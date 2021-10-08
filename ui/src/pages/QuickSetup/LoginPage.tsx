import React from 'react';
import { useHistory, Link } from 'react-router-dom';

import DamlLedger from '@daml/react';

import Credentials, { computeLocalCreds } from '../../Credentials';
import { retrieveParties } from '../../Parties';
import { httpBaseUrl, wsBaseUrl, useVerifiedParties, isHubDeployment } from '../../config';
import { RolesProvider, useRolesContext } from '../../context/RolesContext';
import { loginUser, useUserDispatch } from '../../context/UserContext';
import { ArrowRightIcon } from '../../icons/icons';
import paths from '../../paths';
import QueryStreamProvider from '../../websocket/queryStream';
import { usePublicParty } from '../common';
import { LoadingWheel } from './QuickSetup';

const LoginPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;
  return (
    <DamlLedger
      token={adminCredentials.token}
      party={adminCredentials.party}
      httpBaseUrl={httpBaseUrl}
      wsBaseUrl={wsBaseUrl}
    >
      <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
        <RolesProvider>
          <LoginTileGrid />
        </RolesProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

const LoginTileGrid = () => {
  const history = useHistory();
  const dispatch = useUserDispatch();
  const publicParty = usePublicParty();
  const parties = retrieveParties(publicParty);

  const { identities, loading: identitiesLoading } = useVerifiedParties();

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();

  if (rolesLoading || identitiesLoading) {
    return (
      <div>
        <LoadingWheel label="Loading Log In Data..." dark />
      </div>
    );
  }

  if (identities.length === 0) {
    return (
      <div>
        <p className="dark">
          There are no parties to Log In as. Go back to Quick Setup and add parties.
        </p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <p className="dark details">cmd + click on a tile to launch a new tab </p>
      <div className="log-in-tile-grid">
        {identities.map(p => (
          <Link
            className="log-in-tile"
            key={p.payload.customer}
            onClick={() => handleLogin(p.payload.customer)}
            to={paths.quickSetup.logInParties}
          >
            <div className="log-in-row">
              <h4>{p.payload.legalName}</h4>
              <p className="log-in">
                Log in <ArrowRightIcon />
              </p>
            </div>
            <p className="finished-roles">
              {allRoles
                .filter(r => r.contract.payload.provider === p.payload.customer)
                .map(r => r.roleKind)
                .join(', ')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );

  async function handleLogin(party: string) {
    if (isHubDeployment) {
      const partyDetails = parties?.find(p => p.party === party);

      if (partyDetails) {
        loginUser(dispatch, history, partyDetails);
      }
    } else {
      loginUser(dispatch, history, computeLocalCreds(party));
    }
  }
};

export default LoginPage;
