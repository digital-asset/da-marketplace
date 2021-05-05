import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { CreateEvent } from '@daml/ledger';
import { Template } from '@daml/types';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import {
  Offer as ClearingOffer,
  Role as ClearingRole,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import {
  Offer as CustodianOffer,
  Role as CustodianRole,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import {
  Offer as DistributorOffer,
  Role as DistributorRole,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import {
  Offer as SettlementOffer,
  Service as SettlementService,
} from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import {
  Offer as ExchangeOffer,
  Role as ExchangeRole,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import {
  Offer as MatchingOffer,
  Service as MatchingService,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';

import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';

import {
  Offer as RegulatorServiceOffer,
  Service as RegulatorService,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

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

type OfferContract =
  | CreateEvent<ClearingOffer>
  | CreateEvent<RegulatorServiceOffer>
  | CreateEvent<CustodianOffer>
  | CreateEvent<DistributorOffer>
  | CreateEvent<SettlementOffer>
  | CreateEvent<ExchangeOffer>
  | CreateEvent<MatchingOffer>;

type Role = {
  contract: RoleContract;
  role: ServiceKind;
};

type RolesState = {
  roles: Role[];
  offers: Offer[];
  loading: boolean;
};

type Offer = {
  contract: OfferContract;
  role: ServiceKind;
};

const RolesStateContext = React.createContext<RolesState>({
  roles: [],
  offers: [],
  loading: false,
});

const RolesProvider: React.FC = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [offers, setOffers] = useState<Role[]>([]);

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

  const { contracts: clearingOffers, loading: clearingOffersLoading } = useStreamQueries(
    ClearingOffer
  );
  const {
    contracts: regulatorServiceOffers,
    loading: regulatorServiceOffersLoading,
  } = useStreamQueries(RegulatorServiceOffer);
  const { contracts: custodianOffers, loading: custodianOffersLoading } = useStreamQueries(
    CustodianOffer
  );
  const { contracts: distributorOffers, loading: distributorOffersLoading } = useStreamQueries(
    DistributorOffer
  );
  const { contracts: settlementOffers, loading: settlementOffersLoading } = useStreamQueries(
    SettlementOffer
  );
  const { contracts: exhangeOffers, loading: exhangeOffersLoading } = useStreamQueries(
    ExchangeOffer
  );
  const { contracts: matchingOffers, loading: matchingOffersLoading } = useStreamQueries(
    MatchingOffer
  );

  const { contracts: verifiedIdentities, loading: verifiedIdentitiesLoading } = useStreamQueries(
    VerifiedIdentity
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
        operatorServiceLoading ||
        clearingOffersLoading ||
        custodianOffersLoading ||
        distributorOffersLoading ||
        settlementOffersLoading ||
        exhangeOffersLoading ||
        matchingOffersLoading ||
        verifiedIdentitiesLoading
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
    clearingOffersLoading,
    custodianOffersLoading,
    distributorOffersLoading,
    settlementOffersLoading,
    exhangeOffersLoading,
    matchingOffersLoading,
    verifiedIdentitiesLoading,
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

  useEffect(
    () =>
      setOffers([
        ...clearingOffers.map(c => ({ contract: c, role: ServiceKind.CLEARING })),
        ...regulatorServiceOffers.map(c => ({ contract: c, role: ServiceKind.REGULATOR })),
        ...custodianOffers.map(c => ({ contract: c, role: ServiceKind.CUSTODY })),
        ...distributorOffers.map(c => ({ contract: c, role: ServiceKind.DISTRIBUTION })),
        ...settlementOffers.map(c => ({ contract: c, role: ServiceKind.SETTLEMENT })),
        ...exhangeOffers.map(c => ({ contract: c, role: ServiceKind.TRADING })),
        ...matchingOffers.map(c => ({ contract: c, role: ServiceKind.MATCHING })),
      ]),
    [
      clearingOffers,
      regulatorServiceOffers,
      custodianOffers,
      distributorOffers,
      settlementOffers,
      exhangeOffers,
      matchingOffers,
    ]
  );
  return (
    <RolesStateContext.Provider value={{ roles, offers, loading }}>
      {children}
    </RolesStateContext.Provider>
  );
};

function useRoles() {
  const context = React.useContext<RolesState>(RolesStateContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolessProvider');
  }
  return {roles: context.roles, loading: context.loading};
}

function useOffers() {
  const context = React.useContext<RolesState>(RolesStateContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolessProvider');
  }
  return {offers: context.offers, loading: context.loading};
}

export { RolesProvider, useRoles, useOffers };
