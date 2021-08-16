// Generated from Marketplace/Custody/Role.daml
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

import * as Marketplace_Custody_Service from '../../../Marketplace/Custody/Service/module';
import * as Marketplace_Issuance_Service from '../../../Marketplace/Issuance/Service/module';

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
  damlTypes.Template<Request, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Role:Request'> & {
  Approve: damlTypes.Choice<Request, Approve, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.ContractId<Role>, damlTypes.ContractId<Marketplace_Issuance_Service.Service>, damlTypes.ContractId<Marketplace_Custody_Service.Service>>, undefined>;
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
  damlTypes.Template<Offer, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Role:Offer'> & {
  Accept: damlTypes.Choice<Offer, Accept, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.ContractId<Role>, damlTypes.ContractId<Marketplace_Issuance_Service.Service>, damlTypes.ContractId<Marketplace_Custody_Service.Service>>, undefined>;
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


export declare type TerminateIssuanceService = {
  issuanceServiceCid: damlTypes.ContractId<Marketplace_Issuance_Service.Service>;
};

export declare const TerminateIssuanceService:
  damlTypes.Serializable<TerminateIssuanceService> & {
  }
;


export declare type ApproveIssuanceRequest = {
  issuanceServiceRequestCid: damlTypes.ContractId<Marketplace_Issuance_Service.Request>;
};

export declare const ApproveIssuanceRequest:
  damlTypes.Serializable<ApproveIssuanceRequest> & {
  }
;


export declare type OfferIssuanceService = {
  customer: damlTypes.Party;
};

export declare const OfferIssuanceService:
  damlTypes.Serializable<OfferIssuanceService> & {
  }
;


export declare type TerminateCustodyService = {
  custodyServiceCid: damlTypes.ContractId<Marketplace_Custody_Service.Service>;
};

export declare const TerminateCustodyService:
  damlTypes.Serializable<TerminateCustodyService> & {
  }
;


export declare type ApproveCustodyRequest = {
  custodyRequestCid: damlTypes.ContractId<Marketplace_Custody_Service.Request>;
};

export declare const ApproveCustodyRequest:
  damlTypes.Serializable<ApproveCustodyRequest> & {
  }
;


export declare type OfferCustodyService = {
  customer: damlTypes.Party;
};

export declare const OfferCustodyService:
  damlTypes.Serializable<OfferCustodyService> & {
  }
;


export declare type Role = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Role:
  damlTypes.Template<Role, Role.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Role:Role'> & {
  OfferCustodyService: damlTypes.Choice<Role, OfferCustodyService, damlTypes.ContractId<Marketplace_Custody_Service.Offer>, Role.Key>;
  ApproveCustodyRequest: damlTypes.Choice<Role, ApproveCustodyRequest, damlTypes.ContractId<Marketplace_Custody_Service.Service>, Role.Key>;
  TerminateCustodyService: damlTypes.Choice<Role, TerminateCustodyService, {}, Role.Key>;
  OfferIssuanceService: damlTypes.Choice<Role, OfferIssuanceService, damlTypes.ContractId<Marketplace_Issuance_Service.Offer>, Role.Key>;
  ApproveIssuanceRequest: damlTypes.Choice<Role, ApproveIssuanceRequest, damlTypes.ContractId<Marketplace_Issuance_Service.Service>, Role.Key>;
  TerminateIssuanceService: damlTypes.Choice<Role, TerminateIssuanceService, {}, Role.Key>;
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


