import React, { useState, useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';

import DamlLedger, { useLedger } from '@daml/react';

import { Role as TradingRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Role as CustodyRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';

import { httpBaseUrl, wsBaseUrl, useVerifiedParties, usePartyName } from '../../config';
import Credentials, { computeToken } from '../../Credentials';
import QueryStreamProvider from '../../websocket/queryStream';
import { useStreamQueries } from '../../Main';
import { itemListAsText } from '../../pages/page/utils';

import { InformationIcon } from '../../icons/icons';

import {
  ServicesProvider,
  useServiceContext,
  ServiceKind,
  Service,
} from '../../context/ServicesContext';

import {
  OffersProvider,
  useOffers,
  OfferServiceKind,
  ServiceOffer,
} from '../../context/OffersContext';
import { RoleKind } from '../../context/RolesContext';
import { retrieveUserParties } from '../../Parties';
import { useOperatorParty } from '../common';

interface IOfferServiceInfo {
  provider?: string;
  customer?: string;
  services?: OfferServiceKind[];
}

const OfferServicesPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;
  const userParties = retrieveUserParties();

  const [offerInfo, setOfferInfo] = useState<IOfferServiceInfo>();
  const [token, setToken] = useState<string>();

  const [creatingOffer, setCreatingOffer] = useState(false);

  const provider = offerInfo?.provider;

  useEffect(() => {
    if (provider) {
      const token = computeToken(provider);
      setToken(token);
    }
  }, [userParties, provider]);

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
            <CreateServiceOffers
              offerInfo={offerInfo}
              onFinish={() => {
                setCreatingOffer(false);
              }}
            />
          </QueryStreamProvider>
        </DamlLedger>
      )}
    </div>
  );
};

const OfferForm = (props: {
  offerInfo?: IOfferServiceInfo;
  setOfferInfo: (info?: IOfferServiceInfo) => void;
  createOffer: () => void;
  creatingOffer: boolean;
}) => {
  const { offerInfo, setOfferInfo, createOffer, creatingOffer } = props;

  const { identities, loading: identitiesLoading } = useVerifiedParties();
  const { getName } = usePartyName('');

  const { serviceOffers, loading: loadingServiceOffers } = useOffers();
  const { services, loading: servicesLoading } = useServiceContext();

  const { contracts: tradingRoles, loading: tradingRoleLoading } = useStreamQueries(TradingRole);
  const { contracts: clearingRoles, loading: clearingRoleLoading } = useStreamQueries(ClearingRole);
  const { contracts: custodyRoles, loading: custodyRoleLoading } = useStreamQueries(CustodyRole);

  const serviceOptions = Object.values(OfferServiceKind).map(i => {
    return { text: i, value: i };
  });

  const [warnings, setWarnings] = useState<JSX.Element[]>();

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
        label={<p className="input-label">Services:</p>}
        placeholder="Select..."
        multiple
        onChange={(_, data: any) =>
          setOfferInfo({ ...offerInfo, services: data.value as OfferServiceKind[] })
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
          !offerInfo?.provider || !offerInfo.customer || !offerInfo.services || creatingOffer
        }
        onClick={() => handleOffer()}
      >
        {creatingOffer ? 'Creating Offer...' : 'Offer'}
      </Button>
      {warnings &&
        offerInfo &&
        warnings.map(w => (
          <div className="warning">
            <InformationIcon /> {w}
          </div>
        ))}
    </div>
  );

  function findExistingOffer(service: OfferServiceKind) {
    return !!serviceOffers.find(
      p =>
        p.service === service &&
        p.contract.payload.provider === offerInfo?.provider &&
        p.contract.payload.customer === offerInfo?.customer
    );
  }

  function findExistingService(service: OfferServiceKind) {
    return !!services.find(
      p =>
        (p.service as string) === (service as string) &&
        p.contract.payload.provider === offerInfo?.provider &&
        p.contract.payload.customer === offerInfo?.customer
    );
  }

  function findMissingRole(service?: OfferServiceKind) {
    if (service === OfferServiceKind.MARKET_CLEARING || service === OfferServiceKind.CLEARING) {
      if (!clearingRoles.find(r => r.payload.provider === offerInfo?.provider)) {
        return RoleKind.CLEARING;
      }
    } else if (service === OfferServiceKind.LISTING || service === OfferServiceKind.TRADING) {
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

  function findExistingAction(service: OfferServiceKind) {
    if (findExistingOffer(service)) {
      return 'offered';
    } else if (findExistingService(service)) {
      return 'provides';
    }
    return undefined;
  }

  function handleOffer() {
    setWarnings([]);

    if (!offerInfo) {
      return;
    }

    const { services, provider, customer } = offerInfo;

    if (!services || !provider || !customer) {
      return;
    }

    let warningList: JSX.Element[] = [];

    services.forEach(service => {
      const existingAction = findExistingAction(service);

      if (existingAction) {
        warningList = [
          ...warningList,
          <p>
            Existing Service: {getName(provider)} already {existingAction} {getName(customer)} with
            a {service} Service
          </p>,
        ];
      }

      const missingRole = findMissingRole(service);

      if (missingRole) {
        warningList = [
          ...warningList,
          <p>
            Missing Roles: {getName(provider)} must have a {missingRole} Role Contract to offer{' '}
            {service} services.
          </p>,
        ];
      }
    });

    if (warningList.length > 0) {
      return setWarnings(warningList);
    }

    return createOffer();
  }
};

const CreateServiceOffers = (props: { offerInfo: IOfferServiceInfo; onFinish: () => void }) => {
  const { offerInfo, onFinish } = props;

  const { provider, customer, services } = offerInfo;

  const ledger = useLedger();
  const operator = useOperatorParty();

  const { contracts: tradingRoles, loading: tradingRoleLoading } = useStreamQueries(TradingRole);
  const { contracts: clearingRoles, loading: clearingRoleLoading } = useStreamQueries(ClearingRole);
  const { contracts: custodyRoles, loading: custodyRoleLoading } = useStreamQueries(CustodyRole);

  useEffect(() => {
    if (
      !provider ||
      !customer ||
      !services ||
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
      if (services && services.length > 0) {
        await Promise.all(
          services.map(async service => {
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
          })
        );
      }
      onFinish();
    }
    offerServices();
  }, [
    services,
    tradingRoleLoading,
    clearingRoleLoading,
    custodyRoleLoading,
    clearingRoles,
    custodyRoles,
    customer,
    ledger,
    offerInfo.customer,
    onFinish,
    operator,
    provider,
    tradingRoles,
  ]);

  return null;
};

type IOfferRowInfo = {
  provider: string;
  customers: string[];
  service: string;
}[];

type ServiceContract = Service | ServiceOffer;

export const OffersTable = () => {
  const [loading, setLoading] = useState(false);
  const { services, loading: loadingServices } = useServiceContext();
  const { serviceOffers, loading: loadingServiceOffers } = useOffers();

  useEffect(() => {
    setLoading(loadingServiceOffers || loadingServices);
  }, [loadingServices, loadingServiceOffers]);

  const defaultServices = [ServiceKind.REGULATOR];
  const createdServices = services.filter(s => !defaultServices.includes(s.service));

  if (loading) {
    return null;
  }

  const serviceOffersByProvider = sortByProvider(serviceOffers);
  const createdServicesByProvider = sortByProvider(services);

  return (
    <div className="all-offers">
      <>
        <h4>Services</h4>
        {serviceOffersByProvider.length > 0 || createdServices.length > 0 ? (
          <div className="offers">
            {serviceOffersByProvider.map((r, i) => (
              <OfferRow
                key={i}
                provider={r.provider}
                customers={r.customers}
                service={r.service}
                isAccepted={false}
              />
            ))}
            {createdServicesByProvider.map((r, i) => (
              <OfferRow
                key={i}
                provider={r.provider}
                customers={r.customers}
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

function sortByProvider(contracts: ServiceContract[]): IOfferRowInfo {
  return contracts.reduce((acc, r) => {
    const providerDetails = acc.find(
      i => i.provider === r.contract.payload.provider && i.service === r.service
    );

    let baseAcc = acc;

    const provider = providerDetails?.provider || r.contract.payload.provider;
    const service = providerDetails?.service || r.service;
    const newCustomers = [...(providerDetails?.customers || []), r.contract.payload.customer];

    if (providerDetails) {
      baseAcc = acc.filter(a => a !== providerDetails);
    }

    return [
      ...baseAcc,
      {
        provider,
        service,
        customers: newCustomers,
      },
    ];
  }, [] as IOfferRowInfo);
}

const OfferRow = (props: {
  provider: string;
  customers: string[];
  service: string;
  isAccepted: boolean;
}) => {
  const { provider, customers, service, isAccepted } = props;

  const { getName } = usePartyName('');

  const providerName = getName(provider);
  const customerNames = customers.map(c => getName(c));

  return (
    <div className="offer-row">
      <p>
        {providerName} {isAccepted ? 'provides' : 'offered'} {service} Service to{' '}
        {itemListAsText(customerNames)}
      </p>
    </div>
  );
};

export default OfferServicesPage;
