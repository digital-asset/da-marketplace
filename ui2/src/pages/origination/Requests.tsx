import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { IconButton } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty, useStreamQueries } from '@daml/react';
import useStyles from '../styles';
import { getName } from '../../config';
import {
  Service,
  OriginationRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';

const RequestsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const classes = useStyles();
  const party = useParty();
  const ledger = useLedger();

  const services = useStreamQueries(Service).contracts;
  const providerServices = services.filter(s => s.payload.provider === party);
  const requests = useStreamQueries(OriginationRequest).contracts;

  const originateInstrument = async (c: CreateEvent<OriginationRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.Originate, service.contractId, {
      createOriginationCid: c.contractId,
    });
    history.push('/app/instrument/instruments');
  };

  return (
    <div className="origination-requests">
      <Tile header={<h2>Actions</h2>}>
        <Button secondary className="ghost" onClick={() => history.push('/app/instrument/new')}>
          New Instrument
        </Button>
      </Tile>

      <Tile header={<h2>Origination Requests</h2>}>
        <StripedTable
          headings={[
            'Registrar',
            'Issuer',
            'Asset',
            'Description',
            'Safekeeping Account',
            'Action',
            'Details',
          ]}
          rows={requests.map(c => [
            getName(c.payload.provider),
            getName(c.payload.customer),
            c.payload.assetLabel,
            c.payload.description,
            c.payload.safekeepingAccountId.label,
            <>
              {party === c.payload.provider && (
                <Button secondary className="ghost" onClick={() => originateInstrument(c)}>
                  Originate
                </Button>
              )}
            </>,
            <IconButton
              color="primary"
              size="small"
              component="span"
              onClick={() =>
                history.push('/app/registry/requests/' + c.contractId.replace('#', '_'))
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
