import React, {useMemo, useState} from 'react';
import ModalFormErrorHandled from '../../components/Form/ModalFormErrorHandled';
import { ServicePageProps } from '../common';
import { useStreamQueries } from '../../Main';
import { Offer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { CreateEvent } from '@daml/ledger';
import { DropdownItemProps, Form } from 'semantic-ui-react';
import { createDropdownProp } from '../common';
import { useParty, useLedger } from '@daml/react';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/';
import { usePartyName } from '../../config';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

type OfferProps = {
  offer?: CreateEvent<Offer>;
};

const ClearingOfferModal: React.FC<OfferProps & ServicePageProps<CustodyService>> = ({
  offer,
  services,
}) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const [clearingAccountName, setClearingAccountName] = useState('');
  const [clearingProvider, setClearingProvider] = useState(!!offer ? offer.payload.provider : '');
  const identities = useStreamQueries(VerifiedIdentity).contracts;
  const identityOptions = identities.map(idn =>
    createDropdownProp(idn.payload.legalName, idn.payload.customer)
  );

  const accounts = services
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);
  const accountNames: DropdownItemProps[] = accounts.map(a => createDropdownProp(a.id.label));

  const acceptOffer = async () => {
    const clearingAccount = accounts.find(a => a.id.label === clearingAccountName);
    if (!clearingAccount || !offer) return;
    await ledger.exercise(Offer.Accept, offer.contractId, { clearingAccount });
  };

  const custodyServiceOptions = useMemo(() =>
      services
        .filter(c => c.payload.customer === party)
        .map(c => createDropdownProp(getName(c.payload.provider), c.payload.provider))
    , [services]);

  const accountNeeded = !accountNames.length

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
