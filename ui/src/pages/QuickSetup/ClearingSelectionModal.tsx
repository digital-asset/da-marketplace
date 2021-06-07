import React, { useState } from 'react';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import { ServicePageProps, damlSetValues, makeDamlSet, createDropdownProp } from '../common';
import { useStreamQueries } from '../../Main';
import { Offer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import {
  Service,
  RequestOpenAccount,
  RequestOpenAllocationAccount,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { DropdownItemProps, Form, Modal, Button } from 'semantic-ui-react';
import { useLedger } from '@daml/react';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/';
import { usePartyName } from '../../config';
import {
  OpenAccountRequest,
  OpenAllocationAccountRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import { IRequestServiceInfo, PartyAccountsI } from './RequestServicesPage';
import { Party } from '@daml/types';
import { ServiceKind } from '../../context/ServicesContext';

type Props = {
  party: Party;
  requestInfo: IRequestServiceInfo;
  setRequestInfo: (info?: IRequestServiceInfo) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  accountsForParty?: PartyAccountsI;
};

const ClearingSelectionModal: React.FC<Props> = ({
  party,
  requestInfo,
  setRequestInfo,
  open,
  setOpen,
  accountsForParty,
}) => {
  const [loading, setLoading] = useState(false);
  const clearingProvider = requestInfo?.provider;
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const [clearingAccountName, setClearingAccountName] = useState('');
  const [marginAccountName, setMarginAccountName] = useState('');
  const allocationAccountRules = accountsForParty?.allocAccounts || [];
  const allocationAccounts = allocationAccountRules
    .filter(c => c.payload.nominee === requestInfo.provider)
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);

  const allocationAccountNames: DropdownItemProps[] = allocationAccounts.map(a =>
    createDropdownProp(a.id.label)
  );

  const assetSettlementRules = accountsForParty?.accounts || [];
  const accounts = assetSettlementRules
    .filter(c => c.payload.account.owner === party)
    .filter(c => damlSetValues(c.payload.observers).find(obs => obs === requestInfo.provider))
    .map(c => c.payload.account);
  const accountNames: DropdownItemProps[] = accounts.map(a => createDropdownProp(a.id.label));
  console.log(`rules: ${assetSettlementRules}`);
  console.log(assetSettlementRules);
  console.log(accounts);

  const openAccountRequests = useStreamQueries(OpenAccountRequest).contracts.filter(rq =>
    damlSetValues(rq.payload.observers).find(obs => obs === requestInfo.provider)
  );
  const openAllocationAccountRequests = useStreamQueries(
    OpenAllocationAccountRequest
  ).contracts.filter(rq => rq.payload.nominee === requestInfo.provider);

  const acceptOffer = async () => {
    const clearingAccount = accounts.find(a => a.id.label === clearingAccountName);
    const marginAccount = allocationAccounts.find(a => a.id.label === marginAccountName);
    if (!clearingAccount || !marginAccount) return;
  };

  const custodyServices = useStreamQueries(CustodyService).contracts.filter(
    c => c.payload.customer === party
  );
  const custodyServiceOptions = custodyServices.map(c =>
    createDropdownProp(getName(c.payload.provider), c.payload.provider)
  );

  const requestClearingAccount = async (provider: string) => {
    console.log('requesting clearing account...');
    if (!clearingProvider) return;
    const service = custodyServices.find(s => s.payload.provider === provider);
    if (!service) return;
    const accountRequest: RequestOpenAccount = {
      accountId: {
        signatories: makeDamlSet([service.payload.provider, service.payload.customer]),
        label: `${party}-${clearingProvider}-clearing`,
        version: '0',
      },
      observers: [clearingProvider],
      ctrls: [service.payload.provider, service.payload.customer],
    };
    await ledger.exercise(Service.RequestOpenAccount, service.contractId, accountRequest);
  };

  const requestMarginAccount = async (provider: string) => {
    console.log('requesting margin account...');
    if (!clearingProvider) return;
    const service = custodyServices.find(s => s.payload.provider === provider);
    if (!service) return;
    const request: RequestOpenAllocationAccount = {
      accountId: {
        signatories: makeDamlSet([service.payload.provider, service.payload.customer]),
        label: `${party}-${clearingProvider}-margin`,
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
    <Modal
      as={Form}
      open={open}
      onSubmit={() => {
        const clearingAccount = accounts.find(a => a.id.label === clearingAccountName);
        const marginAccount = allocationAccounts.find(a => a.id.label === marginAccountName);
        setRequestInfo({
          ...requestInfo,
          accounts: { ...accounts, clearing: { clearingAccount, marginAccount } },
        });
        setOpen(false);
      }}
    >
      <Modal.Header as="h2">Select Accounts</Modal.Header>
      <Modal.Content>
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
      </Modal.Content>
      <Modal.Actions>
        <Button
          className="ghost warning"
          color="black"
          onClick={() => {
            const { services: requestServices } = requestInfo;
            if (!!requestServices) {
              setRequestInfo({
                ...requestInfo,
                services: requestServices.filter(s => s !== ServiceKind.CLEARING),
              });
            }
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={!accountNames.length || !allocationAccountNames.length}
          content="Submit"
          labelPosition="right"
          icon="checkmark"
          type="submit"
          loading={loading}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ClearingSelectionModal;
