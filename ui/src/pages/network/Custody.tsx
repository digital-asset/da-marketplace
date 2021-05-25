import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { getTemplateId, usePartyName } from '../../config';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import StripedTable from '../../components/Table/StripedTable';
import {
  OpenAccountRequest,
  OpenAllocationAccountRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import TitleWithActions from '../../components/Common/TitleWithActions';
import { damlSetValues } from '../common';
import { useDisplayErrorMessage } from '../../context/MessagesContext';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

export const CustodyServiceTable: React.FC<Props> = ({ services }) => {
  const party = useParty();
  const history = useHistory();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const terminateService = async (c: CreateEvent<Service>) => {
    await ledger.exercise(Service.Terminate, c.contractId, { ctrl: party });
  };

  return (
    <>
      <TitleWithActions title="Current Services">
        <Button className="ghost" onClick={() => history.push('/app/setup/custody/offer')}>
          Offer Custody Service
        </Button>
      </TitleWithActions>

      <StripedTable
        headings={['Service', 'Operator', 'Provider', 'Consumer', 'Role', 'Action']}
        rows={services.map((c, i) => {
          return {
            elements: [
              getTemplateId(c.templateId),
              getName(c.payload.operator),
              getName(c.payload.provider),
              getName(c.payload.customer),
              party === c.payload.provider ? 'Provider' : 'Consumer',
              <Button
                className="ghost warning small"
                onClick={() => terminateService(c)}
                floated="right"
              >
                Terminate
              </Button>,
            ],
          };
        })}
      />
      <AccountRequestsTable services={services} />
      <AllocationAccountRequestsTable services={services} />
    </>
  );
};

const AccountRequestsTable: React.FC<Props> = ({ services }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();

  const { contracts: openRequests, loading } = useStreamQueries(OpenAccountRequest);

  const openAccount = async (c: CreateEvent<OpenAccountRequest>) => {
    const service = services.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Open Account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.OpenAccount, service.contractId, {
      openAccountRequestCid: c.contractId,
    });
  };

  return !!openRequests.length ? (
    <StripedTable
      title="Account Requests"
      headings={['Account', 'Provider', 'Client', 'Role', 'Controllers', 'Action']}
      loading={loading}
      rows={openRequests.map((c, i) => {
        return {
          elements: [
            c.payload.accountId.label,
            getName(c.payload.provider),
            getName(c.payload.customer),
            party === c.payload.provider ? 'Provider' : 'Client',
            damlSetValues(c.payload.ctrls).join(', '),
            party === c.payload.provider && (
              <Button className="ghost" size="small" onClick={() => openAccount(c)}>
                Process
              </Button>
            ),
          ],
        };
      })}
    />
  ) : (
    <></>
  );
};

const AllocationAccountRequestsTable: React.FC<Props> = ({ services }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();

  const { contracts: openRequests, loading } = useStreamQueries(OpenAllocationAccountRequest);

  const openAccount = async (c: CreateEvent<OpenAllocationAccountRequest>) => {
    const service = services.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Open Account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.OpenAllocationAccount, service.contractId, {
      openAllocationAccountRequestCid: c.contractId,
    });
  };

  return !!openRequests.length ? (
    <StripedTable
      title="Allocation Account Requests"
      headings={['Account', 'Provider', 'Client', 'Role', 'Nominee', 'Action']}
      loading={loading}
      rows={openRequests.map((c, i) => {
        return {
          elements: [
            c.payload.accountId.label,
            getName(c.payload.provider),
            getName(c.payload.customer),
            party === c.payload.provider ? 'Provider' : 'Client',
            c.payload.nominee,
            party === c.payload.provider && (
              <Button className="ghost" size="small" onClick={() => openAccount(c)}>
                Process
              </Button>
            ),
          ],
        };
      })}
    />
  ) : (
    <></>
  );
};
