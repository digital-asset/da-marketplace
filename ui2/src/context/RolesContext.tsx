import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { CreateEvent } from '@daml/ledger';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { Role as CustodianRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Role as DistributorRole } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import { Service as SettlementService } from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import { Role as ExchangeRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Service as MatchingService } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';

import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';

import { Service as RegulatorService } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

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
  | CreateEvent<RegulatorRole>;

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
  const { contracts: regulatorServices, loading: regulatorServicesLoading } = useStreamQueries(
    RegulatorService
  );
  const { contracts: settlementServices, loading: settlementServicesLoading } = useStreamQueries(
    SettlementService
  );
  const { contracts: matchingServices, loading: matchingServicesLoading } = useStreamQueries(
    MatchingService
  );
  const { contracts: operatorService, loading: operatorServiceLoading } = useStreamQueries(
    OperatorService
  );

  useEffect(() => {
    setLoading(
      custodianRolesLoading ||
        clearingRolesLoading ||
        regulatorRolesLoading ||
        regulatorServicesLoading ||
        distributorRolesLoading ||
        settlementServicesLoading ||
        exchangeRolesLoading ||
        matchingServicesLoading ||
        operatorServiceLoading
    );
  }, [
    custodianRolesLoading,
    clearingRolesLoading,
    regulatorRolesLoading,
    regulatorServicesLoading,
    distributorRolesLoading,
    settlementServicesLoading,
    exchangeRolesLoading,
    matchingServicesLoading,
    operatorServiceLoading,
  ]);

  useEffect(
    () =>
      setRoles([
        ...clearingRoles.map(c => ({ contract: c, role: ServiceKind.CLEARING })),
        ...custodianRoles.map(c => ({ contract: c, role: ServiceKind.CUSTODY })),
        ...exchangeRoles.map(c => ({ contract: c, role: ServiceKind.TRADING })),
        ...distributorRoles.map(c => ({ contract: c, role: ServiceKind.DISTRIBUTION })),
        ...regulatorRoles.map(c => ({ contract: c, role: ServiceKind.REGULATOR })),
      ]),
    [clearingRoles, custodianRoles, exchangeRoles, distributorRoles, regulatorRoles]
  );

  return (
    <RolesStateContext.Provider value={{ roles, loading }}>{children}</RolesStateContext.Provider>
  );
};

function useRoles() {
  const context = React.useContext<RolesState>(RolesStateContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolessProvider');
  }
  return { roles: context.roles, loading: context.loading };
}

export { RolesProvider, useRoles };
