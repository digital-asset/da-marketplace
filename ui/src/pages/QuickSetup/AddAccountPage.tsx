import React, { useState, useEffect } from 'react';

import DamlLedger from '@daml/react';

import { retrieveUserParties } from '../../Parties';
import { NewAccount } from '../custody/New';
import { httpBaseUrl, wsBaseUrl, useVerifiedParties, isHubDeployment } from '../../config';
import { computeToken } from '../../Credentials';
import { Form } from 'semantic-ui-react';

const AddAccountPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>();
  const userParties = retrieveUserParties() || [];
  const { identities, loading: identitiesLoading } = useVerifiedParties();

  const [token, setToken] = useState<string>();

  useEffect(() => {
    if (selectedCustomer) {
      if (isHubDeployment) {
        setToken(userParties.find(p => p.party === selectedCustomer)?.token);
      } else {
        setToken(computeToken(selectedCustomer));
      }
    }
  }, [userParties, selectedCustomer]);
  const partyOptions = identities.map(p => {
    return { text: p.payload.legalName, value: p.payload.customer };
  });
  return (
    <Form className="add-account">
      <Form.Select
        label={<p className="input-label">As:</p>}
        value={selectedCustomer || ''}
        placeholder="Select..."
        onChange={(_, data: any) =>
          setSelectedCustomer(
            identities.find(p => p.payload.customer === data.value)?.payload.customer
          )
        }
        options={partyOptions}
      />
      <div className="add-account-form">
        {selectedCustomer && token && (
          <DamlLedger
            token={token}
            party={selectedCustomer}
            httpBaseUrl={httpBaseUrl}
            wsBaseUrl={wsBaseUrl}
          >
            <NewAccount party={selectedCustomer} />
          </DamlLedger>
        )}
      </div>
    </Form>
  );
};

export default AddAccountPage;
