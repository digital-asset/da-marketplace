import React, { useEffect, useState } from 'react';

import { CreateEvent } from '@daml/ledger';

import {
  Role as ClearingRole,
  Request as ClearingRequest,
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
import { Template, Party } from '@daml/types';

export enum RoleKind {
  CLEARING = 'Clearing',
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

type Role = {
  contract: RoleContract;
  role: RoleKind;
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
        ...clearingRoles.map(c => ({ contract: c, role: RoleKind.CLEARING })),
        ...custodianRoles.map(c => ({ contract: c, role: RoleKind.CUSTODY })),
        ...exchangeRoles.map(c => ({ contract: c, role: RoleKind.TRADING })),
        ...distributorRoles.map(c => ({ contract: c, role: RoleKind.DISTRIBUTION })),
        ...settlementServices.map(c => ({ contract: c, role: RoleKind.SETTLEMENT })),
        ...matchingServices.map(c => ({ contract: c, role: RoleKind.MATCHING })),
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
    .reduce((acc, v) => acc.add(v.role), new Set<RoleKind>());
}

function useRoleKinds(): Set<RoleKind> {
  const context = React.useContext<RolesState>(RolesStateContext);
  if (context === undefined) {
    throw new Error('useRoleKinds must be used within a RolesProvider');
  }
  return context.roles.reduce((acc, v) => acc.add(v.role), new Set<RoleKind>());
}

function useProvidersByRole(): Map<RoleKind, [RoleContract]> {
  const context = React.useContext<RolesState>(RolesStateContext);
  if (context === undefined) {
    throw new Error('useProvidersByRole must be used within a RolesProvider');
  }
  let map = new Map<RoleKind, [RoleContract]>();
  context.roles.forEach(r => {
    if (map.has(r.role)) {
      map.get(r.role)?.push(r.contract);
    } else {
      map.set(r.role, [r.contract]);
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
