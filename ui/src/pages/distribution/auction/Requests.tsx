import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';

import {
  CreateAuctionRequest,
  Service,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';

import { useStreamQueries } from '../../../Main';
import StripedTable from '../../../components/Table/StripedTable';
import { usePartyName } from '../../../config';
import { useDisplayErrorMessage } from '../../../context/MessagesContext';
import paths from '../../../paths';
import { ServicePageProps } from '../../common';

const RequestsComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();

  const { contracts: requests, loading } = useStreamQueries(CreateAuctionRequest);
  const providerServices = services.filter(s => s.payload.provider === party);

  const createAuction = async (c: CreateEvent<CreateAuctionRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Create Auction',
        message: 'Could not find Distribution service contract',
      });
    await ledger.exercise(Service.CreateAuction, service.contractId, {
      createAuctionRequestCid: c.contractId,
    });
    history.push(paths.app.auctions.root);
  };

  if (!loading && requests.length === 0) {
    return <></>;
  }

  return (
    <StripedTable
      title="Auction Creation Requests"
      headings={[
        'Agent',
        'Issuer',
        'Auction ID',
        'Auctioned Asset',
        'Quoted Asset',
        'Floor Price',
        'Action',
      ]}
      loading={loading}
      rows={requests.map(c => {
        return {
          elements: [
            getName(c.payload.provider),
            getName(c.payload.customer),
            c.payload.auctionId,
            `${c.payload.asset.quantity} ${c.payload.asset.id.label}`,
            c.payload.quotedAssetId.label,
            `${c.payload.floorPrice} ${c.payload.quotedAssetId.label}`,
            party === c.payload.provider && (
              <Button className="ghost small floating" onClick={() => createAuction(c)}>
                Create
              </Button>
            ),
          ],
        };
      })}
    />
  );
};

export const Requests = withRouter(RequestsComponent);
