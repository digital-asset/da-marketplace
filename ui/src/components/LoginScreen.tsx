// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'

import Credentials, { computeCredentials } from '../Credentials'
import { DeploymentMode, deploymentMode, ledgerId } from '../config'

import './LoginScreen.css'
import OnboardingTile from './common/OnboardingTile'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

type Props = {
  onLogin: (credentials: Credentials) => void;
}

/**
 * React component for the login screen of the `App`.
 */
const LoginScreen: React.FC<Props> = ({onLogin}) => {
  const query = useQuery();
  const history = useHistory();
  const [username, setUsername] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const credentials = computeCredentials(username);
    onLogin(credentials);
    history.push('/role');
  }

  const handleDablLogin = () => {
    window.location.assign(`https://login.projectdabl.com/auth/login?ledgerId=${ledgerId}`);
  }

  useEffect(() => {
    const token = query.get("token");
    const party = query.get("party");

    console.log("yippee kai yey", token, party);

    if (!token || !party) {
      return
    }

    onLogin({token, party, ledgerId});
    history.push('/role');
  }, [query, history]);

  return (
    <OnboardingTile>
      <Form size='large' className='test-select-login-screen'>
        {deploymentMode !== DeploymentMode.PROD_DABL
        ? <>
            {/* FORM_BEGIN */}
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Username'
              value={username}
              className='test-select-username-field'
              onChange={e => setUsername(e.currentTarget.value)}
            />
            <Button
              primary
              fluid
              className='test-select-login-button'
              onClick={handleLogin}>
              Log in
            </Button>
            {/* FORM_END */}
          </>
        : <Button primary fluid onClick={handleDablLogin}>
            Log in with DABL
          </Button>
        }
      </Form>
    </OnboardingTile>
  );
};

export default LoginScreen;
