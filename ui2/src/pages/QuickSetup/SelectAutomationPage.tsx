import React from 'react';

import { Button } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import DamlLedger from '@daml/react';

import { deployAutomation } from '../../automation';
import { makeAutomationOptions } from '../setup/SetupAutomation';

import { AutomationProvider, useAutomations } from '../../context/AutomationContext';
import { retrieveUserParties } from '../../Parties';
import { RolesProvider } from '../../context/RolesContext';
import { OffersProvider } from '../../context/OffersContext';
import QueryStreamProvider from '../../websocket/queryStream';

import Credentials from '../../Credentials';

import DragAndDropToParties, { formatTriggerName, DropItemTypes } from './DragAndDropToParties';

import { httpBaseUrl, wsBaseUrl, publicParty } from '../../config';

const SelectAutomationPage = (props: { adminCredentials: Credentials; onComplete: () => void }) => {
  const { adminCredentials, onComplete } = props;

  return (
    <DamlLedger
      token={adminCredentials.token}
      party={adminCredentials.party}
      httpBaseUrl={httpBaseUrl}
      wsBaseUrl={wsBaseUrl}
    >
      <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
        <AutomationProvider publicParty={publicParty}>
          <RolesProvider>
            <OffersProvider>
              <DragAndDropAutomation onComplete={onComplete} />
            </OffersProvider>
          </RolesProvider>
        </AutomationProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

const DragAndDropAutomation = (props: { onComplete: () => void }) => {
  const { onComplete } = props;

  const parties = retrieveUserParties() || [];

  const automations = useAutomations();

  const triggerOptions = makeAutomationOptions(automations)?.map(option => {
    return { name: formatTriggerName(option.value as string), value: option.value as string };
  });

  const handleDeployment = async (token: string, auto: string) => {
    const [name, hash] = auto.split('#');
    if (hash) {
      deployAutomation(hash, name, token, publicParty);
    }
  };

  return (
    <div className="setup-page select">
      <h4>Drag and Drop Automation to Parties</h4>
      <DragAndDropToParties
        parties={parties}
        handleAddItem={handleAddItem}
        dropItems={triggerOptions}
        dropItemType={DropItemTypes.AUTOMATION}
      />
      <Button className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );

  function handleAddItem(party: PartyDetails, item: string) {
    handleDeployment(party.token, item);
  }
};

export default SelectAutomationPage;
