import React from 'react';
import { createDropdownProp } from '../common';
import { useStreamQueries } from '../../Main';
import { DropdownItemProps, Form, DropdownProps } from 'semantic-ui-react';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/';
import { IPartyAccounts, AccountsForServices } from './ProvideServicesPage';
import { Party } from '@daml/types';
import _ from 'lodash';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';

export enum AccountType {
  REGULAR = 'Regular',
  ALLOCATION = 'Allocation',
}

type AccountInfo = {
  accountType: AccountType;
  accountLabel: string;
};
export type AccountInfos = { [k: string]: AccountInfo };

type Props = {
  party: Party;
  serviceProvider?: Party;
  accountsForParty?: IPartyAccounts;
  accountInfos: AccountInfos;
  accountsForServices: AccountsForServices;
  onChangeAccount: (k: string, acct: Account | undefined) => void;
};

const AccountSelection: React.FC<Props> = ({
  party,
  serviceProvider,
  accountsForServices,
  accountsForParty,
  accountInfos,
  onChangeAccount,
}) => {
  const accounts = (accountsForParty?.accounts || [])
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);
  const accountNames: DropdownItemProps[] = accounts.map(a => createDropdownProp(a.id.label));

    const custodyServices = useStreamQueries(CustodyService).contracts.filter(
    c => c.payload.customer === party
  );

  const accountNeeded = !accountNames.length

  return (
    <>
      {!custodyServices.length && accountNeeded ? (
        <>This party must have at least one Custody service</>
      ) : (
        !!serviceProvider && (
          <div>
            {_.toPairs(accountInfos).map(([k, accountInfo]) => (
              <ProviderOption
                accountInfo={accountInfo}
                accountKey={k}
                accounts={accounts}
                accountsForServices={accountsForServices}
                onChangeAccount={onChangeAccount}
              />
            ))}
          </div>
        )
      )}
    </>
  );
};

const ProviderOption = (props: {
  accountInfo: AccountInfo;
  accountKey: string;
  accounts: Account[];
  accountsForServices: { [k: string]: Account | undefined };
  onChangeAccount: (k: string, acct: Account | undefined) => void;
}) => {
  const {
    accountInfo,
    accounts,
    accountsForServices,
    onChangeAccount,
    accountKey,
  } = props;

  const accountNames: DropdownItemProps[] = accounts.map(a => createDropdownProp(a.id.label));

  const select = (change: DropdownProps) => {
    const account = accounts.find(a => a.id.label === (change.value as string));
    onChangeAccount(accountKey, account);
  };

  return (
    <>
      <Form.Select
        className="request-select"
        label={<p className="input-label">{accountInfo.accountLabel}</p>}
        placeholder="Select..."
        required
        options={[...accountNames]}
        value={accountsForServices[accountKey]?.id.label}
        onChange={(_, change) => select(change)}
      />
    </>
  );
};

export default AccountSelection;
