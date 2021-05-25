import {
  Accept as CustodyRoleAccept,
  Approve as CustodyRoleApprove,
  Decline as CustodyRoleDecline,
  Offer as CustodyRoleOffer,
  Reject as CustodyRoleReject,
  Request as CustodyRoleRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import {
  Accept as TradingRoleAccept,
  Approve as TradingRoleApprove,
  Decline as TradingRoleDecline,
  Offer as TradingRoleOffer,
  Reject as TradingRoleReject,
  Request as TradingRoleRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import {
  Accept as ClearingRoleAccept,
  Approve as ClearingRoleApprove,
  Decline as ClearingRoleDecline,
  Offer as ClearingRoleOffer,
  Reject as ClearingRoleReject,
  Request as ClearingRoleRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import {
  Accept as RegulatorRoleAccept,
  Approve as RegulatorRoleApprove,
  Decline as RegulatorRoleDecline,
  Offer as RegulatorRoleOffer,
  Reject as RegulatorRoleReject,
  Request as RegulatorRoleRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import {
  Accept as DistributionRoleAccept,
  Approve as DistributionRoleApprove,
  Decline as DistributionRoleDecline,
  Offer as DistributionRoleOffer,
  Reject as DistributionRoleReject,
  Request as DistributionRoleRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';

import {
  Accept as CustodyServiceAccept,
  Approve as CustodyServiceApprove,
  Decline as CustodyServiceDecline,
  Offer as CustodyServiceOffer,
  Reject as CustodyServiceReject,
  Request as CustodyServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import {
  Accept as ListingServiceAccept,
  Approve as ListingServiceApprove,
  Decline as ListingServiceDecline,
  Offer as ListingServiceOffer,
  Reject as ListingServiceReject,
  Request as ListingServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import {
  Accept as TradingServiceAccept,
  Approve as TradingServiceApprove,
  Decline as TradingServiceDecline,
  Offer as TradingServiceOffer,
  Reject as TradingServiceReject,
  Request as TradingServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service';
import {
  Accept as MatchingServiceAccept,
  Approve as MatchingServiceApprove,
  Decline as MatchingServiceDecline,
  Offer as MatchingServiceOffer,
  Reject as MatchingServiceReject,
  Request as MatchingServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';
import {
  Accept,
  Accept as ClearingServiceAccept,
  Approve as ClearingServiceApprove,
  Decline as ClearingServiceDecline,
  Offer as ClearingServiceOffer,
  Reject as ClearingServiceReject,
  Request as ClearingServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service';
import {
  Accept as IssuanceServiceAccept,
  Approve as IssuanceServiceApprove,
  Decline as IssuanceServiceDecline,
  Offer as IssuanceServiceOffer,
  Reject as IssuanceServiceReject,
  Request as IssuanceServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service';
import {
  Accept as RegulatorServiceAccept,
  Approve as RegulatorServiceApprove,
  Decline as RegulatorServiceDecline,
  Offer as RegulatorServiceOffer,
  Reject as RegulatorServiceReject,
  Request as RegulatorServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';
import {
  Accept as SettlementServiceAccept,
  Approve as SettlementServiceApprove,
  Decline as SettlementServiceDecline,
  Offer as SettlementServiceOffer,
  Reject as SettlementServiceReject,
  Request as SettlementServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import {
  Accept as MarketServiceAccept,
  Approve as MarketServiceApprove,
  Decline as MarketServiceDecline,
  Offer as MarketServiceOffer,
  Reject as MarketServiceReject,
  Request as MarketServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Market/Service';
import {
  Accept as AuctionServiceAccept,
  Approve as AuctionServiceApprove,
  Decline as AuctionServiceDecline,
  Offer as AuctionServiceOffer,
  Reject as AuctionServiceReject,
  Request as AuctionServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import {
  Accept as BiddingServiceAccept,
  Approve as BiddingServiceApprove,
  Decline as BiddingServiceDecline,
  Offer as BiddingServiceOffer,
  Reject as BiddingServiceReject,
  Request as BiddingServiceRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service';

import { CreateEvent } from '@daml/ledger';
import { Choice, ContractId } from '@daml/types';
import { ServiceKind } from '../../context/ServicesContext';
import { Field, Fields } from '../../components/InputDialog/Fields';

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

type OfferDeclines =
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

export type OfferAcceptFields<A> = {
  acceptFields?: { [K in keyof Extract<OfferAccepts, A>]: Field };
  lookupFields?: (fields: { [k: string]: string }) => { [k: string]: object | string };
};

type OfferNotificationSet = {
  kind: 'Role' | 'Service';
  service: ServiceKind;
  tag: 'offer';
  choices: {
    accept: OfferAcceptChoice;
    decline: OfferDeclineChoice;
  };
  contracts: readonly CreateEvent<OfferTemplates>[];
} & OfferAcceptFields<Record<string, any>>;

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

type RequestRejects =
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

export type RequestApproveFields<A> = {
  approveFields?: { [K in keyof Extract<RequestApproves, A>]: Field };
  lookupFields?: (fields: { [k: string]: string }) => { [k: string]: object | string };
};

type RequestNotificationSet = {
  kind: 'Role' | 'Service';
  service: ServiceKind;
  tag: 'request';
  choices: {
    approve: RequestApproveChoice;
    reject: RequestRejectChoice;
  };
  contracts: readonly CreateEvent<RequestTemplates>[];
} & RequestApproveFields<Record<string, any>>;

export type NotificationSet = OfferNotificationSet | RequestNotificationSet;
