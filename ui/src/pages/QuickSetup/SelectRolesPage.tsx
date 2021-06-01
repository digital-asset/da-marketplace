import React from 'react';

import DamlLedger, { useLedger } from '@daml/react';

import { LoadingWheel } from './QuickSetup';
import { useStreamQueries } from '../../Main';

import { RolesProvider, useRolesContext, RoleKind } from '../../context/RolesContext';
import { OffersProvider, useOffers } from '../../context/OffersContext';

import QueryStreamProvider from '../../websocket/queryStream';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';

import DragAndDropToParties from './DragAndDropToParties';
import Credentials from '../../Credentials';
import { MarketplaceTrigger, deployAutomation } from '../../automation';
import { httpBaseUrl, wsBaseUrl, publicParty, isHubDeployment } from '../../config';
import { AutomationProvider, useAutomations } from '../../context/AutomationContext';

const SelectRolesPage = (props: { adminCredentials: Credentials }) => {
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
              <DragAndDropRoles />
            </OffersProvider>
          </RolesProvider>
        </AutomationProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

const DragAndDropRoles = () => {
  const ledger = useLedger();
  const automations = useAutomations();

  const allTriggers =
    automations?.flatMap(auto => {
      if (auto.automationEntity.tag === 'DamlTrigger') {
        return auto.automationEntity.value.triggerNames.map(tn => {
          return `${tn}#${auto.artifactHash}`;
        });
      } else {
        return `${auto.automationEntity.value.entityName}#${auto.artifactHash}`;
      }
    }) || [];

  const { roles: allRoles, loading: rolesLoading } = useRolesContext();
  const { roleOffers, loading: offersLoading } = useOffers();

  const { contracts: operatorService, loading: operatorLoading } =
    useStreamQueries(OperatorService);

  if (rolesLoading || offersLoading || operatorLoading) {
    return (
      <div className="setup-page loading">
        <LoadingWheel label="Loading parties and roles..." />
      </div>
    );
  }

  return (
    <DragAndDropToParties
      handleAddItem={createRoleContract}
      title={'Drag and Drop Roles to Parties'}
    />
  );

  async function createRoleContract(partyId: string, token: string, role: string) {
    const operatorServiceContract = operatorService[0];

    if (
      findExistingRoleOffer(partyId, role as RoleKind) ||
      findExistingRole(partyId, role as RoleKind)
    ) {
      return;
    }

    const provider = { provider: partyId };

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
        if (isHubDeployment) {
          handleDeployment(token, MarketplaceTrigger.ClearingTrigger);
        }
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
        if (isHubDeployment) {
          handleDeployment(token, MarketplaceTrigger.MatchingEngine);
        }
        return;

      case RoleKind.SETTLEMENT:
        await ledger.exercise(
          OperatorService.OfferSettlementService,
          operatorServiceContract.contractId,
          provider
        );

        if (isHubDeployment) {
          handleDeployment(token, MarketplaceTrigger.SettlementInstructionTrigger);
        }
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

  async function handleDeployment(token: string, autoName: string) {
    console.log(allTriggers);
    const trigger = allTriggers.find(auto => auto.startsWith(autoName));
    if (trigger) {
      console.log(trigger);
      const [name, hash] = trigger.split('#');

      if (hash) {
        deployAutomation(hash, name, token, publicParty);
      }
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
