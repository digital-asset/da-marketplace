// Generated from Marketplace/Trading/Role.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Types from '../../../DA/Finance/Types/module';
import * as Marketplace_Listing_Service from '../../../Marketplace/Listing/Service/module';
import * as Marketplace_Settlement_Service from '../../../Marketplace/Settlement/Service/module';
import * as Marketplace_Trading_Matching_Service from '../../../Marketplace/Trading/Matching/Service/module';
import * as Marketplace_Trading_Model from '../../../Marketplace/Trading/Model/module';
import * as Marketplace_Trading_Service from '../../../Marketplace/Trading/Service/module';

export declare type Reject = {
};

export declare const Reject:
  damlTypes.Serializable<Reject> & {
  }
;


export declare type Approve = {
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Approve:
  damlTypes.Serializable<Approve> & {
  }
;


export declare type Request = {
  provider: damlTypes.Party;
  operator: damlTypes.Party;
};

export declare const Request:
  damlTypes.Template<Request, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Role:Request'> & {
  Approve: damlTypes.Choice<Request, Approve, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4<damlTypes.ContractId<Role>, damlTypes.ContractId<Marketplace_Trading_Matching_Service.Service>, damlTypes.ContractId<Marketplace_Listing_Service.Service>, damlTypes.ContractId<Marketplace_Settlement_Service.Service>>, undefined>;
  Archive: damlTypes.Choice<Request, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  Reject: damlTypes.Choice<Request, Reject, {}, undefined>;
};

export declare namespace Request {
  export type CreateEvent = damlLedger.CreateEvent<Request, undefined, typeof Request.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Request, typeof Request.templateId>
  export type Event = damlLedger.Event<Request, undefined, typeof Request.templateId>
  export type QueryResult = damlLedger.QueryResult<Request, undefined, typeof Request.templateId>
}



export declare type Decline = {
};

export declare const Decline:
  damlTypes.Serializable<Decline> & {
  }
;


export declare type Accept = {
};

export declare const Accept:
  damlTypes.Serializable<Accept> & {
  }
;


export declare type Offer = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Offer:
  damlTypes.Template<Offer, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Role:Offer'> & {
  Accept: damlTypes.Choice<Offer, Accept, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4<damlTypes.ContractId<Role>, damlTypes.ContractId<Marketplace_Trading_Matching_Service.Service>, damlTypes.ContractId<Marketplace_Listing_Service.Service>, damlTypes.ContractId<Marketplace_Settlement_Service.Service>>, undefined>;
  Decline: damlTypes.Choice<Offer, Decline, {}, undefined>;
  Archive: damlTypes.Choice<Offer, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace Offer {
  export type CreateEvent = damlLedger.CreateEvent<Offer, undefined, typeof Offer.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Offer, typeof Offer.templateId>
  export type Event = damlLedger.Event<Offer, undefined, typeof Offer.templateId>
  export type QueryResult = damlLedger.QueryResult<Offer, undefined, typeof Offer.templateId>
}



export declare type TerminateRole = {
};

export declare const TerminateRole:
  damlTypes.Serializable<TerminateRole> & {
  }
;


export declare type CreateFeeSchedule = {
  currency: DA_Finance_Types.Id;
  feeAccount: DA_Finance_Types.Account;
  quantity: damlTypes.Numeric;
};

export declare const CreateFeeSchedule:
  damlTypes.Serializable<CreateFeeSchedule> & {
  }
;


export declare type TerminateListingService = {
  listingServiceCid: damlTypes.ContractId<Marketplace_Listing_Service.Service>;
};

export declare const TerminateListingService:
  damlTypes.Serializable<TerminateListingService> & {
  }
;


export declare type ApproveListingServiceRequest = {
  listingRequestCid: damlTypes.ContractId<Marketplace_Listing_Service.Request>;
};

export declare const ApproveListingServiceRequest:
  damlTypes.Serializable<ApproveListingServiceRequest> & {
  }
;


export declare type OfferListingService = {
  customer: damlTypes.Party;
};

export declare const OfferListingService:
  damlTypes.Serializable<OfferListingService> & {
  }
;


export declare type TerminateTradingService = {
  tradingServiceCid: damlTypes.ContractId<Marketplace_Trading_Service.Service>;
};

export declare const TerminateTradingService:
  damlTypes.Serializable<TerminateTradingService> & {
  }
;


export declare type ApproveTradingServiceRequest = {
  tradingRequestCid: damlTypes.ContractId<Marketplace_Trading_Service.Request>;
};

export declare const ApproveTradingServiceRequest:
  damlTypes.Serializable<ApproveTradingServiceRequest> & {
  }
;


export declare type OfferTradingService = {
  customer: damlTypes.Party;
};

export declare const OfferTradingService:
  damlTypes.Serializable<OfferTradingService> & {
  }
;


export declare type Role = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Role:
  damlTypes.Template<Role, Role.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Role:Role'> & {
  OfferTradingService: damlTypes.Choice<Role, OfferTradingService, damlTypes.ContractId<Marketplace_Trading_Service.Offer>, Role.Key>;
  ApproveTradingServiceRequest: damlTypes.Choice<Role, ApproveTradingServiceRequest, damlTypes.ContractId<Marketplace_Trading_Service.Service>, Role.Key>;
  TerminateTradingService: damlTypes.Choice<Role, TerminateTradingService, {}, Role.Key>;
  OfferListingService: damlTypes.Choice<Role, OfferListingService, damlTypes.ContractId<Marketplace_Listing_Service.Offer>, Role.Key>;
  ApproveListingServiceRequest: damlTypes.Choice<Role, ApproveListingServiceRequest, damlTypes.ContractId<Marketplace_Listing_Service.Service>, Role.Key>;
  TerminateListingService: damlTypes.Choice<Role, TerminateListingService, {}, Role.Key>;
  CreateFeeSchedule: damlTypes.Choice<Role, CreateFeeSchedule, damlTypes.ContractId<Marketplace_Trading_Model.FeeSchedule>, Role.Key>;
  TerminateRole: damlTypes.Choice<Role, TerminateRole, {}, Role.Key>;
  Archive: damlTypes.Choice<Role, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Role.Key>;
};

export declare namespace Role {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<Role, Role.Key, typeof Role.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Role, typeof Role.templateId>
  export type Event = damlLedger.Event<Role, Role.Key, typeof Role.templateId>
  export type QueryResult = damlLedger.QueryResult<Role, Role.Key, typeof Role.templateId>
}


