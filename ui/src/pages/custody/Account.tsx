import React, { useEffect, useMemo, useState } from 'react';
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
import { usePartyName } from '../../config';
import StripedTable from '../../components/Table/StripedTable';
import { ServicePageProps, damlSetValues, makeDamlSet } from '../common';
import { ArrowLeftIcon } from '../../icons/icons';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import _ from 'lodash';
import { halfSecondPromise } from '../page/utils';

const AccountComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();
  const { contractId } = useParams<any>();

  const [updatingDeposits, setUpdatingDeposits] = useState(false);

  const cid = contractId.replace('_', '#');

  const { contracts: accounts, loading: accountsLoading } = useStreamQueries(AssetSettlementRule);
  const { contracts: allocatedAccounts, loading: allocatedAccountsLoading } =
    useStreamQueries(AllocationAccountRule);
  const { contracts: assets, loading: assetsLoading } = useStreamQueries(AssetDescription);
  const { contracts: deposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);

  const addSignatoryAsDepositObserver = async (
    deposit: CreateEvent<AssetDeposit>,
    newObs: string[]
  ) => {
    const newObservers = makeDamlSet([...deposit.observers, ...newObs]);

    await ledger.exercise(AssetDeposit.AssetDeposit_SetObservers, deposit.contractId, {
      newObservers,
    });
  };

  const updateDeposits: any = async (retries: number) => {
    if (retries > 0) {
      await halfSecondPromise();
      return updateDeposits(retries - 1);
    }
    return Promise.all(
      deposits.map(d => {
        const newObservers = damlSetValues(d.payload.asset.id.signatories).filter(
          signatory => !d.observers.includes(signatory)
        );
        if (newObservers.length > 0) {
          addSignatoryAsDepositObserver(d, newObservers);
        }
      })
    );
  };

  useEffect(() => {
    setUpdatingDeposits(true);
    updateDeposits(3).then(() => setUpdatingDeposits(false));
  }, []);

  const allAccounts = useMemo(
    () =>
      accounts
        .map(a => {
          return { account: a.payload.account, contractId: a.contractId.replace('#', '_') };
        })
        .concat(
          allocatedAccounts.map(a => {
            return { account: a.payload.account, contractId: a.contractId.replace('#', '_') };
          })
        ),
    [accounts, allocatedAccounts]
  );

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
  const targetAccount = allAccounts.find(a => a.contractId === cid);

  if (accountsLoading || assetsLoading || depositsLoading || allocatedAccountsLoading) {
    return <h4>Loading account...</h4>;
  }

  if (!targetAccount) {
    return <h4>Could not find account.</h4>;
  }

  const normalAccount = accounts.find(a => a.contractId === targetAccount.contractId);
  const allocationAccount = allocatedAccounts.find(a => a.contractId === targetAccount.contractId);

  const accountDeposits = deposits.filter(
    d =>
      d.payload.account.id.label === targetAccount.account.id.label &&
      d.payload.account.provider === targetAccount.account.provider &&
      d.payload.account.owner === targetAccount.account.owner
  );

  const requestWithdrawDeposit = async (c: CreateEvent<AssetDeposit>) => {
    const service = clientServices.find(s => s.payload.provider === c.payload.account.provider);
    if (!service)
      return displayErrorMessage({
        message: 'The account provider does not offer issuance services.',
      });
    await ledger.exercise(Service.RequestDebitAccount, service.contractId, {
      accountId: c.payload.account.id,
      debit: { depositCid: c.contractId },
    });
    history.push('/app/custody/requests');
  };

  const relatedAccounts = accounts
    .filter(a => a.contractId !== cid)
    .filter(a => a.payload.account.owner === targetAccount.account.owner)
    .map(r => r.payload.account.id.label);

  const requestTransfer = (deposit: CreateEvent<AssetDeposit>) => {
    const onClose = async (state: any | null) => {
      setTransferDialogProps({ ...defaultTransferRequestDialogProps, open: false });
      if (!state) return;
      const transferToAccount = accounts.find(a => a.payload.account.id.label === state.account);
      const service = clientServices.find(
        s => s.payload.provider === targetAccount.account.provider
      );
      if (!service || !transferToAccount) return;

      await ledger.exercise(Service.RequestTransferDeposit, service.contractId, {
        accountId: targetAccount.account.id,
        transfer: {
          receiverAccountId: transferToAccount.payload.account.id,
          depositCid: deposit.contractId,
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
      if (!asset || !targetAccount) return;
      const service = clientServices.find(
        s => s.payload.provider === targetAccount.account.provider
      );
      if (!service) return;

      await ledger
        .exercise(Service.RequestCreditAccount, service.contractId, {
          accountId: targetAccount.account.id,
          asset: { id: asset.payload.assetId, quantity: state.quantity },
        })
        .then(() => {
          setUpdatingDeposits(true);
          updateDeposits(3).then(() => setUpdatingDeposits(false));
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
    if (!service)
      return displayErrorMessage({
        message: 'The account provider does not offer issuance services.',
      });
    await ledger.exercise(Service.RequestCloseAccount, service.contractId, {
      accountId: c.payload.account.id,
    });
    history.push('/app/custody/requests');
  };

  return (
    <>
      <Button className="ghost back-button" onClick={() => history.goBack()}>
        <ArrowLeftIcon /> back
      </Button>
      <InputDialog {...transferDialogProps} />
      <InputDialog {...creditDialogProps} />
      <div className="account">
        <Header as="h2">{targetAccount.account.id.label}</Header>
        {normalAccount && (
          <Tile header={<h4>Actions</h4>}>
            <div className="action-row">
              <Button className="ghost" onClick={() => requestCredit(targetAccount.account.id)}>
                Deposit
              </Button>
              <Button className="ghost" onClick={() => requestCloseAccount(normalAccount)}>
                Close
              </Button>
            </div>
          </Tile>
        )}

        <div className="account-overview">
          <div className="details">
            <Tile header={<h4>Account Details</h4>}>
              <Table basic="very">
                <Table.Body>
                  <Table.Row key={0}>
                    <Table.Cell key={0}>
                      <b>Name</b>
                    </Table.Cell>
                    <Table.Cell key={1}>{targetAccount.account.id.label}</Table.Cell>
                  </Table.Row>
                  <Table.Row key={1}>
                    <Table.Cell key={0}>
                      <b>Type</b>
                    </Table.Cell>
                    <Table.Cell key={1}>{normalAccount ? 'Normal' : 'Allocation'}</Table.Cell>
                  </Table.Row>
                  <Table.Row key={2}>
                    <Table.Cell key={0}>
                      <b>Provider</b>
                    </Table.Cell>
                    <Table.Cell key={1}>{getName(targetAccount.account.provider)}</Table.Cell>
                  </Table.Row>
                  <Table.Row key={3}>
                    <Table.Cell key={0}>
                      <b>Owner</b>
                    </Table.Cell>
                    <Table.Cell key={1}>{getName(targetAccount.account.owner)}</Table.Cell>
                  </Table.Row>
                  <Table.Row key={4}>
                    <Table.Cell key={0}>
                      <b>Role</b>
                    </Table.Cell>
                    <Table.Cell key={1}>
                      {party === targetAccount.account.provider ? 'Provider' : 'Client'}
                    </Table.Cell>
                  </Table.Row>
                  {normalAccount && (
                    <Table.Row key={5}>
                      <Table.Cell key={0}>
                        <b>Controllers</b>
                      </Table.Cell>
                      <Table.Cell key={1}>
                        {damlSetValues(normalAccount.payload.ctrls)
                          .map(ctrl => getName(ctrl))
                          .sort()
                          .join(', ')}
                      </Table.Cell>
                    </Table.Row>
                  )}
                  {allocationAccount && (
                    <Table.Row key={5}>
                      <Table.Cell key={0}>
                        <b>Nominee</b>
                      </Table.Cell>
                      <Table.Cell key={1}>{allocationAccount.payload.nominee}</Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Tile>
          </div>
          <div className="holdings">
            <Tile header={<h4>Holdings</h4>}>
              <StripedTable
                headings={['Holding', 'Asset', '']}
                loading={depositsLoading || updatingDeposits}
                rows={accountDeposits.map(c => {
                  return {
                    elements: [
                      c.payload.asset.quantity,
                      c.payload.asset.id.label,
                      <>
                        {party === targetAccount.account.owner && normalAccount && (
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
