import {
  Offer as CustodyRoleOffer,
  Request as CustodyRoleRequest,
  Accept as CustodyRoleAccept,
  Decline as CustodyRoleDecline,
  Approve as CustodyRoleApprove,
  Reject as CustodyRoleReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import {
  Offer as TradingRoleOffer,
  Request as TradingRoleRequest,
  Accept as TradingRoleAccept,
  Decline as TradingRoleDecline,
  Approve as TradingRoleApprove,
  Reject as TradingRoleReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import {
  Offer as ClearingRoleOffer,
  Request as ClearingRoleRequest,
  Accept as ClearingRoleAccept,
  Decline as ClearingRoleDecline,
  Approve as ClearingRoleApprove,
  Reject as ClearingRoleReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import {
  Offer as RegulatorRoleOffer,
  Request as RegulatorRoleRequest,
  Accept as RegulatorRoleAccept,
  Decline as RegulatorRoleDecline,
  Approve as RegulatorRoleApprove,
  Reject as RegulatorRoleReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import {
  Offer as DistributionRoleOffer,
  Request as DistributionRoleRequest,
  Accept as DistributionRoleAccept,
  Decline as DistributionRoleDecline,
  Approve as DistributionRoleApprove,
  Reject as DistributionRoleReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';

import {
  Offer as CustodyServiceOffer,
  Request as CustodyServiceRequest,
  Accept as CustodyServiceAccept,
  Decline as CustodyServiceDecline,
  Approve as CustodyServiceApprove,
  Reject as CustodyServiceReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import {
  Offer as ListingServiceOffer,
  Request as ListingServiceRequest,
  Accept as ListingServiceAccept,
  Decline as ListingServiceDecline,
  Approve as ListingServiceApprove,
  Reject as ListingServiceReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import {
  Offer as TradingServiceOffer,
  Request as TradingServiceRequest,
  Accept as TradingServiceAccept,
  Decline as TradingServiceDecline,
  Approve as TradingServiceApprove,
  Reject as TradingServiceReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import {
  Offer as MatchingServiceOffer,
  Request as MatchingServiceRequest,
  Accept as MatchingServiceAccept,
  Decline as MatchingServiceDecline,
  Approve as MatchingServiceApprove,
  Reject as MatchingServiceReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';
import {
  Offer as ClearingServiceOffer,
  Request as ClearingServiceRequest,
  Accept as ClearingServiceAccept,
  Decline as ClearingServiceDecline,
  Approve as ClearingServiceApprove,
  Reject as ClearingServiceReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import {
  Offer as IssuanceServiceOffer,
  Request as IssuanceServiceRequest,
  Accept as IssuanceServiceAccept,
  Decline as IssuanceServiceDecline,
  Approve as IssuanceServiceApprove,
  Reject as IssuanceServiceReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import {
  Offer as RegulatorServiceOffer,
  Request as RegulatorServiceRequest,
  Accept as RegulatorServiceAccept,
  Decline as RegulatorServiceDecline,
  Approve as RegulatorServiceApprove,
  Reject as RegulatorServiceReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';
import {
  Offer as SettlementServiceOffer,
  Request as SettlementServiceRequest,
  Accept as SettlementServiceAccept,
  Decline as SettlementServiceDecline,
  Approve as SettlementServiceApprove,
  Reject as SettlementServiceReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import {
  Offer as MarketServiceOffer,
  Request as MarketServiceRequest,
  Accept as MarketServiceAccept,
  Decline as MarketServiceDecline,
  Approve as MarketServiceApprove,
  Reject as MarketServiceReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service';
import {
  Offer as AuctionServiceOffer,
  Request as AuctionServiceRequest,
  Accept as AuctionServiceAccept,
  Decline as AuctionServiceDecline,
  Approve as AuctionServiceApprove,
  Reject as AuctionServiceReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import {
  Offer as BiddingServiceOffer,
  Request as BiddingServiceRequest,
  Accept as BiddingServiceAccept,
  Decline as BiddingServiceDecline,
  Approve as BiddingServiceApprove,
  Reject as BiddingServiceReject,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';

import { CreateEvent } from '@daml/ledger';
import { Choice, ContractId } from '@daml/types';
import { ServiceKind } from '../../context/ServicesContext';

export type OfferTemplates =
  | CustodyRoleOffer
  | TradingRoleOffer
  | ClearingRoleOffer
  | RegulatorRoleOffer
  | DistributionRoleOffer
  | CustodyServiceOffer
  | ListingServiceOffer
  | TradingServiceOffer
  | MatchingServiceOffer
  | ClearingServiceOffer
  | IssuanceServiceOffer
  | RegulatorServiceOffer
  | SettlementServiceOffer
  | MarketServiceOffer
  | AuctionServiceOffer
  | BiddingServiceOffer;

export type OfferAccepts =
  | CustodyRoleAccept
  | TradingRoleAccept
  | ClearingRoleAccept
  | RegulatorRoleAccept
  | DistributionRoleAccept
  | CustodyServiceAccept
  | ListingServiceAccept
  | TradingServiceAccept
  | MatchingServiceAccept
  | ClearingServiceAccept
  | IssuanceServiceAccept
  | RegulatorServiceAccept
  | SettlementServiceAccept
  | MarketServiceAccept
  | AuctionServiceAccept
  | BiddingServiceAccept;

export type OfferAcceptChoice = Choice<
  OfferTemplates,
  OfferAccepts,
  ContractId<OfferTemplates>,
  undefined
>;

export type OfferDeclines =
  | CustodyRoleDecline
  | TradingRoleDecline
  | ClearingRoleDecline
  | RegulatorRoleDecline
  | DistributionRoleDecline
  | CustodyServiceDecline
  | ListingServiceDecline
  | TradingServiceDecline
  | MatchingServiceDecline
  | ClearingServiceDecline
  | IssuanceServiceDecline
  | RegulatorServiceDecline
  | SettlementServiceDecline
  | MarketServiceDecline
  | AuctionServiceDecline
  | BiddingServiceDecline;

export type OfferDeclineChoice = Choice<
  OfferTemplates,
  OfferDeclines,
  ContractId<OfferTemplates>,
  undefined
>;

type OfferNotificationSet = {
  tag: 'offer';
  choices: {
    accept: OfferAcceptChoice;
    decline: OfferDeclineChoice;
  };
  contracts: readonly CreateEvent<OfferTemplates>[];
};

// -------------------------------------------------------------

export type RequestTemplates =
  | CustodyRoleRequest
  | TradingRoleRequest
  | ClearingRoleRequest
  | RegulatorRoleRequest
  | DistributionRoleRequest
  | CustodyServiceRequest
  | ListingServiceRequest
  | TradingServiceRequest
  | MatchingServiceRequest
  | ClearingServiceRequest
  | IssuanceServiceRequest
  | RegulatorServiceRequest
  | SettlementServiceRequest
  | MarketServiceRequest
  | AuctionServiceRequest
  | BiddingServiceRequest;

export type RequestApproves =
  | CustodyRoleApprove
  | TradingRoleApprove
  | ClearingRoleApprove
  | RegulatorRoleApprove
  | DistributionRoleApprove
  | CustodyServiceApprove
  | ListingServiceApprove
  | TradingServiceApprove
  | MatchingServiceApprove
  | ClearingServiceApprove
  | IssuanceServiceApprove
  | RegulatorServiceApprove
  | SettlementServiceApprove
  | MarketServiceApprove
  | AuctionServiceApprove
  | BiddingServiceApprove;

export type RequestApproveChoice = Choice<
  RequestTemplates,
  RequestApproves,
  ContractId<RequestTemplates>,
  undefined
>;

export type RequestRejects =
  | CustodyRoleReject
  | TradingRoleReject
  | ClearingRoleReject
  | RegulatorRoleReject
  | DistributionRoleReject
  | CustodyServiceReject
  | ListingServiceReject
  | TradingServiceReject
  | MatchingServiceReject
  | ClearingServiceReject
  | IssuanceServiceReject
  | RegulatorServiceReject
  | SettlementServiceReject
  | MarketServiceReject
  | AuctionServiceReject
  | BiddingServiceReject;

export type RequestRejectChoice = Choice<
  RequestTemplates,
  RequestRejects,
  ContractId<RequestTemplates>,
  undefined
>;

type RequestNotificationSet = {
  tag: 'request';
  choices: {
    approve: RequestApproveChoice;
    reject: RequestRejectChoice;
  };
  contracts: readonly CreateEvent<RequestTemplates>[];
};

export type NotificationSet = (OfferNotificationSet | RequestNotificationSet) & {
  kind: 'Role' | 'Service';
  service: ServiceKind;
};
