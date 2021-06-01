import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { Button } from 'semantic-ui-react';

import { useStreamQueries } from '../../Main';
import {
  CloseAccountRequest,
  DebitAccountRequest,
  OpenAccountRequest,
  TransferDepositRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import { usePartyName } from '../../config';
import { CreditAccountRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model/module';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { damlSetValues } from '../common';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import StripedTable from '../../components/Table/StripedTable';
import BackButton from '../../components/Common/BackButton';
import paths from '../../paths';

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
  const openRequests = useStreamQueries(OpenAccountRequest).contracts;
  const closeRequests = useStreamQueries(CloseAccountRequest).contracts;
  const creditRequests = useStreamQueries(CreditAccountRequest).contracts;
  const debitRequests = useStreamQueries(DebitAccountRequest).contracts;
  const transferRequests = useStreamQueries(TransferDepositRequest).contracts;
  const assetDeposits = useStreamQueries(AssetDeposit).contracts;

  const openAccount = async (c: CreateEvent<OpenAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return;
    await ledger.exercise(Service.OpenAccount, service.contractId, {
      openAccountRequestCid: c.contractId,
    });
    history.push(paths.app.custody.accounts.root);
  };

  const closeAccount = async (c: CreateEvent<CloseAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to close account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.CloseAccount, service.contractId, {
      closeAccountRequestCid: c.contractId,
    });
    history.push(paths.app.custody.accounts.root);
  };

  const creditAccount = async (c: CreateEvent<CreditAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Credit Account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.CreditAccount, service.contractId, {
      creditAccountRequestCid: c.contractId,
    });
    history.push(paths.app.custody.accounts.root);
  };

  const debitAccount = async (c: CreateEvent<DebitAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Debit Account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.DebitAccount, service.contractId, {
      debitAccountRequestCid: c.contractId,
    });
    history.push(paths.app.custody.accounts.root);
  };

  const transferDeposit = async (c: CreateEvent<TransferDepositRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Transfer Deposit',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.TransferDeposit, service.contractId, {
      transferDepositRequestCid: c.contractId,
    });
    history.push(paths.app.custody.accounts.root);
  };

  const getDebitDepositDetail = (
    c: CreateEvent<DebitAccountRequest>,
    extract: (deposit: AssetDeposit) => string
  ): string => {
    const deposit = assetDeposits.find(a => a.contractId === c.payload.debit.depositCid);
    if (!deposit) return '';
    return extract(deposit.payload);
  };

  const getTransferDepositDetail = (
    c: CreateEvent<TransferDepositRequest>,
    extract: (deposit: AssetDeposit) => string
  ): string => {
    const deposit = assetDeposits.find(a => a.contractId === c.payload.transfer.depositCid);
    if (!deposit) return '';
    return extract(deposit.payload);
  };

  return (
    <>
      <BackButton />
      {openRequests.length > 0 && (
        <StripedTable
          title="Open Account Requests"
          headings={['Account', 'Provider', 'Client', 'Role', 'Controllers', 'Action']}
          rows={openRequests.map((c, i) => {
            return {
              elements: [
                c.payload.accountId.label,
                getName(c.payload.provider),
                getName(c.payload.customer),
                party === c.payload.provider ? 'Provider' : 'Client',
                damlSetValues(c.payload.ctrls).join(', '),
                party === c.payload.provider && (
                  <Button onClick={() => openAccount(c)}>Process</Button>
                ),
              ],
            };
          })}
        />
      )}
      {closeRequests.length > 0 && (
        <StripedTable
          title="Close Account Requests"
          headings={['Account', 'Provider', 'Client', 'Role', 'Action']}
          rows={closeRequests.map((c, i) => {
            return {
              elements: [
                c.payload.accountId.label,
                getName(c.payload.provider),
                getName(c.payload.customer),
                party === c.payload.provider ? 'Provider' : 'Client',
                party === c.payload.provider && (
                  <Button onClick={() => closeAccount(c)}>Process</Button>
                ),
              ],
            };
          })}
        />
      )}

      {creditRequests.length > 0 && (
        <StripedTable
          title="Credit Account Requests"
          headings={['Account', 'Provider', 'Client', 'Asset', 'Quantity', 'Action']}
          rows={creditRequests.map((c, i) => {
            return {
              elements: [
                c.payload.accountId.label,
                getName(c.payload.provider),
                getName(c.payload.customer),
                c.payload.asset.id.label,
                c.payload.asset.quantity,
                party === c.payload.provider && (
                  <Button onClick={() => creditAccount(c)}>Process</Button>
                ),
              ],
            };
          })}
        />
      )}
      {debitRequests.length > 0 && (
        <StripedTable
          title="Withdraw Deposit Requests"
          headings={['Account', 'Provider', 'Client', 'Asset', 'Quantity', 'Action']}
          rows={debitRequests.map((c, i) => {
            return {
              elements: [
                c.payload.accountId.label,
                getName(c.payload.provider),
                getName(c.payload.customer),
                getDebitDepositDetail(c, d => d.asset.id.label),
                getDebitDepositDetail(c, d => d.asset.quantity),
                party === c.payload.provider && (
                  <Button onClick={() => debitAccount(c)}>Process</Button>
                ),
              ],
            };
          })}
        />
      )}
      {transferRequests.length > 0 && (
        <StripedTable
          title="Transfer Requests"
          headings={['Account', 'Provider', 'Client', 'Asset', 'Quantity', 'Transfer to', 'Action']}
          rows={transferRequests.map((c, i) => {
            return {
              elements: [
                c.payload.accountId.label,
                getName(c.payload.provider),
                getName(c.payload.customer),
                getTransferDepositDetail(c, d => d.asset.id.label),
                getTransferDepositDetail(c, d => d.asset.quantity),
                c.payload.transfer.receiverAccountId.label,
                party === c.payload.provider && (
                  <Button onClick={() => transferDeposit(c)}>Process</Button>
                ),
              ],
            };
          })}
        />
      )}
    </>
  );
};

export const Requests = withRouter(RequestsComponent);
