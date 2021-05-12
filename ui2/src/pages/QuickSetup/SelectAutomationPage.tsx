import React, { useEffect, useState } from 'react';

import { Button } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import { ServiceKind } from './QuickSetup';

import { ArrowLeftIcon } from '../../icons/icons';

import OverflowMenu, { OverflowMenuEntry } from '../page/OverflowMenu';
import { PublishedInstance, getAutomationInstances, deployAutomation } from '../../automation';
import { useAutomations } from '../../context/AutomationContext';
import { makeAutomationOptions } from '../setup/SetupAutomation';
import { DraggableItemTile } from './SelectRolesPage';
import { publicParty } from '../../config';
import { useRolesContext } from '../../context/RolesContext';

import { retrieveParties } from '../../Parties';

import { LoadingWheel } from './QuickSetup';

const SelectAutomationPage = (props: { onComplete: () => void }) => {
  const { onComplete } = props;

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();

  const parties = retrieveParties() || [];

  const automations = useAutomations();

  const triggerOptions = makeAutomationOptions(automations).map(option => {
    return { name: formatTriggerName(option.value as string), value: option.value as string };
  });

  if (rolesLoading) {
    return (
      <div className="setup-page select-roles">
        <LoadingWheel label="Loading role selection..." />
      </div>
    );
  }

  const handleDeployment = async (token: string, auto: string) => {
    console.log('deploying automation!!!!!');
    const [name, hash] = auto.split('#');
    if (hash) {
      deployAutomation(hash, name, token, publicParty);
    }
  };

  return (
    <div className="setup-page select-roles">
      <h4>Drag and Drop Automation to Parties</h4>
      <div className="page-row">
        <div>
          <p className="bold">Parties</p>
          <div className="party-names">
            {parties.map((p, i) => (
              <PartyRowDropZone
                key={i}
                party={p}
                handleAddAutomation={handleDeployment}
                roles={allRoles
                  .filter(r => r.contract.payload.provider === p.party)
                  .map(r => r.role)}
                options={triggerOptions}
              />
            ))}
          </div>
        </div>
        <div className="arrow">
          <ArrowLeftIcon color="grey" />
        </div>
        <div>
          <p className="bold">Automation</p>
          <div className="role-tiles">
            {triggerOptions.map((a, i) => (
              <DraggableItemTile key={i} item={a} />
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

export function formatTriggerName(name: string) {
  return name
    .split('#')[0]
    .split(':')[0]
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

const PartyRowDropZone = (props: {
  party: PartyDetails;
  handleAddAutomation: (token: string, automation: string) => void;
  roles: ServiceKind[];
  options: { name: string; value: string }[];
}) => {
  const { party, handleAddAutomation, roles, options } = props;
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

  const currentTriggerOptions = options.filter(
    to =>
      !deployedAutomations
        .map(da => `${da.config.value.name}#${da.entityInfo.artifactHash}`)
        .includes(String(to.value))
  );

  return (
    <div
      className="party-name"
      onDrop={evt => handleDrop(evt.dataTransfer.getData('text') as string)}
      onDragOver={evt => evt.preventDefault()}
    >
      <div className="party-details">
        <p>{party.partyName}</p>
        <p className="role-names">{roles.join(', ')}</p>
      </div>

      <div className="role-names">
        {deployedAutomations.map(da => {
          return <p>{formatTriggerName(da.config.value.name)}</p>;
        })}
      </div>
    </div>
  );

  function handleDrop(auto: string) {
    console.log('dropped:', auto);
    if (currentTriggerOptions.map(i => i.value).includes(auto)) {
      handleAddAutomation(token, auto);
    }
  }
};

export default SelectAutomationPage;
