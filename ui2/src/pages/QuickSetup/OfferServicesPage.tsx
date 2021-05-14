import React, { useState, useEffect } from 'react';

import { PartyDetails } from '@daml/hub-react';

import { Button, Form } from 'semantic-ui-react';

import { retrieveUserParties } from '../../Parties';

import DamlLedger, { useLedger, useStreamQueries } from '@daml/react';

import { Role as TradingRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Role as CustodyRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';

import { httpBaseUrl, wsBaseUrl } from '../../config';
import Credentials from '../../Credentials';
import QueryStreamProvider from '../../websocket/queryStream';

import { InformationIcon, CheckMarkIcon } from '../../icons/icons';

import { ServicesProvider, useServiceContext, ServiceKind } from '../../context/ServicesContext';

import { OffersProvider, useOffers, OfferServiceKind } from '../../context/OffersContext';
import { RoleKind } from '../../context/RolesContext';

import { useWellKnownParties } from '@daml/hub-react/lib';

interface IOfferServiceInfo {
  provider?: PartyDetails;
  customer?: PartyDetails;
  service?: OfferServiceKind;
}

const OfferServicesPage = (props: {
  adminCredentials: Credentials;
  onComplete: () => void;
  backToSelectRoles: () => void;
}) => {
  const { adminCredentials, onComplete, backToSelectRoles } = props;

  const [offerInfo, setOfferInfo] = useState<IOfferServiceInfo>();
  const [creatingOffer, setCreatingOffer] = useState(false);

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
      {creatingOffer && offerInfo && offerInfo.provider && (
        <DamlLedger
          token={offerInfo.provider.token}
          party={offerInfo.provider.party}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <QueryStreamProvider defaultPartyToken={offerInfo.provider.token}>
            <CreateServiceOffer
              offerInfo={offerInfo}
              onFinish={() => {
                setCreatingOffer(false);
                setOfferInfo(undefined);
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

  const [loading, setLoading] = useState(false);

  const parties = retrieveUserParties() || [];

  const { serviceOffers: serviceOffers, loading: loadingServiceOffers } = useOffers();
  const { services: services, loading: servicesLoading } = useServiceContext();

  const { contracts: tradingRoles, loading: tradingRoleLoading } = useStreamQueries(TradingRole);
  const { contracts: clearingRoles, loading: clearingRoleLoading } = useStreamQueries(ClearingRole);
  const { contracts: custodyRoles, loading: custodyRoleLoading } = useStreamQueries(CustodyRole);

  const serviceOptions = Object.values(OfferServiceKind).map(i => {
    return { text: i, value: i };
  });

  const [warning, setWarning] = useState<JSX.Element>();

  const partyOptions = parties.map(p => {
    return { text: p.partyName, value: p.party };
  });

  useEffect(() => {
    setLoading(
      tradingRoleLoading ||
        clearingRoleLoading ||
        custodyRoleLoading ||
        loadingServiceOffers ||
        servicesLoading
    );
  }, [
    tradingRoleLoading,
    clearingRoleLoading,
    custodyRoleLoading,
    loadingServiceOffers,
    servicesLoading,
  ]);

  if (loading) {
    return null;
  }

  return (
    <div className="offer-form">
      <h4>Offer Services</h4>
      <Form.Select
        className="offer-select"
        label={<p className="input-label">Provider:</p>}
        value={offerInfo?.provider?.partyName || ''}
        placeholder="Select..."
        onChange={(_, data: any) =>
          setOfferInfo({
            ...offerInfo,
            provider: parties.find(p => p.party === data.value),
            customer: undefined,
          })
        }
        key={2}
        options={partyOptions}
      />
      <Form.Select
        className="offer-select"
        disabled={!offerInfo?.provider}
        label={<p className="input-label">Service:</p>}
        value={
          offerInfo?.service ? serviceOptions.find(p => offerInfo.service === p.value)?.text : ''
        }
        placeholder="Select..."
        onChange={(_, data: any) =>
          setOfferInfo({ ...offerInfo, service: data.value as OfferServiceKind })
        }
        options={serviceOptions}
      />
      <Form.Select
        className="offer-select"
        label={<p className="input-label">Customer:</p>}
        disabled={!offerInfo?.provider}
        value={offerInfo?.customer?.partyName || ''}
        placeholder="Select..."
        onChange={(_, data: any) =>
          setOfferInfo({
            ...offerInfo,
            customer: parties.find(p => p.party === data.value),
          })
        }
        options={partyOptions.filter(p => p.value != offerInfo?.provider?.party)}
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
        <p className="role-missing">
          <InformationIcon /> {warning}
        </p>
      )}
    </div>
  );

  function findExistingOffer() {
    return !!serviceOffers.find(
      p =>
        p.service === offerInfo?.service &&
        p.contract.payload.provider === offerInfo?.provider?.party &&
        p.contract.payload.customer === offerInfo?.customer?.party
    );
  }

  function findExistingService() {
    return !!services.find(
      p =>
        (p.service as string) === (offerInfo?.service as string) &&
        p.contract.payload.provider === offerInfo?.provider?.party &&
        p.contract.payload.customer === offerInfo?.customer?.party
    );
  }

  function findMissingRole(service?: OfferServiceKind) {
    if (
      service === OfferServiceKind.TRADING ||
      service === OfferServiceKind.MARKET_CLEARING ||
      service === OfferServiceKind.CLEARING
    ) {
      if (!clearingRoles.find(r => r.payload.provider === offerInfo?.provider?.party)) {
        return RoleKind.CLEARING;
      }
    } else if (service === OfferServiceKind.LISTING) {
      if (!tradingRoles.find(r => r.payload.provider === offerInfo?.provider?.party)) {
        return RoleKind.TRADING;
      }
    } else if (service === OfferServiceKind.CUSTODY || service === OfferServiceKind.ISSUANCE) {
      if (!custodyRoles.find(r => r.payload.provider === offerInfo?.provider?.party)) {
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

    const existingAction = findExistingAction();

    if (existingAction) {
      return setWarning(
        <p>
          {provider?.party} already {existingAction} {customer?.party} with a {service} Service
        </p>
      );
    }

    const missingRole = findMissingRole(service);

    if (missingRole) {
      return setWarning(
        <p>
          {provider?.partyName} must have a {missingRole} Role Contract to offer {service}
          services. Go back to the <a onClick={() => backToSelectRoles()}>Select Roles</a> page to
          assign {provider?.partyName} a {missingRole} Role.
        </p>
      );
    }
    return createOffer();
  }
};

const CreateServiceOffer = (props: { offerInfo: IOfferServiceInfo; onFinish: () => void }) => {
  const { offerInfo, onFinish } = props;
  const [loading, setLoading] = useState(false);

  const { provider, customer, service } = offerInfo;

  const ledger = useLedger();

  const operator = useWellKnownParties().parties?.userAdminParty || 'Operator';

  const { contracts: tradingRoles, loading: tradingRoleLoading } = useStreamQueries(TradingRole);
  const { contracts: clearingRoles, loading: clearingRoleLoading } = useStreamQueries(ClearingRole);
  const { contracts: custodyRoles, loading: custodyRoleLoading } = useStreamQueries(CustodyRole);

  useEffect(() => {
    setLoading(tradingRoleLoading || clearingRoleLoading || custodyRoleLoading);
  }, [tradingRoleLoading, clearingRoleLoading, custodyRoleLoading]);

  useEffect(() => {
    if (!provider || !customer || !service || loading) {
      return;
    }

    const params = {
      customer: customer.party,
      provider: provider.party,
      operator,
    };

    const clearingRoleId = clearingRoles[0]?.contractId;
    const tradingRoleId = tradingRoles[0]?.contractId;
    const custodyRoleId = custodyRoles[0]?.contractId;

    async function offerServices() {
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
  }, [loading]);
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
    return null;
  }

  return (
    <div className="all-offers">
      <>
        <p className="bold">Services</p>
        <div className="offers">
          {serviceOffers.map(r => (
            <div className="offer-row" key={r.contract.contractId}>
              <div className="offer">
                {r.contract.payload.provider} <p>offered</p> {r.service} Service <p>to</p>{' '}
                {r.contract.payload.customer}
              </div>
            </div>
          ))}
          {createdServices.map(r => (
            <div className="offer-row" key={r.contract.contractId}>
              <div className="offer">
                {r.contract.payload.provider} <p>provides</p> {r.service} Service <p>to</p>{' '}
                {r.contract.payload.customer}
              </div>
              <p className="accepted">
                <CheckMarkIcon />
              </p>
            </div>
          ))}
        </div>
      </>
    </div>
  );
};

export default OfferServicesPage;
