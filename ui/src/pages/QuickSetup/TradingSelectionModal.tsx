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
import { DropdownItemProps, Form, Modal, Button } from 'semantic-ui-react';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount/module';
import { createDropdownProp } from '../common';
import { useParty, useLedger } from '@daml/react';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/';
import { usePartyName } from '../../config';
import {
  OpenAccountRequest,
  OpenAllocationAccountRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
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

const TradingSelectionModal: React.FC<Props> = ({
  party,
  requestInfo,
  setRequestInfo,
  open,
  setOpen,
  accountsForParty,
}) => {
  const [loading, setLoading] = useState(false);
  const tradingProvider = requestInfo?.provider;
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const [tradingAccountName, setTradingAccountName] = useState('');
  const [allocationAccountName, setAllocationAccountName] = useState('');
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
    const tradingAccount = accounts.find(a => a.id.label === tradingAccountName);
    const allocationAccount = allocationAccounts.find(a => a.id.label === allocationAccountName);
    if (!tradingAccount || !allocationAccount) return;
  };

  const custodyServices = useStreamQueries(CustodyService).contracts.filter(
    c => c.payload.customer === party
  );
  const custodyServiceOptions = custodyServices.map(c =>
    createDropdownProp(getName(c.payload.provider), c.payload.provider)
  );

  const requestTradingAccount = async (provider: string) => {
    console.log('requesting trading account...');
    if (!tradingProvider) return;
    const service = custodyServices.find(s => s.payload.provider === provider);
    if (!service) return;
    const accountRequest: RequestOpenAccount = {
      accountId: {
        signatories: makeDamlSet([service.payload.provider, service.payload.customer]),
        label: `${party}-${tradingProvider}-trading`,
        version: '0',
      },
      observers: [tradingProvider],
      ctrls: [service.payload.provider, service.payload.customer],
    };
    await ledger.exercise(Service.RequestOpenAccount, service.contractId, accountRequest);
  };

  const requestAllocationAccount = async (provider: string) => {
    console.log('requesting allocation account...');
    if (!tradingProvider) return;
    const service = custodyServices.find(s => s.payload.provider === provider);
    if (!service) return;
    const request: RequestOpenAllocationAccount = {
      accountId: {
        signatories: makeDamlSet([service.payload.provider, service.payload.customer]),
        label: `${party}-${tradingProvider}-allocation`,
        version: '0',
      },
      observers: makeDamlSet<string>([]),
      nominee: tradingProvider,
    };
    await ledger.exercise(Service.RequestOpenAllocationAccount, service.contractId, request);
  };

  const allocationAccountNeeded =
    !allocationAccounts.length && !openAllocationAccountRequests.length;
  const accountNeeded = !accountNames.length && !openAccountRequests.length;

  return (
    <Modal
      as={Form}
      open={open}
      onSubmit={() => {
        const tradingAccount = accounts.find(a => a.id.label === tradingAccountName);
        const allocationAccount = allocationAccounts.find(
          a => a.id.label === allocationAccountName
        );
        // if (!tradingAccount || !allocationAccount) return;
        setRequestInfo({
          ...requestInfo,
          accounts: { ...accounts, trading: { tradingAccount, allocationAccount } },
        });
        setOpen(false);
      }}
    >
      <Modal.Header as="h2">Select Accounts</Modal.Header>
      <Modal.Content>
        {!!tradingProvider &&
          (!!accountNames.length && !!allocationAccountNames.length ? (
            <div>
              <Form.Select
                label="Trading Account"
                placeholder="Select..."
                required
                min={1}
                options={accountNames}
                value={tradingAccountName}
                onChange={(_, change) => setTradingAccountName(change.value as string)}
              />
              <Form.Select
                label="Allocation Account"
                placeholder="Select..."
                required
                options={allocationAccountNames}
                value={allocationAccountName}
                onChange={(_, change) => setAllocationAccountName(change.value as string)}
              />
            </div>
          ) : accountNeeded || allocationAccountNeeded ? (
            <div>
              <h3>Accounts are required with this provider, select a Bank to continue.</h3>
              <Form.Select
                label="Account Provider"
                placeholder="Select..."
                required
                options={custodyServiceOptions}
                onChange={(_, change) => {
                  const tradingServiceProvider = change.value as string;
                  if (accountNeeded) requestTradingAccount(tradingServiceProvider);
                  if (allocationAccountNeeded) requestAllocationAccount(tradingServiceProvider);
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
                services: requestServices.filter(s => s !== ServiceKind.TRADING),
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

export default TradingSelectionModal;
