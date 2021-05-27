import React, { useState, useEffect } from 'react';

import { Button, Form, List } from 'semantic-ui-react';

import DamlLedger, { useLedger } from '@daml/react';
import { Template } from '@daml/types';

import {
  httpBaseUrl,
  wsBaseUrl,
  useVerifiedParties,
  usePartyName,
  isHubDeployment,
} from '../../config';
import Credentials, { computeToken } from '../../Credentials';
import QueryStreamProvider from '../../websocket/queryStream';

import { InformationIcon } from '../../icons/icons';
import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Request as MarketClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service/module';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import {
  ServicesProvider,
  useServiceContext,
  ServiceKind,
  ServiceRequestTemplates,
} from '../../context/ServicesContext';
import _ from 'lodash';

import { retrieveUserParties } from '../../Parties';

interface IRequestServiceInfo {
  provider?: string;
  customer?: string;
  services?: ServiceKind[];
}

// without the ability to create accounts from quick setup, these requests are the only ones supported at this stage
const SUPPORTED_REQUESTS = [
  ServiceKind.MARKET_CLEARING,
  ServiceKind.LISTING,
  ServiceKind.CUSTODY,
  ServiceKind.ISSUANCE,
];

const RequestServicesPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;
  const userParties = retrieveUserParties() || [];

  const [requestInfo, setRequestInfo] = useState<IRequestServiceInfo>();
  const [token, setToken] = useState<string>();

  const [status, setStatus] = useState<string[]>([]);

  const [creatingRequest, setCreatingRequest] = useState(false);

  const provider = requestInfo?.provider;

  useEffect(() => {
    if (provider) {
      if (isHubDeployment) {
        setToken(userParties.find(p => p.party === provider)?.token);
      } else {
        setToken(computeToken(provider));
      }
    }
  }, [userParties, provider]);

  return (
    <div className="setup-page request-services">
      <div className="page-row">
        <DamlLedger
          party={adminCredentials.party}
          token={adminCredentials.token}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
            <ServicesProvider>
              <RequestForm
                requestInfo={requestInfo}
                setRequestInfo={setRequestInfo}
                createRequest={() => setCreatingRequest(true)}
                creatingRequest={creatingRequest}
              />
            </ServicesProvider>
          </QueryStreamProvider>
        </DamlLedger>
        <div className="all-requests">
          <h4>Requests</h4>
          <List>
            {status.map(s => (
              <List.Item>{s}</List.Item>
            ))}
          </List>
        </div>
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
                onFinish={() => setCreatingRequest(false)}
                setStatus={setStatus}
                status={status}
              />
            </QueryStreamProvider>
          </DamlLedger>
        )}
      </div>
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

  const serviceOptions = SUPPORTED_REQUESTS.map(i => {
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
            customer: identities.find(p => p.payload.customer === data.value)?.payload.customer,
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
            provider: identities.find(p => p.payload.customer === data.value)?.payload.customer,
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
  setStatus: (status: string[]) => void;
  status: string[];
  onFinish: () => void;
}) => {
  const { requestInfo, onFinish, setStatus, status } = props;

  const { provider, customer, services } = requestInfo;

  const ledger = useLedger();

  const { getName } = usePartyName('');

  useEffect(() => {
    if (!provider || !customer || !services) {
      return;
    }

    const params = {
      customer: provider,
      provider: customer,
    };

    async function offerServices() {
      let newStatus: string[] = [];

      if (services && provider && customer && services.length > 0) {
        await Promise.all(
          services.map(async service => {
            switch (service) {
              case ServiceKind.MARKET_CLEARING:
                const hi = await doRequest(MarketClearingRequest, params, service);
                newStatus = [...newStatus, hi];
                break;
              case ServiceKind.LISTING:
                newStatus = [...newStatus, await doRequest(ListingRequest, params, service)];
                break;
              case ServiceKind.CUSTODY:
                newStatus = [...newStatus, await doRequest(CustodyRequest, params, service)];
                break;
              case ServiceKind.ISSUANCE:
                newStatus = [...newStatus, await doRequest(IssuanceRequest, params, service)];
                break;
              default:
                throw new Error(`Unsupported service: ${service}`);
            }
          })
        );
      }
      setStatus([...status, ...newStatus]);
      onFinish();
    }
    offerServices();
  }, []);

  async function doRequest(
    request: Template<ServiceRequestTemplates, undefined, string>,
    params: { customer: string; provider: string },
    service: ServiceKind
  ) {
    let newStatus: string = '';
    await ledger
      .create(request, params)
      .then(
        () =>
          (newStatus = `${getName(params.provider)} requested ${service} from ${getName(
            params.customer
          )}`)
      )
      .catch(() => (newStatus = `Error creating ${service} Request`));
    return newStatus;
  }

  return null;
};

export default RequestServicesPage;
