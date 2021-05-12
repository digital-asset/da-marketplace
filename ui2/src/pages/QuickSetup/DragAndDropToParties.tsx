import React, { useEffect, useState } from 'react';

import { PartyDetails } from '@daml/hub-react';

import { ArrowLeftIcon } from '../../icons/icons';

import { PublishedInstance, getAutomationInstances, MarketplaceTrigger } from '../../automation';

import { useRolesContext, ServiceKind } from '../../context/RolesContext';
import { useOffersContext } from '../../context/OffersContext';

import { LoadingWheel } from './QuickSetup';

export enum DropItemTypes {
  AUTOMATION = 'Automation',
  ROLES = 'Roles',
}

const DragAndDropToParties = (props: {
  parties: PartyDetails[];
  handleAddItem: (party: PartyDetails, item: string) => void;
  dropItems: { name: string; value: string }[];
  dropItemType: DropItemTypes;
}) => {
  const { parties, handleAddItem, dropItems, dropItemType } = props;

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();
  const { offers: allOffers, loading: offersLoading } = useOffersContext();

  if (rolesLoading || offersLoading) {
    return (
      <div className="setup-page select">
        <LoadingWheel label="Loading..." />
      </div>
    );
  }

  let draggableItems = dropItems;

  if (dropItemType === DropItemTypes.AUTOMATION) {
    draggableItems.filter(item => item.value != MarketplaceTrigger.AutoApproveTrigger); // already deployed for all parties
  }

  return (
    <div className="page-row">
      <div>
        <p className="bold here">Parties</p>
        <div className="party-names">
          {dropItemType === DropItemTypes.ROLES
            ? parties.map((p, i) => (
                <PartyRowDropZone
                  key={i}
                  party={p}
                  handleAddItem={handleAddItem}
                  roles={allRoles
                    .filter(r => r.contract.payload.provider === p.party)
                    .map(r => r.role)}
                  clearingOffer={findClearingOffer(p)}
                />
              ))
            : dropItemType === DropItemTypes.AUTOMATION &&
              parties.map((p, i) => (
                <PartyRowDropZone
                  key={i}
                  party={p}
                  handleAddItem={handleAddItem}
                  roles={allRoles
                    .filter(r => r.contract.payload.provider === p.party)
                    .map(r => r.role)}
                  triggers={dropItems}
                  clearingOffer={findClearingOffer(p)}
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
          {draggableItems.map((item, i) => (
            <DraggableItemTile key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );

  function findClearingOffer(party: PartyDetails) {
    return !!allOffers.find(
      r => r.contract.payload.provider === party.party && r.role == ServiceKind.CLEARING
    );
  }
};

export const PartyRowDropZone = (props: {
  party: PartyDetails;
  handleAddItem: (party: PartyDetails, item: string | ServiceKind) => void;
  roles: ServiceKind[];
  triggers?: { name: string; value: string }[];
  clearingOffer: boolean;
}) => {
  const { party, handleAddItem, roles, triggers, clearingOffer } = props;

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

  let rolesList = roles as string[];

  if (clearingOffer) {
    rolesList = [...rolesList, 'Clearing (pending)'];
  }

  return (
    <div
      className="party-name"
      onDrop={evt => handleDrop(evt.dataTransfer.getData('text') as string)}
      onDragOver={evt => evt.preventDefault()}
    >
      {roles && (
        <div className="party-details">
          <p>{party.partyName}</p>
          <p className="dropped-items">{rolesList.join(', ')}</p>
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
