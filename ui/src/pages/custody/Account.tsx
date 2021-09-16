import React, { useState } from 'react';

import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Account as AccountContract } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { CreateEvent } from '@daml/ledger';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { InputDialog, InputDialogProps } from '../../components/InputDialog/InputDialog';
import { usePartyName } from '../../config';
import Tile from '../../components/Tile/Tile';
import {ServicePageProps, damlSetValues, isEmptySet} from '../common';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import OverflowMenu, { OverflowMenuEntry } from '../../pages/page/OverflowMenu';
import {Icon, Popup} from "semantic-ui-react";

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

  const { contracts: deposits, loading: depositsLoading } = useStreamQueries(AssetDeposit);
  // const existingCloseRequest = !!useStreamQueries(CloseAccountRequest).contracts.find(
  //   c => c.payload.accountId.label === targetAccount.account.id.label
  // );

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

  if (depositsLoading) {
    return <h4>Loading account...</h4>;
  }

  if (!targetAccount) {
    return <h4>Could not find account.</h4>;
  }

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
    await ledger.exercise(Service.RequestWithdrawl, service.contractId, {
      depositCid: c.contractId
    });
  };

  const relatedAccounts = services
    .filter(s => s.contractId !== cid)
    .filter(s => s.payload.account.owner === targetAccount.account.owner)
    .map(s => s.payload.account.id.label);

  const requestTransfer = (deposit: CreateEvent<AssetDeposit>) => {
    const onClose = async (state: any | null) => {
      setTransferDialogProps({ ...defaultTransferRequestDialogProps, open: false });
      if (!state) return;
      const transferToAccount = services.find(a => a.payload.account.id.label === state.account);

      if (!service || !transferToAccount) return;

      await ledger.exercise(AssetDeposit.AssetDeposit_Transfer, deposit.contractId, {
        receiverAccount: transferToAccount.payload.account
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

  // const requestCloseAccount = async (c: CreateEvent<AssetSettlementRule>) => {
  //   if (!service)
  //     return displayErrorMessage({
  //       message: 'The account provider does not offer issuance services.',
  //     });
  //   await ledger.exercise(Service.RequestCloseAccount, service.contractId, {
  //     accountId: c.payload.account.id,
  //   });
  // };

  return (
    <>
      <InputDialog {...transferDialogProps} isModal />
      <div className="account">
        <div className="account-details">
          <div className="account-data">
            <h4> {targetAccount.account.id.label} </h4>
            {/*{ targetAccount.account.owner === party &&*/}
            {/*  (existingCloseRequest ? (*/}
            {/*    <p className="close-request">*/}
            {/*      <i> close request pending</i>*/}
            {/*    </p>*/}
            {/*  ) : (*/}
            {/*    <OverflowMenu>*/}
            {/*      <OverflowMenuEntry*/}
            {/*        label={'Close Account'}*/}
            {/*        onClick={() => requestCloseAccount(normalAccount)}*/}
            {/*      />*/}
            {/*    </OverflowMenu>*/}
            {/*  ))}*/}
          </div>
          <div className="account-data body">
            <p className="p2">Provider: {getName(targetAccount.account.provider)}</p>
            <p className="p2">Owner: {getName(targetAccount.account.owner)}</p>
            <p className="p2">
              Role: {party === targetAccount.account.provider ? 'Provider' : 'Client'}
            </p>
            <p className="p2">
                Signatories:{' '}
                {damlSetValues(targetAccount.account.id.signatories)
                  .map(a => getName(a))
                  .sort()
                  .join(', ')}
              </p>
          </div>
        </div>
        {accountDeposits.length > 0 ? (
          accountDeposits.map(c => (
            <Tile className="account-holding" key={c.contractId}>
              <p>
                <b>{c.payload.asset.id.label}</b> {c.payload.asset.quantity}{' '}
                { !isEmptySet(c.payload.lockers) &&
                    <Popup
                        trigger={<Icon name="lock" />}
                        content={"Locked by " + damlSetValues(c.payload.lockers)
                                    .map(a => getName(a))
                                    .sort()
                                    .join(', ')}
                      />
                }
              </p>
              {party === targetAccount.account.owner && (
                <OverflowMenu>
                  <OverflowMenuEntry label={'Withdraw'} onClick={() => requestWithdrawDeposit(c)} />
                  {/*<OverflowMenuEntry label={'Transfer'} onClick={() => requestTransfer(c)} />*/}
                </OverflowMenu>
              )}
            </Tile>
          ))
        ) : (
          <Tile className="account-holding">
            <i>There are no holdings in this account.</i>
          </Tile>
        )}
      </div>
    </>
  );
};

export default Account;
