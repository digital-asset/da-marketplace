import React from 'react';

import { useHistory, Link } from 'react-router-dom';

import DamlLedger from '@daml/react';

import { ArrowRightIcon } from '../../icons/icons';

import { loginUser, useUserDispatch } from '../../context/UserContext';
import { RolesProvider, useRolesContext } from '../../context/RolesContext';

import Credentials, { computeCredentials } from '../../Credentials';

import { retrieveParties } from '../../Parties';

import { LoadingWheel } from './QuickSetup';

import QueryStreamProvider from '../../websocket/queryStream';
import QuickSetupPage from './QuickSetupPage';

import paths from '../../paths';
import { httpBaseUrl, wsBaseUrl, useVerifiedParties, isHubDeployment } from '../../config';

const FinishPage = (props: { adminCredentials: Credentials }) => {
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
  const parties = retrieveParties() || [];

  const { identities, loading: identitiesLoading } = useVerifiedParties();

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();

  if (rolesLoading || identitiesLoading) {
    return (
      <QuickSetupPage className="loading">
        <LoadingWheel label="Loading Log In Data..." />
      </QuickSetupPage>
    );
  }

  if (identities.length === 0) {
    return (
      <div>
        <p className='dark'>There are no parties to Log In as. Go back to Quick Setup and add parties.</p>
      </div>
    );
  }

  return (
    <QuickSetupPage className="finish">
      <p className="dark details">cmd + click on a tile to launch a new tab </p>
      <div className="log-in-tile-grid">
        {identities.map(p => (
          <Link
            className="log-in-tile"
            key={p.payload.customer}
            onClick={() => handleLogin(p.payload.customer)}
            to={paths.quickSetup.logInParties}
          >
            <div className="log-in-row page-row">
              <h4>{p.payload.legalName}</h4>
              <p className="log-in page-row">
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
    </QuickSetupPage>
  );

  async function handleLogin(party: string) {
    if (isHubDeployment) {
      const partyDetails = parties?.find(p => p.party === party);

      if (partyDetails) {
        loginUser(dispatch, history, partyDetails);
      }
    } else {
      loginUser(dispatch, history, computeCredentials(party));
    }
  }
};

export default FinishPage;
