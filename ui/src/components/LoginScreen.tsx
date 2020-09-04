// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react'
import { Button, Form, Grid, Header, Image, Segment, Dropdown } from 'semantic-ui-react'
import Credentials, { computeCredentials } from '../Credentials';
import Ledger from '@daml/ledger';
import { User } from '@daml.js/da-marketplace';
import { Role } from "@daml.js/da-marketplace/lib/Marketplace"
import { DeploymentMode, deploymentMode, ledgerId, httpBaseUrl} from '../config';
import { useEffect } from 'react';

type Props = {
  onLogin: (credentials: Credentials) => void;
}

/**
 * React component for the login screen of the `App`.
 */
const LoginScreen: React.FC<Props> = ({onLogin}) => {
  const [username, setUsername] = React.useState('');
  const [role, setRole] = React.useState('');

  const login = useCallback(async (credentials: Credentials, role: string) => {
    try {
      const ledger = new Ledger({token: credentials.token, httpBaseUrl});
      let userContract = await ledger.fetchByKey(User.User, credentials.party);
      if (userContract === null) {
        const user = {username: credentials.party, following: []};
        userContract = await ledger.create(User.User, user);
      }
      const userSession = {operator: "Operator", user: credentials.party, role}
      await ledger.create(Role.UserSession, userSession);
      onLogin(credentials);
    } catch(error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
    }
  }, [onLogin]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const credentials = computeCredentials(username);
    await login(credentials, role);
  }

  const handleDablLogin = () => {
    window.location.assign(`https://login.projectdabl.com/auth/login?ledgerId=${ledgerId}`);
  }

  useEffect(() => {
    const url = new URL(window.location.toString());
    const token = url.searchParams.get('token');
    if (token === null) {
      return;
    }
    const party = url.searchParams.get('party');
    if (party === null) {
      throw Error("When 'token' is passed via URL, 'party' must be passed too.");
    }
    url.search = '';
    window.history.replaceState(window.history.state, '', url.toString());
    login({token, party, ledgerId}, role);
  }, [login, role]);

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h1' textAlign='center' size='huge' style={{color: '#223668'}}>
          <Header.Content>
            <Image
              as='a'
              href='https://www.daml.com/'
              target='_blank'
              src='/daml.svg'
              alt='DAML Logo'
              spaced
              size='small'
              verticalAlign='middle'
            />
            Marketplace App
          </Header.Content>
        </Header>
        <Form size='large' className='test-select-login-screen'>
          <Segment>
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
                <Segment>
                <Dropdown
                  placeholder='Choose your role'
                  fluid
                  selection
                  options={[{
                    key: 'operator',
                    text: 'Operator',
                    value: 'Operator',
                  },
                  {
                    key: 'custodian',
                    text: 'Custodian',
                    value: 'Custodian',
                  },
                  {
                    key: 'exchange',
                    text: 'Exchange',
                    value: 'Exchange',
                  },
                  {
                    key: 'issuer',
                    text: 'Issuer',
                    value: 'Issuer',
                  },
                  {
                    key: 'investor',
                    text: 'Investor',
                    value: 'Investor',
                  }]}
                  onChange={(_, data) => setRole(data.value as string)}
                />
                </Segment>
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
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default LoginScreen;
