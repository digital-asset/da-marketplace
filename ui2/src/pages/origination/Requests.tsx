import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { usePartyName } from '../../config';
import {
  Service,
  OriginationRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';

const RequestsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const services = useStreamQueries(Service).contracts;
  const providerServices = services.filter(s => s.payload.provider === party);
  const { contracts: requests, loading: requestsLoading } = useStreamQueries(OriginationRequest);

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
      <Tile header={<h4>Actions</h4>}>
        <Button secondary className="ghost" onClick={() => history.push('/app/instrument/new')}>
          New Instrument
        </Button>
      </Tile>

      <Tile header={<h4>Origination Requests</h4>}>
        <StripedTable
          headings={[
            'Registrar',
            'Issuer',
            'Asset',
            'Description',
            'Safekeeping Account',
            'Action',
          ]}
          loading={requestsLoading}
          rowsClickable
          rows={requests.map(c => {
            return {
              elements: [
                getName(c.payload.provider),
                getName(c.payload.customer),
                c.payload.assetLabel,
                c.payload.description,
                c.payload.safekeepingAccount.id.label,
                <>
                  {party === c.payload.provider && (
                    <Button secondary className="ghost" onClick={() => originateInstrument(c)}>
                      Originate
                    </Button>
                  )}
                </>,
              ],
              onClick: () =>
                history.push('/app/registry/requests/' + c.contractId.replace('#', '_')),
            };
          })}
        />
      </Tile>
    </div>
  );
};

export const Requests = withRouter(RequestsComponent);
