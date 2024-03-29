import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';

import { useAutomationInstances, useAutomations } from '@daml/hub-react';
import { useLedger } from '@daml/react';
import { Choice, ContractId } from '@daml/types';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';

import Credentials, { computeLocalToken } from '../../Credentials';
import { useStreamQueries } from '../../Main';
import { retrieveParties } from '../../Parties';
import { MarketplaceTrigger, isHubDeployment, useVerifiedParties } from '../../config';
import { useOffers } from '../../context/OffersContext';
import { useRolesContext, RoleKind, terminateRole } from '../../context/RolesContext';
import { usePublicParty } from '../common';
import QuickSetupPage from './QuickSetupPage';

const ConfigureProviders = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;

  return (
    <QuickSetupPage title="Configure Providers" adminCredentials={adminCredentials}>
      <ConfigureProvidersPage />
    </QuickSetupPage>
  );
};

const ConfigureProvidersPage = () => {
  const ledger = useLedger();
  const publicParty = usePublicParty();
  const { automations } = useAutomations();
  const { deployAutomation } = useAutomationInstances();

  const { identities, loading: identitiesLoading } = useVerifiedParties();
  const { roles: allRoles, loading: rolesLoading } = useRolesContext();
  const { roleOffers, loading: offersLoading } = useOffers();

  const [selectedParty, setSelectedParty] = useState<string>();
  const [selectedRoles, setSelectedRoles] = useState<RoleKind[]>([]);

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
      return { text: `${i} Service`, value: i };
    });

  if (rolesLoading || offersLoading || operatorLoading || identitiesLoading) {
    return null;
  }

  const partyOptions = identities.map(p => {
    return { text: p.payload.legalName, value: p.payload.customer };
  });

  const parties = retrieveParties(publicParty);

  const hasRole = !!allRoles.find(
    role =>
      selectedRoles.includes(role.roleKind) && role.contract.payload.provider === selectedParty
  );

  return (
    <>
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
          label={<p className="input-label">Provides:</p>}
          placeholder="Select..."
          multiple
          value={selectedRoles || []}
          onChange={(_, data: any) => setSelectedRoles(data.value)}
          options={roleOptions}
        />
      </Form>
      <div className="page-row submit-actions ">
        <Button
          disabled={selectedRoles.length === 0 || !selectedParty || hasRole}
          className="ghost"
          onClick={() => {
            if (!!selectedParty && selectedRoles.length > 0) {
              createRoleContract(selectedParty, selectedRoles);
            }
          }}
        >
          Assign
        </Button>
        <Button
          disabled={selectedRoles.length === 0 || !selectedParty || !hasRole}
          className="ghost"
          onClick={() => {
            if (!!selectedParty && selectedRoles.length > 0) {
              handleTerminateRole();
            }
          }}
        >
          Remove
        </Button>
      </div>
    </>
  );

  async function handleTerminateRole() {
    const roles = allRoles.filter(
      role =>
        selectedRoles.includes(role.roleKind) && role.contract.payload.provider === selectedParty
    );
    if (roles.length > 0) {
      await Promise.all(roles.map(async role => terminateRole(role, ledger)));
      setSelectedRoles([]);
    }
  }

  async function createRoleContract(partyId: string, roles: RoleKind[]) {
    const provider = { provider: partyId };
    const token = isHubDeployment
      ? parties.find(p => p.party === partyId)?.token
      : computeLocalToken(partyId);
    if (!token) {
      setSelectedParty(undefined);
      setSelectedRoles([]);
      return;
    }
    await Promise.all(
      roles.map(async role => {
        if (
          findExistingRoleOffer(partyId, role as RoleKind) ||
          findExistingRole(partyId, role as RoleKind)
        ) {
          return;
        }
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
      })
    );
  }

  async function doCreate(
    choice: Choice<OperatorService, any, ContractId<any>, string>,
    provider: { provider: string }
  ) {
    const operatorServiceContract = operatorService[0];
    return await ledger.exercise(choice, operatorServiceContract.contractId, provider).then(_ => {
      setSelectedParty(undefined);
      setSelectedRoles([]);
    });
  }

  async function handleDeployment(token: string, autoName: string) {
    if (!isHubDeployment) {
      return;
    }
    const trigger = allTriggers.find(auto => auto.startsWith(autoName));

    if (trigger) {
      const [name, hash] = trigger.split('#');

      if (hash && deployAutomation) {
        deployAutomation(hash, name);
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

export default ConfigureProviders;
