import React from 'react';

import { useHistory } from 'react-router-dom';

import DamlLedger from '@daml/react';

import { Button } from 'semantic-ui-react';

import { ArrowRightIcon } from '../../icons/icons';

import { loginUser, useUserDispatch } from '../../context/UserContext';
import { RolesProvider, useRolesContext } from '../../context/RolesContext';

import Credentials, { computeCredentials } from '../../Credentials';

import { LoadingWheel } from './QuickSetup';

import QueryStreamProvider from '../../websocket/queryStream';

import { httpBaseUrl, wsBaseUrl, useVerifiedParties } from '../../config';

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

  const { identities, loading: identitiesLoading } = useVerifiedParties();

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();

  if (rolesLoading || identitiesLoading) {
    return (
      <div className="setup-page loading">
        <LoadingWheel label="Loading Log In Data..." />
      </div>
    );
  }

  if (identities.length === 0) {
    return (
      <div className="setup-page loading">
        <p>There are no parties to Log In as. Go back to Quick Setup and add parties.</p>
      </div>
    );
  }

  return (
    <div className="setup-page finish">
      {identities.map(p => (
        <div
          className="log-in-tile"
          key={p.payload.customer}
          onClick={e => handleClick(e, p.payload.customer)}
        >
          <div className="log-in-row page-row">
            <h4>{p.payload.legalName}</h4>
            <p className="p2 log-in page-row">
              Log in <ArrowRightIcon />
            </p>
          </div>
          <p className="finished-roles">
            {allRoles
              .filter(r => r.contract.payload.provider === p.payload.customer)
              .map(r => r.role)
              .join(', ')}
          </p>
        </div>
      ))}
      ctrl + click to Log in party on a new tab
      <Button onClick={() => openAll()}>Open All</Button>
    </div>
  );

  function handleClick(event: React.MouseEvent, party: string) {
    event.stopPropagation();
    
    // In that case, event.ctrlKey does the trick.
    if (event.ctrlKey) {
      console.debug('Ctrl+click has just happened!');
      
    }

    //loginUser(dispatch, history, computeCredentials(party), true);
  }

  function openAll() {
    return;
  }
};

export default FinishPage;
