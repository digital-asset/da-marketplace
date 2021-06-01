import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { usePartyName } from '../../config';
import {
  RequestOpenAccount,
  RequestOpenAllocationAccount,
  Service,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Party } from '@daml/types';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { createDropdownProp, ServicePageProps, makeDamlSet } from '../common';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import BackButton from '../../components/Common/BackButton';
import { Button, Form, Header } from 'semantic-ui-react';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import { IconClose } from '../../icons/icons';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount/module';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { CreateEvent } from '@daml/ledger';
import paths from '../../paths';

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
  const [observers, setObservers] = useState<string[]>([]);

  const identities = useStreamQueries(VerifiedIdentity).contracts;
  const identityOptions = identities.map(iden =>
    createDropdownProp(iden.payload.legalName, iden.payload.customer)
  );

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
  if (custodyService.length === 0) return <>Not a custody service customer</>; // add MissingServiceModal

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
            signatories: makeDamlSet([service.payload.provider, service.payload.customer]),
            label: accountName,
            version: '0',
          },
          observers,
          ctrls: [service.payload.provider, service.payload.customer],
        };
        await ledger.exercise(Service.RequestOpenAccount, service.contractId, accountRequest);
        history.push(paths.app.custody.assets);
        break;
      case AccountType.ALLOCATION:
        const nomineeIdentity = identities.find(i => i.payload.customer === accountNominee);
        if (!nomineeIdentity) return;
        const request: RequestOpenAllocationAccount = {
          accountId: {
            signatories: makeDamlSet([service.payload.provider, service.payload.customer]),
            label: accountName,
            version: '0',
          },
          observers: makeDamlSet<string>(observers),
          nominee: nomineeIdentity.payload.customer,
        };
        await ledger.exercise(Service.RequestOpenAllocationAccount, service.contractId, request);
        history.push(paths.app.custody.assets);
        break;
    }
  };

  const operators: DropdownItemProps[] = services
    .reduce(
      (acc, cur) =>
        acc.find(a => a.payload.operator === cur.payload.operator) ? acc : [...acc, cur],
      [] as CreateEvent<Service, any, any>[]
    )
    .map((c, i) => ({
      key: i,
      text: getName(c.payload.operator),
      value: c.payload.operator,
    }))
    .sort();

  const providerByOperator = (operator: string): DropdownItemProps[] =>
    services
      .filter(s => s.payload.operator === operator)
      .map((c, i) => ({
        key: i,
        text: getName(c.payload.provider),
        value: c.payload.provider,
      }));

  return (
    <div className="input-dialog">
      <BackButton prevPage="Wallet" />
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
            options={identityOptions}
            onChange={(_, change) => setAccountNominee(change.value as Party)}
          />
        )}
        <Form.Input
          label="Version"
          placeholder="0"
          readOnly
          onChange={(_, change) => setAccountName(change.value as string)}
        />
        <Form.Select
          label="Observers"
          multiple
          placeholder="Select..."
          options={identityOptions}
          onChange={(event: React.SyntheticEvent, result: any) => {
            setObservers(result.value);
          }}
        />
        <div className="submit-form">
          <Button type="submit" className="ghost" disabled={!canRequest} content="Submit" />
          <Button className="a a2" onClick={() => history.goBack()}>
            <IconClose /> Cancel
          </Button>
        </div>
      </FormErrorHandled>
    </div>
  );
};

export const New = withRouter(NewComponent);
