import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { CreateEvent } from '@daml/ledger';
import { useParty, useStreamQueries } from '@daml/react';
import { usePartyName, getTemplateId } from '../../config';
import {
  Service,
  CreateListingRequest,
  FailedListingCreation,
} from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import Tile from '../../components/Tile/Tile';
import { Listing as ListingComponent } from './Listing';
import StripedTable from '../../components/Table/StripedTable';
import {
  FairValue,
  ManualFairValueCalculation,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Model/module';
import { FairValueCalculationRequests } from './ManualCalculationRequests';
import TitleWithActions from '../../components/Common/TitleWithActions';

const LISTING_REQUEST_TEMPLATE = 'Marketplace.Listing.Service.CreateListingRequest';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
  listings: Readonly<CreateEvent<Listing, any, any>[]>;
};

export const getMarketType = (
  c: CreateEvent<Listing | FailedListingCreation | CreateListingRequest>,
  getName: (party: string) => string
) => {
  const listingType = c.payload.listingType;
  if (listingType.tag === 'Collateralized') {
    return 'Collateralized';
  } else {
    return getName(listingType.value.clearinghouse);
  }
};

export const ListingsTable: React.FC<Props> = ({ services, listings }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const history = useHistory();

  const { contractId } = useParams<any>();

  const { contracts: manualFVRequests, loading: manualFVRequestsLoading } = useStreamQueries(
    ManualFairValueCalculation
  );

  const { contracts: fairValueContracts, loading: fairValuesLoading } = useStreamQueries(FairValue);
  const { contracts: listingRequests, loading: listingRequestsLoading } =
    useStreamQueries(CreateListingRequest);
  const { contracts: failedListingRequests, loading: failedListingRequestsLoading } =
    useStreamQueries(FailedListingCreation);

  return !contractId ? (
    <>
      <TitleWithActions
        title="Listings"
        actions={[{ path: '/app/setup/listing/new', label: ' New Listing' }]}
      />

      <StripedTable
        rowsClickable
        headings={[
          'Provider',
          'Client',
          'Cleared By',
          'Listing ID',
          'Calendar ID',
          'Traded Asset',
          'Traded Asset Precision',
          'Quoted Asset',
          'Quoted Asset Precision',
          'Fair Value',
        ]}
        loading={fairValuesLoading}
        rows={listings.map(c => {
          const fairValues = fairValueContracts.filter(
            fv => fv.payload.listingId.label === c.payload.listingId.label
          );
          return {
            elements: [
              getName(c.payload.provider),
              getName(c.payload.customer),
              getMarketType(c, getName),
              c.payload.listingId.label,
              c.payload.calendarId,
              c.payload.tradedAssetId.label,
              c.payload.tradedAssetPrecision,
              c.payload.quotedAssetId.label,
              c.payload.quotedAssetPrecision,
              fairValues.length > 0 ? fairValues[fairValues.length - 1].payload.price : 'None',
            ],
            onClick: () => history.push('/app/manage/listings/' + c.contractId.replace('#', '_')),
          };
        })}
      />
      {(!!listingRequests.length || !!failedListingRequests.length) && (
        <StripedTable
          title="Requests"
          headings={[
            'Provider',
            'Client',
            'Cleared By',
            'Listing ID',
            'Calendar ID',
            'Traded Asset',
            'Traded Asset Precision',
            'Quoted Asset',
            'Quoted Asset Precision',
            'Status',
          ]}
          loading={failedListingRequestsLoading || listingRequestsLoading}
          rows={[...listingRequests, ...failedListingRequests].map(c => {
            return {
              elements: [
                getName(c.payload.provider),
                getName(c.payload.customer),
                getMarketType(c, getName),
                c.payload.symbol,
                c.payload.calendarId,
                c.payload.tradedAssetId.label,
                c.payload.tradedAssetPrecision,
                c.payload.quotedAssetId.label,
                c.payload.quotedAssetPrecision,
                getTemplateId(c.templateId) === LISTING_REQUEST_TEMPLATE ? 'Pending' : 'Failed',
                getTemplateId(c.templateId) === LISTING_REQUEST_TEMPLATE
                  ? ''
                  : (c.payload as FailedListingCreation).error.message
                      .replace('{', '')
                      .replace('}', '')
                      .replace(/'/g, ''),
              ],
            };
          })}
        />
      )}
      {!!manualFVRequests.length && (
        <Tile header="Manual Fair Requests">
          <FairValueCalculationRequests
            requests={manualFVRequests}
            loading={manualFVRequestsLoading}
          />
        </Tile>
      )}
    </>
  ) : (
    <ListingComponent services={services} />
  );
};
