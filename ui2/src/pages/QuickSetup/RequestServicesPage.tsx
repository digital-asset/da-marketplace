import React, { useState } from 'react';

import { PartyDetails } from '@daml/hub-react';

import { Button, Form } from 'semantic-ui-react';

import { ServiceKind } from '../../context/RolesContext';

import { retrieveUserParties } from '../../Parties';

interface IRequestServiceInfo {
  sender?: string;
  reciever?: string;
  service?: ServiceKind;
}

const RequestServicesPage = (props: { onComplete: () => void }) => {
  const { onComplete } = props;
  const [requestInfo, setRequestInfo] = useState<IRequestServiceInfo>();
  const parties = retrieveUserParties() || [];

  const partyOptions = parties.map(p => {
    return { text: p.partyName, value: p.party };
  });

  const serviceOptions = Object.values(ServiceKind)
    .filter(s => s !== ServiceKind.REGULATOR)
    .map(i => {
      return { text: i, value: i };
    });

  return (
    <div className="setup-page request-services">
      <h4>Request Services</h4>
      <Form.Select
        className="request-select"
        label={<p className="input-label">As:</p>}
        value={
          requestInfo?.sender ? partyOptions.find(p => requestInfo.sender === p.value)?.text : ''
        }
        placeholder="Select..."
        onChange={(_, data: any) => setRequestInfo({ ...requestInfo, sender: data.value })}
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
            ? partyOptions.find(p => requestInfo.reciever === p.value)?.text
            : ''
        }
        placeholder="Select..."
        onChange={(_, data: any) => setRequestInfo({ ...requestInfo, reciever: data.value })}
        options={partyOptions}
      />
      <Button
        className="ghost request"
        disabled={!requestInfo?.reciever || !requestInfo.sender || !requestInfo.service}
        onClick={() => handleRequest()}
      >
        Request
      </Button>

      <Button className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );

  function handleRequest() {
    if (requestInfo?.sender == requestInfo?.reciever) {
      //return error
    }
  }
};

export default RequestServicesPage;
