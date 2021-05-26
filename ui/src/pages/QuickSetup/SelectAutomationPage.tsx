import React from 'react';

import DamlLedger from '@daml/react';

import { deployAutomation } from '../../automation';
import { makeAutomationOptions } from '../setup/SetupAutomation';

import { AutomationProvider, useAutomations } from '../../context/AutomationContext';
import { RolesProvider } from '../../context/RolesContext';
import { OffersProvider } from '../../context/OffersContext';
import QueryStreamProvider from '../../websocket/queryStream';

import Credentials from '../../Credentials';

import DragAndDropToParties, { formatTriggerName, DropItemTypes } from './DragAndDropToParties';

import { httpBaseUrl, wsBaseUrl, publicParty } from '../../config';

const SelectAutomationPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;

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
              <DragAndDropAutomation />
            </OffersProvider>
          </RolesProvider>
        </AutomationProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

const DragAndDropAutomation = () => {
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
    <DragAndDropToParties
      handleAddItem={handleAddItem}
      dropItems={triggerOptions}
      dropItemType={DropItemTypes.AUTOMATION}
      title={'Drag and Drop Automation to Parties'}
    />
  );

  function handleAddItem(token: string, item: string) {
    handleDeployment(token, item);
  }
};

export default SelectAutomationPage;
