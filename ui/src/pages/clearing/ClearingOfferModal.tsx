import React, { useState } from 'react';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import { ServicePageProps, damlSetValues, makeDamlSet } from '../common';
import { useStreamQueries } from '../../Main';
import { Offer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import {
  Service,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { CreateEvent } from '@daml/ledger';
import { DropdownItemProps, Form } from 'semantic-ui-react';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { createDropdownProp } from '../common';
import { useParty, useLedger } from '@daml/react';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/';
import { usePartyName } from '../../config';
import {
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

type OfferProps = {
  offer?: CreateEvent<Offer>;
};

const ClearingOfferModal: React.FC<OfferProps> = ({
  offer,
}) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const [clearingAccountName, setClearingAccountName] = useState('');
  const [marginAccountName, setMarginAccountName] = useState('');
  const [clearingProvider, setClearingProvider] = useState(!!offer ? offer.payload.provider : '');

  const identities = useStreamQueries(VerifiedIdentity).contracts;
  const identityOptions = identities.map(idn =>
    createDropdownProp(idn.payload.legalName, idn.payload.customer)
  );

  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules
    .filter(c => c.payload.account.owner === party)
    .filter(c => damlSetValues(c.payload.observers).find(obs => obs === clearingProvider))
    .map(c => c.payload.account);
  const accountNames: DropdownItemProps[] = accounts.map(a => createDropdownProp(a.id.label));

  // const openAccountRequests = useStreamQueries(OpenAccountRequest).contracts.filter(rq =>
  //   damlSetValues(rq.payload.observers).find(obs => obs === clearingProvider)
  // );

  const acceptOffer = async () => {
    const clearingAccount = accounts.find(a => a.id.label === clearingAccountName);
    if (!clearingAccount || !offer) return;
    await ledger.exercise(Offer.Accept, offer.contractId, { clearingAccount });
  };

  const custodyServices = useStreamQueries(CustodyService).contracts.filter(
    c => c.payload.customer === party
  );
  const custodyServiceOptions = custodyServices.map(c =>
    createDropdownProp(getName(c.payload.provider), c.payload.provider)
  );

  // const requestClearingAccount = async (provider: string) => {
  //   const service = custodyServices.find(s => s.payload.provider === provider);
  //   if (!service) return;
  //   const accountRequest: RequestOpenAccount = {
  //     accountId: {
  //       signatories: makeDamlSet([service.payload.provider, service.payload.customer]),
  //       label: `${party}-${clearingProvider}-clearing`,
  //       version: '0',
  //     },
  //     observers: [clearingProvider],
  //     ctrls: [service.payload.provider, service.payload.customer],
  //   };
  //   await ledger.exercise(Service.RequestOpenAccount, service.contractId, accountRequest);
  // };

  const accountNeeded = !accountNames.length //&& !openAccountRequests.length;

  return (
    <ModalFormErrorHandled
      onSubmit={() => acceptOffer()}
      title={!!offer ? 'Accept Offer' : 'Request Offer'}
      disabled={!accountNames.length}
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
        (!!accountNames.length ? (
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
          </div>
        ) : accountNeeded ? (
          <div>
            <h3>Accounts are required with this provider, select a Bank to continue.</h3>
            <Form.Select
              label="Account Provider"
              placeholder="Select..."
              required
              options={custodyServiceOptions}
              onChange={(_, change) => {
                // const clearingServiceProvider = change.value as string;
                // if (accountNeeded) requestClearingAccount(clearingServiceProvider);
                // if (marginAccountNeeded) requestMarginAccount(clearingServiceProvider);
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
