import React, { useEffect, useState } from 'react';

import { ArrowLeftIcon } from '../../icons/icons';

import { PublishedInstance, getAutomationInstances, MarketplaceTrigger } from '../../automation';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

import { useRolesContext, RoleKind } from '../../context/RolesContext';
import { useOffers } from '../../context/OffersContext';

import { LoadingWheel } from './QuickSetup';
import classNames from 'classnames';
import { isHubDeployment, useVerifiedParties } from '../../config';

import { CreateEvent } from '@daml/ledger';
import { retrieveParties } from '../../Parties';

const DragAndDropToParties = (props: {
  handleAddItem: (party: string, token: string, item: string) => void;
  dropItems: { name: string; value: string }[];
  title: string;
}) => {
  const { handleAddItem, dropItems, title } = props;
  const { identities, loading: identitiesLoading } = useVerifiedParties();
  const { roles: allRoles, loading: rolesLoading } = useRolesContext();

  if (rolesLoading || identitiesLoading) {
    return (
      <div className="setup-page loading">
        <LoadingWheel label={`Loading parties and roles...`} />
      </div>
    );
  }

  let draggableItems = dropItems;

  return (
    <div className="setup-page select">
      <h4>{title}</h4>
      <div className="page-row">
        <div>
          <p className="bold">Parties</p>
          <div className="party-names">
            {identities.map((p, i) => (
              <PartyRowDropZone
                key={i}
                party={p}
                handleAddItem={handleAddItem}
                roles={allRoles
                  .filter(r => r.contract.payload.provider === p.payload.customer)
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
          <p className="bold">Roles</p>
          <div className="drag-tiles page-row ">
            {draggableItems.map((item, i) => (
              <DraggableItemTile key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PartyRowDropZone = (props: {
  party: CreateEvent<VerifiedIdentity>;
  handleAddItem: (party: string, token: string, item: string | RoleKind) => void;
  roles: RoleKind[];
  triggers?: { name: string; value: string }[];
}) => {
  const { party, handleAddItem, roles, triggers } = props;
  const { roleOffers } = useOffers();

  const [deployedAutomations, setDeployedAutomations] = useState<PublishedInstance[]>([]);
  const [dragCount, setDragCount] = useState(0);

  const parties = retrieveParties() || [];

  const token = parties.find(p => p.party === party.payload.customer)?.token;

  useEffect(() => {
    if (isHubDeployment && token) {
      const timer = setInterval(() => {
        getAutomationInstances(token).then(pd => {
          setDeployedAutomations(pd || []);
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [token]);

  const clearingOffer = findClearingOffer(party.payload.customer);
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
          <p>{party.payload.legalName}</p>
          <p className="dropped-items">{rolesList.join(', ')}</p>
        </div>
      )}

      <p className="dropped-items">
        {deployedAutomations.map(da => formatTriggerName(da.config.value.name)).join(', ')}
      </p>
    </div>
  );

  function findClearingOffer(partyId: string) {
    return !!roleOffers.find(
      r => r.contract.payload.provider === partyId && r.role === RoleKind.CLEARING
    );
  }

  function handleDrop(item: string) {
    setDragCount(dragCount - 1);
    if (token) {
      handleAddItem(party.payload.customer, token, item);
    }
  }
};

const DraggableItemTile = (props: { item: { name: string; value: string } }) => {
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
