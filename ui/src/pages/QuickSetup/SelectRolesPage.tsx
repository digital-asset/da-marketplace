import React, { useState } from 'react';

import { useLedger } from '@daml/react';
import { Choice, ContractId } from '@daml/types';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';

import { useRolesContext, RoleKind, terminateRole } from '../../context/RolesContext';
import { useOffers } from '../../context/OffersContext';
import { useAutomations } from '../../context/AutomationContext';

import { useStreamQueries } from '../../Main';
import { MarketplaceTrigger, deployAutomation } from '../../automation';
import { retrieveParties } from '../../Parties';
import { computeToken } from '../../Credentials';
import { publicParty, isHubDeployment, useVerifiedParties } from '../../config';
import { Form, Button } from 'semantic-ui-react';

const SelectRolesPage = () => {
  const ledger = useLedger();
  const automations = useAutomations();

  const { identities, loading: identitiesLoading } = useVerifiedParties();
  const { roles: allRoles, loading: rolesLoading } = useRolesContext();
  const { roleOffers, loading: offersLoading } = useOffers();

  const [selectedParty, setSelectedParty] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<RoleKind>();

  const { contracts: operatorService, loading: operatorLoading } =
    useStreamQueries(OperatorService);

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

  const roleOptions = Object.values(RoleKind)
    .filter(
      s => s !== RoleKind.REGULATOR && s !== RoleKind.MATCHING && s !== RoleKind.CLEARING_PENDING
    )
    .map(i => {
      return { text: i, value: i };
    });

  if (rolesLoading || offersLoading || operatorLoading || identitiesLoading) {
    return null;
  }

  const partyOptions = identities.map(p => {
    return { text: p.payload.legalName, value: p.payload.customer };
  });

  const parties = retrieveParties() || [];

  const hasRole = !!allRoles.find(
    role => role.roleKind === selectedRole && role.contract.payload.provider === selectedParty
  );

  return (
    <div className="assign-roles">
      <h4>Assign Roles:</h4>
      <Form>
        <Form.Select
          className="request-select"
          label={<p className="input-label">Party:</p>}
          placeholder="Select..."
          value={selectedParty || ''}
          onChange={(_, data: any) => setSelectedParty(data.value)}
          options={partyOptions}
        />
        <Form.Select
          className="request-select"
          label={<p className="input-label">Role:</p>}
          placeholder="Select..."
          value={selectedRole || ''}
          onChange={(_, data: any) => setSelectedRole(data.value)}
          options={roleOptions}
        />
        <div className="submit-actions">
          <Button
            disabled={!selectedRole || !selectedRole || hasRole}
            className="ghost"
            onClick={() => {
              if (!!selectedParty && !!selectedRole) {
                createRoleContract(selectedParty, selectedRole);
              }
            }}
          >
            Assign
          </Button>
          <Button
            disabled={!selectedRole || !selectedRole || !hasRole}
            className="ghost"
            onClick={() => {
              if (!!selectedParty && !!selectedRole) {
                handleTerminateRole();
              }
            }}
          >
            Remove
          </Button>
        </div>
      </Form>
    </div>
  );

  function handleTerminateRole() {
    const role = allRoles.find(
      role => role.roleKind === selectedRole && role.contract.payload.provider === selectedParty
    );
    if (role) {
      terminateRole(role, ledger);
    }
  }

  async function createRoleContract(partyId: string, role: RoleKind) {
    const token = isHubDeployment
      ? parties.find(p => p.party === partyId)?.token
      : computeToken(partyId);

    if (
      findExistingRoleOffer(partyId, role as RoleKind) ||
      findExistingRole(partyId, role as RoleKind) ||
      !token
    ) {
      setSelectedParty(undefined);
      setSelectedRole(undefined);
      return;
    }

    const provider = { provider: partyId };

    switch (role) {
      case RoleKind.CUSTODY:
        doCreate(OperatorService.OfferCustodianRole, provider);
        return;
      case RoleKind.CLEARING:
        doCreate(OperatorService.OfferClearingRole, provider);
        handleDeployment(token, MarketplaceTrigger.ClearingTrigger);
        return;
      case RoleKind.TRADING:
        doCreate(OperatorService.OfferExchangeRole, provider);
        handleDeployment(token, MarketplaceTrigger.SettlementInstructionTrigger);
        return;
      case RoleKind.SETTLEMENT:
        doCreate(OperatorService.OfferSettlementService, provider);
        handleDeployment(token, MarketplaceTrigger.SettlementInstructionTrigger);
        return;
      case RoleKind.DISTRIBUTION:
        doCreate(OperatorService.OfferDistributorRole, provider);
        return;
      default:
        throw new Error(`Unsupported role: ${role}`);
    }
  }

  async function doCreate(
    choice: Choice<OperatorService, any, ContractId<any>, string>,
    provider: { provider: string }
  ) {
    const operatorServiceContract = operatorService[0];
    return await ledger.exercise(choice, operatorServiceContract.contractId, provider).then(_ => {
      setSelectedParty(undefined);
      setSelectedRole(undefined);
    });
  }

  async function handleDeployment(token: string, autoName: string) {
    if (!isHubDeployment) {
      return;
    }
    const trigger = allTriggers.find(auto => auto.startsWith(autoName));

    if (trigger) {
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
    return !!allRoles.find(c => c.roleKind === role && c.contract.payload.provider === provider);
  }
};

export function formatTriggerName(name: string) {
  return name
    .split('#')[0]
    .split(':')[0]
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

export default SelectRolesPage;
