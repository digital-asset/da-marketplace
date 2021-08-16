// Generated from Marketplace/Issuance/Service.daml
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

import * as ContingentClaims_Claim_Serializable from '../../../ContingentClaims/Claim/Serializable/module';
import * as DA_Finance_Asset from '../../../DA/Finance/Asset/module';
import * as DA_Finance_Types from '../../../DA/Finance/Types/module';
import * as Marketplace_Issuance_AssetDescription from '../../../Marketplace/Issuance/AssetDescription/module';
import * as Marketplace_Issuance_CFI from '../../../Marketplace/Issuance/CFI/module';
import * as Marketplace_Issuance_Model from '../../../Marketplace/Issuance/Model/module';

export declare type OriginationRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  assetLabel: string;
  cfi: Marketplace_Issuance_CFI.CFI;
  description: string;
  claims: ContingentClaims_Claim_Serializable.Claim<damlTypes.Date, damlTypes.Numeric, DA_Finance_Types.Id>;
  safekeepingAccount: DA_Finance_Types.Account;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const OriginationRequest:
  damlTypes.Template<OriginationRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:OriginationRequest'> & {
  Archive: damlTypes.Choice<OriginationRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace OriginationRequest {
  export type CreateEvent = damlLedger.CreateEvent<OriginationRequest, undefined, typeof OriginationRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<OriginationRequest, typeof OriginationRequest.templateId>
  export type Event = damlLedger.Event<OriginationRequest, undefined, typeof OriginationRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<OriginationRequest, undefined, typeof OriginationRequest.templateId>
}



export declare type ReduceIssuanceRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  issuanceId: string;
  accountId: DA_Finance_Types.Id;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
};

export declare const ReduceIssuanceRequest:
  damlTypes.Template<ReduceIssuanceRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:ReduceIssuanceRequest'> & {
  Archive: damlTypes.Choice<ReduceIssuanceRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace ReduceIssuanceRequest {
  export type CreateEvent = damlLedger.CreateEvent<ReduceIssuanceRequest, undefined, typeof ReduceIssuanceRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ReduceIssuanceRequest, typeof ReduceIssuanceRequest.templateId>
  export type Event = damlLedger.Event<ReduceIssuanceRequest, undefined, typeof ReduceIssuanceRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<ReduceIssuanceRequest, undefined, typeof ReduceIssuanceRequest.templateId>
}



export declare type CreateIssuanceRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  issuanceId: string;
  assetId: DA_Finance_Types.Id;
  accountId: DA_Finance_Types.Id;
  quantity: damlTypes.Numeric;
};

export declare const CreateIssuanceRequest:
  damlTypes.Template<CreateIssuanceRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:CreateIssuanceRequest'> & {
  Archive: damlTypes.Choice<CreateIssuanceRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace CreateIssuanceRequest {
  export type CreateEvent = damlLedger.CreateEvent<CreateIssuanceRequest, undefined, typeof CreateIssuanceRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<CreateIssuanceRequest, typeof CreateIssuanceRequest.templateId>
  export type Event = damlLedger.Event<CreateIssuanceRequest, undefined, typeof CreateIssuanceRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<CreateIssuanceRequest, undefined, typeof CreateIssuanceRequest.templateId>
}



export declare type Approve = {
  operator: damlTypes.Party;
};

export declare const Approve:
  damlTypes.Serializable<Approve> & {
  }
;


export declare type Reject = {
};

export declare const Reject:
  damlTypes.Serializable<Reject> & {
  }
;


export declare type Cancel = {
};

export declare const Cancel:
  damlTypes.Serializable<Cancel> & {
  }
;


export declare type Request = {
  customer: damlTypes.Party;
  provider: damlTypes.Party;
};

export declare const Request:
  damlTypes.Template<Request, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:Request'> & {
  Archive: damlTypes.Choice<Request, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  Cancel: damlTypes.Choice<Request, Cancel, {}, undefined>;
  Reject: damlTypes.Choice<Request, Reject, {}, undefined>;
  Approve: damlTypes.Choice<Request, Approve, damlTypes.ContractId<Service>, undefined>;
};

export declare namespace Request {
  export type CreateEvent = damlLedger.CreateEvent<Request, undefined, typeof Request.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Request, typeof Request.templateId>
  export type Event = damlLedger.Event<Request, undefined, typeof Request.templateId>
  export type QueryResult = damlLedger.QueryResult<Request, undefined, typeof Request.templateId>
}



export declare type Withdraw = {
};

export declare const Withdraw:
  damlTypes.Serializable<Withdraw> & {
  }
;


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
  customer: damlTypes.Party;
};

export declare const Offer:
  damlTypes.Template<Offer, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:Offer'> & {
  Archive: damlTypes.Choice<Offer, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  Decline: damlTypes.Choice<Offer, Decline, {}, undefined>;
  Withdraw: damlTypes.Choice<Offer, Withdraw, {}, undefined>;
  Accept: damlTypes.Choice<Offer, Accept, damlTypes.ContractId<Service>, undefined>;
};

export declare namespace Offer {
  export type CreateEvent = damlLedger.CreateEvent<Offer, undefined, typeof Offer.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Offer, typeof Offer.templateId>
  export type Event = damlLedger.Event<Offer, undefined, typeof Offer.templateId>
  export type QueryResult = damlLedger.QueryResult<Offer, undefined, typeof Offer.templateId>
}



export declare type ReduceIssuance = {
  reduceIssuanceRequestCid: damlTypes.ContractId<ReduceIssuanceRequest>;
};

export declare const ReduceIssuance:
  damlTypes.Serializable<ReduceIssuance> & {
  }
;


export declare type CreateIssuance = {
  createIssuanceRequestCid: damlTypes.ContractId<CreateIssuanceRequest>;
};

export declare const CreateIssuance:
  damlTypes.Serializable<CreateIssuance> & {
  }
;


export declare type Originate = {
  createOriginationCid: damlTypes.ContractId<OriginationRequest>;
};

export declare const Originate:
  damlTypes.Serializable<Originate> & {
  }
;


export declare type RequestReduceIssuance = {
  issuanceId: string;
  accountId: DA_Finance_Types.Id;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
};

export declare const RequestReduceIssuance:
  damlTypes.Serializable<RequestReduceIssuance> & {
  }
;


export declare type RequestCreateIssuance = {
  issuanceId: string;
  accountId: DA_Finance_Types.Id;
  assetId: DA_Finance_Types.Id;
  quantity: damlTypes.Numeric;
};

export declare const RequestCreateIssuance:
  damlTypes.Serializable<RequestCreateIssuance> & {
  }
;


export declare type RequestOrigination = {
  assetLabel: string;
  cfi: Marketplace_Issuance_CFI.CFI;
  description: string;
  claims: ContingentClaims_Claim_Serializable.Claim<damlTypes.Date, damlTypes.Numeric, DA_Finance_Types.Id>;
  safekeepingAccount: DA_Finance_Types.Account;
  observers: damlTypes.Party[];
};

export declare const RequestOrigination:
  damlTypes.Serializable<RequestOrigination> & {
  }
;


export declare type Service = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
};

export declare const Service:
  damlTypes.Template<Service, Service.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:Service'> & {
  Archive: damlTypes.Choice<Service, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Service.Key>;
  Originate: damlTypes.Choice<Service, Originate, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Issuance_AssetDescription.AssetDescription>, Marketplace_Issuance_AssetDescription.AssetDescription>, Service.Key>;
  CreateIssuance: damlTypes.Choice<Service, CreateIssuance, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Issuance_Model.Issuance>, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>>, Service.Key>;
  RequestOrigination: damlTypes.Choice<Service, RequestOrigination, damlTypes.ContractId<OriginationRequest>, Service.Key>;
  RequestCreateIssuance: damlTypes.Choice<Service, RequestCreateIssuance, damlTypes.ContractId<CreateIssuanceRequest>, Service.Key>;
  RequestReduceIssuance: damlTypes.Choice<Service, RequestReduceIssuance, damlTypes.ContractId<ReduceIssuanceRequest>, Service.Key>;
  ReduceIssuance: damlTypes.Choice<Service, ReduceIssuance, damlTypes.ContractId<Marketplace_Issuance_Model.Issuance>, Service.Key>;
};

export declare namespace Service {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<Service, Service.Key, typeof Service.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Service, typeof Service.templateId>
  export type Event = damlLedger.Event<Service, Service.Key, typeof Service.templateId>
  export type QueryResult = damlLedger.QueryResult<Service, Service.Key, typeof Service.templateId>
}


