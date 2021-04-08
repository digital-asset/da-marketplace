import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { IconButton } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty, useStreamQueries } from '@daml/react';
import { getName } from '../../config';
import {
  Service,
  CreateIssuanceRequest,
  ReduceIssuanceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

const RequestsComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  services,
}: RouteComponentProps & Props) => {
  const party = useParty();
  const ledger = useLedger();

  const providerServices = services.filter(s => s.payload.provider === party);
  const createRequests = useStreamQueries(CreateIssuanceRequest).contracts;
  const reduceRequests = useStreamQueries(ReduceIssuanceRequest).contracts;
  const createIssuance = async (c: CreateEvent<CreateIssuanceRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.CreateIssuance, service.contractId, {
      createIssuanceRequestCid: c.contractId,
    });
    history.push('/app/issuance/issuances');
  };

  const deleteIssuance = async (c: CreateEvent<ReduceIssuanceRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.ReduceIssuance, service.contractId, {
      reduceIssuanceRequestCid: c.contractId,
    });
    history.push('/app/issuance/issuances');
  };

  return (
    <div className="issuance-requests">
      <Tile header={<h2>Actions</h2>}>
        <Button secondary className="ghost" onClick={() => history.push('/app/issuance/new')}>
          New Issuance
        </Button>
      </Tile>

      <Tile header={<h2>Issuance Requests</h2>}>
        <StripedTable
          headings={[
            'Issuing Agent',
            'Issuer',
            'Issuance ID',
            'Account',
            'Asset',
            'Quantity',
            'Action',
            'Details',
          ]}
          rows={createRequests.map(c => [
            getName(c.payload.provider),
            getName(c.payload.customer),
            c.payload.issuanceId,
            c.payload.accountId.label,
            c.payload.assetId.label,
            c.payload.quantity,
            <>
              {party === c.payload.provider && (
                <Button secondary className="ghost" onClick={() => createIssuance(c)}>
                  Issue
                </Button>
              )}
            </>,
            <IconButton
              color="primary"
              size="small"
              component="span"
              onClick={() =>
                history.push('/app/issuance/createrequest/' + c.contractId.replace('#', '_'))
              }
            >
              <KeyboardArrowRight fontSize="small" />
            </IconButton>,
          ])}
        />
      </Tile>

      <Tile header={<h2>Deissuance Requests</h2>}>
        <StripedTable
          headings={[
            'Provider',
            'Client',
            'Role',
            'Issuance ID',
            'Account',
            // 'Asset',
            // 'Quantity',
            'Action',
            'Details',
          ]}
          rows={reduceRequests.map(c => [
            getName(c.payload.provider),
            getName(c.payload.customer),
            party === c.payload.provider ? 'Provider' : 'Client',
            c.payload.issuanceId,
            c.payload.accountId.label,
            // c.payload.assetId.label,
            // c.payload.quotedAssetId.label,
            <>
              {party === c.payload.provider && (
                <Button secondary className="ghost" onClick={() => deleteIssuance(c)}>
                  Deissue
                </Button>
              )}
            </>,
            <IconButton
              color="primary"
              size="small"
              component="span"
              onClick={() =>
                history.push('/app/issuance/deleterequest/' + c.contractId.replace('#', '_'))
              }
            >
              <KeyboardArrowRight fontSize="small" />
            </IconButton>,
          ])}
        />
      </Tile>
    </div>
  );
};

export const Requests = withRouter(RequestsComponent);
