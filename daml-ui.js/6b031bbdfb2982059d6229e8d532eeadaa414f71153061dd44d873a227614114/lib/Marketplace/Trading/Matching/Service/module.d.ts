// Generated from Marketplace/Trading/Matching/Service.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as Marketplace_Clearing_Model from '../../../../Marketplace/Clearing/Model/module';
import * as Marketplace_Settlement_Model from '../../../../Marketplace/Settlement/Model/module';
import * as Marketplace_Trading_Model from '../../../../Marketplace/Trading/Model/module';

export declare type Reject = {
};

export declare const Reject:
  damlTypes.Serializable<Reject> & {
  }
;


export declare type Approve = {
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
  damlTypes.Template<Request, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Matching.Service:Request'> & {
  Approve: damlTypes.Choice<Request, Approve, damlTypes.ContractId<Service>, undefined>;
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
};

export declare const Offer:
  damlTypes.Template<Offer, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Matching.Service:Offer'> & {
  Accept: damlTypes.Choice<Offer, Accept, damlTypes.ContractId<Service>, undefined>;
  Decline: damlTypes.Choice<Offer, Decline, {}, undefined>;
  Archive: damlTypes.Choice<Offer, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace Offer {
  export type CreateEvent = damlLedger.CreateEvent<Offer, undefined, typeof Offer.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Offer, typeof Offer.templateId>
  export type Event = damlLedger.Event<Offer, undefined, typeof Offer.templateId>
  export type QueryResult = damlLedger.QueryResult<Offer, undefined, typeof Offer.templateId>
}



export declare type Terminate = {
};

export declare const Terminate:
  damlTypes.Serializable<Terminate> & {
  }
;


export declare type MatchOrders = {
  execution: Marketplace_Trading_Model.Execution;
};

export declare const MatchOrders:
  damlTypes.Serializable<MatchOrders> & {
  }
;


export declare type Service = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
};

export declare const Service:
  damlTypes.Template<Service, Service.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Matching.Service:Service'> & {
  MatchOrders: damlTypes.Choice<Service, MatchOrders, MatchResult, Service.Key>;
  Terminate: damlTypes.Choice<Service, Terminate, {}, Service.Key>;
  Archive: damlTypes.Choice<Service, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Service.Key>;
};

export declare namespace Service {
  export type Key = damlTypes.Party
  export type CreateEvent = damlLedger.CreateEvent<Service, Service.Key, typeof Service.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Service, typeof Service.templateId>
  export type Event = damlLedger.Event<Service, Service.Key, typeof Service.templateId>
  export type QueryResult = damlLedger.QueryResult<Service, Service.Key, typeof Service.templateId>
}



export declare type MatchResult =
  |  { tag: 'Cleared'; value: damlTypes.ContractId<Marketplace_Clearing_Model.ClearedTrade> }
  |  { tag: 'Collateralized'; value: damlTypes.ContractId<Marketplace_Settlement_Model.SettlementInstruction> }
;

export declare const MatchResult:
  damlTypes.Serializable<MatchResult> & {
  }
;

