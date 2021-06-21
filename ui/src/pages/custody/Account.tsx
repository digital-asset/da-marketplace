import React, { useState } from 'react';

import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Account as AccountContract } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { CreateEvent } from '@daml/ledger';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { InputDialog, InputDialogProps } from '../../components/InputDialog/InputDialog';
import { Button } from 'semantic-ui-react';
import { usePartyName } from '../../config';
import Tile from '../../components/Tile/Tile';
import { ServicePageProps, damlSetValues } from '../common';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import { IconChevronDown, IconChevronUp } from '../../icons/icons';

interface AccountProps {
  targetAccount: {
    account: AccountContract;
    contractId: string;
  };
}

const Account: React.FC<ServicePageProps<Service> & AccountProps> = ({
  services,
  targetAccount,
}: ServicePageProps<Service> & AccountProps) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();

  const cid = targetAccount.contractId.replace('_', '#');

  const { contracts: accounts, loading: accountsLoading } = useStreamQueries(AssetSettlementRule);
  const { contracts: allocatedAccounts, loading: allocatedAccountsLoading } =
    useStreamQueries(AllocationAccountRule);
  const { contracts: deposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);

  const [showAccountDetails, setShowAccountDetails] = useState(false);

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

  if (accountsLoading || depositsLoading || allocatedAccountsLoading) {
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

  const requestCloseAccount = async (c: CreateEvent<AssetSettlementRule>) => {
    if (!service)
      return displayErrorMessage({
        message: 'The account provider does not offer issuance services.',
      });
    await ledger.exercise(Service.RequestCloseAccount, service.contractId, {
      accountId: c.payload.account.id,
    });
  };

  return (
    <>
      <InputDialog {...transferDialogProps} isModal />
      <div className="account">
        <div className="account-details">
          <h4> {targetAccount.account.id.label} </h4>
          <Button className="a a2" onClick={() => setShowAccountDetails(!showAccountDetails)}>
            {showAccountDetails ? <IconChevronUp /> : <IconChevronDown />}
          </Button>
        </div>
        {showAccountDetails && (
          <div className="account-details">
            <p className="p2">Type: {normalAccount ? 'Normal' : 'Allocation'} </p>
            <p className="p2">Provider: {getName(targetAccount.account.provider)}</p>
            <p className="p2">Owner: {getName(targetAccount.account.owner)}</p>
            <p className="p2">
              Role: {party === targetAccount.account.provider ? 'Provider' : 'Client'}
            </p>
            {allocationAccount && (
              <p className="p2">Nominee: {allocationAccount.payload.nominee}</p>
            )}
            {normalAccount && (
              <p className="p2">
                Controllers:{' '}
                {damlSetValues(normalAccount.payload.ctrls)
                  .map(ctrl => getName(ctrl))
                  .sort()
                  .join(', ')}
              </p>
            )}
            {normalAccount && (
              <Button
                className="ghost warning  secondary-smaller"
                onClick={() => requestCloseAccount(normalAccount)}
              >
                Close Account
              </Button>
            )}
          </div>
        )}
        {accountDeposits.length > 0 ? (
          accountDeposits.map(c => (
            <Tile className="account-holding">
              <p>
                <b>{c.payload.asset.id.label}</b> {c.payload.asset.quantity}{' '}
              </p>
              {party === targetAccount.account.owner && normalAccount && (
                <div className="actions">
                  <Button
                    className="ghost"
                    content="Withdraw"
                    onClick={() => requestWithdrawDeposit(c)}
                  />
                  {relatedAccounts.length > 0 && (
                    <Button
                      className="ghost"
                      content="Transfer"
                      onClick={() => requestTransfer(c)}
                    />
                  )}
                </div>
              )}
            </Tile>
          ))
        ) : (
          <div className="none p2">
            <i>There are no holdings in this account.</i>
          </div>
        )}
      </div>
    </>
  );
};

export default Account;
