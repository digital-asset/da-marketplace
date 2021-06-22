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
  CreditAccountRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import { usePartyName } from '../../config';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { damlSetValues } from '../common';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import StripedTable from '../../components/Table/StripedTable';
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
    history.push(paths.app.wallet.accounts.root);
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
    history.push(paths.app.wallet.accounts.root);
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
    history.push(paths.app.wallet.accounts.root);
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
    history.push(paths.app.wallet.accounts.root);
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
    history.push(paths.app.wallet.accounts.root);
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

  const [inboundOpenRequests, outboundOpenRequests] = partitionArray(
    c => party === c.payload.provider,
    [...openRequests]
  );

  const [inboundCloseRequests, outboundCloseRequests] = partitionArray(
    c => party === c.payload.provider,
    [...closeRequests]
  );

  const [inboundCreditRequests, outboundCreditRequests] = partitionArray(
    c => party === c.payload.provider,
    [...creditRequests]
  );

  const [inboundDebitRequests, outboundDebitRequests] = partitionArray(
    c => party === c.payload.provider,
    [...debitRequests]
  );
  const [inboundTransferRequests, outboundTransferRequests] = partitionArray(
    c => party === c.payload.provider,
    [...transferRequests]
  );
  return (
    <>
      <StripedTable
        title="Outbound Requests"
        headings={['Request', 'Pending party approval']}
        rows={[
          ...outboundOpenRequests.map((c, i) => {
            return {
              elements: [`Open Account: ${c.payload.accountId.label}`, getName(c.payload.provider)],
            };
          }),
          ...outboundCloseRequests.map((c, i) => {
            return {
              elements: [
                `Close Account: ${c.payload.accountId.label}`,
                getName(c.payload.provider),
              ],
            };
          }),
          ...outboundCreditRequests.map((c, i) => {
            return {
              elements: [
                `Credit Account: ${c.payload.accountId.label} - ${c.payload.asset.id.label} ${c.payload.asset.quantity}`,
                getName(c.payload.provider),
              ],
            };
          }),
          ...outboundDebitRequests.map((c, i) => {
            return {
              elements: [
                `Debit Account: ${c.payload.accountId.label} -
                ${getDebitDepositDetail(c, d => d.asset.id.label)}
                ${getDebitDepositDetail(c, d => d.asset.quantity)}`,
                getName(c.payload.provider),
              ],
            };
          }),
          ...outboundTransferRequests.map((c, i) => {
            return {
              elements: [
                `Transfer: ${getTransferDepositDetail(
                  c,
                  d => d.asset.quantity
                )} ${getTransferDepositDetail(c, d => d.asset.id.label)} from ${
                  c.payload.accountId.label
                } to ${c.payload.transfer.receiverAccountId.label}
              `,
                getName(c.payload.provider),
              ],
            };
          }),
        ]}
      />

      <StripedTable
        title="Inbound Requests"
        headings={['Type', 'Provider', 'Client', 'Action']}
        rows={[
          ...inboundOpenRequests.map((c, i) => {
            return {
              elements: [
                `Open Account Requests: ${c.payload.accountId.label}`,
                getName(c.payload.provider),
                getName(c.payload.customer),
                <Button onClick={() => openAccount(c)}>Process</Button>,
              ],
            };
          }),
          ...inboundCloseRequests.map((c, i) => {
            return {
              elements: [
                `Close Account Requests: ${c.payload.accountId.label}`,
                getName(c.payload.provider),
                getName(c.payload.customer),
                <Button onClick={() => closeAccount(c)}>Process</Button>,
              ],
            };
          }),
          ...inboundCreditRequests.map((c, i) => {
            return {
              elements: [
                `Credit Account: ${c.payload.accountId.label} - ${c.payload.asset.id.label} ${c.payload.asset.quantity}`,
                getName(c.payload.provider),
                getName(c.payload.customer),
                <Button onClick={() => creditAccount(c)}>Process</Button>,
              ],
            };
          }),
          ...inboundDebitRequests.map((c, i) => {
            return {
              elements: [
                `Debit Account: ${c.payload.accountId.label} -
                ${getDebitDepositDetail(c, d => d.asset.id.label)}
                ${getDebitDepositDetail(c, d => d.asset.quantity)}`,
                getName(c.payload.provider),
                getName(c.payload.customer),
                <Button onClick={() => debitAccount(c)}>Process</Button>,
              ],
            };
          }),
          ...inboundTransferRequests.map((c, i) => {
            return {
              elements: [
                `Transfer: ${getTransferDepositDetail(
                  c,
                  d => d.asset.quantity
                )} ${getTransferDepositDetail(c, d => d.asset.id.label)} from ${
                  c.payload.accountId.label
                } to ${c.payload.transfer.receiverAccountId.label}
              `,
                getName(c.payload.provider),
                getName(c.payload.customer),
                <Button onClick={() => transferDeposit(c)}>Process</Button>,
              ],
            };
          }),
        ]}
      />
    </>
  );
};

export function partitionArray<T>(isValid: (elem: T) => boolean, array?: T[]): [T[], T[]] {
  if (!array) {
    return [[], []];
  }
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []] as [T[], T[]]
  );
}

export const Requests = withRouter(RequestsComponent);
