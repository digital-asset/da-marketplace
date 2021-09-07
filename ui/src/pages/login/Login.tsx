// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Icon } from 'semantic-ui-react';

import { PartyToken, DamlHubLogin } from '@daml/hub-react';

import { computeCredentials } from '../../Credentials';
import { retrieveParties, storeParties } from '../../Parties';
import {
  deploymentMode,
  DeploymentMode,
  isHubDeployment,
} from '../../config';

import Tile from '../../components/Tile/Tile';
import TilePage from '../../components/Tile/TilePage';

import { AppError } from '../error/errorTypes';
import FormErrorHandled from '../../components/Form/FormErrorHandled';
import { loginUser, useUserDispatch } from '../../context/UserContext';
import paths from '../../paths';

/**
 * React component for the login screen of the `App`.
 */
const LoginScreen: React.FC = () => {
  const history = useHistory();
  const userDispatch = useUserDispatch();

  const localTiles = [
    <Tile dark thinGap key="login" showLogoHeader>
      <LocalLoginForm />
    </Tile>,
    <Tile dark thinGap key="quick-setup">
      <QuickSetupButton />
    </Tile>,
  ];

  const dablTiles = [
    <Tile dark thinGap key="login" showLogoHeader>
      <Form size="large">
        <DamlHubLogin
          options={{
            method: {
              button: {
                render: () => (
                  <Button
                    fluid
                    icon="right arrow blue"
                    labelPosition="right"
                    className="dabl-login-button"
                  />
                ),
              },
            },
          }}
          onLogin={(creds, err) => {
            if (creds) {
              // onLogin(creds);
              loginUser(userDispatch, history, creds);
            } else {
              console.warn('Error with button login: ', err);
            }
          }}
        />
      </Form>
    </Tile>,
    <Tile dark thinGap key="parties">
      <PartiesLoginForm />
    </Tile>,
    <Tile dark thinGap key="quick-setup">
      <QuickSetupButton />
    </Tile>,
    <Tile dark thinGap key="jwt">
      <JWTLoginForm />
    </Tile>,
  ];

  const tiles = deploymentMode === DeploymentMode.PROD_DAML_HUB ? dablTiles : localTiles;

  return (
    <div className="login-screen">
      <TilePage tiles={tiles} />
    </div>
  );
};

const QuickSetupButton = () => {
  const history = useHistory();

  return (
    <Button
      className="ghost dark"
      onClick={() =>
        history.push(`${paths.quickSetup.root}${isHubDeployment ? '/add-parties' : ''}`)
      }
    >
      Quick Setup
    </Button>
  );
};

const LocalLoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const history = useHistory();
  const userDispatch = useUserDispatch();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const credentials = computeCredentials(username);

    loginUser(userDispatch, history, credentials);
  };

  return (
    <Form size="large" className="username-login">
      <Form.Input
        required
        fluid
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.currentTarget.value)}
      />
      <Button
        className="ghost dark"
        fluid
        icon="right arrow"
        labelPosition="right"
        disabled={!username}
        content={<p className="dark bold">Log in</p>}
        onClick={handleLogin}
      />
    </Form>
  );
};

const JWTLoginForm: React.FC = () => {
  const [partyId, setPartyId] = useState('');
  const [jwt, setJwt] = useState('');

  const history = useHistory();
  const userDispatch = useUserDispatch();

  const handleTokenLogin = () => {
    loginUser(userDispatch, history, new PartyToken(jwt));
  };

  return (
    <>
      <p className="login-details dark">or via Daml Hub JWT Token:</p>
      <Form size="large" className="login-form">
        <Form.Input
          fluid
          required
          label={<p className="dark">Party</p>}
          placeholder="Party ID"
          value={partyId}
          onChange={e => setPartyId(e.currentTarget.value)}
        />

        <Form.Input
          fluid
          required
          type="password"
          label={<p className="dark">Token</p>}
          placeholder="Party JWT"
          value={jwt}
          onChange={e => setJwt(e.currentTarget.value)}
        />
        <Button
          fluid
          className="ghost dark"
          icon="right arrow"
          labelPosition="right"
          disabled={!jwt || !partyId}
          content={<p className="dark bold">Submit</p>}
          onClick={handleTokenLogin}
        />
      </Form>
    </>
  );
};

const PartiesLoginForm: React.FC = () => {
  const [selectedPartyId, setSelectedPartyId] = useState('');
  const [parties, setParties] = useState<PartyToken[]>();

  const history = useHistory();
  const userDispatch = useUserDispatch();

  const options =
    parties?.map(party => ({
      key: party.party,
      text: party.partyName,
      value: party.party,
    })) || [];

  useEffect(() => {
    const parties = retrieveParties();
    if (parties) {
      setParties(parties);
      setSelectedPartyId(parties[0]?.party || '');
    }
  }, []);

  const handleLogin = async () => {
    const partyDetails = parties?.find(p => p.party === selectedPartyId);

    if (partyDetails) {
      loginUser(userDispatch, history, partyDetails);
    } else {
      throw new AppError('Failed to Login', 'No parties.json or party selected');
    }
  };

  const handleLoad = async (parties: PartyToken[]) => {
    setParties(parties);
    setSelectedPartyId(parties[0]?.party || '');
    storeParties(parties);
  };

  const handleError = (error: string): (() => Promise<void>) => {
    return async () => {
      throw new AppError('Invalid Parties.json', error);
    };
  };

  return (
    <>
      <p className="login-details dark">
        <span>
          Alternatively, login with <code className="link">parties.json</code> located in the Daml
          Hub Console Identities tab:
        </span>
      </p>
      <FormErrorHandled size="large" className="login-form" onSubmit={handleLogin}>
        {loadAndCatch => (
          <>
            <Form.Group widths="equal">
              <Form.Input className="upload-file-input">
                <DamlHubLogin
                  options={{
                    method: {
                      file: {
                        render: () => (
                          <label className="custom-file-upload button ui">
                            {' '}
                            <Icon name="file" className="white" />
                            <p className="dark">Load Parties</p>
                          </label>
                        ),
                      },
                    },
                  }}
                  onPartiesLoad={(creds, err) => {
                    if (creds) {
                      handleLoad(creds);
                    } else if (err) {
                      loadAndCatch(handleError(err));
                    }
                  }}
                />
              </Form.Input>
              <Form.Select
                selection
                disabled={!parties}
                placeholder="Choose a party"
                options={options}
                value={selectedPartyId}
                onChange={(_, d) => typeof d.value === 'string' && setSelectedPartyId(d.value)}
              />
            </Form.Group>
            <Button
              fluid
              submit
              icon="right arrow"
              labelPosition="right"
              disabled={!parties?.find(p => p.party === selectedPartyId)}
              className="ghost dark"
              content={<p className="dark bold">Log in</p>}
            />
            {/* FORM_END */}
          </>
        )}
      </FormErrorHandled>
    </>
  );
};

export default LoginScreen;
