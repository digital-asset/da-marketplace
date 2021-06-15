import React, { useMemo, useState } from 'react';

import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { RouteComponentProps, useParams, withRouter } from 'react-router-dom';
import { CreateEvent } from '@daml/ledger';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { InputDialog, InputDialogProps } from '../../components/InputDialog/InputDialog';
import { Button, Form } from 'semantic-ui-react';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { usePartyName } from '../../config';
import StripedTable from '../../components/Table/StripedTable';
import BackButton from '../../components/Common/BackButton';
import InfoCard from '../../components/Common/InfoCard';
import Tile from '../../components/Tile/Tile';
import { ServicePageProps, damlSetValues, createDropdownProp } from '../common';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import paths from '../../paths';
import FormErrorHandled from '../../components/Form/FormErrorHandled';

const AccountComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();
  const { contractId } = useParams<any>();

  const cid = contractId.replace('_', '#');

  const { contracts: accounts, loading: accountsLoading } = useStreamQueries(AssetSettlementRule);
  const { contracts: allocatedAccounts, loading: allocatedAccountsLoading } =
    useStreamQueries(AllocationAccountRule);
  const { contracts: assets, loading: assetsLoading } = useStreamQueries(AssetDescription);
  const { contracts: deposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);

  const [creditAsset, setCreditAsset] = useState<string>('');
  const [creditQuantity, setCreditQuantity] = useState<string>('');

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
  const service = clientServices.find(s => s.payload.provider === targetAccount.account.provider);

  const accountDeposits = deposits.filter(
    d =>
      d.payload.account.id.label === targetAccount.account.id.label &&
      d.payload.account.provider === targetAccount.account.provider &&
      d.payload.account.owner === targetAccount.account.owner
  );

  const requestWithdrawDeposit = async (c: CreateEvent<AssetDeposit>) => {
    if (!service)
      return displayErrorMessage({
        message: 'The account provider does not offer issuance services.',
      });
    await ledger.exercise(Service.RequestDebitAccount, service.contractId, {
      accountId: c.payload.account.id,
      debit: { depositCid: c.contractId },
    });
    history.push(paths.app.wallet.requests);
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

  const onRequestCredit = async () => {
    const asset = assets.find(i => i.payload.description === creditAsset);
    if (!asset) return;

    if (!service)
      return displayErrorMessage({
        message: `${getName(
          targetAccount.account.provider
        )} does not offer issuance services to ${getName(party)}`,
      });

    await ledger.exercise(Service.RequestCreditAccount, service.contractId, {
      accountId: targetAccount.account.id,
      asset: { id: asset.payload.assetId, quantity: creditQuantity },
    });
    setCreditAsset('');
    setCreditQuantity('');
  };

  const requestCloseAccount = async (c: CreateEvent<AssetSettlementRule>) => {
    if (!service)
      return displayErrorMessage({
        message: 'The account provider does not offer issuance services.',
      });
    await ledger.exercise(Service.RequestCloseAccount, service.contractId, {
      accountId: c.payload.account.id,
    });
    history.push(paths.app.wallet.requests);
  };

  let accountData = [
    {
      label: 'Name',
      data: targetAccount.account.id.label,
    },
    { label: 'Type', data: normalAccount ? 'Normal' : 'Allocation' },
    { label: 'Provider', data: getName(targetAccount.account.provider) },
    { label: 'Owner', data: getName(targetAccount.account.owner) },
    {
      label: 'Role',
      data: party === targetAccount.account.provider ? 'Provider' : 'Client',
    },
  ];

  if (normalAccount) {
    accountData = [
      ...accountData,
      {
        label: 'Controllers',
        data: damlSetValues(normalAccount.payload.ctrls)
          .map(ctrl => getName(ctrl))
          .sort()
          .join(', '),
      },
    ];
  }
  if (allocationAccount) {
    accountData = [
      ...accountData,
      {
        label: 'Nominee',
        data: allocationAccount.payload.nominee,
      },
    ];
  }

  return (
    <>
      <BackButton prevPageLabel="Wallet" prevPagePath={paths.app.wallet.root} />
      <InputDialog {...transferDialogProps} isModal />
      <div className="account">
        <div className="page-section-row">
          <InfoCard
            title="Account Details"
            info={accountData}
            actions={
              normalAccount && [
                <Button
                  key="close-account"
                  className="ghost warning"
                  onClick={() => requestCloseAccount(normalAccount)}
                >
                  Close Account
                </Button>,
              ]
            }
          />
          <Tile header="Credit Account Request">
            <br />
            <FormErrorHandled onSubmit={() => onRequestCredit()}>
              <Form.Select
                label="Asset"
                options={assets.map(a => createDropdownProp(a.payload.description))}
                value={creditAsset}
                onChange={(_, data) => setCreditAsset(data.value as string)}
              />
              <Form.Input
                label="Quantity"
                type="number"
                value={creditQuantity}
                onChange={(_, data) => setCreditQuantity(data.value as string)}
              />
              <Button
                type="submit"
                className="ghost"
                disabled={creditAsset === '' || creditQuantity === '' || creditQuantity === '0'}
                content="Submit"
              />
            </FormErrorHandled>
          </Tile>
        </div>
        <StripedTable
          title="Holdings"
          headings={['Holding', 'Asset', '']}
          loading={depositsLoading}
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
      </div>
    </>
  );
};

export const Account = withRouter(AccountComponent);
