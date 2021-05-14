import React from 'react';

import { Button } from 'semantic-ui-react';

import DamlLedger, { useLedger, useStreamQueries } from '@daml/react';

import { LoadingWheel } from './QuickSetup';

import { RolesProvider, useRolesContext, RoleKind } from '../../context/RolesContext';
import { OffersProvider, useOffers } from '../../context/OffersContext';

import QueryStreamProvider from '../../websocket/queryStream';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import { Service as RegulatorService } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

import DragAndDropToParties, { DropItemTypes } from './DragAndDropToParties';
import Credentials from '../../Credentials';

import { httpBaseUrl, wsBaseUrl, usePartyName } from '../../config';

const SelectRolesPage = (props: { adminCredentials: Credentials; onComplete: () => void }) => {
  const { adminCredentials, onComplete } = props;

  return (
    <DamlLedger
      token={adminCredentials.token}
      party={adminCredentials.party}
      httpBaseUrl={httpBaseUrl}
      wsBaseUrl={wsBaseUrl}
    >
      <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
        <RolesProvider>
          <OffersProvider>
            <DragAndDropRoles onComplete={onComplete} />
          </OffersProvider>
        </RolesProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

const DragAndDropRoles = (props: { onComplete: () => void }) => {
  const { onComplete } = props;

  const ledger = useLedger();
  const roleOptions = Object.values(RoleKind)
    .filter(s => s !== RoleKind.REGULATOR)
    .map(i => {
      return { name: i, value: i };
    });

  const { getName } = usePartyName('');

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();
  const { roleOffers: roleOffers, loading: offersLoading } = useOffers();

  const { contracts: regulatorServices, loading: regulatorLoading } =
    useStreamQueries(RegulatorService);
  const { contracts: operatorService, loading: operatorLoading } =
    useStreamQueries(OperatorService);
  const regulatorRoles = useStreamQueries(RegulatorRole);

  if (rolesLoading || offersLoading || regulatorLoading || operatorLoading) {
    return (
      <div className="setup-page loading">
        <LoadingWheel label="Loading Parties and Roles..." />
      </div>
    );
  }

  return (
    <div className="setup-page select roles">
      <h4>Drag and Drop Roles to Parties</h4>
      <i>
        Auto Approval Triggers have been deployed, check the logs in the Hub Deployments tab to view
        their status.
      </i>
      <DragAndDropToParties
        handleAddItem={createRoleContract}
        dropItems={roleOptions}
        dropItemType={DropItemTypes.ROLES}
      />
      <Button className="ghost next" onClick={() => onComplete()}>
        Next
      </Button>
    </div>
  );

  async function createRoleContract(partyId: string, role: string) {
    const operatorServiceContract = operatorService[0];

    if (
      findExistingRoleOffer(partyId, role as RoleKind) ||
      findExistingRole(partyId, role as RoleKind)
    ) {
      return;
    }

    if (!findExistingRoleOffer(partyId, RoleKind.REGULATOR)) {
      if (!regulatorServices.find(c => c.payload.customer === partyId)) {
        const regId = regulatorRoles.contracts[0].contractId;
        await ledger.exercise(RegulatorRole.OfferRegulatorService, regId, {
          customer: partyId,
        });
      }
    }

    const provider = { provider: partyId };
    console.log('Creating Role Contract for', getName(partyId));

    switch (role) {
      case RoleKind.CUSTODY:
        await ledger.exercise(
          OperatorService.OfferCustodianRole,
          operatorServiceContract.contractId,
          provider
        );
        return;
      case RoleKind.CLEARING:
        await ledger.exercise(
          OperatorService.OfferClearingRole,
          operatorServiceContract.contractId,
          provider
        );
        return;

      case RoleKind.TRADING:
        await ledger.exercise(
          OperatorService.OfferExchangeRole,
          operatorServiceContract.contractId,
          provider
        );
        return;

      case RoleKind.MATCHING:
        await ledger.exercise(
          OperatorService.OfferMatchingService,
          operatorServiceContract.contractId,
          provider
        );
        return;

      case RoleKind.SETTLEMENT:
        await ledger.exercise(
          OperatorService.OfferSettlementService,
          operatorServiceContract.contractId,
          provider
        );
        return;

      case RoleKind.DISTRIBUTION:
        await ledger.exercise(
          OperatorService.OfferDistributorRole,
          operatorServiceContract.contractId,
          provider
        );
        return;

      default:
        throw new Error(`Unsupported role: ${role}`);
    }
  }

  function findExistingRoleOffer(provider: string, role: RoleKind) {
    return !!roleOffers.find(c => c.role === role && c.contract.payload.provider === provider);
  }

  function findExistingRole(provider: string, role: RoleKind) {
    return !!allRoles.find(c => c.role === role && c.contract.payload.provider === provider);
  }
};

export default SelectRolesPage;
