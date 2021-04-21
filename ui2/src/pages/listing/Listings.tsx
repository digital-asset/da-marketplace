import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { usePartyLegalName } from '../../config';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import Tile from '../../components/Tile/Tile';
import { Button, Header } from 'semantic-ui-react';
import StripedTable from '../../components/Table/StripedTable';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
  listings: Readonly<CreateEvent<Listing, any, any>[]>;
};

export const ListingsTable: React.FC<Props> = ({ services, listings }) => {
  const party = useParty();
  const { getLegalName } = usePartyLegalName(party);
  const ledger = useLedger();

  const service = services.find(s => s.payload.customer === party);

  const requestDisableDelisting = async (c: CreateEvent<Listing>) => {
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.RequestDisableListing, service.contractId, {
      listingCid: c.contractId,
    });
  };

  return (
    <StripedTable
      headings={[
        'Provider',
        'Client',
        'Listing ID',
        'Calendar ID',
        'Traded Asset',
        'Traded Asset Precision',
        'Quoted Asset',
        'Quoted Asset Precision',
        'Action',
      ]}
      rows={listings.map(c => {
        return {
          elements: [
            getLegalName(c.payload.provider),
            getLegalName(c.payload.customer),
            c.payload.listingId,
            c.payload.calendarId,
            c.payload.tradedAssetId.label,
            c.payload.tradedAssetPrecision,
            c.payload.quotedAssetId.label,
            c.payload.quotedAssetPrecision,
            party === c.payload.customer && (
              <Button floated="right" className="ghost" onClick={() => requestDisableDelisting(c)}>
                Disable
              </Button>
            ),
          ],
        };
      })}
    />
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
      <ListingsTable services={services} listings={listings} />
    </div>
  );
};

export const Listings = withRouter(ListingsComponent);
