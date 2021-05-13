import React from 'react';

import { Button } from 'semantic-ui-react';

import { PartyDetails } from '@daml/hub-react';

import { LoadingWheel } from './QuickSetup';

import { useLedger, useStreamQueries } from '@daml/react';

import { useRolesContext, ServiceKind } from '../../context/RolesContext';
import { useOffersContext } from '../../context/OffersContext';

import { retrieveUserParties } from '../../Parties';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import { Service as RegulatorService } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

import DragAndDropToParties, { DropItemTypes } from './DragAndDropToParties';

const SelectRolesPage = (props: { onComplete: () => void }) => {
  const { onComplete } = props;
  const parties = retrieveUserParties() || [];

  const ledger = useLedger();
  const roleOptions = Object.values(ServiceKind)
    .filter(s => s !== ServiceKind.REGULATOR)
    .map(i => {
      return { name: i, value: i };
    });

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();
  const { offers: allOffers, loading: offersLoading } = useOffersContext();

  const { contracts: regulatorServices, loading: regulatorLoading } =
    useStreamQueries(RegulatorService);
  const { contracts: operatorService, loading: operatorLoading } =
    useStreamQueries(OperatorService);
  const regulatorRoles = useStreamQueries(RegulatorRole);

  if (rolesLoading || offersLoading || regulatorLoading || operatorLoading) {
    return (
      <div className="setup-page select">
        <LoadingWheel label="Loading..," />
      </div>
    );
  }

  return (
    <div className="setup-page select">
      <h4>Drag and Drop Roles to Parties</h4>
      <i>
        Auto Approval Triggers have been deployed, check the logs in the Hub Deployments tab to view
        their status.
      </i>
      <DragAndDropToParties
        parties={parties}
        handleAddItem={createRoleContract}
        dropItems={roleOptions}
        dropItemType={DropItemTypes.ROLES}
      />
      <Button className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );

  async function createRoleContract(party: PartyDetails, role: string) {
    const operatorServiceContract = operatorService[0];

    if (
      findExistingOffer(party.party, role as ServiceKind) ||
      findExistingRole(party.party, role as ServiceKind)
    ) {
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
        await ledger.exercise(
          OperatorService.OfferCustodianRole,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
        return;
      case ServiceKind.CLEARING:
        await ledger.exercise(
          OperatorService.OfferClearingRole,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
        return;

      case ServiceKind.TRADING:
        await ledger.exercise(
          OperatorService.OfferExchangeRole,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
        return;

      case ServiceKind.MATCHING:
        await ledger.exercise(
          OperatorService.OfferMatchingService,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
        return;

      case ServiceKind.SETTLEMENT:
        await ledger.exercise(
          OperatorService.OfferSettlementService,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
        return;

      case ServiceKind.DISTRIBUTION:
        await ledger.exercise(
          OperatorService.OfferDistributorRole,
          operatorServiceContract.contractId,
          { provider: party.party }
        );
        return;

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

export default SelectRolesPage;
