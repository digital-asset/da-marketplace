import React, { useState, useEffect } from 'react';
import { Form } from 'semantic-ui-react';

import DamlLedger from '@daml/react';
import { PartyToken } from '@daml/hub-react';

import { httpBaseUrl, wsBaseUrl, useVerifiedParties, isHubDeployment } from '../../config';
import { retrieveUserParties } from '../../Parties';
import { NewAccount } from '../custody/New';
import { computeToken } from '../../Credentials';

import QuickSetupPage from './QuickSetupPage';

const CreateAccount = (props: { adminCredentials: PartyToken }) => {
  const { adminCredentials } = props;

  return (
    <QuickSetupPage
      className="add-account"
      title="Create Account"
      adminCredentials={adminCredentials}
    >
      <CreateAccountPage />
    </QuickSetupPage>
  );
};

const CreateAccountPage = () => {
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

  if (identitiesLoading) {
    return null;
  }

  return (
    <div className="add-account">
      <Form>
        <Form.Select
          label={<p className="input-label">Account Owner</p>}
          value={selectedCustomer || ''}
          placeholder="Select..."
          onChange={(_, data: any) =>
            setSelectedCustomer(
              identities.find(p => p.payload.customer === data.value)?.payload.customer
            )
          }
          options={partyOptions}
        />
      </Form>
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
    </div>
  );
};

export default CreateAccount;
