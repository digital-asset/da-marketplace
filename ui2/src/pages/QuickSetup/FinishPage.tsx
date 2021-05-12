import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import { ArrowRightIcon } from '../../icons/icons';

import { useRolesContext } from '../../context/RolesContext';
import { loginUser, useUserDispatch } from '../../context/UserContext';

import { computeCredentials } from '../../Credentials';

import { retrieveUserParties } from '../../Parties';

import { LoadingWheel } from './QuickSetup';

const FinishPage = () => {
  const dispatch = useUserDispatch();

  const history = useHistory();

  const parties = retrieveUserParties();

  const [loading, setLoading] = useState<boolean>(false);

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();

  useEffect(() => {
    setLoading(rolesLoading);
  }, [rolesLoading]);

  if (loading) {
    return (
      <div className="setup-page select-roles">
        <LoadingWheel label="Loading role selection..." />
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
          <div className="log-in-row">
            <h4>{p.partyName}</h4>
            <p className="p2 log-in">
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
