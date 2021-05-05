import React, { useEffect, useState } from 'react';

import { Button, DropdownItemProps } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import { ServiceKind } from './QuickSetup';

import { ArrowLeftIcon } from '../../icons/icons';

import OverflowMenu, { OverflowMenuEntry } from '../page/OverflowMenu';
import {
  PublishedInstance,
  PublicAutomation,
  getAutomationInstances,
  deployAutomation,
  undeployAutomation,
} from '../../automation';
import { IQuickSetupData } from './QuickSetup';
import { useAutomations } from '../../context/AutomationContext';
import { makeAutomationOptions } from '../setup/SetupAutomation';
import { DraggableItemTile } from './SelectRolesPage';
import { PageControls, usePagination } from './PaginationUtils';
import { publicParty } from '../../config';

import Credentials from '../../Credentials';

const SelectAutomationPage = (props: {
  parties: PartyDetails[];
  toNextPage: () => void;
//   quickSetupData: Map<string, IQuickSetupData>;
//   setQuickSetupData: (newQuickSetupData: Map<string, IQuickSetupData>) => void;
  credentials: Credentials;
}) => {
  const { parties, toNextPage, credentials } = props;

  const token = credentials.token;

  const page = usePagination(parties);
  const automations = useAutomations();
  const triggerOptions: DropdownItemProps[] = makeAutomationOptions(automations);

  const automationNames = makeAutomationOptions(automations).map(a => a.text as string);

  const [deployedAutomations, setDeployedAutomations] = useState<PublishedInstance[]>([]);
  const [toDeploy, setToDeploy] = useState<string[]>([]);
  const [deploying, setDeploying] = useState<boolean>(false);

  const handleDeployment = async (token: string) => {
    setDeploying(true);
    for (const auto of toDeploy) {
      const [name, hash] = auto.split('#');
      if (hash) {
        await deployAutomation(hash, name, token, publicParty);
      }
    }
    setToDeploy([]);
    setDeploying(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      getAutomationInstances(token).then(pd => {
        setDeployedAutomations(pd || []);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [token]);

  const currentTriggerOptions = triggerOptions
    .filter(
      to =>
        !deployedAutomations
          .map(da => `${da.config.value.name}#${da.entityInfo.artifactHash}`)
          .includes(String(to.value))
    )
    .map(da => da.config.value.name as string);

  return (
    <div className="setup-page select-roles">
      <h4>Drag and Drop Automation to Parties</h4>
      <div className="page-body">
        <div>
          <p className="bold">Parties</p>
          <div className="party-names">
            {/* {parties.slice(page.startingIndex, page.endingIndex).map((p, i) => (
              <PartyRowDropZone
                key={i}
                party={p}
                handleAddAutomation={handleAddAutomation}
                roles={quickSetupData.get(p.party)?.roles || []}
                automation={deployedAutomations.map(da => da.config.value.name.split(':')[0])}
                options={currentTriggerOptions}
              />
            ))} */}
          </div>
          <PageControls
            numberOfPages={page.numberOfPages}
            page={page.page}
            setPage={page.setPage}
          />
        </div>
        <div className="arrow">
          <ArrowLeftIcon color="black" />
        </div>
        <div>
          <p className="bold">Automation</p>
          <div className="role-tiles">
            {automationNames.map((a, i) => (
              <DraggableItemTile key={i} item={a} />
            ))}
          </div>
        </div>
      </div>
      <Button className="ghost next" onClick={() => toNextPage()}>
        Next
      </Button>
    </div>
  );

  function handleAddAutomation(party: PartyDetails, automation: string) {
    // const existingEntry = quickSetupData.get(party.party);
    // const existingAutomations = quickSetupData.get(party.party)?.automation || [];

    // if (!existingAutomations.includes(automation)) {
    //   let newMap = new Map(quickSetupData);
    //   newMap.set(party.party, {
    //     ...existingEntry,
    //     automation: [...existingAutomations, automation],
    //   });
    //   setQuickSetupData(newMap);
    // }
  }
};

const PartyRowDropZone = (props: {
  party: PartyDetails;
  handleAddAutomation: (party: PartyDetails, automation: string) => void;
  roles: ServiceKind[];
  automation: string[];
  options: string[];
}) => {
  const { party, handleAddAutomation, roles, automation, options } = props;

  return (
    <div
      className="party-name"
      onDrop={evt => handleAddAutomation(party, evt.dataTransfer.getData('text') as string)}
      onDragOver={evt => evt.preventDefault()}
    >
      <div>
        <p>{party.partyName}</p>
        <p className="role-name">{roles.join(', ')}</p>
        <p className="role-name">{automation.join(', ')}</p>
      </div>
      <OverflowMenu>
        {options.map(a => (
          <OverflowMenuEntry
            key={a}
            label={`Add ${a}`}
            onClick={() => handleAddAutomation(party, a)}
          />
        ))}
      </OverflowMenu>
    </div>
  );
};

export default SelectAutomationPage;
