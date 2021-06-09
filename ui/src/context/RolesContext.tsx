import React, { useEffect, useState } from 'react';

import Ledger, { CreateEvent } from '@daml/ledger';

import {
  Role as ClearingRole,
  Request as ClearingRequest,
  Offer as ClearingOffer,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import {
  Role as CustodianRole,
  Request as CustodianRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import {
  Role as DistributorRole,
  Request as DistributorRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import {
  Service as SettlementService,
  Request as SettlementRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import {
  Role as ExchangeRole,
  Request as ExchangeRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import {
  Service as MatchingService,
  Request as MatchingRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';

import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';

import { useStreamQueries } from '../Main';
import { Template, Party, ContractId } from '@daml/types';

export enum RoleKind {
  CLEARING = 'Clearing',
  CLEARING_PENDING = 'Clearing (pending)',
  CUSTODY = 'Custody',
  TRADING = 'Exchange',
  MATCHING = 'Matching',
  SETTLEMENT = 'Settlement',
  REGULATOR = 'Regulator',
  DISTRIBUTION = 'Distribution',
}

type RoleContract =
  | CreateEvent<ClearingRole>
  | CreateEvent<CustodianRole>
  | CreateEvent<ExchangeRole>
  | CreateEvent<DistributorRole>
  | CreateEvent<RegulatorRole>
  | CreateEvent<SettlementService>
  | CreateEvent<MatchingService>;

export type RoleRequest = Template<RoleRequestTemplates, undefined, string>;

export type RoleRequestTemplates =
  | CustodianRequest
  | ClearingRequest
  | ExchangeRequest
  | DistributorRequest
  | SettlementRequest
  | MatchingRequest;

export type Role = {
  contract: RoleContract;
  roleKind: RoleKind;
};

export const terminateRole = async (role: Role, ledger: Ledger) => {
  const cid = role.contract.contractId;

  switch (role.roleKind) {
    case RoleKind.CLEARING:
      ledger.exercise(ClearingRole.TerminateRole, cid, {});
      break;
    case RoleKind.CLEARING_PENDING:
      ledger.archive(ClearingOffer, cid as ContractId<ClearingOffer>);
      break;
    case RoleKind.CUSTODY:
      ledger.exercise(CustodianRole.TerminateRole, cid, {});
      break;
    case RoleKind.TRADING:
      ledger.exercise(ExchangeRole.TerminateRole, cid, {});
      break;
    case RoleKind.DISTRIBUTION:
      ledger.exercise(DistributorRole.TerminateRole, cid, {});
      break;
    case RoleKind.REGULATOR:
      ledger.exercise(RegulatorRole.TerminateRole, cid, {});
      break;
    case RoleKind.SETTLEMENT:
      ledger.exercise(SettlementService.Terminate, cid, {});
      break;
    case RoleKind.MATCHING:
      ledger.exercise(MatchingService.Terminate, cid, {});
      break;
    default:
      throw new Error(`Unsupported Role Kind ${role.roleKind}`);
  }
};

type RolesState = {
  roles: Role[];
  loading: boolean;
};

const RolesStateContext = React.createContext<RolesState>({
  roles: [],
  loading: false,
});

const RolesProvider: React.FC = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { contracts: clearingRoles, loading: clearingRolesLoading } =
    useStreamQueries(ClearingRole);
  const { contracts: custodianRoles, loading: custodianRolesLoading } =
    useStreamQueries(CustodianRole);
  const { contracts: exchangeRoles, loading: exchangeRolesLoading } =
    useStreamQueries(ExchangeRole);
  const { contracts: distributorRoles, loading: distributorRolesLoading } =
    useStreamQueries(DistributorRole);
  const { contracts: settlementServices, loading: settlementServicesLoading } =
    useStreamQueries(SettlementService);
  const { contracts: matchingServices, loading: matchingServicesLoading } =
    useStreamQueries(MatchingService);

  useEffect(() => {
    setLoading(
      custodianRolesLoading ||
        clearingRolesLoading ||
        distributorRolesLoading ||
        exchangeRolesLoading ||
        matchingServicesLoading ||
        settlementServicesLoading
    );
  }, [
    custodianRolesLoading,
    clearingRolesLoading,
    distributorRolesLoading,
    exchangeRolesLoading,
    matchingServicesLoading,
    settlementServicesLoading,
  ]);

  useEffect(
    () =>
      setRoles([
        ...clearingRoles.map(c => ({ contract: c, roleKind: RoleKind.CLEARING })),
        ...custodianRoles.map(c => ({ contract: c, roleKind: RoleKind.CUSTODY })),
        ...exchangeRoles.map(c => ({ contract: c, roleKind: RoleKind.TRADING })),
        ...distributorRoles.map(c => ({ contract: c, roleKind: RoleKind.DISTRIBUTION })),
        ...settlementServices.map(c => ({ contract: c, roleKind: RoleKind.SETTLEMENT })),
        ...matchingServices.map(c => ({ contract: c, roleKind: RoleKind.MATCHING })),
      ]),
    [
      clearingRoles,
      custodianRoles,
      exchangeRoles,
      distributorRoles,
      settlementServices,
      matchingServices,
    ]
  );

  return (
    <RolesStateContext.Provider value={{ roles, loading }}>{children}</RolesStateContext.Provider>
  );
};

function usePartyRoleKinds(party: Party): Set<RoleKind> {
  const context = React.useContext<RolesState>(RolesStateContext);
  if (context === undefined) {
    throw new Error('usePartyRoleKinds must be used within a RolesProvider');
  }
  return context.roles
    .filter(r => r.contract.payload.provider === party)
    .reduce((acc, v) => acc.add(v.roleKind), new Set<RoleKind>());
}

function useRoleKinds(): Set<RoleKind> {
  const context = React.useContext<RolesState>(RolesStateContext);
  if (context === undefined) {
    throw new Error('useRoleKinds must be used within a RolesProvider');
  }
  return context.roles.reduce((acc, v) => acc.add(v.roleKind), new Set<RoleKind>());
}

function useProvidersByRole(): Map<RoleKind, [RoleContract]> {
  const context = React.useContext<RolesState>(RolesStateContext);
  if (context === undefined) {
    throw new Error('useProvidersByRole must be used within a RolesProvider');
  }
  let map = new Map<RoleKind, [RoleContract]>();
  context.roles.forEach(r => {
    if (map.has(r.roleKind)) {
      map.get(r.roleKind)?.push(r.contract);
    } else {
      map.set(r.roleKind, [r.contract]);
    }
  });
  return map;
}

function useRolesContext() {
  const context = React.useContext<RolesState>(RolesStateContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
}

export { RolesProvider, useRolesContext, useRoleKinds, usePartyRoleKinds, useProvidersByRole };
