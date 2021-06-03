import React, { useState } from 'react';
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
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount/module';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { CreateEvent } from '@daml/ledger';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import { Form } from 'semantic-ui-react';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/module';

enum AccountType {
  REGULAR = 'Regular',
  ALLOCATION = 'Allocation',
}

type Props = {
  party: Party;
  custodyServices?: Readonly<CreateEvent<CustodyService, any, any>[]> | undefined;
};

const NewComponent: React.FC<Props> = ({ party, custodyServices }) => {
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

  const { contracts: servicesStream, loading: custodyLoading } = useStreamQueries(CustodyService);
  const customerCustodyServices = servicesStream.filter(cs => cs.payload.customer === party);
  const services = !!custodyServices ? servicesStream : customerCustodyServices;

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
    <ModalFormErrorHandled
      onSubmit={() => requestAccount()}
      title="New Account"
      disabled={!canRequest}
      button={false}
    >
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
    </ModalFormErrorHandled>
  );
};

export const NewAccountModal = NewComponent;
