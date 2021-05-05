import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { CreateEvent } from '@daml/ledger';

import { Offer as ClearingOffer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { Offer as CustodianOffer } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Offer as DistributorOffer } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import { Offer as SettlementOffer } from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import { Offer as ExchangeOffer } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Offer as MatchingOffer } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';

import { Offer as RegulatorOffer } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

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

type OfferContract =
  | CreateEvent<ClearingOffer>
  | CreateEvent<RegulatorOffer>
  | CreateEvent<CustodianOffer>
  | CreateEvent<DistributorOffer>
  | CreateEvent<SettlementOffer>
  | CreateEvent<ExchangeOffer>
  | CreateEvent<MatchingOffer>;

type OffersState = {
  offers: Offer[];
  loading: boolean;
};

type Offer = {
  contract: OfferContract;
  role: ServiceKind;
};

const OffersStateContext = React.createContext<OffersState>({
  offers: [],
  loading: false,
});

const OffersProvider: React.FC = ({ children }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { contracts: clearingOffers, loading: clearingOffersLoading } = useStreamQueries(
    ClearingOffer
  );
  const {
    contracts: regulatorServiceOffers,
    loading: regulatorServiceOffersLoading,
  } = useStreamQueries(RegulatorOffer);
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

  useEffect(() => {
    setLoading(
      clearingOffersLoading ||
        custodianOffersLoading ||
        distributorOffersLoading ||
        settlementOffersLoading ||
        exhangeOffersLoading ||
        matchingOffersLoading ||
        regulatorServiceOffersLoading
    );
  }, [
    clearingOffersLoading,
    custodianOffersLoading,
    distributorOffersLoading,
    settlementOffersLoading,
    exhangeOffersLoading,
    matchingOffersLoading,
    regulatorServiceOffersLoading,
  ]);

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
    <OffersStateContext.Provider value={{ offers, loading }}>
      {children}
    </OffersStateContext.Provider>
  );
};

function useOffersContext() {
  const context = React.useContext<OffersState>(OffersStateContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolessProvider');
  }
  return context;
}

export { OffersProvider, useOffersContext };
