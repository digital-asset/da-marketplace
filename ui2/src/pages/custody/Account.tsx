import React, { useState } from 'react';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { CreateEvent } from '@daml/ledger';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { InputDialog, InputDialogProps } from '../../components/InputDialog/InputDialog';
import Tile from '../../components/Tile/Tile';
import { Button, Header, Table } from 'semantic-ui-react';
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { getName } from '../../config';
import StripedTable from '../../components/Table/StripedTable';
import { ServicePageProps } from '../common';

const AccountComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();
  const ledger = useLedger();
  const { contractId } = useParams<any>();

  const cid = contractId.replace('_', '#');

  const accounts = useStreamQueries(AssetSettlementRule);
  const { contracts: deposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);
  const assets = useStreamQueries(AssetDescription).contracts;

  const defaultTransferRequestDialogProps: InputDialogProps<any> = {
    open: false,
    title: 'Transfer Account Request',
    defaultValue: { account: '' },
    fields: {
      account: { label: 'Account', type: 'selection', items: [] },
    },
    onClose: async function (state: any | null) {},
  };
  const [transferDialogProps, setTransferDialogProps] = useState<InputDialogProps<any>>(
    defaultTransferRequestDialogProps
  );

  const assetNames = assets.map(a => a.payload.description);
  const defaultCreditRequestDialogProps: InputDialogProps<any> = {
    open: false,
    title: 'Credit Account Request',
    defaultValue: { account: '', asset: '', quantity: 0 },
    fields: {
      account: { label: 'Account', type: 'selection', items: [] },
      asset: { label: 'Asset', type: 'selection', items: assetNames },
      quantity: { label: 'Quantity', type: 'number' },
    },
    onClose: async function (state: any | null) {},
  };
  const [creditDialogProps, setCreditDialogProps] = useState<InputDialogProps<any>>(
    defaultCreditRequestDialogProps
  );

  const clientServices = services.filter(s => s.payload.customer === party);
  const account = accounts.contracts.find(a => a.contractId === cid);
  if (!account) return <></>;

  const accountDeposits = deposits.filter(
    d =>
      d.payload.account.id.label === account.payload.account.id.label &&
      d.payload.account.provider === account.payload.account.provider &&
      d.payload.account.owner === account.payload.account.owner
  );

  const requestWithdrawDeposit = async (c: CreateEvent<AssetDeposit>) => {
    const service = clientServices.find(s => s.payload.provider === c.payload.account.provider);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.RequestDebitAccount, service.contractId, {
      accountId: c.payload.account.id,
      debit: { depositCid: c.contractId },
    });
    history.push('/app/custody/requests');
  };

  const relatedAccounts = accounts.contracts
    .filter(a => a.contractId !== cid)
    .filter(a => a.payload.account.owner === account.payload.account.owner)
    .map(r => r.payload.account.id.label);

  const requestTransfer = (deposit: CreateEvent<AssetDeposit>) => {
    const onClose = async (state: any | null) => {
      setTransferDialogProps({ ...defaultTransferRequestDialogProps, open: false });
      if (!state) return;
      const transferToAccount = accounts.contracts.find(
        a => a.payload.account.id.label === state.account
      );
      const service = clientServices.find(
        s => s.payload.provider === account.payload.account.provider
      );
      if (!service || !transferToAccount) return;

      await ledger.exercise(Service.RequestTransferDeposit, service.contractId, {
        accountId: account.payload.account.id,
        transfer: {
          receiverAccountId: transferToAccount.payload.account.id,
          depositCid: state.deposit,
        },
      });
    };
    setTransferDialogProps({
      ...defaultTransferRequestDialogProps,
      defaultValue: {
        ...defaultTransferRequestDialogProps.defaultValue,
        deposit: deposit.contractId,
      },
      fields: {
        ...defaultTransferRequestDialogProps.fields,
        account: { label: 'Account', type: 'selection', items: relatedAccounts },
      },
      open: true,
      onClose,
    });
  };

  const requestCredit = (accountId: Id) => {
    const onClose = async (state: any | null) => {
      setCreditDialogProps({ ...defaultCreditRequestDialogProps, open: false });
      if (!state) return;
      const asset = assets.find(i => i.payload.description === state.asset);
      // const account = accounts.find(a => a.payload.account.id.label === state.account);
      if (!asset || !account) return;
      const service = clientServices.find(
        s => s.payload.provider === account.payload.account.provider
      );
      if (!service) return;

      await ledger.exercise(Service.RequestCreditAccount, service.contractId, {
        accountId: account.payload.account.id,
        asset: { id: asset.payload.assetId, quantity: state.quantity },
      });
    };
    setCreditDialogProps({
      ...defaultCreditRequestDialogProps,
      defaultValue: { ...defaultCreditRequestDialogProps.fields, account: accountId.label },
      fields: {
        ...defaultCreditRequestDialogProps.fields,
        account: { label: 'Account', type: 'selection', items: [accountId.label] },
      },
      open: true,
      onClose,
    });
  };

  const requestCloseAccount = async (c: CreateEvent<AssetSettlementRule>) => {
    const service = clientServices.find(s => s.payload.provider === c.payload.account.provider);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.RequestCloseAccount, service.contractId, {
      accountId: c.payload.account.id,
    });
    history.push('/app/custody/requests');
  };

  return (
    <>
      <InputDialog {...transferDialogProps} />
      <InputDialog {...creditDialogProps} />
      <div className="account">
        <Header as="h2">{account.payload.account.id.label}</Header>
        <Tile header={<h4>Actions</h4>}>
          <div className="action-row">
            <Button className="ghost" onClick={() => requestCredit(account.payload.account.id)}>
              Deposit
            </Button>
            <Button className="ghost" onClick={() => requestCloseAccount(account)}>
              Close
            </Button>
          </div>
        </Tile>

        <div className="account-overview">
          <div className="details">
            <Tile header={<h4>Account Details</h4>}>
              <Table basic="very">
                <Table.Body>
                  <Table.Row key={0}>
                    <Table.Cell key={0}>
                      <b>Account name</b>
                    </Table.Cell>
                    <Table.Cell key={1}>{account.payload.account.id.label}</Table.Cell>
                  </Table.Row>
                  <Table.Row key={1}>
                    <Table.Cell key={0}>
                      <b>Provider</b>
                    </Table.Cell>
                    <Table.Cell key={1}>{getName(account.payload.account.provider)}</Table.Cell>
                  </Table.Row>
                  <Table.Row key={2}>
                    <Table.Cell key={0}>
                      <b>Owner</b>
                    </Table.Cell>
                    <Table.Cell key={1}>{getName(account.payload.account.owner)}</Table.Cell>
                  </Table.Row>
                  <Table.Row key={3}>
                    <Table.Cell key={0}>
                      <b>Role</b>
                    </Table.Cell>
                    <Table.Cell key={1}>
                      {party === account.payload.account.provider ? 'Provider' : 'Client'}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row key={4}>
                    <Table.Cell key={0}>
                      <b>Controllers</b>
                    </Table.Cell>
                    <Table.Cell key={1}>
                      {Object.keys(account.payload.ctrls.textMap).join(', ')}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Tile>
          </div>
          <div className="holdings">
            <Tile header={<h4>Holdings</h4>}>
              <StripedTable
                headings={['Holding', 'Asset', '']}
                loading={depositsLoading}
                rows={accountDeposits.map(c => {
                  return {
                    elements: [
                      c.payload.asset.quantity,
                      c.payload.asset.id.label,
                      <>
                        {party === account.payload.account.owner && (
                          <div className="action-row">
                            <Button className="ghost" onClick={() => requestWithdrawDeposit(c)}>
                              Withdraw
                            </Button>
                            {relatedAccounts.length > 0 && (
                              <Button className="ghost" onClick={() => requestTransfer(c)}>
                                Transfer
                              </Button>
                            )}
                          </div>
                        )}
                      </>,
                    ],
                  };
                })}
              />
            </Tile>
          </div>
        </div>
      </div>
    </>
  );
};

export const Account = withRouter(AccountComponent);
