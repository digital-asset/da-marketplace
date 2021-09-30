import React, { useState } from 'react';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import { ServicePageProps, damlSetValues, makeDamlSet } from '../common';
import { useStreamQueries } from '../../Main';
import { Offer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import {
  Service,
  RequestOpenAccount,
  RequestOpenAllocationAccount,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { CreateEvent } from '@daml/ledger';
import { DropdownItemProps, Form } from 'semantic-ui-react';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount/module';
import { createDropdownProp } from '../common';
import { useParty, useLedger } from '@daml/react';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/';
import { useAccountName, usePartyName } from '../../config';
import {
  OpenAccountRequest,
  OpenAllocationAccountRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

type OfferProps = {
  offer?: CreateEvent<Offer>;
};

const ClearingOfferModal: React.FC<ServicePageProps<Service> & OfferProps> = ({
  services,
  offer,
}) => {
  const ledger = useLedger();
  const party = useParty();
  const { getName } = usePartyName(party);
  const [clearingAccountName, setClearingAccountName] = useState('');
  const [marginAccountName, setMarginAccountName] = useState('');
  const [clearingProvider, setClearingProvider] = useState(!!offer ? offer.payload.provider : '');
  const allocationAccountRules = useStreamQueries(AllocationAccountRule).contracts;
  const allocationAccounts = allocationAccountRules
    .filter(c => c.payload.nominee === clearingProvider)
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);

  const identities = useStreamQueries(VerifiedIdentity).contracts;
  const identityOptions = identities.map(idn =>
    createDropdownProp(idn.payload.legalName, idn.payload.customer)
  );

  const accountName = useAccountName('clearing', party, clearingProvider);

  const allocationAccountNames: DropdownItemProps[] = allocationAccounts.map(a =>
    createDropdownProp(a.id.label)
  );

  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules
    .filter(c => c.payload.account.owner === party)
    .filter(c => damlSetValues(c.payload.observers).find(obs => obs === clearingProvider))
    .map(c => c.payload.account);
  const accountNames: DropdownItemProps[] = accounts.map(a => createDropdownProp(a.id.label));

  const openAccountRequests = useStreamQueries(OpenAccountRequest).contracts.filter(rq =>
    damlSetValues(rq.payload.observers).find(obs => obs === clearingProvider)
  );
  const openAllocationAccountRequests = useStreamQueries(
    OpenAllocationAccountRequest
  ).contracts.filter(rq => rq.payload.nominee === clearingProvider);

  const acceptOffer = async () => {
    const clearingAccount = accounts.find(a => a.id.label === clearingAccountName);
    const marginAccount = allocationAccounts.find(a => a.id.label === marginAccountName);
    if (!clearingAccount || !marginAccount || !offer) return;
    await ledger.exercise(Offer.Accept, offer.contractId, { marginAccount, clearingAccount });
  };

  const custodyServices = useStreamQueries(CustodyService).contracts.filter(
    c => c.payload.customer === party
  );
  const custodyServiceOptions = custodyServices.map(c =>
    createDropdownProp(getName(c.payload.provider), c.payload.provider)
  );

  const requestClearingAccount = async (provider: string) => {
    const service = custodyServices.find(s => s.payload.provider === provider);
    if (!service) return;
    if (!accountName) return;

    const accountRequest: RequestOpenAccount = {
      accountId: {
        signatories: makeDamlSet([service.payload.provider, service.payload.customer]),
        label: accountName,
        version: '0',
      },
      observers: [clearingProvider],
      ctrls: [service.payload.provider, service.payload.customer],
    };
    await ledger.exercise(Service.RequestOpenAccount, service.contractId, accountRequest);
  };

  const requestMarginAccount = async (provider: string) => {
    const service = custodyServices.find(s => s.payload.provider === provider);
    if (!service) return;
    if (!accountName) return;

    const request: RequestOpenAllocationAccount = {
      accountId: {
        signatories: makeDamlSet([service.payload.provider, service.payload.customer]),
        label: accountName,
        version: '0',
      },
      observers: makeDamlSet<string>([]),
      nominee: clearingProvider,
    };
    await ledger.exercise(Service.RequestOpenAllocationAccount, service.contractId, request);
  };

  const marginAccountNeeded = !allocationAccounts.length && !openAllocationAccountRequests.length;
  const accountNeeded = !accountNames.length && !openAccountRequests.length;

  return (
    <ModalFormErrorHandled
      onSubmit={() => acceptOffer()}
      title={!!offer ? 'Accept Offer' : 'Request Offer'}
      disabled={!accountNames.length || !allocationAccountNames.length}
    >
      {!offer && (
        <Form.Select
          label="Clearing Account"
          placeholder="Select..."
          required
          min={1}
          options={identityOptions}
          value={clearingProvider}
          onChange={(_, change) => setClearingProvider(change.value as string)}
        />
      )}
      {!!clearingProvider &&
        (!!accountNames.length && !!allocationAccountNames.length ? (
          <div>
            <Form.Select
              label="Clearing Account"
              placeholder="Select..."
              required
              min={1}
              options={accountNames}
              value={clearingAccountName}
              onChange={(_, change) => setClearingAccountName(change.value as string)}
            />
            <Form.Select
              label="Margin Account"
              placeholder="Select..."
              required
              options={allocationAccountNames}
              value={marginAccountName}
              onChange={(_, change) => setMarginAccountName(change.value as string)}
            />
          </div>
        ) : accountNeeded || marginAccountNeeded ? (
          <div>
            <h3>Accounts are required with this provider, select a Bank to continue.</h3>
            <Form.Select
              label="Account Provider"
              placeholder="Select..."
              required
              options={custodyServiceOptions}
              onChange={(_, change) => {
                const clearingServiceProvider = change.value as string;
                if (accountNeeded) requestClearingAccount(clearingServiceProvider);
                if (marginAccountNeeded) requestMarginAccount(clearingServiceProvider);
              }}
            />
          </div>
        ) : (
          <p>Waiting for requests to be accepted...</p>
        ))}
    </ModalFormErrorHandled>
  );
};

export default ClearingOfferModal;
