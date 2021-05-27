import React, { useEffect, useState } from 'react';

import { CreateEvent } from '@daml/ledger';
import { Template } from '@daml/types';

import { Request as CustodyRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/module';
import { Request as ClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service/module';
import { Request as MarketClearingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service/module';
import { Request as AuctionRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service/module';
import { Request as BiddingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service/module';
import { Request as IssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service/module';
import { Request as ListingRequest } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service/module';
import {
  Offer as TradingOffer,
  Request as TradingRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module';
import { Request as RegulatorRequest } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service/module';

import { Role as TradingRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Role as CustodyRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';

import { useStreamQueries } from '../Main';

enum ServiceKind {
  CUSTODY = 'Custody',
  MARKET_CLEARING = 'Market Clearing',
  AUCTION = 'Auction',
  BIDDING = 'Bidding',
  ISSUANCE = 'Issuance',
  LISTING = 'Listing',
  TRADING = 'Trading',
  CLEARING = 'Clearing',
  MATCHING = 'Matching',
  SETTLEMENT = 'Settlement',
  DISTRIBUTOR = 'Distributor',
  REGULATOR = 'Regulator',
}

// Do we want to keep this?
// ts-prune-ignore-next
export type ServiceRoleOfferChoice =
  | typeof ClearingRole.OfferClearingService
  | typeof ClearingRole.OfferMarketService
  | typeof TradingRole.OfferTradingService
  | typeof TradingRole.OfferListingService
  | typeof CustodyRole.OfferIssuanceService
  | typeof CustodyRole.OfferCustodyService;

// Do we want to keep this?
// ts-prune-ignore-next
export type ServiceRequest = Template<ServiceRequestTemplates, undefined, string>;

type ServiceRequestTemplates =
  | CustodyRequest
  | ClearingRequest
  | MarketClearingRequest
  | AuctionRequest
  | BiddingRequest
  | IssuanceRequest
  | ListingRequest
  | TradingRequest;

// Do we want to keep this?
// ts-prune-ignore-next
export type ServiceOffer = Template<ServiceOfferTemplates, undefined, string>;

type ServiceOfferTemplates = TradingOffer;

type RequestContract =
  | CreateEvent<CustodyRequest>
  | CreateEvent<ClearingRequest>
  | CreateEvent<MarketClearingRequest>
  | CreateEvent<AuctionRequest>
  | CreateEvent<BiddingRequest>
  | CreateEvent<IssuanceRequest>
  | CreateEvent<ListingRequest>
  | CreateEvent<TradingRequest>;

type Request = {
  contract: RequestContract;
  service: ServiceKind;
};

type RequestsState = {
  requests: Request[];
  loading: boolean;
};

const RequestsStateContext = React.createContext<RequestsState>({ requests: [], loading: false });

const RequestsProvider: React.FC = ({ children }) => {
  const [requests, setRequests] = useState<Request[]>([]);
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
    ]
  );

  useEffect(
    () =>
      setRequests([
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

  return (
    <RequestsStateContext.Provider value={{ requests, loading }}>
      {children}
    </RequestsStateContext.Provider>
  );
};

function useRequestKinds(): Set<ServiceKind> {
  const context = React.useContext<RequestsState>(RequestsStateContext);
  if (context === undefined) {
    throw new Error('useProviderServices  must be used within a ServicesProvider');
  }
  return context.requests.reduce((acc, v) => acc.add(v.service), new Set<ServiceKind>());
}

export { RequestsProvider, useRequestKinds };
