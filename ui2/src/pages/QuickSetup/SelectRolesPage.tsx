import React, { useState } from 'react';

import { Button } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import { ServiceKind } from './QuickSetup';

import { ArrowLeftIcon } from '../../icons/icons';

import classNames from 'classnames';

import { LoadingWheel } from './QuickSetup';

import { useLedger, useStreamQueries } from '@daml/react';

import { useRolesContext } from '../../context/RolesContext';
import { useOffersContext } from '../../context/OffersContext';

import { retrieveParties } from '../../Parties';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import { Service as RegulatorService } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

const SelectRolesPage = (props: { onComplete: () => void }) => {
  const { onComplete } = props;
  const parties = retrieveParties() || [];

  const ledger = useLedger();
  const roleOptions = getRoleOptions();

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();
  const { offers: allOffers, loading: offersLoading } = useOffersContext();

  const { contracts: regulatorServices, loading: regulatorLoading } =
    useStreamQueries(RegulatorService);
  const { contracts: operatorService, loading: operatorLoading } =
    useStreamQueries(OperatorService);
  const regulatorRoles = useStreamQueries(RegulatorRole);

  if (rolesLoading || offersLoading || regulatorLoading || operatorLoading) {
    return (
      <div className="setup-page select-roles">
        <LoadingWheel label="Loading role selection..." />
      </div>
    );
  }

  return (
    <div className="setup-page select-roles">
      <h4>Drag and Drop Roles to Parties</h4>
      <div className="page-row">
        <div>
          <p className="bold here">Parties</p>
          <div className="party-names">
            {parties.map((p, i) => (
              <PartyRowDropZone
                key={i}
                party={p}
                handleAddRole={createRoleContract}
                roles={allRoles
                  .filter(r => r.contract.payload.provider === p.party)
                  .map(r => r.role)}
              />
            ))}
          </div>
        </div>
        <div className="arrow">
          <ArrowLeftIcon color="grey" />
        </div>
        <div>
          <p className="bold">Roles</p>
          <div className="role-tiles">
            {roleOptions.map((role, i) => (
              <DraggableItemTile key={i} item={role} />
            ))}
          </div>
        </div>
      </div>
      <Button className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );

  async function createRoleContract(party: PartyDetails, role: ServiceKind) {
    const operatorServiceContract = operatorService[0];

    console.log('dropped: ', role);

    if (findExistingOffer(party.party, role) || findExistingRole(party.party, role)) {
      console.log('found existing offer or role: ', role);
      return;
    }

    if (!findExistingOffer(party.party, ServiceKind.REGULATOR)) {
      if (!regulatorServices.find(c => c.payload.customer === party.party)) {
        const regId = regulatorRoles.contracts[0].contractId;
        await ledger.exercise(RegulatorRole.OfferRegulatorService, regId, {
          customer: party.party,
        });
      }
    }

    switch (role) {
      case ServiceKind.CUSTODY:
        return await ledger.exercise(
          OperatorService.OfferCustodianRole,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
      case ServiceKind.CLEARING:
        return await ledger.exercise(
          OperatorService.OfferClearingRole,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
      case ServiceKind.TRADING:
        return await ledger.exercise(
          OperatorService.OfferExchangeRole,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
      case ServiceKind.MATCHING:
        return await ledger.exercise(
          OperatorService.OfferMatchingService,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
      case ServiceKind.SETTLEMENT:
        return await ledger.exercise(
          OperatorService.OfferSettlementService,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
      case ServiceKind.DISTRIBUTION:
        return await ledger.exercise(
          OperatorService.OfferDistributorRole,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
      default:
        throw new Error(`Unsupported service: ${role}`);
    }
  }

  function findExistingOffer(provider: string, role: ServiceKind) {
    return !!allOffers.find(c => c.role === role && c.contract.payload.provider === provider);
  }

  function findExistingRole(provider: string, role: ServiceKind) {
    return !!allRoles.find(c => c.role === role && c.contract.payload.provider === provider);
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

const PartyRowDropZone = (props: {
  party: PartyDetails;
  handleAddRole: (party: PartyDetails, role: ServiceKind) => void;
  roles: ServiceKind[];
}) => {
  const { party, handleAddRole, roles } = props;

  return (
    <div
      className="party-name"
      onDrop={evt => handleAddRole(party, evt.dataTransfer.getData('text') as ServiceKind)}
      onDragOver={evt => evt.preventDefault()}
    >
      <div>
        <p>{party.partyName}</p>
        <p className="role-names">{roles.join(', ')}</p>
      </div>
    </div>
  );
};

function getRoleOptions(excludeOptions?: ServiceKind[]) {
  return Object.values(ServiceKind)
    .filter(s => s !== ServiceKind.REGULATOR && !(excludeOptions || []).includes(s))
    .map(i => {
      return { name: i, value: i };
    });
}

export default SelectRolesPage;
