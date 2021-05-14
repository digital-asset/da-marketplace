import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import DamlLedger from '@daml/react';

import { ArrowRightIcon } from '../../icons/icons';

import { loginUser, useUserDispatch } from '../../context/UserContext';
import { RolesProvider, useRolesContext } from '../../context/RolesContext';

import Credentials, { computeCredentials } from '../../Credentials';

import { retrieveUserParties } from '../../Parties';

import { LoadingWheel } from './QuickSetup';

import QueryStreamProvider from '../../websocket/queryStream';

import { httpBaseUrl, wsBaseUrl } from '../../config';

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
  const parties = retrieveUserParties();

  const [loading, setLoading] = useState<boolean>(false);

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();

  useEffect(() => {
    setLoading(rolesLoading);
  }, [rolesLoading]);

  if (loading) {
    return (
      <div className="setup-page loading">
        <LoadingWheel label="Loading Log In Data..." />
      </div>
    );
  }

  return (
    <div className="setup-page finish">
      {parties.map(p => (
        <div
          className="log-in-tile"
          key={p.party}
          onClick={() =>
            loginUser(
              dispatch,
              history,
              parties.find(party => party.party === p.party) || computeCredentials(p.party)
            )
          }
        >
          <div className="log-in-row page-row">
            <h4>{p.partyName}</h4>
            <p className="p2 log-in page-row">
              Log in <ArrowRightIcon />
            </p>
          </div>
          <p className="finished-roles">
            {allRoles
              .filter(r => r.contract.payload.provider === p.party)
              .map(r => r.role)
              .join(',')}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FinishPage;
