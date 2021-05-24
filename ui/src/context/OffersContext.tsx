import React, { useEffect, useState } from 'react';

import { CreateEvent } from '@daml/ledger';

import { Offer as ClearingOffer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { Offer as CustodianOffer } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Offer as DistributorOffer } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import { Offer as SettlementOffer } from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import { Offer as ExchangeOffer } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Offer as MatchingOffer } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';

import { Offer as RegulatorOffer } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

import { Offer as MarketClearingServiceOffer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service';
import { Offer as CustodyServiceOffer } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { Offer as TradingServiceOffer } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import { Offer as IssuanceServiceOffer } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import { Offer as ListingServiceOffer } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Offer as ClearingServiceOffer } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';

import { useStreamQueries } from '../Main';
import { RoleKind } from './RolesContext';

export enum OfferServiceKind {
  CLEARING = 'Clearing',
  MARKET_CLEARING = 'Market Clearing',
  CUSTODY = 'Custody',
  TRADING = 'Trading',
  LISTING = 'Listing',
  ISSUANCE = 'Issuance',
}

type OfferRoleContract =
  | CreateEvent<ClearingOffer>
  | CreateEvent<RegulatorOffer>
  | CreateEvent<CustodianOffer>
  | CreateEvent<DistributorOffer>
  | CreateEvent<SettlementOffer>
  | CreateEvent<ExchangeOffer>
  | CreateEvent<MatchingOffer>;

type OfferServiceContract =
  | CreateEvent<MarketClearingServiceOffer>
  | CreateEvent<CustodyServiceOffer>
  | CreateEvent<TradingServiceOffer>
  | CreateEvent<IssuanceServiceOffer>
  | CreateEvent<ListingServiceOffer>
  | CreateEvent<ClearingServiceOffer>;

type OffersState = {
  roleOffers: RoleOffer[];
  serviceOffers: ServiceOffer[];
  loading: boolean;
};

type RoleOffer = {
  contract: OfferRoleContract;
  role: RoleKind;
};

type ServiceOffer = {
  contract: OfferServiceContract;
  service: OfferServiceKind;
};

const OffersStateContext = React.createContext<OffersState>({
  roleOffers: [],
  serviceOffers: [],
  loading: false,
});

const OffersProvider: React.FC = ({ children }) => {
  const [roleOffers, setRoleOffers] = useState<RoleOffer[]>([]);
  const [serviceOffers, setServiceOffers] = useState<ServiceOffer[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const { contracts: clearingOffers, loading: clearingOffersLoading } =
    useStreamQueries(ClearingOffer);
  const { contracts: regulatorServiceOffers, loading: regulatorServiceOffersLoading } =
    useStreamQueries(RegulatorOffer);
  const { contracts: custodianOffers, loading: custodianOffersLoading } =
    useStreamQueries(CustodianOffer);
  const { contracts: distributorOffers, loading: distributorOffersLoading } =
    useStreamQueries(DistributorOffer);
  const { contracts: settlementOffers, loading: settlementOffersLoading } =
    useStreamQueries(SettlementOffer);
  const { contracts: exhangeOffers, loading: exhangeOffersLoading } =
    useStreamQueries(ExchangeOffer);
  const { contracts: matchingOffers, loading: matchingOffersLoading } =
    useStreamQueries(MatchingOffer);

  const { contracts: clearingServiceOffers, loading: clearingServiceOffersLoading } =
    useStreamQueries(ClearingServiceOffer);
  const { contracts: marketClearingServiceOffers, loading: marketClearingServiceOffersLoading } =
    useStreamQueries(MarketClearingServiceOffer);
  const { contracts: custodyServiceOffers, loading: custodyServiceOffersLoading } =
    useStreamQueries(CustodyServiceOffer);
  const { contracts: tradingServiceOffers, loading: tradingServiceOffersLoading } =
    useStreamQueries(TradingServiceOffer);
  const { contracts: issuanceServiceOffers, loading: issuanceServiceOffersLoading } =
    useStreamQueries(IssuanceServiceOffer);
  const { contracts: listingServiceOffers, loading: listingServiceOffersLoading } =
    useStreamQueries(ListingServiceOffer);

  useEffect(() => {
    setLoading(
      clearingOffersLoading ||
        custodianOffersLoading ||
        distributorOffersLoading ||
        settlementOffersLoading ||
        exhangeOffersLoading ||
        matchingOffersLoading ||
        regulatorServiceOffersLoading ||
        custodyServiceOffersLoading ||
        clearingServiceOffersLoading ||
        marketClearingServiceOffersLoading ||
        tradingServiceOffersLoading ||
        issuanceServiceOffersLoading ||
        listingServiceOffersLoading
    );
  }, [
    clearingOffersLoading,
    custodianOffersLoading,
    distributorOffersLoading,
    settlementOffersLoading,
    exhangeOffersLoading,
    matchingOffersLoading,
    regulatorServiceOffersLoading,
    custodyServiceOffersLoading,
    clearingServiceOffersLoading,
    marketClearingServiceOffersLoading,
    tradingServiceOffersLoading,
    issuanceServiceOffersLoading,
    listingServiceOffersLoading,
  ]);

  useEffect(
    () =>
      setRoleOffers([
        ...clearingOffers.map(c => ({ contract: c, role: RoleKind.CLEARING })),
        ...regulatorServiceOffers.map(c => ({ contract: c, role: RoleKind.REGULATOR })),
        ...custodianOffers.map(c => ({ contract: c, role: RoleKind.CUSTODY })),
        ...distributorOffers.map(c => ({ contract: c, role: RoleKind.DISTRIBUTION })),
        ...settlementOffers.map(c => ({ contract: c, role: RoleKind.SETTLEMENT })),
        ...exhangeOffers.map(c => ({ contract: c, role: RoleKind.TRADING })),
        ...matchingOffers.map(c => ({ contract: c, role: RoleKind.MATCHING })),
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
  useEffect(
    () =>
      setServiceOffers([
        ...clearingServiceOffers.map(c => ({ contract: c, service: OfferServiceKind.CLEARING })),
        ...marketClearingServiceOffers.map(c => ({
          contract: c,
          service: OfferServiceKind.MARKET_CLEARING,
        })),
        ...custodyServiceOffers.map(c => ({ contract: c, service: OfferServiceKind.CUSTODY })),
        ...tradingServiceOffers.map(c => ({ contract: c, service: OfferServiceKind.TRADING })),
        ...issuanceServiceOffers.map(c => ({ contract: c, service: OfferServiceKind.ISSUANCE })),
        ...listingServiceOffers.map(c => ({ contract: c, service: OfferServiceKind.LISTING })),
      ]),
    [
      marketClearingServiceOffers,
      custodyServiceOffers,
      tradingServiceOffers,
      issuanceServiceOffers,
      listingServiceOffers,
      clearingServiceOffers,
    ]
  );

  return (
    <OffersStateContext.Provider value={{ roleOffers, serviceOffers, loading }}>
      {children}
    </OffersStateContext.Provider>
  );
};

function useOffers() {
  const context = React.useContext<OffersState>(OffersStateContext);
  if (context === undefined) {
    throw new Error('useOffersContext must be used within a OffersProvider');
  }
  return context;
}

export { OffersProvider, useOffers };
