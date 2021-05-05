import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { CreateEvent } from '@daml/ledger';

import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { Role as CustodianRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Role as DistributorRole } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import { Service as SettlementService } from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import { Role as ExchangeRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Service as MatchingService } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';

import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';

import { useStreamQueries } from '../Main';

enum ServiceKind {
  CLEARING = 'Clearing',
  CUSTODY = 'Custody',
  TRADING = 'Trading',
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

type Role = {
  contract: RoleContract;
  role: ServiceKind;
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
  const [operatorRole, setOperatorRole] = useState([]);

  const [loading, setLoading] = useState<boolean>(false);

  const { contracts: clearingRoles, loading: clearingRolesLoading } = useStreamQueries(
    ClearingRole
  );
  const { contracts: custodianRoles, loading: custodianRolesLoading } = useStreamQueries(
    CustodianRole
  );
  const { contracts: exchangeRoles, loading: exchangeRolesLoading } = useStreamQueries(
    ExchangeRole
  );
  const { contracts: distributorRoles, loading: distributorRolesLoading } = useStreamQueries(
    DistributorRole
  );
  const { contracts: regulatorRoles, loading: regulatorRolesLoading } = useStreamQueries(
    RegulatorRole
  );
  const { contracts: settlementServices, loading: settlementServicesLoading } = useStreamQueries(
    SettlementService
  );
  const { contracts: matchingServices, loading: matchingServicesLoading } = useStreamQueries(
    MatchingService
  );

  useEffect(() => {
    setLoading(
      custodianRolesLoading ||
        clearingRolesLoading ||
        regulatorRolesLoading ||
        distributorRolesLoading ||
        exchangeRolesLoading ||
        matchingServicesLoading ||
        settlementServicesLoading
    );
  }, [
    custodianRolesLoading,
    clearingRolesLoading,
    regulatorRolesLoading,
    distributorRolesLoading,
    exchangeRolesLoading,
    matchingServicesLoading,
    settlementServicesLoading,
  ]);

  useEffect(
    () =>
      setRoles([
        ...clearingRoles.map(c => ({ contract: c, role: ServiceKind.CLEARING })),
        ...custodianRoles.map(c => ({ contract: c, role: ServiceKind.CUSTODY })),
        ...exchangeRoles.map(c => ({ contract: c, role: ServiceKind.TRADING })),
        ...distributorRoles.map(c => ({ contract: c, role: ServiceKind.DISTRIBUTION })),
        ...regulatorRoles.map(c => ({ contract: c, role: ServiceKind.REGULATOR })),
        ...settlementServices.map(c => ({ contract: c, role: ServiceKind.SETTLEMENT })),
        ...matchingServices.map(c => ({ contract: c, role: ServiceKind.MATCHING })),
      ]),
    [
      clearingRoles,
      custodianRoles,
      exchangeRoles,
      distributorRoles,
      regulatorRoles,
      operatorRole,
      settlementServices,
      matchingServices,
    ]
  );

  return (
    <RolesStateContext.Provider value={{ roles, loading }}>{children}</RolesStateContext.Provider>
  );
};

function useRolesContext() {
  const context = React.useContext<RolesState>(RolesStateContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolessProvider');
  }
  return context;
}

export { RolesProvider, useRolesContext };
