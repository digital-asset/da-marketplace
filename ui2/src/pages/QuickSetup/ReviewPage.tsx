import React, { useState, useEffect } from 'react';

import { Button } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';
import { useStreamQueries } from '@daml/react';
import { useRolesContext } from '../../context/RolesContext';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { PublishedInstance, getAutomationInstances } from '../../automation';

import { LoadingWheel } from './QuickSetup';
import { formatTriggerName } from './DragAndDropToParties';

import { retrieveUserParties } from '../../Parties';

const ReviewPage = (props: { onComplete: () => void }) => {
  const { onComplete } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const { roles: allRoles, loading: rolesLoading } = useRolesContext();
  const parties = retrieveUserParties() || [];

  const { contracts: verifiedIdentities, loading: verifiedIdentityLoading } =
    useStreamQueries(VerifiedIdentity);

  useEffect(() => {
    setLoading(verifiedIdentityLoading || rolesLoading);
  }, [verifiedIdentityLoading, rolesLoading]);

  if (loading) {
    return (
      <div className="setup-page">
        <LoadingWheel label="Loading role selection..." />
      </div>
    );
  }
  return (
    <div className="setup-page review">
      <h4>Review</h4>
      <div className="page-row">
        <div>
          <p className="bold">Parties</p>
          <div className="party-names">
            {parties.map(p => (
              <PartyRow
                key={p.party}
                party={p}
                roles={allRoles
                  .filter(r => r.contract.payload.provider === p.party)
                  .map(r => r.role)}
              />
            ))}
          </div>
        </div>
      </div>
      <Button className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );
};

const PartyRow = (props: { party: PartyDetails; roles: string[] }) => {
  const { party, roles } = props;
  const [deployedAutomations, setDeployedAutomations] = useState<PublishedInstance[]>([]);

  const token = party.token;

  useEffect(() => {
    const timer = setInterval(() => {
      getAutomationInstances(token).then(pd => {
        setDeployedAutomations(pd || []);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [token]);

  return (
    <div className="party-name">
      <div className="party-details">
        <p>{party.partyName}</p>
        <p className="dropped-items">{roles.join(', ')}</p>
      </div>

      <p className="dropped-items">
        {deployedAutomations.map(da => {
          return <p>{formatTriggerName(da.config.value.name)}</p>;
        })}
      </p>
    </div>
  );
};
export default ReviewPage;
