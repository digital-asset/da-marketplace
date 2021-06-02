import React, { useState, useEffect } from 'react';

import { Button, Form } from 'semantic-ui-react';

import DamlLedger, { useLedger } from '@daml/react';
import { Template } from '@daml/types';

import {
  httpBaseUrl,
  wsBaseUrl,
  useVerifiedParties,
  isHubDeployment,
  usePartyName,
} from '../../config';
import { itemListAsText } from '../../pages/page/utils';
import Credentials, { computeToken } from '../../Credentials';
import QueryStreamProvider from '../../websocket/queryStream';

import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Request as MarketClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service/module';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import {
  ServiceKind,
  ServiceRequestTemplates,
  ServicesProvider,
  useServiceContext,
} from '../../context/ServicesContext';
import { RequestsProvider } from '../../context/RequestsContext';

import { retrieveUserParties } from '../../Parties';
import { IconCheck, InformationIcon } from '../../icons/icons';

import QuickSetupPage from './QuickSetupPage';
import { MenuItems, LoadingWheel } from './QuickSetup';

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
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);

  const customer = requestInfo?.customer;

  useEffect(() => {
    if (customer) {
      if (isHubDeployment) {
        setToken(userParties.find(p => p.party === customer)?.token);
      } else {
        setToken(computeToken(customer));
      }
    }
  }, [userParties, customer]);

  const onFinishCreatingRequest = (success: boolean) => {
    if (success) {
      setAddedSuccessfully(true);
      setTimeout(() => {
        setAddedSuccessfully(false);
        setRequestInfo(undefined);
      }, 2500);
    }
  };

  return (
    <>
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
              addedSuccessfully={addedSuccessfully}
            />
          </ServicesProvider>
        </QueryStreamProvider>
      </DamlLedger>
      {creatingRequest && requestInfo && requestInfo.provider && requestInfo.customer && token && (
        <DamlLedger
          token={token}
          party={requestInfo.customer}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <QueryStreamProvider defaultPartyToken={token}>
            <RequestsProvider>
              <CreateServiceRequests
                requestInfo={requestInfo}
                onFinish={success => {
                  setCreatingRequest(false);
                  onFinishCreatingRequest(success);
                }}
              />
            </RequestsProvider>
          </QueryStreamProvider>
        </DamlLedger>
      )}
    </>
  );
};

const RequestForm = (props: {
  requestInfo?: IRequestServiceInfo;
  setRequestInfo: (info?: IRequestServiceInfo) => void;
  createRequest: () => void;
  creatingRequest: boolean;
  addedSuccessfully: boolean;
}) => {
  const { requestInfo, setRequestInfo, createRequest, creatingRequest, addedSuccessfully } = props;
  const [existingServices, setExistingServices] = useState<ServiceKind[]>([]);
  const { identities, loading: identitiesLoading } = useVerifiedParties();
  const { services } = useServiceContext();
  const { getName } = usePartyName('');

  const serviceOptions = SUPPORTED_REQUESTS.map(i => {
    return { text: i, value: i };
  });

  const partyOptions = identities.map(p => {
    return { text: p.payload.legalName, value: p.payload.customer };
  });

  useEffect(() => {
    if (!requestInfo) {
      return;
    }

    const { customer, provider, services: requestServices } = requestInfo;

    if (!customer || !provider || !requestServices) {
      return;
    }

    const matchingContracts = services.filter(
      s => s.contract.payload.provider === provider && s.contract.payload.customer === customer
    );

    const existingServices = requestServices.filter(
      service => !!matchingContracts.find(s => s.service === service)
    );

    if (existingServices.length > 0) {
      setExistingServices(existingServices);
    } else {
      setExistingServices([]);
    }
  }, [requestInfo, services]);

  if (identitiesLoading) {
    return (
      <QuickSetupPage className="loading">
        <LoadingWheel label="Loading parties..." />
      </QuickSetupPage>
    );
  }

  return (
    <QuickSetupPage
      className="request-services"
      nextItem={MenuItems.REVIEW}
      title="Request Services"
    >
      <div className="page-row">
        <Form>
          <Form.Select
            disabled={creatingRequest}
            className="request-select"
            label={<p className="input-label">As:</p>}
            value={requestInfo?.customer || ''}
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
            value={requestInfo?.services || []}
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
            value={requestInfo?.provider || ''}
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
              !requestInfo ||
              !requestInfo.provider ||
              !requestInfo.customer ||
              !requestInfo.services ||
              creatingRequest ||
              existingServices.length > 0
            }
            onClick={() => createRequest()}
          >
            {creatingRequest ? 'Creating Request...' : 'Request'}
          </Button>
          {addedSuccessfully && (
            <p className="message">
              <IconCheck /> {itemListAsText(requestInfo?.services || [])} Successfully Requested
            </p>
          )}
          {existingServices.length > 0 && requestInfo?.provider && requestInfo?.customer && (
            <p className="message">
              <InformationIcon /> {getName(requestInfo?.provider)} already provides{' '}
              {itemListAsText(existingServices || [])} services to {getName(requestInfo?.customer)}
            </p>
          )}
        </Form>
        <div className="party-names">
          {services.map((s, i) => (
            <div className="party-name" key={i}>
              <p>
                {s.contract.payload.provider} provides {s.service} service to{' '}
                {s.contract.payload.customer}{' '}
              </p>
            </div>
          ))}
        </div>
      </div>
    </QuickSetupPage>
  );
};

const CreateServiceRequests = (props: {
  requestInfo: IRequestServiceInfo;
  onFinish: (success: boolean) => void;
}) => {
  const { requestInfo, onFinish } = props;

  const ledger = useLedger();

  const { provider, customer, services } = requestInfo;

  if (!provider || !customer || !services) {
    return null;
  }

  const params = {
    customer: customer,
    provider: provider,
  };

  async function offerServices() {
    console.log('here');
    let success = true;

    if (services && provider && customer && services.length > 0) {
      await Promise.all(
        services.map(async service => {
          switch (service) {
            case ServiceKind.MARKET_CLEARING:
              await doRequest(MarketClearingRequest, params).catch(_ => (success = false));
              break;
            case ServiceKind.LISTING:
              await doRequest(ListingRequest, params).catch(_ => (success = false));
              break;
            case ServiceKind.CUSTODY:
              await doRequest(CustodyRequest, params).catch(_ => (success = false));
              break;
            case ServiceKind.ISSUANCE:
              await doRequest(IssuanceRequest, params).catch(_ => (success = false));
              break;
            default:
              success = false;
              throw new Error(`Unsupported service: ${service}`);
          }
        })
      );
    }
    onFinish(success);
  }

  async function doRequest(
    request: Template<ServiceRequestTemplates, undefined, string>,
    params: { customer: string; provider: string }
  ) {
    return await ledger.create(request, params);
  }
  offerServices();
  return null;
};

export default RequestServicesPage;
