import React, { useState, useEffect } from 'react';

import { Button } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import DamlLedger from '@daml/react';

import { useRolesContext } from '../../context/RolesContext';

import { PublishedInstance, getAutomationInstances } from '../../automation';
import { httpBaseUrl, wsBaseUrl } from '../../config';
import QueryStreamProvider from '../../websocket/queryStream';
import { retrieveUserParties } from '../../Parties';
import Credentials from '../../Credentials';

import { LoadingWheel } from './QuickSetup';
import { formatTriggerName } from './DragAndDropToParties';
import { OffersTable } from './OfferServicesPage';
import { ServicesProvider } from '../../context/ServicesContext';
import { OffersProvider } from '../../context/OffersContext';

const ReviewPage = (props: { adminCredentials: Credentials; onComplete: () => void }) => {
  const { adminCredentials, onComplete } = props;
  const [loading, setLoading] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="setup-page loading">
        <LoadingWheel label="Loading review data..." />
      </div>
    );
  }

  return (
    <div className="setup-page review">
      <h4>Review</h4>
      <DamlLedger
        party={adminCredentials.party}
        token={adminCredentials.token}
        httpBaseUrl={httpBaseUrl}
        wsBaseUrl={wsBaseUrl}
      >
        <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
          <ServicesProvider>
            <OffersProvider>
              <div className="page-row">
                <PartiesReview setLoading={setLoading} />
                <OffersTable />
              </div>
            </OffersProvider>
          </ServicesProvider>
        </QueryStreamProvider>
      </DamlLedger>

      <Button className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );
};

const PartiesReview = (props: { setLoading: (bool: boolean) => void }) => {
  const { setLoading } = props;

  const parties = retrieveUserParties() || [];

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();

  useEffect(() => {
    setLoading(rolesLoading);
  }, [rolesLoading]);

  return (
    <div className="all-parties">
      <p className="bold">Parties</p>
      <div className="party-names">
        {parties.map(p => (
          <PartyRow
            key={p.party}
            party={p}
            roles={allRoles.filter(r => r.contract.payload.provider === p.party).map(r => r.role)}
          />
        ))}
      </div>
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
        <p className="dropped-items">
          {roles.join(', ')}
        </p>
        <p className="dropped-items">
          {deployedAutomations.map(da => formatTriggerName(da.config.value.name)).join(', ')}
        </p>
      </div>
    </div>
  );
};
export default ReviewPage;
