// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Button, Form, Header } from 'semantic-ui-react'

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

  const handleDablLogin = () => {
    window.location.assign(`https://login.projectdabl.com/auth/login?ledgerId=${ledgerId}`);
  }

  const handleDablTokenLogin = () => {
    history.push(`/?party=${partyId}&token=${jwt}`);
  }

  useEffect(() => {
    const token = query.get("token");
    const party = query.get("party");

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
      <Header as='h4'>Or</Header>
      <Form size='large' className='test-select-login-screen'>
        <Form.Input
          fluid
          icon='user'
          iconPosition='left'
          label='Party'
          placeholder='Party ID'
          value={partyId}
          className='test-select-username-field'
          onChange={e => setPartyId(e.currentTarget.value)}
        />
        <Form.Input
          fluid
          icon='lock'
          type='password'
          iconPosition='left'
          label='Token'
          placeholder='Party JWT'
          value={jwt}
          className='test-select-username-field'
          onChange={e => setJwt(e.currentTarget.value)}
        />
        <Button
          basic
          primary
          fluid
          content='Sign in with token'
          onClick={handleDablTokenLogin}/>
      </Form>
    </>
  )
}

export default LoginScreen;
