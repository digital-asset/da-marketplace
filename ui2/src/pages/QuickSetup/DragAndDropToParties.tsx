import React, { useEffect, useState } from 'react';

import { PartyDetails } from '@daml/hub-react';

import { ArrowLeftIcon } from '../../icons/icons';

import { PublishedInstance, getAutomationInstances, MarketplaceTrigger } from '../../automation';

import { useRolesContext, RoleKind } from '../../context/RolesContext';
import { useOffers } from '../../context/OffersContext';

import { LoadingWheel } from './QuickSetup';
import classNames from 'classnames';
import { isHubDeployment } from '../../config';

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
  const { roleOffers: roleOffers, loading: offersLoading } = useOffers();

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
        <div className="drag-tiles page-row ">
          {draggableItems.map((item, i) => (
            <DraggableItemTile key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );

  function findClearingOffer(party: PartyDetails) {
    return !!roleOffers.find(
      r => r.contract.payload.provider === party.party && r.role == RoleKind.CLEARING
    );
  }
};

export const PartyRowDropZone = (props: {
  party: PartyDetails;
  handleAddItem: (party: PartyDetails, item: string | RoleKind) => void;
  roles: RoleKind[];
  triggers?: { name: string; value: string }[];
  clearingOffer: boolean;
}) => {
  const { party, handleAddItem, roles, triggers, clearingOffer } = props;

  const [deployedAutomations, setDeployedAutomations] = useState<PublishedInstance[]>([]);
  const [dragCount, setDragCount] = useState(0);

  const token = party.token;

  useEffect(() => {
    if (isHubDeployment) {
      const timer = setInterval(() => {
        getAutomationInstances(token).then(pd => {
          setDeployedAutomations(pd || []);
        });
      }, 1000);
      return () => clearInterval(timer);
    }
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
      className={classNames('party-name page-row', { 'drag-over': dragCount > 0 })}
      onDrop={evt => handleDrop(evt.dataTransfer.getData('text') as string)}
      onDragEnter={evt => setDragCount(dragCount + 1)}
      onDragLeave={evt => setDragCount(dragCount - 1)}
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
          {deployedAutomations.map(da => formatTriggerName(da.config.value.name)).join(', ')}
        </div>
      )}
    </div>
  );

  function handleDrop(item: string) {
    setDragCount(dragCount - 1);

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
    <div className="drag-tile" draggable={true} onDragStart={e => handleDragStart(e)}>
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
