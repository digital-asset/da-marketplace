import React, { useState, useEffect } from 'react';

import { Button, Form, List, Table } from 'semantic-ui-react';

import DamlLedger, { useLedger } from '@daml/react';

import classNames from 'classnames';

import { httpBaseUrl, wsBaseUrl, useVerifiedParties, usePartyName } from '../../config';
import Credentials, { computeToken } from '../../Credentials';
import QueryStreamProvider from '../../websocket/queryStream';
import { LoadingWheel } from './QuickSetup';
import { itemListAsText } from '../page/utils';

import { InformationIcon } from '../../icons/icons';
import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Request as MarketClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service/module';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Request as TradingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { Request as AuctionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import { Request as BiddingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';
import { ServicesProvider, useServiceContext, ServiceKind } from '../../context/ServicesContext';
import _ from 'lodash';

import { retrieveUserParties } from '../../Parties';

interface IRequestServiceInfo {
  provider?: string;
  customer?: string;
  services?: ServiceKind[];
}

const RequestServicesPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;
  const userParties = retrieveUserParties() || [];

  const [requestInfo, setRequestInfo] = useState<IRequestServiceInfo>();
  const [token, setToken] = useState<string>();

  const [creatingRequest, setCreatingRequest] = useState(false);

  const provider = requestInfo?.provider;

  useEffect(() => {
    if (provider) {
      const token = computeToken(provider);
      setToken(token);
    }
  }, [userParties, provider]);

  return (
    <div className="setup-page request-services">
      <DamlLedger
        party={adminCredentials.party}
        token={adminCredentials.token}
        httpBaseUrl={httpBaseUrl}
        wsBaseUrl={wsBaseUrl}
      >
        <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
          <ServicesProvider>
            <div className="page-row">
              <RequestForm
                requestInfo={requestInfo}
                setRequestInfo={setRequestInfo}
                createRequest={() => setCreatingRequest(true)}
                creatingRequest={creatingRequest}
              />
              <RequestTable />
            </div>
          </ServicesProvider>
        </QueryStreamProvider>
      </DamlLedger>
      {creatingRequest && requestInfo && requestInfo.provider && token && (
        <DamlLedger
          token={token}
          party={requestInfo.provider}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <QueryStreamProvider defaultPartyToken={token}>
            <CreateServiceRequests
              requestInfo={requestInfo}
              onFinish={() => {
                setCreatingRequest(false);
              }}
            />
          </QueryStreamProvider>
        </DamlLedger>
      )}
    </div>
  );
};

const RequestForm = (props: {
  requestInfo?: IRequestServiceInfo;
  setRequestInfo: (info?: IRequestServiceInfo) => void;
  createRequest: () => void;
  creatingRequest: boolean;
}) => {
  const { requestInfo, setRequestInfo, createRequest, creatingRequest } = props;
  const { getName } = usePartyName('');

  const { identities, loading: identitiesLoading } = useVerifiedParties();

  const { services, loading: servicesLoading } = useServiceContext();

  const serviceOptions = Object.values(ServiceKind).map(i => {
    return { text: i, value: i };
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  const partyOptions = identities.map(p => {
    return { text: p.payload.legalName, value: p.payload.customer };
  });

  useEffect(() => {
    if (!requestInfo) {
      return;
    }

    const { services, provider, customer } = requestInfo;

    if (!!services && !!provider && !!customer) {
      let warningList: string[] = [];

      services.forEach(service => {
        const existingAction = findExistingService(service);
        if (existingAction) {
          warningList = [
            ...warningList,
            `${getName(customer)} already provides ${getName(
              provider
            )} with the ${existingAction} service `,
          ];
        }
      });
      setWarnings(warningList);
    }
  }, [requestInfo, creatingRequest]);

  if (servicesLoading || identitiesLoading) {
    return null;
  }

  return (
    <div className="request-form">
      <h4>Request Services</h4>
      <Form.Select
        disabled={creatingRequest}
        className="request-select"
        label={<p className="input-label">As:</p>}
        placeholder="Select..."
        onChange={(_, data: any) =>
          setRequestInfo({
            ...requestInfo,
            provider: identities.find(p => p.payload.customer === data.value)?.payload.customer,
          })
        }
        options={partyOptions}
      />
      <Form.Select
        disabled={creatingRequest}
        className="request-select"
        label={<p className="input-label">Request Service:</p>}
        placeholder="Select..."
        multiple
        onChange={(_, data: any) =>
          setRequestInfo({ ...requestInfo, services: data.value as ServiceKind[] })
        }
        options={serviceOptions}
      />
      <Form.Select
        disabled={creatingRequest}
        className="request-select"
        label={<p className="input-label">From:</p>}
        placeholder="Select..."
        onChange={(_, data: any) =>
          setRequestInfo({
            ...requestInfo,
            customer: identities.find(p => p.payload.customer === data.value)?.payload.customer,
          })
        }
        options={partyOptions}
      />

      <Button
        className="ghost request"
        disabled={
          !requestInfo?.provider ||
          !requestInfo.customer ||
          !requestInfo.services ||
          creatingRequest ||
          warnings.length > 0
        }
        onClick={() => createRequest()}
      >
        {creatingRequest ? 'Creating Request...' : 'Request'}
      </Button>
      {warnings && requestInfo && (
        <List>
          {warnings.map(w => (
            <List.Item>
              <InformationIcon />
              <List.Content>{w}</List.Content>
            </List.Item>
          ))}
        </List>
      )}
    </div>
  );

  function findExistingService(service: ServiceKind) {
    return services.find(
      p =>
        p.service === service &&
        p.contract.payload.provider === requestInfo?.provider &&
        p.contract.payload.customer === requestInfo?.customer
    )?.service;
  }
};

const CreateServiceRequests = (props: {
  requestInfo: IRequestServiceInfo;
  onFinish: () => void;
}) => {
  const { requestInfo, onFinish } = props;

  const { provider, customer, services } = requestInfo;

  const ledger = useLedger();

  useEffect(() => {
    if (!provider || !customer || !services) {
      return;
    }
    const params = {
      customer: provider,
      provider: customer,
    };

    async function offerServices() {
      if (services && services.length > 0) {
        await Promise.all(
          services.map(async service => {
            switch (service) {
              case ServiceKind.TRADING:
                // await ledger.create(TradingRequest, params);
                break;
              case ServiceKind.MARKET_CLEARING:
                await ledger.create(MarketClearingRequest, params);
                break;
              case ServiceKind.CLEARING:
                // await ledger.create(ClearingRequest, params);
                break;
              case ServiceKind.AUCTION:
                // await ledger.create(ClearingRequest, params);
                break;
              case ServiceKind.LISTING:
                await ledger.create(ListingRequest, params);
                break;
              case ServiceKind.CUSTODY:
                await ledger.create(CustodyRequest, params);
                break;
              case ServiceKind.ISSUANCE:
                await ledger.create(IssuanceRequest, params);
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
  }, []);

  return null;
};

type IServiceRowInfo = {
  provider: string;
  customers: string[];
  service: string;
}[];

export const RequestTable = () => {
  const { services, loading: loadingServices } = useServiceContext();

  const defaultServices = [ServiceKind.REGULATOR];

  const createdServices = services.filter(s => !defaultServices.includes(s.service));

  if (loadingServices) {
    return (
      <div className="setup-page loading">
        <LoadingWheel label="Loading Services..." />
      </div>
    );
  }

  const servicesByProvider = createdServices
    .reduce((acc, r) => {
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
    }, [] as IServiceRowInfo)
    .sort((a, b) => (a.provider > b.provider ? 1 : b.provider > a.provider ? -1 : 0));

  return (
    <div className="all-requests">
      <>
        <h4>Network</h4>
        {servicesByProvider.length > 0 ? (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <h4>Provider</h4>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <h4>Service</h4>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <h4>Customers</h4>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {servicesByProvider.map((r, i) => (
                <ServiceRow
                  key={i}
                  provider={
                    servicesByProvider[i - 1]?.provider != r.provider ? r.provider : undefined
                  }
                  customers={r.customers}
                  service={r.service}
                />
              ))}
            </Table.Body>
          </Table>
        ) : (
          <div className="request-row empty">No services are being provided to any parties.</div>
        )}
      </>
    </div>
  );
};

const ServiceRow = (props: { provider?: string; customers: string[]; service: string }) => {
  const { provider, customers, service } = props;

  const { getName } = usePartyName('');

  const providerName = provider ? getName(provider) : '';
  const customerNames = customers.map(c => getName(c));

  return (
    <Table.Row className={classNames({ 'sub-row': !provider })}>
      <Table.Cell>
        <p className="p2">{providerName} </p>
      </Table.Cell>
      <Table.Cell>
        <p className="p2">{service}</p>
      </Table.Cell>
      <Table.Cell>
        <p className="p2">{customerNames.join(', ')}</p>
      </Table.Cell>
    </Table.Row>
  );
};

export default RequestServicesPage;
