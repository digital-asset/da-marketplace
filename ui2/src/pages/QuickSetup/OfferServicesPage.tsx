import React, { useState, useEffect } from 'react';

import { Button, Form } from 'semantic-ui-react';

import DamlLedger, { useLedger } from '@daml/react';

import { Role as TradingRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Role as CustodyRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';

import { httpBaseUrl, wsBaseUrl, useVerifiedParties, usePartyName } from '../../config';
import Credentials from '../../Credentials';
import QueryStreamProvider from '../../websocket/queryStream';
import { LoadingWheel } from './QuickSetup';
import { useStreamQueries } from '../../Main';

import { InformationIcon, CheckMarkIcon } from '../../icons/icons';

import { ServicesProvider, useServiceContext, ServiceKind } from '../../context/ServicesContext';

import { OffersProvider, useOffers, OfferServiceKind } from '../../context/OffersContext';
import { RoleKind } from '../../context/RolesContext';

import { useWellKnownParties } from '@daml/hub-react/lib';
import { retrieveUserParties } from '../../Parties';

interface IOfferServiceInfo {
  provider?: string;
  customer?: string;
  service?: OfferServiceKind;
}

const OfferServicesPage = (props: {
  adminCredentials: Credentials;
  onComplete: () => void;
  backToSelectRoles: () => void;
}) => {
  const { adminCredentials, onComplete, backToSelectRoles } = props;
  const userParties = retrieveUserParties() || [];

  const [offerInfo, setOfferInfo] = useState<IOfferServiceInfo>();
  const [token, setToken] = useState<string>();

  const [creatingOffer, setCreatingOffer] = useState(false);

  useEffect(() => {
    if (offerInfo?.provider) {
      setToken(userParties.find(p => p.party === offerInfo.provider)?.token);
    }
  }, [offerInfo?.provider]);

  return (
    <div className="setup-page offer-services">
      <DamlLedger
        party={adminCredentials.party}
        token={adminCredentials.token}
        httpBaseUrl={httpBaseUrl}
        wsBaseUrl={wsBaseUrl}
      >
        <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
          <ServicesProvider>
            <OffersProvider>
              <div className="page-row">
                <OfferForm
                  offerInfo={offerInfo}
                  setOfferInfo={setOfferInfo}
                  createOffer={() => setCreatingOffer(true)}
                  creatingOffer={creatingOffer}
                  backToSelectRoles={backToSelectRoles}
                />
                <OffersTable />
              </div>
            </OffersProvider>
          </ServicesProvider>
        </QueryStreamProvider>
      </DamlLedger>
      {creatingOffer && offerInfo && offerInfo.provider && token && (
        <DamlLedger
          token={token}
          party={offerInfo.provider}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <QueryStreamProvider defaultPartyToken={token}>
            <CreateServiceOffer
              offerInfo={offerInfo}
              onFinish={() => {
                setCreatingOffer(false);
              }}
            />
          </QueryStreamProvider>
        </DamlLedger>
      )}

      <Button className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );
};

const OfferForm = (props: {
  offerInfo?: IOfferServiceInfo;
  setOfferInfo: (info?: IOfferServiceInfo) => void;
  createOffer: () => void;
  creatingOffer: boolean;
  backToSelectRoles: () => void;
}) => {
  const { offerInfo, setOfferInfo, createOffer, creatingOffer, backToSelectRoles } = props;

  const { identities, loading: identitiesLoading } = useVerifiedParties();
  const { getName } = usePartyName('');

  const { serviceOffers: serviceOffers, loading: loadingServiceOffers } = useOffers();
  const { services: services, loading: servicesLoading } = useServiceContext();

  const { contracts: tradingRoles, loading: tradingRoleLoading } = useStreamQueries(TradingRole);
  const { contracts: clearingRoles, loading: clearingRoleLoading } = useStreamQueries(ClearingRole);
  const { contracts: custodyRoles, loading: custodyRoleLoading } = useStreamQueries(CustodyRole);

  const serviceOptions = Object.values(OfferServiceKind).map(i => {
    return { text: i, value: i };
  });

  const [warning, setWarning] = useState<JSX.Element>();

  const partyOptions = identities.map(p => {
    return { text: p.payload.legalName, value: p.payload.customer };
  });

  if (
    tradingRoleLoading ||
    clearingRoleLoading ||
    custodyRoleLoading ||
    loadingServiceOffers ||
    servicesLoading ||
    identitiesLoading
  ) {
    return null;
  }

  return (
    <div className="offer-form">
      <h4>Offer Services</h4>
      <Form.Select
        className="offer-select"
        label={<p className="input-label">Provider:</p>}
        placeholder="Select..."
        onChange={(_, data: any) =>
          setOfferInfo({
            ...offerInfo,
            provider: identities.find(p => p.payload.customer === data.value)?.payload.customer,
          })
        }
        options={partyOptions}
      />
      <Form.Select
        className="offer-select"
        label={<p className="input-label">Service:</p>}
        placeholder="Select..."
        onChange={(_, data: any) =>
          setOfferInfo({ ...offerInfo, service: data.value as OfferServiceKind })
        }
        options={serviceOptions}
      />
      <Form.Select
        className="offer-select"
        label={<p className="input-label">Customer:</p>}
        placeholder="Select..."
        onChange={(_, data: any) =>
          setOfferInfo({
            ...offerInfo,
            customer: identities.find(p => p.payload.customer === data.value)?.payload.customer,
          })
        }
        options={partyOptions}
      />

      <Button
        className="ghost offer"
        disabled={
          !offerInfo?.provider || !offerInfo.customer || !offerInfo.service || creatingOffer
        }
        onClick={() => handleOffer()}
      >
        {creatingOffer ? 'Creating Offer...' : 'Offer'}
      </Button>
      {warning && offerInfo && (
        <div className="warning">
          <InformationIcon /> {warning}
        </div>
      )}
    </div>
  );

  function findExistingOffer() {
    return !!serviceOffers.find(
      p =>
        p.service === offerInfo?.service &&
        p.contract.payload.provider === offerInfo?.provider &&
        p.contract.payload.customer === offerInfo?.customer
    );
  }

  function findExistingService() {
    return !!services.find(
      p =>
        (p.service as string) === (offerInfo?.service as string) &&
        p.contract.payload.provider === offerInfo?.provider &&
        p.contract.payload.customer === offerInfo?.customer
    );
  }

  function findMissingRole(service?: OfferServiceKind) {
    if (
      service === OfferServiceKind.TRADING ||
      service === OfferServiceKind.MARKET_CLEARING ||
      service === OfferServiceKind.CLEARING
    ) {
      if (!clearingRoles.find(r => r.payload.provider === offerInfo?.provider)) {
        return RoleKind.CLEARING;
      }
    } else if (service === OfferServiceKind.LISTING) {
      if (!tradingRoles.find(r => r.payload.provider === offerInfo?.provider)) {
        return RoleKind.TRADING;
      }
    } else if (service === OfferServiceKind.CUSTODY || service === OfferServiceKind.ISSUANCE) {
      if (!custodyRoles.find(r => r.payload.provider === offerInfo?.provider)) {
        return RoleKind.CUSTODY;
      }
    }
    return undefined;
  }

  function findExistingAction() {
    if (findExistingOffer()) {
      return 'offered';
    } else if (findExistingService()) {
      return 'provides';
    }
    return undefined;
  }

  function handleOffer() {
    setWarning(undefined);

    if (!offerInfo) {
      return;
    }

    const { service, provider, customer } = offerInfo;

    if (!service || !provider || !customer) {
      return;
    }

    const existingAction = findExistingAction();

    if (existingAction) {
      return setWarning(
        <p>
          {getName(provider)} already {existingAction} {getName(customer)} with a {service} Service
        </p>
      );
    }

    const missingRole = findMissingRole(service);

    if (missingRole) {
      return setWarning(
        <p>
          {getName(provider)} must have a {missingRole} Role Contract to offer {service} services.{' '}
          Go back to the <a onClick={() => backToSelectRoles()}>Select Roles</a> page to assign{' '}
          {getName(provider)} a {missingRole} Role.
        </p>
      );
    }

    return createOffer();
  }
};

const CreateServiceOffer = (props: { offerInfo: IOfferServiceInfo; onFinish: () => void }) => {
  const { offerInfo, onFinish } = props;

  const { provider, customer, service } = offerInfo;

  const ledger = useLedger();
  const { getName } = usePartyName('');

  const operator = useWellKnownParties().parties?.userAdminParty || 'Operator';

  const { contracts: tradingRoles, loading: tradingRoleLoading } = useStreamQueries(TradingRole);
  const { contracts: clearingRoles, loading: clearingRoleLoading } = useStreamQueries(ClearingRole);
  const { contracts: custodyRoles, loading: custodyRoleLoading } = useStreamQueries(CustodyRole);

  useEffect(() => {
    if (
      !provider ||
      !customer ||
      !service ||
      tradingRoleLoading ||
      clearingRoleLoading ||
      custodyRoleLoading
    ) {
      return;
    }

    const params = {
      customer,
      provider,
      operator,
    };

    const clearingRoleId = clearingRoles[0]?.contractId;
    const tradingRoleId = tradingRoles[0]?.contractId;
    const custodyRoleId = custodyRoles[0]?.contractId;

    async function offerServices() {
      console.log('Creating Service Offer', service, 'for', getName(offerInfo.customer || ''));

      switch (service) {
        case OfferServiceKind.TRADING:
          await ledger.exercise(TradingRole.OfferTradingService, clearingRoleId, params);
          break;
        case OfferServiceKind.MARKET_CLEARING:
          await ledger.exercise(ClearingRole.OfferMarketService, clearingRoleId, params);
          break;
        case OfferServiceKind.CLEARING:
          await ledger.exercise(ClearingRole.OfferClearingService, clearingRoleId, params);
          break;
        case OfferServiceKind.LISTING:
          await ledger.exercise(TradingRole.OfferListingService, tradingRoleId, params);
          break;
        case OfferServiceKind.CUSTODY:
          await ledger.exercise(CustodyRole.OfferCustodyService, custodyRoleId, params);
          break;
        case OfferServiceKind.ISSUANCE:
          await ledger.exercise(CustodyRole.OfferIssuanceService, custodyRoleId, params);
          break;
        default:
          throw new Error(`Unsupported service: ${service}`);
      }
      onFinish();
    }
    offerServices();
  }, [tradingRoleLoading, clearingRoleLoading, custodyRoleLoading]);

  return null;
};

export const OffersTable = () => {
  const [loading, setLoading] = useState(false);
  const { services: services, loading: loadingServices } = useServiceContext();
  const { serviceOffers: serviceOffers, loading: loadingServiceOffers } = useOffers();

  useEffect(() => {
    setLoading(loadingServiceOffers || loadingServices);
  }, [loadingServices, loadingServiceOffers]);

  const defaultServices = [ServiceKind.REGULATOR];
  const createdServices = services.filter(s => !defaultServices.includes(s.service));

  if (loading) {
    return (
      <div className="setup-page loading">
        <LoadingWheel label="Loading Services..." />
      </div>
    );
  }

  return (
    <div className="all-offers">
      <>
        <h4>Services</h4>
        {serviceOffers.length > 0 || createdServices.length > 0 ? (
          <div className="offers">
            {serviceOffers.map(r => (
              <OfferRow
                key={r.contract.contractId}
                provider={r.contract.payload.provider}
                customer={r.contract.payload.customer}
                service={r.service}
                isAccepted={false}
              />
            ))}
            {createdServices.map(r => (
              <OfferRow
                key={r.contract.contractId}
                provider={r.contract.payload.provider}
                customer={r.contract.payload.customer}
                service={r.service}
                isAccepted={true}
              />
            ))}
          </div>
        ) : (
          <div className="offers empty">
            <div className="offer-row empty">No services are being offered or provided.</div>
          </div>
        )}
      </>
    </div>
  );
};

const OfferRow = (props: {
  provider: string;
  customer: string;
  service: string;
  isAccepted: boolean;
}) => {
  const { provider, customer, service, isAccepted } = props;

  const { getName } = usePartyName('');

  const providerName = getName(provider);
  const customerName = getName(customer);

  return (
    <div className="offer-row">
      <div className="offer">
        {providerName} <p>{isAccepted ? 'provides' : 'offered'}</p> {service} Service <p>to</p>{' '}
        {customerName}
      </div>
      {isAccepted && (
        <p className="accepted">
          <CheckMarkIcon />
        </p>
      )}
    </div>
  );
};

export default OfferServicesPage;
