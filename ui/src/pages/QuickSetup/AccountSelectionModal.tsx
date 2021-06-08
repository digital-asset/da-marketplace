import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { damlSetValues, makeDamlSet, createDropdownProp } from '../common';
import { useStreamQueries } from '../../Main';
import {
  Service,
  RequestOpenAccount,
  RequestOpenAllocationAccount,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { DropdownItemProps, Form, Modal, Button, DropdownProps } from 'semantic-ui-react';
import { useLedger } from '@daml/react';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/';
import { usePartyName } from '../../config';
import {
  OpenAccountRequest,
  OpenAllocationAccountRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import { IPartyAccounts } from './RequestServicesPage';
import { Party } from '@daml/types';
import _ from 'lodash';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { CreateEvent } from '@daml/ledger';

export enum AccountType {
  REGULAR = 'Regular',
  ALLOCATION = 'Allocation',
}

type AccountInfo = {
  accountType: AccountType;
  accountLabel: string;
};
export type AccountInfos = { [k: string]: AccountInfo };
export type SetFunction = (accts: { [k: string]: Account | undefined }) => void;

type NameMap = { [k: string]: string | undefined };

type Props = {
  party: Party;
  serviceProvider?: Party;
  open: boolean;
  setOpen: (bool: boolean) => void;
  accountsForParty?: IPartyAccounts;
  accountInfos: AccountInfos;
  onCancel: () => void;
  onFinish: SetFunction;
};

const AccountSelectionModal: React.FC<Props> = ({
  party,
  serviceProvider,
  open,
  setOpen,
  accountsForParty,
  accountInfos,
  onFinish,
  onCancel,
}) => {
  const { getName } = usePartyName(party);

  const hasRegularAccount = _.values(accountInfos).reduce(
    (acc, info) => acc || info.accountType === AccountType.REGULAR,
    false
  );
  const hasAllocationAccount = _.values(accountInfos).reduce(
    (acc, info) => acc || info.accountType === AccountType.ALLOCATION,
    false
  );

  const emptyNamesState = _.mapValues(accountInfos, () => {
    return undefined;
  });
  const [accountNamesState, setAccountNamesState] = useState<NameMap>(emptyNamesState);

  useEffect(() => {
    setAccountNamesState(prev =>
      _.mapValues(accountInfos, (_, key) => {
        return prev[key] || undefined;
      })
    );
  }, [accountInfos]);

  const disabled = _.values(accountNamesState).reduce((acc, name) => acc || !name, false);

  const allocationAccountRules = accountsForParty?.allocAccounts || [];
  const allocationAccounts = allocationAccountRules
    .filter(c => c.payload.nominee === serviceProvider)
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);

  const assetSettlementRules = accountsForParty?.accounts || [];
  const accounts = assetSettlementRules
    .filter(c => c.payload.account.owner === party)
    .filter(c => damlSetValues(c.payload.observers).find(obs => obs === serviceProvider))
    .map(c => c.payload.account);
  const accountNames: DropdownItemProps[] = accounts.map(a => createDropdownProp(a.id.label));

  const openAccountRequests = useStreamQueries(OpenAccountRequest).contracts.filter(rq =>
    damlSetValues(rq.payload.observers).find(obs => obs === serviceProvider)
  );
  const openAllocationAccountRequests = useStreamQueries(
    OpenAllocationAccountRequest
  ).contracts.filter(rq => rq.payload.nominee === serviceProvider);

  const custodyServices = useStreamQueries(CustodyService).contracts.filter(
    c => c.payload.customer === party
  );

  const allocationAccountNeeded =
    hasAllocationAccount && !allocationAccounts.length && !openAllocationAccountRequests.length;
  const accountNeeded = hasRegularAccount && !accountNames.length && !openAccountRequests.length;

  return (
    <Modal
      as={Form}
      open={open}
      onSubmit={() => {
        const accts = _.mapValues(accountInfos, (accountInfo, k) => {
          const account =
            accountInfo.accountType === AccountType.REGULAR
              ? accounts.find(a => a.id.label === accountNamesState[k])
              : allocationAccounts.find(a => a.id.label === accountNamesState[k]);
          return account;
        });
        onFinish(accts);
        setAccountNamesState(emptyNamesState);
        setOpen(false);
      }}
    >
      <Modal.Header as="h2">{`Select Accounts for ${getName(party)} requesting from ${getName(
        serviceProvider || ''
      )}`}</Modal.Header>
      <Modal.Content>
        {!custodyServices.length && (allocationAccountNeeded || accountNeeded) ? (
          <>This party must have at least one Custody service</>
        ) : (
          !!serviceProvider && (
            <div>
              {_.toPairs(accountInfos).map(([k, accountInfo]) => (
                <ProviderOption
                  accountInfo={accountInfo}
                  accountKey={k}
                  accounts={accounts}
                  allocationAccounts={allocationAccounts}
                  openAllocationAccountRequests={openAllocationAccountRequests}
                  openAccountRequests={openAccountRequests}
                  custodyServices={custodyServices}
                  accountNamesState={accountNamesState}
                  setAccountNamesState={setAccountNamesState}
                  party={party}
                  serviceProvider={serviceProvider}
                />
              ))}
            </div>
          )
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          className="ghost warning"
          color="black"
          onClick={() => {
            onCancel();
            setOpen(false);
            // setAccountNamesState(emptyNamesState);
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={disabled}
          content="Submit"
          labelPosition="right"
          icon="checkmark"
          type="submit"
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

const ProviderOption = (props: {
  accountInfo: AccountInfo;
  accountKey: string;
  accounts: Account[];
  allocationAccounts: Account[];
  openAccountRequests: CreateEvent<OpenAccountRequest>[];
  openAllocationAccountRequests: CreateEvent<OpenAllocationAccountRequest>[];
  custodyServices: CreateEvent<CustodyService>[];
  accountNamesState: NameMap;
  setAccountNamesState: (setter: (prevState: NameMap) => NameMap) => void;
  party: string;
  serviceProvider: string;
}) => {
  const {
    accountInfo,
    accounts,
    allocationAccounts,
    party,
    serviceProvider,
    openAccountRequests,
    openAllocationAccountRequests,
    custodyServices,
    accountNamesState,
    setAccountNamesState,
    accountKey,
  } = props;
  const ledger = useLedger();
  const { getName } = usePartyName(party);

  const accountNames: DropdownItemProps[] = accounts.map(a => createDropdownProp(a.id.label));
  const allocationAccountNames: DropdownItemProps[] = allocationAccounts.map(a =>
    createDropdownProp(a.id.label)
  );

  const accountOptions =
    accountInfo.accountType === AccountType.REGULAR ? accountNames : allocationAccountNames;

  const makeAccountName = (accountInfo: AccountInfo) =>
    `${getName(party)}-${getName(serviceProvider)}-${accountInfo.accountLabel.replace(/\s+/g, '')}`;

  const requestAccount = async (provider: string, accountInfo: AccountInfo) => {
    if (!serviceProvider) return;
    const service = custodyServices.find(s => s.payload.provider === provider);
    if (!service) return;
    const accountId = {
      signatories: makeDamlSet([service.payload.provider, service.payload.customer]),
      label: makeAccountName(accountInfo),
      version: '0',
    };

    if (accountInfo.accountType === AccountType.REGULAR) {
      const accountRequest: RequestOpenAccount = {
        accountId,
        observers: [serviceProvider],
        ctrls: [service.payload.provider, service.payload.customer],
      };
      await ledger.exercise(Service.RequestOpenAccount, service.contractId, accountRequest);
    } else {
      const request: RequestOpenAllocationAccount = {
        accountId,
        observers: makeDamlSet<string>([]),
        nominee: serviceProvider,
      };
      await ledger.exercise(Service.RequestOpenAllocationAccount, service.contractId, request);
    }
  };

  const accountExists = (accountInfo: AccountInfo) => {
    const accountName = makeAccountName(accountInfo);
    if (accountInfo.accountType === AccountType.REGULAR) {
      return !!accounts.find(a => a.id.label === accountName);
    } else {
      return allocationAccounts.find(a => a.id.label === accountName);
    }
  };

  const accountRequestExists = (accountInfo: AccountInfo) => {
    const accountName = makeAccountName(accountInfo);
    if (accountInfo.accountType === AccountType.REGULAR) {
      return !!openAccountRequests.find(rq => rq.payload.accountId.label === accountName);
    } else {
      return !!openAllocationAccountRequests.find(rq => rq.payload.accountId.label === accountName);
    }
  };

  const uuid = uuidv4();
  const accountRequestPrepend = `${uuid}REQUEST`;

  const providerOptions =
    accountExists(accountInfo) || accountRequestExists(accountInfo)
      ? []
      : custodyServices.map(svc => {
          return {
            key: `REQUEST_${svc.payload.provider}_${accountInfo.accountLabel}`,
            label: `Request account from: ${getName(svc.payload.provider)}`,
            value: `${accountRequestPrepend}_${svc.payload.provider}`,
          };
        });

  const selectOrCreate = (change: DropdownProps) => {
    const [prepend, ...rest] = (change.value as string).split('_');
    if (prepend === accountRequestPrepend) {
      requestAccount(rest[0], accountInfo);
    } else {
      setAccountNamesState(prev => {
        let copy = { ...prev };
        copy[accountKey] = change.value as string;
        return copy;
      });
    }
  };
  return (
    <>
      <Form.Select
        label={accountInfo.accountLabel}
        placeholder="Select..."
        required
        options={[...accountOptions, ...providerOptions]}
        value={accountNamesState[accountKey]}
        onChange={(_, change) => selectOrCreate(change)}
      />
      {accountRequestExists(accountInfo) && <p>Account request pending...</p>}
    </>
  );
};

export default AccountSelectionModal;
