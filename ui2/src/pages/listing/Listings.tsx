import React from 'react';
import { withRouter, RouteComponentProps, useHistory } from 'react-router-dom';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty, useStreamQueries } from '@daml/react';
import { usePartyName } from '../../config';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import Tile from '../../components/Tile/Tile';
import { Button, Header } from 'semantic-ui-react';
import StripedTable from '../../components/Table/StripedTable';
import {
  ManualFairValueCalculation,
  FairValue,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Model/module';
import { FairValueCalculationRequests } from './ManualCalculationRequests';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
  listings: Readonly<CreateEvent<Listing, any, any>[]>;
};

export const ListingsTable: React.FC<Props> = ({ services, listings }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const history = useHistory();

  const service = services.find(s => s.payload.customer === party);

  const { contracts: manualFVRequests, loading: manualFVRequestsLoading } = useStreamQueries(
    ManualFairValueCalculation
  );

  const { contracts: fairValueContracts, loading: fairValuesLoading } = useStreamQueries(FairValue);

  const getMarketType = (c: CreateEvent<Listing>) => {
    const listingType = c.payload.listingType;
    if (listingType.tag === 'Collateralized') {
      return 'Collateralized';
    } else {
      return getName(listingType.value.clearinghouse);
    }
  };

  return (
    <>
      <StripedTable
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
          'Fair Value'
        ]}
        rowsClickable
        loading={fairValuesLoading}
        rows={listings.map(c => {
          const fairValues = fairValueContracts.filter(
            fv => fv.payload.listingId.label === c.payload.listingId.label
          );
          return {
            elements: [
              getName(c.payload.provider),
              getName(c.payload.customer),
              getMarketType(c),
              c.payload.listingId.label,
              c.payload.calendarId,
              c.payload.tradedAssetId.label,
              c.payload.tradedAssetPrecision,
              c.payload.quotedAssetId.label,
              c.payload.quotedAssetPrecision,
              fairValues.length > 0 ? fairValues[fairValues.length - 1].payload.price : 'None',
            ],
            onClick: () => history.push('/app/manage/listing/' + c.contractId.replace('#', '_')),
          };
        })}
      />
      {!manualFVRequests.length && (
        <Tile header={<h4>Manual Fair Requests</h4>}>
          <FairValueCalculationRequests
            requests={manualFVRequests}
            loading={manualFVRequestsLoading}
          />
        </Tile>
      )}
    </>
  );
};

const ListingsComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  services,
  listings,
}: RouteComponentProps & Props) => {
  return (
    <div>
      <Tile header={<h4>Actions</h4>}>
        <Button className="ghost" onClick={() => history.push('/app/listing/new')}>
          New Listing
        </Button>
      </Tile>
      <Header as="h2">Listings</Header>
    </div>
  );
};

export const Listings = withRouter(ListingsComponent);
