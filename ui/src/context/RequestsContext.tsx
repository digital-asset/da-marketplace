import React, { useEffect, useState } from 'react';

import { CreateEvent } from '@daml/ledger';

import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/module';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service/module';
import { Request as MarketClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service/module';
import { Request as AuctionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service/module';
import { Request as BiddingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service/module';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service/module';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service/module';
import { Request as TradingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module';
import { Request as RegulatorRequest } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service/module';

import { Request as TradingRoleRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Request as SettlementRequest } from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import { Request as DistributionRoleRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import { Request as CustodyRoleRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Request as ClearingRoleRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';

import { useStreamQueries } from '../Main';
import { ServiceKind } from './ServicesContext';
import { RoleKind } from './RolesContext';

type RoleRequestContract =
  | CreateEvent<ClearingRoleRequest>
  | CreateEvent<DistributionRoleRequest>
  | CreateEvent<CustodyRoleRequest>
  | CreateEvent<SettlementRequest>
  | CreateEvent<ClearingRoleRequest>;

type RoleRequest = {
  contract: RoleRequestContract;
  role: RoleKind;
};

type ServiceRequestContract =
  | CreateEvent<CustodyRequest>
  | CreateEvent<ClearingRequest>
  | CreateEvent<MarketClearingRequest>
  | CreateEvent<AuctionRequest>
  | CreateEvent<BiddingRequest>
  | CreateEvent<IssuanceRequest>
  | CreateEvent<ListingRequest>
  | CreateEvent<TradingRequest>;

type ServiceRequest = {
  contract: ServiceRequestContract;
  service: ServiceKind;
};

type RequestsState = {
  serviceRequests: ServiceRequest[];
  roleRequests: RoleRequest[];
  loading: boolean;
};

const RequestsStateContext = React.createContext<RequestsState>({
  roleRequests: [],
  serviceRequests: [],
  loading: false,
});

const RequestsProvider: React.FC = ({ children }) => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { contracts: clearingRequest, loading: clearingLoading } =
    useStreamQueries(ClearingRequest);
  const { contracts: marketClearingRequest, loading: marketClearingLoading } =
    useStreamQueries(MarketClearingRequest);
  const { contracts: custodyRequest, loading: custodyLoading } = useStreamQueries(CustodyRequest);
  const { contracts: auctionRequest, loading: auctionLoading } = useStreamQueries(AuctionRequest);
  const { contracts: biddingRequest, loading: biddingLoading } = useStreamQueries(BiddingRequest);
  const { contracts: issuanceRequest, loading: issuanceLoading } =
    useStreamQueries(IssuanceRequest);
  const { contracts: listingRequest, loading: listingLoading } = useStreamQueries(ListingRequest);
  const { contracts: tradingRequest, loading: tradingLoading } = useStreamQueries(TradingRequest);
  const { contracts: regulatorRequest, loading: regulatorLoading } =
    useStreamQueries(RegulatorRequest);

  const { contracts: clearingRoleRequest, loading: clearingRoleLoading } =
    useStreamQueries(ClearingRoleRequest);
  const { contracts: tradingRoleRequest, loading: tradingRoleLoading } =
    useStreamQueries(TradingRoleRequest);
  const { contracts: distributionRoleRequest, loading: distributionRoleLoading } =
    useStreamQueries(DistributionRoleRequest);
  const { contracts: custodyRoleRequest, loading: custodyRoleLoading } =
    useStreamQueries(CustodyRoleRequest);
  const { contracts: settlementRequest, loading: settlementLoading } =
    useStreamQueries(SettlementRequest);

  useEffect(
    () =>
      setLoading(
        custodyLoading ||
          clearingLoading ||
          marketClearingLoading ||
          auctionLoading ||
          biddingLoading ||
          issuanceLoading ||
          listingLoading ||
          tradingLoading ||
          clearingRoleLoading ||
          tradingRoleLoading ||
          distributionRoleLoading ||
          custodyRoleLoading ||
          settlementLoading ||
          regulatorLoading
      ),
    [
      custodyLoading,
      clearingLoading,
      marketClearingLoading,
      auctionLoading,
      biddingLoading,
      issuanceLoading,
      listingLoading,
      tradingLoading,
      regulatorLoading,
      clearingRoleLoading,
      tradingRoleLoading,
      distributionRoleLoading,
      custodyRoleLoading,
      settlementLoading,
    ]
  );

  useEffect(
    () =>
      setServiceRequests([
        ...clearingRequest.map(c => ({ contract: c, service: ServiceKind.CLEARING })),
        ...marketClearingRequest.map(c => ({ contract: c, service: ServiceKind.MARKET_CLEARING })),
        ...custodyRequest.map(c => ({ contract: c, service: ServiceKind.CUSTODY })),
        ...auctionRequest.map(c => ({ contract: c, service: ServiceKind.AUCTION })),
        ...biddingRequest.map(c => ({ contract: c, service: ServiceKind.BIDDING })),
        ...issuanceRequest.map(c => ({ contract: c, service: ServiceKind.ISSUANCE })),
        ...listingRequest.map(c => ({ contract: c, service: ServiceKind.LISTING })),
        ...tradingRequest.map(c => ({ contract: c, service: ServiceKind.TRADING })),
        ...regulatorRequest.map(c => ({ contract: c, service: ServiceKind.REGULATOR })),
      ]),
    [
      clearingRequest,
      marketClearingRequest,
      custodyRequest,
      auctionRequest,
      biddingRequest,
      issuanceRequest,
      listingRequest,
      tradingRequest,
      regulatorRequest,
    ]
  );

  useEffect(
    () =>
      setRoleRequests([
        ...clearingRoleRequest.map(c => ({ contract: c, role: RoleKind.CLEARING })),
        ...settlementRequest.map(c => ({ contract: c, role: RoleKind.SETTLEMENT })),
        ...custodyRoleRequest.map(c => ({ contract: c, role: RoleKind.CUSTODY })),
        ...tradingRoleRequest.map(c => ({ contract: c, role: RoleKind.TRADING })),
        ...distributionRoleRequest.map(c => ({ contract: c, role: RoleKind.DISTRIBUTION })),
      ]),
    [
      clearingRoleRequest,
      custodyRoleRequest,
      tradingRoleRequest,
      settlementRequest,
      distributionRoleRequest,
    ]
  );

  return (
    <RequestsStateContext.Provider value={{ serviceRequests, roleRequests, loading }}>
      {children}
    </RequestsStateContext.Provider>
  );
};

function useServiceRequestKinds(): Set<ServiceKind> {
  const context = React.useContext<RequestsState>(RequestsStateContext);
  if (context === undefined) {
    throw new Error('useServiceRequestKinds  must be used within a ServicesProvider');
  }
  return context.serviceRequests.reduce((acc, v) => acc.add(v.service), new Set<ServiceKind>());
}

function useRoleRequestKinds(): Set<RoleKind> {
  const context = React.useContext<RequestsState>(RequestsStateContext);
  if (context === undefined) {
    throw new Error('useRoleRequestKinds must be used within a ServicesProvider');
  }
  return context.roleRequests.reduce((acc, v) => acc.add(v.role), new Set<RoleKind>());
}

export { RequestsProvider, useServiceRequestKinds, useRoleRequestKinds };
