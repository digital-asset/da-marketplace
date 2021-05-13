import React, { useState, useEffect } from 'react';

import { PartyDetails } from '@daml/hub-react';

import { Button, Form } from 'semantic-ui-react';

import { retrieveUserParties } from '../../Parties';
import { WellKnownPartiesProvider } from '@daml/hub-react/lib';

import { halfSecondPromise } from '../page/utils';

import { usePartyName } from '../../config';
import {
  ServiceRequest,
  ServiceRequestTemplates,
  ServiceKind,
} from '../../context/ServicesContext';
import { useAllRequests } from '../../context/RequestsContext';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import DamlLedger, { useLedger, useStreamQueries } from '@daml/react';

import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Request as MarketClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service/module';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Request as TradingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { Request as AuctionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import { Request as BiddingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AllocationAccountRule } from '@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Template } from '@daml/types';
import { Account } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { Fields } from '../../components/InputDialog/Fields';
import { httpBaseUrl, wsBaseUrl, ledgerId, publicParty, isHubDeployment } from '../../config';
import { PublicDamlProvider } from '../../Main';
import Credentials from '../../Credentials';
import QueryStreamProvider from '../../websocket/queryStream';

interface IRequestServiceInfo {
  sender?: PartyDetails;
  reciever?: PartyDetails;
  service?: ServiceKind;
}

const RequestServicesPage = (props: { adminCredentials: Credentials; onComplete: () => void }) => {
  const { adminCredentials, onComplete } = props;
  const [requestInfo, setRequestInfo] = useState<IRequestServiceInfo>();
  const [creatingRequest, setCreatingRequest] = useState(false);
  const displayErrorMessage = useDisplayErrorMessage();

  return (
    <div className="setup-page request-services">
      <div className="page-row">
        <RequestForm
          requestInfo={requestInfo}
          setRequestInfo={setRequestInfo}
          handleRequest={handleRequest}
          creatingRequest={creatingRequest}
        />
        <WellKnownPartiesProvider>
          <DamlLedger
            party={adminCredentials.party}
            token={adminCredentials.token}
            httpBaseUrl={httpBaseUrl}
            wsBaseUrl={wsBaseUrl}
          >
            <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
              <RequestsTable />
            </QueryStreamProvider>
          </DamlLedger>
        </WellKnownPartiesProvider>
      </div>
      {creatingRequest && requestInfo && requestInfo.sender && (
        <DamlLedger
          token={requestInfo.sender.token}
          party={requestInfo.sender.party}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <CreateServiceRequest
            requestInfo={requestInfo}
            onFinish={() => setCreatingRequest(false)}
          />
        </DamlLedger>
      )}

      <Button className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );

  function handleRequest() {
    if (!requestInfo) {
      return;
    }

    const { sender, reciever, service } = requestInfo;

    if (!sender || !reciever || !service) {
      return;
    }

    if (sender.party === reciever?.party) {
      setRequestInfo(undefined);
      return displayErrorMessage({
        header: 'Failed to Request Service',
        message: 'The sender and reciever of a service request cannot be the same party.',
      });
    }
    setCreatingRequest(true);
    return;
  }
};

const RequestForm = (props: {
  requestInfo?: IRequestServiceInfo;
  setRequestInfo: (info: IRequestServiceInfo) => void;
  handleRequest: () => void;
  creatingRequest: boolean;
}) => {
  const { requestInfo, setRequestInfo, handleRequest, creatingRequest } = props;
  const parties = retrieveUserParties() || [];

  const partyOptions = parties.map(p => {
    return { text: p.partyName, value: p.party };
  });

  // for not bc these services dont need accounts
  const serviceOptions = [
    ServiceKind.CUSTODY,
    ServiceKind.ISSUANCE,
    ServiceKind.LISTING,
    ServiceKind.MARKET_CLEARING,
  ]
    .filter(s => s !== ServiceKind.REGULATOR)
    .map(i => {
      return { text: i, value: i };
    });

  return (
    <div className="request-form">
      <h4>Request Services</h4>
      <Form.Select
        className="request-select"
        label={<p className="input-label">As:</p>}
        value={
          requestInfo?.sender
            ? partyOptions.find(p => requestInfo.sender?.party === p.value)?.text
            : ''
        }
        placeholder="Select..."
        onChange={(_, data: any) =>
          setRequestInfo({ ...requestInfo, sender: parties.find(p => p.party === data.value) })
        }
        key={2}
        options={partyOptions}
      />
      <Form.Select
        className="request-select"
        label={<p className="input-label">Request Service:</p>}
        value={
          requestInfo?.service
            ? serviceOptions.find(p => requestInfo.service === p.value)?.text
            : ''
        }
        placeholder="Select..."
        onChange={(_, data: any) =>
          setRequestInfo({ ...requestInfo, service: data.value as ServiceKind })
        }
        options={serviceOptions}
      />
      <Form.Select
        className="request-select"
        label={<p className="input-label">From:</p>}
        value={
          requestInfo?.reciever
            ? partyOptions.find(p => requestInfo.reciever?.party === p.value)?.text
            : ''
        }
        placeholder="Select..."
        onChange={(_, data: any) =>
          setRequestInfo({
            ...requestInfo,
            reciever: parties.find(p => p.party === data.value),
          })
        }
        options={partyOptions}
      />

      <Button
        className="ghost request"
        disabled={
          !requestInfo?.reciever || !requestInfo.sender || !requestInfo.service || creatingRequest
        }
        onClick={() => handleRequest()}
      >
        {creatingRequest ? 'Creating Request...' : 'Request'}
      </Button>
    </div>
  );
};

const CreateServiceRequest = (props: {
  requestInfo: IRequestServiceInfo;
  onFinish: () => void;
}) => {
  const { requestInfo, onFinish } = props;
  const { sender, reciever, service } = requestInfo;

  const ledger = useLedger();

  useEffect(() => {
    switch (service) {
      case ServiceKind.CUSTODY:
        requestService(CustodyRequest);
        break;
      case ServiceKind.ISSUANCE:
        requestService(IssuanceRequest);
        break;
      case ServiceKind.LISTING:
        requestService(ListingRequest);
        break;
      case ServiceKind.MARKET_CLEARING:
        requestService(MarketClearingRequest);
        break;
    }
  }, []);

  const requestService = async <T extends ServiceRequestTemplates>(
    service: Template<T, undefined, string>
  ) => {
    if (!sender || !reciever) {
      return;
    }
    let params = {
      customer: sender.party,
      provider: reciever.party,
      observers: [publicParty],
    };

    const request = service as unknown as Template<ServiceRequestTemplates, undefined, string>;
    await ledger.create(request, params).then(resp => console.log(resp));
    await halfSecondPromise();
    onFinish();
  };

  return null;
};

export const RequestsTable = () => {
  const requests = useAllRequests();

  return (
    <div className="all-requests">
      <h4>Service Requests</h4>
      <div className="requests">
        {requests.map(r => (
          <div className="party-name request">
            {r.contract.payload.customer}
            requesting
            {r.service}
            from
            {r.contract.payload.provider}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestServicesPage;
