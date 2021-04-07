import React, { useEffect, useState } from "react";

import { Service as CustodyService, Request as CustodyRequest } from "@daml.js/da-marketplace/lib/Marketplace/Custody/Service/module";
import { Service as AuctionService, Request as AuctionRequest } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service/module";
import { Service as BiddingService, Request as BiddingRequest } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service/module";
import { Service as IssuanceService, Request as IssuanceRequest } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/Service/module";
import { Service as ListingService, Request as ListingRequest } from "@daml.js/da-marketplace/lib/Marketplace/Listing/Service/module";
import { Service as TradingService, Request as TradingRequest } from "@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module";
import { useParty, useStreamQueries } from "@daml/react";
import { CreateEvent } from "@daml/ledger";
import { Template } from "@daml/types";

const ServicesStateContext = React.createContext<ServicesState>({ services: [] });

export enum ServiceKind {
  CUSTODY = "Custody",
  AUCTION = "Auction",
  BIDDING = "Bidding",
  ISSUANCE = "Issuance",
  LISTING = "Listing",
  TRADING = "Trading"
}

export type ServiceRequest = Template<ServiceRequestTemplates, undefined, string>;

export type ServiceRequestTemplates =
  CustodyRequest |
  AuctionRequest |
  BiddingRequest |
  IssuanceRequest |
  ListingRequest |
  TradingRequest;

type ServiceRequestTemplates2 =
  typeof CustodyRequest |
  typeof AuctionRequest |
  typeof BiddingRequest |
  typeof IssuanceRequest |
  typeof ListingRequest |
  typeof TradingRequest;

type ServiceContract =
  CreateEvent<CustodyService> |
  CreateEvent<AuctionService> |
  CreateEvent<BiddingService> |
  CreateEvent<IssuanceService> |
  CreateEvent<ListingService> |
  CreateEvent<TradingService>;

type Service = {
  contract: ServiceContract;
  service: ServiceKind;
}

type ServicesState = {
  services: Service[];
}

const ServicesProvider : React.FC = ({ children }) => {
  const party = useParty();

  const [ services, setServices ] = useState<Service[]>([]);
  const [ loading, setLoading ] = useState<boolean>(false);

  const { contracts: custodyService, loading: custodyLoading } = useStreamQueries(CustodyService);
  const { contracts: auctionService, loading: auctionLoading } = useStreamQueries(AuctionService);
  const { contracts: biddingService, loading: biddingLoading } = useStreamQueries(BiddingService);
  const { contracts: issuanceService, loading: issuanceLoading } = useStreamQueries(IssuanceService);
  const { contracts: listingService, loading: listingLoading } = useStreamQueries(ListingService);
  const { contracts: tradingService, loading: tradingLoading } = useStreamQueries(TradingService);

  useEffect(() =>
    setLoading(
      custodyLoading  ||
      auctionLoading  ||
      biddingLoading  ||
      issuanceLoading ||
      listingLoading  ||
      tradingLoading
    ), [custodyLoading, auctionLoading, biddingLoading, issuanceLoading, listingLoading, tradingLoading]
  );

  useEffect(() =>
    setServices([
      ...custodyService.map(c => ({ contract: c, service: ServiceKind.CUSTODY })),
      ...auctionService.map(c => ({ contract: c, service: ServiceKind.AUCTION })),
      ...biddingService.map(c => ({ contract: c, service: ServiceKind.BIDDING })),
      ...issuanceService.map(c => ({ contract: c, service: ServiceKind.ISSUANCE })),
      ...listingService.map(c => ({ contract: c, service: ServiceKind.LISTING })),
      ...tradingService.map(c => ({ contract: c, service: ServiceKind.TRADING }))
    ]), [custodyService, auctionService, biddingService, issuanceService, listingService, tradingService]
  );

  return (
    <ServicesStateContext.Provider value={{services}}>
      {children}
    </ServicesStateContext.Provider>
  );
}

type GroupedCustomerServices = {
  provider: string;
  services: ServiceKind[];
  contracts: ServiceContract[]
}[];

/* Retrieve all providers who are providing you, the customer, a service */
function useProviderServices (party: string): GroupedCustomerServices {
  const context = React.useContext<ServicesState>(ServicesStateContext);
  if (context === undefined) {
    throw new Error("useProviderServices  must be used within a ServicesProvider");
  }

  return context.services
    .filter(s => s.contract.payload.customer === party)
    .reduce((acc, service) => {
      const providerDetails = acc.find(i => i.provider === service.contract.payload.provider);

      const provider = providerDetails?.provider || service.contract.payload.provider;
      const services = [ ...(providerDetails?.services || []), service.service];
      const contracts = [ ...(providerDetails?.contracts || []), service.contract];

      return [
        ...acc.filter(i => i.provider !== service.contract.payload.provider),
        { provider, services, contracts }
      ];
  }, [] as GroupedCustomerServices);
}

/* Retrieve all customers who are using services provided by you */
function useCustomerServices(party: string) {
  const context = React.useContext<ServicesState>(ServicesStateContext);
  if (context === undefined) {
    throw new Error("useCustomerServices must be used within a ServicesProvider");
  }
  return context.services.filter(s => s.contract.payload.provider === party);
}

export { ServicesProvider, useProviderServices , useCustomerServices };
