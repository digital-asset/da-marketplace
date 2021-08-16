// Generated from Marketplace/Clearing/Role.daml
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
import * as Marketplace_Clearing_Market_Service from '../../../Marketplace/Clearing/Market/Service/module';
import * as Marketplace_Clearing_Service from '../../../Marketplace/Clearing/Service/module';

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
  ccpAccount: DA_Finance_Types.Account;
};

export declare const Request:
  damlTypes.Template<Request, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Role:Request'> & {
  Approve: damlTypes.Choice<Request, Approve, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Role>, damlTypes.ContractId<Marketplace_Clearing_Market_Service.Service>>, undefined>;
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
  ccpAccount: DA_Finance_Types.Account;
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
  damlTypes.Template<Offer, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Role:Offer'> & {
  Accept: damlTypes.Choice<Offer, Accept, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Role>, damlTypes.ContractId<Marketplace_Clearing_Market_Service.Service>>, undefined>;
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


export declare type TerminateMarketService = {
  marketServiceCid: damlTypes.ContractId<Marketplace_Clearing_Market_Service.Service>;
};

export declare const TerminateMarketService:
  damlTypes.Serializable<TerminateMarketService> & {
  }
;


export declare type RejectMarketRequest = {
  marketRequestCid: damlTypes.ContractId<Marketplace_Clearing_Market_Service.Request>;
};

export declare const RejectMarketRequest:
  damlTypes.Serializable<RejectMarketRequest> & {
  }
;


export declare type ApproveMarketRequest = {
  marketRequestCid: damlTypes.ContractId<Marketplace_Clearing_Market_Service.Request>;
};

export declare const ApproveMarketRequest:
  damlTypes.Serializable<ApproveMarketRequest> & {
  }
;


export declare type OfferMarketService = {
  customer: damlTypes.Party;
};

export declare const OfferMarketService:
  damlTypes.Serializable<OfferMarketService> & {
  }
;


export declare type TerminateClearingService = {
  custodyServiceCid: damlTypes.ContractId<Marketplace_Clearing_Service.Service>;
};

export declare const TerminateClearingService:
  damlTypes.Serializable<TerminateClearingService> & {
  }
;


export declare type RejectClearingRequest = {
  clearingRequestCid: damlTypes.ContractId<Marketplace_Clearing_Service.Request>;
};

export declare const RejectClearingRequest:
  damlTypes.Serializable<RejectClearingRequest> & {
  }
;


export declare type ApproveClearingRequest = {
  clearingRequestCid: damlTypes.ContractId<Marketplace_Clearing_Service.Request>;
};

export declare const ApproveClearingRequest:
  damlTypes.Serializable<ApproveClearingRequest> & {
  }
;


export declare type OfferClearingService = {
  customer: damlTypes.Party;
};

export declare const OfferClearingService:
  damlTypes.Serializable<OfferClearingService> & {
  }
;


export declare type Role = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
  ccpAccount: DA_Finance_Types.Account;
};

export declare const Role:
  damlTypes.Template<Role, Role.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Role:Role'> & {
  OfferClearingService: damlTypes.Choice<Role, OfferClearingService, damlTypes.ContractId<Marketplace_Clearing_Service.Offer>, Role.Key>;
  ApproveClearingRequest: damlTypes.Choice<Role, ApproveClearingRequest, damlTypes.ContractId<Marketplace_Clearing_Service.Service>, Role.Key>;
  RejectClearingRequest: damlTypes.Choice<Role, RejectClearingRequest, {}, Role.Key>;
  TerminateClearingService: damlTypes.Choice<Role, TerminateClearingService, {}, Role.Key>;
  OfferMarketService: damlTypes.Choice<Role, OfferMarketService, damlTypes.ContractId<Marketplace_Clearing_Market_Service.Offer>, Role.Key>;
  ApproveMarketRequest: damlTypes.Choice<Role, ApproveMarketRequest, damlTypes.ContractId<Marketplace_Clearing_Market_Service.Service>, Role.Key>;
  RejectMarketRequest: damlTypes.Choice<Role, RejectMarketRequest, {}, Role.Key>;
  TerminateMarketService: damlTypes.Choice<Role, TerminateMarketService, {}, Role.Key>;
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


