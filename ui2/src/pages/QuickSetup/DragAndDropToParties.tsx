import React, { useEffect, useState } from 'react';

import { Loader } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import { ArrowLeftIcon } from '../../icons/icons';

import { PublishedInstance, getAutomationInstances, MarketplaceTrigger } from '../../automation';
import { ServiceKind } from '../../context/RolesContext';
import { makeAutomationOptions } from '../setup/SetupAutomation';
import { isHubDeployment } from '../../config';
import { Role } from '../../context/RolesContext';

const DragAndDropToParties = (props: {
  parties: PartyDetails[];
  handleAddItem: (party: PartyDetails, item: string) => void;
  allRoles: Role[];
  dropItems: { name: string; value: string }[];
  dropItemType: 'Automation' | 'Roles';
}) => {
  const { parties, handleAddItem, allRoles, dropItems, dropItemType } = props;

  return (
    <div className="page-row">
      <div>
        <p className="bold here">Parties</p>
        <div className="party-names">
          {dropItemType === 'Roles'
            ? parties.map((p, i) => (
                <PartyRowDropZone
                  key={i}
                  party={p}
                  handleAddItem={handleAddItem}
                  roles={allRoles
                    .filter(r => r.contract.payload.provider === p.party)
                    .map(r => r.role)}
                />
              ))
            : dropItemType === 'Automation' &&
              parties.map((p, i) => (
                <PartyRowDropZone
                  key={i}
                  party={p}
                  handleAddItem={handleAddItem}
                  roles={allRoles
                    .filter(r => r.contract.payload.provider === p.party)
                    .map(r => r.role)}
                  triggers={dropItems}
                />
              ))}
        </div>
      </div>
      <div className="arrow">
        <ArrowLeftIcon color="grey" />
      </div>
      <div>
        <p className="bold">{dropItemType}</p>
        <div className="role-tiles">
          {dropItems.map((item, i) => (
            <DraggableItemTile key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const PartyRowDropZone = (props: {
  party: PartyDetails;
  handleAddItem: (party: PartyDetails, item: string | ServiceKind) => void;
  roles: ServiceKind[];
  triggers?: { name: string; value: string }[];
}) => {
  const { party, handleAddItem, roles, triggers } = props;
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

  const currentTriggerOptions =
    triggers?.filter(
      to =>
        !deployedAutomations
          .map(da => `${da.config.value.name}#${da.entityInfo.artifactHash}`)
          .includes(String(to.value))
    ) || [];

  return (
    <div
      className="party-name"
      onDrop={evt => handleDrop(evt.dataTransfer.getData('text') as string)}
      onDragOver={evt => evt.preventDefault()}
    >
      {roles && (
        <div className="party-details">
          <p>{party.partyName}</p>
          <p className="dropped-items">{roles.join(', ')}</p>
        </div>
      )}

      {triggers && (
        <div className="dropped-items">
          {deployedAutomations.map(da => {
            return <p>{formatTriggerName(da.config.value.name)}</p>;
          })}
        </div>
      )}
    </div>
  );

  function handleDrop(item: string) {
    if (!!triggers) {
      if (currentTriggerOptions.map(i => i.value).includes(item)) {
        handleAddItem(party, item);
      }
    } else {
      handleAddItem(party, item);
    }
  }
};

export const DraggableItemTile = (props: { item: { name: string; value: string } }) => {
  const { item } = props;

  function handleDragStart(evt: any) {
    evt.dataTransfer.setData('text', item.value);
  }

  return (
    <div className="role-tile" draggable={true} onDragStart={e => handleDragStart(e)}>
      <p>{item.name}</p>
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

export default DragAndDropToParties;
