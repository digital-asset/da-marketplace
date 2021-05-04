import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { publicParty, usePartyName } from '../../config';
import {
  RequestOpenAccount,
  Service,
  RequestOpenAllocationAccount,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Party } from '@daml/types';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { ServicePageProps, createDropdownProp } from '../common';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { Button, Form, Header } from 'semantic-ui-react';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import { IconClose } from '../../icons/icons';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount/module';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

enum AccountType {
  REGULAR = 'Regular',
  ALLOCATION = 'Allocation',
}

const NewComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const accounts = useStreamQueries(AssetSettlementRule).contracts;
  const allocationAccounts = useStreamQueries(AllocationAccountRule).contracts;

  const [operator, setOperator] = useState<Party>();
  const [provider, setProvider] = useState<Party>();
  const [accountName, setAccountName] = useState<string>('');
  const [accountType, setAccountType] = useState(AccountType.REGULAR);
  const [accountNominee, setAccountNominee] = useState<Party>();
  console.log(accountType);

  const identities = useStreamQueries(VerifiedIdentity).contracts;

  const canRequest =
    !!operator &&
    !!provider &&
    !!accountName &&
    !!accountType &&
    (accountType === AccountType.REGULAR
      ? accounts.find(
          a =>
            a.payload.account.provider === provider &&
            a.payload.account.owner === party &&
            a.payload.account.id.label === accountName
        ) === undefined
      : allocationAccounts.find(
          a =>
            a.payload.account.provider === provider &&
            a.payload.account.owner === party &&
            a.payload.account.id.label === accountName
        ) === undefined && !!accountNominee);

  const custodyService = services.filter(s => s.payload.customer === party);
  if (custodyService.length === 0) return <>Not a custody service customer</>;

  const requestAccount = async () => {
    const service = services.find(
      s =>
        s.payload.operator === operator &&
        s.payload.provider === provider &&
        s.payload.customer === party
    );
    if (!service) return;
    switch (accountType) {
      case AccountType.REGULAR:
        const accountRequest: RequestOpenAccount = {
          accountId: {
            signatories: {
              textMap: { [service.payload.provider]: {}, [service.payload.customer]: {} },
            },
            label: accountName,
            version: '0',
          },
          observers: [publicParty],
          ctrls: [service.payload.provider, service.payload.customer],
        };
        await ledger.exercise(Service.RequestOpenAccount, service.contractId, accountRequest);
        history.push('/app/custody/assets');
      case AccountType.ALLOCATION:
        const nomineeIdentity = identities.find(i => i.payload.customer === accountNominee);
        if (!nomineeIdentity) return;
        const request: RequestOpenAllocationAccount = {
          accountId: {
            signatories: {
              textMap: { [service.payload.provider]: {}, [service.payload.customer]: {} },
            },
            label: accountName,
            version: '0',
          },
          observers: { textMap: {} }, // TODO: Add public party?
          nominee: nomineeIdentity.payload.customer,
        };
        await ledger.exercise(Service.RequestOpenAllocationAccount, service.contractId, request);
        history.push('/app/custody/assets');
    }
  };

  const operators: DropdownItemProps[] = services.map((c, i) => ({
    key: i,
    text: getName(c.payload.operator),
    value: c.payload.operator,
  }));

  const providerByOperator = (operator: string): DropdownItemProps[] =>
    services
      .filter(s => s.payload.operator === operator)
      .map((c, i) => ({
        key: i,
        text: getName(c.payload.provider),
        value: c.payload.provider,
      }));

  return (
    <div className="new-account">
      <Header as="h2">New Account Request</Header>
      <FormErrorHandled onSubmit={() => requestAccount()}>
        <Form.Select
          label="Operator"
          placeholder="Select..."
          required
          options={operators}
          onChange={(_, change) => setOperator(change.value as Party)}
        />
        <Form.Select
          label="Provider"
          placeholder="Select..."
          disabled={!operator}
          required
          options={operator ? providerByOperator(operator) : []}
          onChange={(_, change) => setProvider(change.value as Party)}
        />
        <Form.Input label="Customer" placeholder={getName(party)} readOnly />
        <Form.Input
          label="Account Name"
          placeholder="Provide an Account Name"
          required
          onChange={(_, change) => setAccountName(change.value as string)}
        />
        <Form.Select
          label="Account Type"
          placeholder="Account Type..."
          value={accountType}
          options={Object.values(AccountType).map(at => createDropdownProp(at))}
          required
          onChange={(_, change) => setAccountType(change.value as AccountType)}
        />
        {accountType === AccountType.ALLOCATION && (
          <Form.Select
            label="Nominee"
            placeholder="Select..."
            required
            options={identities.map(iden =>
              createDropdownProp(iden.payload.legalName, iden.payload.customer)
            )}
            onChange={(_, change) => setAccountNominee(change.value as Party)}
          />
        )}
        <Form.Input
          label="Version"
          placeholder="0"
          readOnly
          onChange={(_, change) => setAccountName(change.value as string)}
        />
        <div className="submit">
          <Button type="submit" className="ghost" disabled={!canRequest} content="Submit" />
          <a className="a2" onClick={() => history.goBack()}>
            <IconClose /> Cancel
          </a>
        </div>
      </FormErrorHandled>
    </div>
  );
};

export const New = withRouter(NewComponent);
