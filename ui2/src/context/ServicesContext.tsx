import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import { CreateEvent } from '@daml/ledger';
import { Template } from '@daml/types';

import {
  Service as CustodyService,
  Offer as CustodyOffer,
  Request as CustodyRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/module';
import {
  Service as ClearingService,
  Offer as ClearingOffer,
  Request as ClearingRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service/module';
import {
  Service as MarketClearingService,
  Offer as MarketClearingOffer,
  Request as MarketClearingRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service/module';
import {
  Service as AuctionService,
  Request as AuctionRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service/module';
import {
  Service as BiddingService,
  Request as BiddingRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service/module';
import {
  Service as IssuanceService,
  Request as IssuanceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service/module';
import {
  Service as ListingService,
  Request as ListingRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service/module';
import {
  Service as TradingService,
  Offer as TradingOffer,
  Request as TradingRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module';
import {
  Service as RegulatorService,
  Request as RegulatorRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service/module';

import { Role as TradingRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Role as CustodyRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';

import { useStreamQueries } from '../Main';

export enum ServiceKind {
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

export type ServiceRoleOfferChoice =
  | typeof ClearingRole.OfferClearingService
  | typeof ClearingRole.OfferMarketService
  | typeof TradingRole.OfferTradingService
  | typeof TradingRole.OfferListingService
  | typeof CustodyRole.OfferIssuanceService
  | typeof CustodyRole.OfferCustodyService;

export type ServiceRequest = Template<ServiceRequestTemplates, undefined, string>;

export type ServiceRequestTemplates =
  | CustodyRequest
  | ClearingRequest
  | MarketClearingRequest
  | AuctionRequest
  | BiddingRequest
  | IssuanceRequest
  | ListingRequest
  | TradingRequest;

export type ServiceOffer = Template<ServiceOfferTemplates, undefined, string>;
export type ServiceOfferTemplates = TradingOffer;

type ServiceContract =
  | CreateEvent<CustodyService>
  | CreateEvent<ClearingService>
  | CreateEvent<MarketClearingService>
  | CreateEvent<AuctionService>
  | CreateEvent<BiddingService>
  | CreateEvent<IssuanceService>
  | CreateEvent<ListingService>
  | CreateEvent<TradingService>;

type Service = {
  contract: ServiceContract;
  service: ServiceKind;
};

type ServicesState = {
  services: Service[];
  loading: boolean;
};

const ServicesStateContext = React.createContext<ServicesState>({ services: [], loading: false });

const ServicesProvider: React.FC = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { contracts: clearingService, loading: clearingLoading } = useStreamQueries(
    ClearingService
  );
  const { contracts: marketClearingService, loading: marketClearingLoading } = useStreamQueries(
    MarketClearingService
  );
  const { contracts: custodyService, loading: custodyLoading } = useStreamQueries(CustodyService);
  const { contracts: auctionService, loading: auctionLoading } = useStreamQueries(AuctionService);
  const { contracts: biddingService, loading: biddingLoading } = useStreamQueries(BiddingService);
  const { contracts: issuanceService, loading: issuanceLoading } = useStreamQueries(
    IssuanceService
  );
  const { contracts: listingService, loading: listingLoading } = useStreamQueries(ListingService);
  const { contracts: tradingService, loading: tradingLoading } = useStreamQueries(TradingService);
  const { contracts: regulatorService, loading: regulatorLoading } = useStreamQueries(
    RegulatorService
  );

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
      setServices([
        ...clearingService.map(c => ({ contract: c, service: ServiceKind.CLEARING })),
        ...marketClearingService.map(c => ({ contract: c, service: ServiceKind.MARKET_CLEARING })),
        ...custodyService.map(c => ({ contract: c, service: ServiceKind.CUSTODY })),
        ...auctionService.map(c => ({ contract: c, service: ServiceKind.AUCTION })),
        ...biddingService.map(c => ({ contract: c, service: ServiceKind.BIDDING })),
        ...issuanceService.map(c => ({ contract: c, service: ServiceKind.ISSUANCE })),
        ...listingService.map(c => ({ contract: c, service: ServiceKind.LISTING })),
        ...tradingService.map(c => ({ contract: c, service: ServiceKind.TRADING })),
        ...regulatorService.map(c => ({ contract: c, service: ServiceKind.REGULATOR })),
      ]),
    [
      clearingService,
      marketClearingService,
      custodyService,
      auctionService,
      biddingService,
      issuanceService,
      listingService,
      tradingService,
      regulatorService,
    ]
  );

  return (
    <ServicesStateContext.Provider value={{ services, loading }}>
      {children}
    </ServicesStateContext.Provider>
  );
};

type GroupedCustomerServices = {
  provider: string;
  services: ServiceKind[];
  contracts: ServiceContract[];
}[];

/* Retrieve all providers who are providing you, the customer, a service */
function useProviderServices(party: string): GroupedCustomerServices {
  const context = React.useContext<ServicesState>(ServicesStateContext);
  if (context === undefined) {
    throw new Error('useProviderServices  must be used within a ServicesProvider');
  }

  return context.services
    .filter(s => s.contract.payload.customer === party)
    .reduce((acc, service) => {
      const providerDetails = acc.find(i => i.provider === service.contract.payload.provider);

      const provider = providerDetails?.provider || service.contract.payload.provider;
      const services = _.concat(_.compact(providerDetails?.services), service.service);
      const contracts = _.concat(_.compact(providerDetails?.contracts), service.contract);

      return [
        ...acc.filter(i => i.provider !== service.contract.payload.provider),
        { provider, services, contracts },
      ];
    }, [] as GroupedCustomerServices);
}

/* Retrieve all customers who are using services provided by you */
function useCustomerServices(party: string) {
  const context = React.useContext<ServicesState>(ServicesStateContext);
  if (context === undefined) {
    throw new Error('useCustomerServices must be used within a ServicesProvider');
  }
  return context.services.filter(s => s.contract.payload.provider === party);
}

export { ServicesProvider, useProviderServices, useCustomerServices };
