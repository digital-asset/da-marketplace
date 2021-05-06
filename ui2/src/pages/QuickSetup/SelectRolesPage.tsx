import React from 'react';

import { Button } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import { ServiceKind } from './QuickSetup';

import { ArrowLeftIcon } from '../../icons/icons';

import OverflowMenu, { OverflowMenuEntry } from '../page/OverflowMenu';

import { PageControls, usePagination } from './PaginationUtils';

import { useLedger, useStreamQueries } from '@daml/react';

import { useRolesContext } from '../../context/RolesContext';
import { useOffersContext } from '../../context/OffersContext';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import { Service as RegulatorService } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

const SelectRolesPage = (props: { parties: PartyDetails[]; toNextPage: () => void }) => {
  const { parties, toNextPage } = props;

  const ledger = useLedger();
  const page = usePagination(parties);
  const roleOptions = getRoleOptions();

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();
  const { offers: allOffers, loading: offersLoading } = useOffersContext();

  const { contracts: regulatorServices, loading: regulatorLoading } = useStreamQueries(
    RegulatorService
  );
  const { contracts: operatorService, loading: operatorLoading } = useStreamQueries(
    OperatorService
  );

  if (rolesLoading || offersLoading || regulatorLoading || operatorLoading) {
    return <p>Loading</p>;
  }

  return (
    <div className="setup-page select-roles">
      <h4>Drag and Drop Roles to Parties</h4>
      <div className="page-body">
        <div>
          <p className="bold">Parties</p>
          <div className="party-names">
            {parties.slice(page.startingIndex, page.endingIndex).map((p, i) => (
              <PartyRowDropZone
                key={i}
                party={p}
                handleAddRole={createRoleContract}
                roles={allRoles
                  .filter(role => role.contract.payload.provider === p.party)
                  .map(role => role.role)}
              />
            ))}
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
          <p className="bold">Roles</p>
          <div className="role-tiles">
            {roleOptions.map((role, i) => (
              <DraggableItemTile key={i} item={role} />
            ))}
          </div>
        </div>
      </div>
      <Button className="ghost next" onClick={() => toNextPage()}>
        Next
      </Button>
    </div>
  );

  async function createRoleContract(party: PartyDetails, role: ServiceKind) {
    const operatorServiceContract = operatorService[0];

    if (!party || !operatorServiceContract || !role) return undefined;

    const provider = party?.party;
    const id = operatorServiceContract.contractId;

    if (
      !findExistingOffer(provider, ServiceKind.REGULATOR) &&
      !regulatorServices.find(c => c.payload.customer === provider)
    ) {
      const regulatorRoles = allRoles.filter(
        c => c.contract.payload.provider === party.party && c.role === ServiceKind.REGULATOR
      );
      const regId = regulatorRoles[0].contract.contractId;
      await ledger.exercise(RegulatorRole.OfferRegulatorService, regId, {
        customer: provider,
      }); // trigger auto-approves
    }

    if (findExistingOffer(provider, role) || findExistingRole(provider, role)) {
      console.log('found this role, returning');
      return;
    }

    switch (role) {
      case ServiceKind.CUSTODY:
        console.log('role', role);
        console.log('party', party.partyName);
        return await ledger.exercise(OperatorService.OfferCustodianRole, id, { provider });
      case ServiceKind.CLEARING:
        console.log('role', role);
        console.log('party', party.partyName);
        return await ledger.exercise(OperatorService.OfferClearingRole, id, { provider });
      case ServiceKind.TRADING:
        console.log('role', role);
        console.log('party', party.partyName);
        return await ledger.exercise(OperatorService.OfferExchangeRole, id, { provider });
      case ServiceKind.MATCHING:
        console.log('role', role);
        console.log('party', party.partyName);
        return await ledger.exercise(OperatorService.OfferMatchingService, id, { provider });
      case ServiceKind.SETTLEMENT:
        console.log('role', role);
        console.log('party', party.partyName);
        return await ledger.exercise(OperatorService.OfferSettlementService, id, { provider });
      case ServiceKind.DISTRIBUTION:
        console.log('role', role);
        console.log('party', party.partyName);
        return await ledger.exercise(OperatorService.OfferDistributorRole, id, { provider });
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

export const DraggableItemTile = (props: { item: string }) => {
  const { item } = props;

  function handleDragStart(evt: any, item: string) {
    evt.dataTransfer.setData('text', item);
  }

  return (
    <div className="role-tile" draggable={true} onDragStart={e => handleDragStart(e, item)}>
      <p>{item}</p>
    </div>
  );
};

const PartyRowDropZone = (props: {
  party: PartyDetails;
  handleAddRole: (party: PartyDetails, role: ServiceKind) => void;
  roles: ServiceKind[];
}) => {
  const { party, handleAddRole, roles } = props;

  const roleOptions = getRoleOptions(roles);

  return (
    <div
      className="party-name"
      onDrop={evt => handleAddRole(party, evt.dataTransfer.getData('text') as ServiceKind)}
      onDragOver={evt => evt.preventDefault()}
    >
      <div>
        <p>{party.partyName}</p>
        <p className="role-name">{roles.join(', ')}</p>
      </div>
      <OverflowMenu>
        {roleOptions.map(role => (
          <OverflowMenuEntry
            key={role}
            label={`Add ${role}`}
            onClick={() => handleAddRole(party, role)}
          />
        ))}
      </OverflowMenu>
    </div>
  );
};

function getRoleOptions(excludeOptions?: ServiceKind[]) {
  return Object.values(ServiceKind).filter(
    s => s !== ServiceKind.REGULATOR && !(excludeOptions || []).includes(s)
  );
}

export default SelectRolesPage;
