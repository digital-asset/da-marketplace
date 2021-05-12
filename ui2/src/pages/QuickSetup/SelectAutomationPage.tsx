import React from 'react';

import { Button } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import { deployAutomation } from '../../automation';
import { useAutomations } from '../../context/AutomationContext';
import { makeAutomationOptions } from '../setup/SetupAutomation';
import { publicParty } from '../../config';
import { useRolesContext } from '../../context/RolesContext';

import { retrieveUserParties } from '../../Parties';

import { LoadingWheel } from './QuickSetup';
import DragAndDropToParties, { formatTriggerName } from './DragAndDropToParties';

const SelectAutomationPage = (props: { onComplete: () => void }) => {
  const { onComplete } = props;

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();

  const parties = retrieveUserParties() || [];

  const automations = useAutomations();

  const triggerOptions = makeAutomationOptions(automations)?.map(option => {
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
    const [name, hash] = auto.split('#');
    if (hash) {
      deployAutomation(hash, name, token, publicParty);
    }
  };

  return (
    <div className="setup-page select-roles">
      <h4>Drag and Drop Automation to Parties</h4>
      <DragAndDropToParties
        parties={parties}
        handleAddItem={handleAddItem}
        allRoles={allRoles}
        dropItems={triggerOptions}
        dropItemType="Automation"
      />
      <Button className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );

  function handleAddItem(party: PartyDetails, item: string) {
    console.log('dropped:', item);
    handleDeployment(party.token, item);
  }
};

export default SelectAutomationPage;
