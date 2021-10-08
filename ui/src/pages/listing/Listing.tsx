import React, { useState } from 'react';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react';

import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';

import {
  FairValue,
  ManualFairValueCalculation,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Model/module';
import { Service as ClearedMarketService } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { Listing as ListingTemplate } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';

import { useStreamQueries } from '../../Main';
import BackButton from '../../components/Common/BackButton';
import TitleWithActions from '../../components/Common/TitleWithActions';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import StripedTable from '../../components/Table/StripedTable';
import Tile from '../../components/Tile/Tile';
import { usePartyName } from '../../config';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import { createDropdownProp, ServicePageProps } from '../common';
import { getMarketType } from './Listings';
import { FairValueCalculationRequests } from './ManualCalculationRequests';

type FairValueRequestProps = {
  service?: Readonly<CreateEvent<ClearedMarketService, any, any>>;
  listingId?: string;
  selectListings?: boolean;
};

export const FairValueRequest: React.FC<FairValueRequestProps> = ({
  listingId,
  selectListings,
  service,
}) => {
  const ledger = useLedger();
  const party = useParty();
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(c => c.payload.assetId.version === '0');
  const [currencyLabel, setCurrencyLabel] = useState('');
  const selectedListingIds = !!listingId ? [listingId] : null;
  const displayErrorMessage = useDisplayErrorMessage();

  const requestFairValues = async () => {
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Request Fair Values',
        message: 'Could not find Listing service contract',
      });
    const currencyAsset = assets.find(c => c.payload.assetId.label === currencyLabel);
    const calculationId =
      Date.now().toString() + crypto.getRandomValues(new Uint16Array(1))[0].toString();
    const upTo = new Date().toISOString();
    if (!currencyAsset) return;
    if (selectedListingIds == null) {
      await ledger.exercise(ClearedMarketService.RequestAllFairValues, service.contractId, {
        party,
        calculationId,
        upTo,
        currency: currencyAsset.payload.assetId,
      });
    } else {
      await ledger.exercise(ClearedMarketService.RequestFairValues, service.contractId, {
        party,
        currency: currencyAsset.payload.assetId,
        listingIds: selectedListingIds,
        calculationId,
        upTo,
      });
    }
  };
  return (
    <ModalFormErrorHandled onSubmit={() => requestFairValues()} title="Request FV">
      <Form.Select
        label="Currency"
        placeholder="Select..."
        required
        options={assets.map(a => createDropdownProp(a.payload.assetId.label))}
        value={currencyLabel}
        onChange={(_, change) => setCurrencyLabel(change.value as string)}
      />
    </ModalFormErrorHandled>
  );
};

const ListingComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  services,
}) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const { contractId } = useParams<any>();
  const displayErrorMessage = useDisplayErrorMessage();

  const cid = contractId.replace('_', '#');

  const { contracts: listings, loading } = useStreamQueries(ListingTemplate);

  const listing = listings.find(a => a.contractId === cid);
  const service = services.find(s => s.payload.customer === party);

  const { contracts: fairValueContracts, loading: fairValuesLoading } = useStreamQueries(FairValue);
  const { contracts: clearedMarketServices } = useStreamQueries(ClearedMarketService);
  const clearedMarketService = clearedMarketServices.find(
    cms => cms.payload.customer === listing?.payload.customer
  );

  const fairValues = fairValueContracts.filter(
    fv => fv.payload.listingId === listing?.payload.listingId
  );

  const { contracts: manualFVRequestContracts, loading: manualFVRequestsLoading } =
    useStreamQueries(ManualFairValueCalculation);
  const manualFVRequests = manualFVRequestContracts.filter(
    fv => fv.payload.listingId === listing?.payload.listingId
  );

  const requestDisableDelisting = async () => {
    if (!service || !listing)
      return displayErrorMessage({
        header: 'Failed to Disable Delisting',
        message: 'Could not find Listing service contract',
      });
    await ledger.exercise(Service.RequestDisableListing, service.contractId, {
      listingCid: listing.contractId,
    });
  };
  return (
    <div className="listing">
      <div>
        <BackButton />
        <TitleWithActions title={listing?.payload.listingId || ''}>
          <Button.Group>
            {!!clearedMarketService && (
              <FairValueRequest
                listingId={listing?.payload.listingId}
                service={clearedMarketService}
              />
            )}
            {!!service && service.payload.customer === listing?.payload.customer && (
              <Button
                floated="left"
                className="ghost warning"
                onClick={() => requestDisableDelisting()}
              >
                Disable
              </Button>
            )}
          </Button.Group>
        </TitleWithActions>
      </div>
      {!!listing && (
        <StripedTable
          loading={loading}
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
          ]}
          rows={[
            {
              elements: [
                getName(listing.payload.provider),
                getName(listing.payload.customer),
                getMarketType(listing, getName),
                listing.payload.listingId,
                listing.payload.calendarId,
                listing.payload.tradedAssetId.label,
                listing.payload.tradedAssetPrecision,
                listing.payload.quotedAssetId.label,
                listing.payload.quotedAssetPrecision,
              ],
            },
          ]}
        />
      )}
      {!!manualFVRequests.length && party === listing?.payload.customer && (
        <Tile header="Manual Fair Requests">
          <FairValueCalculationRequests
            requests={manualFVRequests}
            loading={manualFVRequestsLoading}
          />
        </Tile>
      )}
      <StripedTable
        title="Fair Values"
        headings={['Provider', 'Client', 'Listing ID', 'Price', 'Currency', 'Up To']}
        loading={fairValuesLoading}
        rows={fairValues.reverse().map(fv => {
          return {
            elements: [
              getName(fv.payload.provider),
              getName(fv.payload.customer),
              fv.payload.listingId,
              fv.payload.price,
              fv.payload.currency.label,
              fv.payload.upTo,
            ],
          };
        })}
      />
    </div>
  );
};

export const Listing = withRouter(ListingComponent);
