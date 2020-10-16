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

function raiseParamsToHash() {
  const url = new URL(window.location.href);

  // When DABL login redirects back to app, hoist the query into the hash route.
  // This allows react-router's HashRouter to see and parse the supplied params

  // i.e., we want to turn
  // ledgerid.projectdabl.com/?party=party&token=token/#/
  // into
  // ledgerid.projectdabl.com/#/?party=party&token=token
  if (url.search !== '' && url.hash === '#/') {
    window.location.href = `${url.origin}${url.pathname}#/${url.search}`;
  }
}

function getTokenFromCookie(): string {
  const tokenCookiePair = document.cookie.split('; ').find(row => row.startsWith('DABL_LEDGER_ACCESS_TOKEN')) || '';
  return tokenCookiePair.slice(tokenCookiePair.indexOf('=') + 1);
}

type Props = {
  onLogin: (credentials: Credentials) => void;
}

/**
 * React component for the login screen of the `App`.
 */
const LoginScreen: React.FC<Props> = ({onLogin}) => {
  return (
    <OnboardingTile>
      {deploymentMode !== DeploymentMode.PROD_DABL
        ? <LocalLoginForm onLogin={onLogin}/>
        : <DablLoginForm onLogin={onLogin}/>
      }
    </OnboardingTile>
  );
};


const LocalLoginForm: React.FC<Props> = ({onLogin}) => {
  const [ username, setUsername ] = useState("");
  const history = useHistory();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const credentials = computeCredentials(username);
    onLogin(credentials);
    history.push('/role');
  }

  return (
    <Form size='large' className='test-select-login-screen'>
      {/* FORM_BEGIN */}
      <Form.Input
        fluid
        required
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
        disabled={!username}
        className='test-select-login-button'
        content='Log in'
        onClick={handleLogin}/>
      {/* FORM_END */}
    </Form>
  )
}

const DablLoginForm: React.FC<Props> = ({onLogin}) => {
  const [ partyId, setPartyId ] = useState("");
  const [ jwt, setJwt ] = useState("");

  const query = useQuery();
  const history = useHistory();
  const location = window.location;

  const handleDablLogin = () => {
    window.location.assign(`https://login.projectdabl.com/auth/login?ledgerId=${ledgerId}`);
  }

  const handleDablTokenLogin = () => {
    onLogin({token: jwt, party: partyId, ledgerId});
    history.push('/role');
  }

  useEffect(() => {
    raiseParamsToHash();
  }, [location]);

  useEffect(() => {
    const party = query.get("party");
    const token = getTokenFromCookie();

    if (!token || !party) {
      return
    }

    onLogin({token, party, ledgerId});
    history.push('/role');
  }, [onLogin, query, history]);

  return (
    <>
      <Form size='large' className='test-select-login-screen'>
        <Button
          primary
          fluid
          content='Log in with DABL'
          onClick={handleDablLogin}/>
      </Form>
      <p>Or</p>
      <Form size='large' className='test-select-login-screen'>
        <Form.Input
          fluid
          inline
          required
          icon='user'
          iconPosition='left'
          label='Party'
          placeholder='Party ID'
          value={partyId}
          className='test-select-username-field'
          onChange={e => setPartyId(e.currentTarget.value)}/>

        <Form.Input
          fluid
          inline
          required
          icon='lock'
          type='password'
          iconPosition='left'
          label='Token'
          placeholder='Party JWT'
          value={jwt}
          className='test-select-username-field'
          onChange={e => setJwt(e.currentTarget.value)}/>

        <Button
          basic
          primary
          fluid
          disabled={!jwt || !partyId}
          content='Submit'
          onClick={handleDablTokenLogin}/>
      </Form>
    </>
  )
}

export default LoginScreen;
