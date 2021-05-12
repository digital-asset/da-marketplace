import React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { usePartyName } from '../../config';
import { ArrowRightIcon } from '../../icons/icons';
import {
  CreateIssuanceRequest,
  ReduceIssuanceRequest,
  Service,
} from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import Tile from '../../components/Tile/Tile';
import StripedTable from '../../components/Table/StripedTable';
import { useDisplayErrorMessage } from '../../context/MessagesContext';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

const RequestsComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  services,
}: RouteComponentProps & Props) => {
  const party = useParty();
  const { getName } = usePartyName(party);

  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();

  const providerServices = services.filter(s => s.payload.provider === party);
  const { contracts: createRequests, loading: createRequestsLoading } =
    useStreamQueries(CreateIssuanceRequest);
  const { contracts: reduceRequests, loading: reduceRequestsLoading } =
    useStreamQueries(ReduceIssuanceRequest);
  const createIssuance = async (c: CreateEvent<CreateIssuanceRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Create Issuance',
        message: 'Could not find Issuance service contract',
      });
    await ledger.exercise(Service.CreateIssuance, service.contractId, {
      createIssuanceRequestCid: c.contractId,
    });
    history.push('/app/issuance/issuances');
  };

  const deleteIssuance = async (c: CreateEvent<ReduceIssuanceRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Create Issuance',
        message: 'Could not find Issuance service contract',
      });
    await ledger.exercise(Service.ReduceIssuance, service.contractId, {
      reduceIssuanceRequestCid: c.contractId,
    });
    history.push('/app/issuance/issuances');
  };

  return (
    <div className="issuance-requests">
      <Tile header={<h4>Actions</h4>}>
        <Button secondary className="ghost" onClick={() => history.push('/app/issuance/new')}>
          New Issuance
        </Button>
      </Tile>

      <Tile header={<h4>Issuance Requests</h4>}>
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
          loading={createRequestsLoading}
          rows={createRequests.map(c => {
            return {
              elements: [
                getName(c.payload.provider),
                getName(c.payload.customer),
                c.payload.issuanceId,
                c.payload.accountId.label,
                c.payload.assetId.label,
                c.payload.quantity,
                <>
                  {party === c.payload.provider && (
                    <Button className="ghost" onClick={() => createIssuance(c)}>
                      Issue
                    </Button>
                  )}
                </>,
                <NavLink to={'/app/issuance/createrequest/' + c.contractId.replace('#', '_')}>
                  <ArrowRightIcon />
                </NavLink>,
              ],
            };
          })}
        />
      </Tile>

      <Tile header={<h4>Deissuance Requests</h4>}>
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
          loading={reduceRequestsLoading}
          rows={reduceRequests.map(c => {
            return {
              elements: [
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
                <NavLink to={'/app/issuance/deleterequest/' + c.contractId.replace('#', '_')}>
                  <ArrowRightIcon />
                </NavLink>,
              ],
            };
          })}
        />
      </Tile>
    </div>
  );
};

export const Requests = withRouter(RequestsComponent);
