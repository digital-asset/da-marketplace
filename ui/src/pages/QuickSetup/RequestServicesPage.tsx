import React, { useState, useEffect } from 'react';

import { Button, Form, List, Table } from 'semantic-ui-react';

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
import { RequestsProvider, useRequests, Request as IRequest } from '../../context/RequestsContext';
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

  const [creatingRequest, setCreatingRequest] = useState(false);
  const [selectedParty, setSelectedParty] = useState(userParties[0]);

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

  const partyOptions = userParties.map(p => {
    return { text: p.partyName, value: p.party };
  });

  console.log(selectedParty);

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
          <div className="page-row request-contract-party-select">
            <h4>Request contracts</h4>
            <Form.Select
              inline
              placeholder="Select..."
              onChange={(_, data: any) => {
                const newParty = userParties.find(p => p.party === data.value);
                if (newParty) {
                  setSelectedParty(newParty);
                }
              }}
              options={partyOptions}
              value={selectedParty.party}
            />
          </div>

          <DamlLedger
            token={selectedParty.token}
            party={selectedParty.party}
            httpBaseUrl={httpBaseUrl}
            wsBaseUrl={wsBaseUrl}
          >
            <QueryStreamProvider defaultPartyToken={selectedParty.token}>
              <RequestsProvider>
                <RequestTable party={selectedParty.party} />
              </RequestsProvider>
            </QueryStreamProvider>
          </DamlLedger>
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
              />
            </QueryStreamProvider>
          </DamlLedger>
        )}
      </div>
    </div>
  );
};

const RequestTable = (props: { party: string }) => {
  const requests = useRequests() || [];

  console.log(props.party, requests);
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Provider</Table.HeaderCell>
          <Table.HeaderCell>Customer</Table.HeaderCell>
          <Table.HeaderCell>Service</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {requests.length === 0 ? (
          <Table.Row>
            <Table.Cell col-span={3}>No requests have been made by this party</Table.Cell>
          </Table.Row>
        ) : (
          requests.map((r, i) => (
            <Table.Row key={i}>
              <Table.Cell>{r.contract.payload.provider}</Table.Cell>
              <Table.Cell>{r.contract.payload.customer}</Table.Cell>
              <Table.Cell>{r.service}</Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
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
      if (services && provider && customer && services.length > 0) {
        await Promise.all(
          services.map(async service => {
            switch (service) {
              case ServiceKind.MARKET_CLEARING:
                await doRequest(MarketClearingRequest, params);
                break;
              case ServiceKind.LISTING:
                await doRequest(ListingRequest, params);
                break;
              case ServiceKind.CUSTODY:
                await doRequest(CustodyRequest, params);
                break;
              case ServiceKind.ISSUANCE:
                await doRequest(IssuanceRequest, params);
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

  async function doRequest(
    request: Template<ServiceRequestTemplates, undefined, string>,
    params: { customer: string; provider: string }
  ) {
    return await ledger.create(request, params);
  }

  return null;
};

export default RequestServicesPage;
