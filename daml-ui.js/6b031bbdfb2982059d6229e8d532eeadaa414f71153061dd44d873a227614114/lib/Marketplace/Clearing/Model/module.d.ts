// Generated from Marketplace/Clearing/Model.daml
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
import * as Marketplace_Trading_Model from '../../../Marketplace/Trading/Model/module';

export declare type ClearedTradeSide = {
  clearinghouse: damlTypes.Party;
  exchange: damlTypes.Party;
  participant: damlTypes.Party;
  order: Marketplace_Trading_Model.Order;
  execution: Marketplace_Trading_Model.Execution;
  timeNovated: damlTypes.Time;
};

export declare const ClearedTradeSide:
  damlTypes.Template<ClearedTradeSide, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:ClearedTradeSide'> & {
  Archive: damlTypes.Choice<ClearedTradeSide, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace ClearedTradeSide {
  export type CreateEvent = damlLedger.CreateEvent<ClearedTradeSide, undefined, typeof ClearedTradeSide.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ClearedTradeSide, typeof ClearedTradeSide.templateId>
  export type Event = damlLedger.Event<ClearedTradeSide, undefined, typeof ClearedTradeSide.templateId>
  export type QueryResult = damlLedger.QueryResult<ClearedTradeSide, undefined, typeof ClearedTradeSide.templateId>
}



export declare type ClearedTrade_Novate = {
};

export declare const ClearedTrade_Novate:
  damlTypes.Serializable<ClearedTrade_Novate> & {
  }
;


export declare type ClearedTrade = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  clearinghouse: damlTypes.Party;
  makerOrder: Marketplace_Trading_Model.Order;
  takerOrder: Marketplace_Trading_Model.Order;
  execution: Marketplace_Trading_Model.Execution;
};

export declare const ClearedTrade:
  damlTypes.Template<ClearedTrade, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:ClearedTrade'> & {
  Archive: damlTypes.Choice<ClearedTrade, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  ClearedTrade_Novate: damlTypes.Choice<ClearedTrade, ClearedTrade_Novate, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<ClearedTradeSide>, damlTypes.ContractId<ClearedTradeSide>>, undefined>;
};

export declare namespace ClearedTrade {
  export type CreateEvent = damlLedger.CreateEvent<ClearedTrade, undefined, typeof ClearedTrade.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ClearedTrade, typeof ClearedTrade.templateId>
  export type Event = damlLedger.Event<ClearedTrade, undefined, typeof ClearedTrade.templateId>
  export type QueryResult = damlLedger.QueryResult<ClearedTrade, undefined, typeof ClearedTrade.templateId>
}



export declare type FulfilledMarkToMarketCalculation = {
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  calculation: MarkToMarketCalculation;
  note: string;
};

export declare const FulfilledMarkToMarketCalculation:
  damlTypes.Template<FulfilledMarkToMarketCalculation, FulfilledMarkToMarketCalculation.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:FulfilledMarkToMarketCalculation'> & {
  Archive: damlTypes.Choice<FulfilledMarkToMarketCalculation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, FulfilledMarkToMarketCalculation.Key>;
};

export declare namespace FulfilledMarkToMarketCalculation {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<FulfilledMarkToMarketCalculation, FulfilledMarkToMarketCalculation.Key, typeof FulfilledMarkToMarketCalculation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<FulfilledMarkToMarketCalculation, typeof FulfilledMarkToMarketCalculation.templateId>
  export type Event = damlLedger.Event<FulfilledMarkToMarketCalculation, FulfilledMarkToMarketCalculation.Key, typeof FulfilledMarkToMarketCalculation.templateId>
  export type QueryResult = damlLedger.QueryResult<FulfilledMarkToMarketCalculation, FulfilledMarkToMarketCalculation.Key, typeof FulfilledMarkToMarketCalculation.templateId>
}



export declare type RejectedMarkToMarketCalculation_Retry = {
  ctrl: damlTypes.Party;
};

export declare const RejectedMarkToMarketCalculation_Retry:
  damlTypes.Serializable<RejectedMarkToMarketCalculation_Retry> & {
  }
;


export declare type RejectedMarkToMarketCalculation_Cancel = {
};

export declare const RejectedMarkToMarketCalculation_Cancel:
  damlTypes.Serializable<RejectedMarkToMarketCalculation_Cancel> & {
  }
;


export declare type RejectedMarkToMarketCalculation = {
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  calculation: MarkToMarketCalculation;
  note: string;
};

export declare const RejectedMarkToMarketCalculation:
  damlTypes.Template<RejectedMarkToMarketCalculation, RejectedMarkToMarketCalculation.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:RejectedMarkToMarketCalculation'> & {
  Archive: damlTypes.Choice<RejectedMarkToMarketCalculation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, RejectedMarkToMarketCalculation.Key>;
  RejectedMarkToMarketCalculation_Cancel: damlTypes.Choice<RejectedMarkToMarketCalculation, RejectedMarkToMarketCalculation_Cancel, {}, RejectedMarkToMarketCalculation.Key>;
  RejectedMarkToMarketCalculation_Retry: damlTypes.Choice<RejectedMarkToMarketCalculation, RejectedMarkToMarketCalculation_Retry, damlTypes.ContractId<MarkToMarketCalculation>, RejectedMarkToMarketCalculation.Key>;
};

export declare namespace RejectedMarkToMarketCalculation {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<RejectedMarkToMarketCalculation, RejectedMarkToMarketCalculation.Key, typeof RejectedMarkToMarketCalculation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<RejectedMarkToMarketCalculation, typeof RejectedMarkToMarketCalculation.templateId>
  export type Event = damlLedger.Event<RejectedMarkToMarketCalculation, RejectedMarkToMarketCalculation.Key, typeof RejectedMarkToMarketCalculation.templateId>
  export type QueryResult = damlLedger.QueryResult<RejectedMarkToMarketCalculation, RejectedMarkToMarketCalculation.Key, typeof RejectedMarkToMarketCalculation.templateId>
}



export declare type MarkToMarketCalculation_Reject = {
  note: string;
};

export declare const MarkToMarketCalculation_Reject:
  damlTypes.Serializable<MarkToMarketCalculation_Reject> & {
  }
;


export declare type MarkToMarketCalculation_Resolve = {
  note: string;
};

export declare const MarkToMarketCalculation_Resolve:
  damlTypes.Serializable<MarkToMarketCalculation_Resolve> & {
  }
;


export declare type MarkToMarketCalculation = {
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  accountId: DA_Finance_Types.Id;
  currency: DA_Finance_Types.Id;
  mtmAmount: damlTypes.Numeric;
  calculationTime: damlTypes.Time;
  calculationId: string;
};

export declare const MarkToMarketCalculation:
  damlTypes.Template<MarkToMarketCalculation, MarkToMarketCalculation.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:MarkToMarketCalculation'> & {
  Archive: damlTypes.Choice<MarkToMarketCalculation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, MarkToMarketCalculation.Key>;
  MarkToMarketCalculation_Resolve: damlTypes.Choice<MarkToMarketCalculation, MarkToMarketCalculation_Resolve, damlTypes.ContractId<FulfilledMarkToMarketCalculation>, MarkToMarketCalculation.Key>;
  MarkToMarketCalculation_Reject: damlTypes.Choice<MarkToMarketCalculation, MarkToMarketCalculation_Reject, damlTypes.ContractId<RejectedMarkToMarketCalculation>, MarkToMarketCalculation.Key>;
};

export declare namespace MarkToMarketCalculation {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<MarkToMarketCalculation, MarkToMarketCalculation.Key, typeof MarkToMarketCalculation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<MarkToMarketCalculation, typeof MarkToMarketCalculation.templateId>
  export type Event = damlLedger.Event<MarkToMarketCalculation, MarkToMarketCalculation.Key, typeof MarkToMarketCalculation.templateId>
  export type QueryResult = damlLedger.QueryResult<MarkToMarketCalculation, MarkToMarketCalculation.Key, typeof MarkToMarketCalculation.templateId>
}



export declare type RejectedMarginCalculation_Retry = {
  ctrl: damlTypes.Party;
};

export declare const RejectedMarginCalculation_Retry:
  damlTypes.Serializable<RejectedMarginCalculation_Retry> & {
  }
;


export declare type RejectedMarginCalculation_Cancel = {
};

export declare const RejectedMarginCalculation_Cancel:
  damlTypes.Serializable<RejectedMarginCalculation_Cancel> & {
  }
;


export declare type RejectedMarginCalculation = {
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  calculation: MarginCalculation;
  note: string;
};

export declare const RejectedMarginCalculation:
  damlTypes.Template<RejectedMarginCalculation, RejectedMarginCalculation.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:RejectedMarginCalculation'> & {
  Archive: damlTypes.Choice<RejectedMarginCalculation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, RejectedMarginCalculation.Key>;
  RejectedMarginCalculation_Cancel: damlTypes.Choice<RejectedMarginCalculation, RejectedMarginCalculation_Cancel, {}, RejectedMarginCalculation.Key>;
  RejectedMarginCalculation_Retry: damlTypes.Choice<RejectedMarginCalculation, RejectedMarginCalculation_Retry, damlTypes.ContractId<MarginCalculation>, RejectedMarginCalculation.Key>;
};

export declare namespace RejectedMarginCalculation {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<RejectedMarginCalculation, RejectedMarginCalculation.Key, typeof RejectedMarginCalculation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<RejectedMarginCalculation, typeof RejectedMarginCalculation.templateId>
  export type Event = damlLedger.Event<RejectedMarginCalculation, RejectedMarginCalculation.Key, typeof RejectedMarginCalculation.templateId>
  export type QueryResult = damlLedger.QueryResult<RejectedMarginCalculation, RejectedMarginCalculation.Key, typeof RejectedMarginCalculation.templateId>
}



export declare type FulfilledMarginCalculation = {
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  calculation: MarginCalculation;
  note: string;
};

export declare const FulfilledMarginCalculation:
  damlTypes.Template<FulfilledMarginCalculation, FulfilledMarginCalculation.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:FulfilledMarginCalculation'> & {
  Archive: damlTypes.Choice<FulfilledMarginCalculation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, FulfilledMarginCalculation.Key>;
};

export declare namespace FulfilledMarginCalculation {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<FulfilledMarginCalculation, FulfilledMarginCalculation.Key, typeof FulfilledMarginCalculation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<FulfilledMarginCalculation, typeof FulfilledMarginCalculation.templateId>
  export type Event = damlLedger.Event<FulfilledMarginCalculation, FulfilledMarginCalculation.Key, typeof FulfilledMarginCalculation.templateId>
  export type QueryResult = damlLedger.QueryResult<FulfilledMarginCalculation, FulfilledMarginCalculation.Key, typeof FulfilledMarginCalculation.templateId>
}



export declare type MarginCalculation_Reject = {
  note: string;
};

export declare const MarginCalculation_Reject:
  damlTypes.Serializable<MarginCalculation_Reject> & {
  }
;


export declare type MarginCalculation_Resolve = {
  note: string;
};

export declare const MarginCalculation_Resolve:
  damlTypes.Serializable<MarginCalculation_Resolve> & {
  }
;


export declare type MarginCalculation = {
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  accountId: DA_Finance_Types.Id;
  currency: DA_Finance_Types.Id;
  targetAmount: damlTypes.Numeric;
  calculationTime: damlTypes.Time;
  calculationId: string;
};

export declare const MarginCalculation:
  damlTypes.Template<MarginCalculation, MarginCalculation.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:MarginCalculation'> & {
  Archive: damlTypes.Choice<MarginCalculation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, MarginCalculation.Key>;
  MarginCalculation_Resolve: damlTypes.Choice<MarginCalculation, MarginCalculation_Resolve, damlTypes.ContractId<FulfilledMarginCalculation>, MarginCalculation.Key>;
  MarginCalculation_Reject: damlTypes.Choice<MarginCalculation, MarginCalculation_Reject, damlTypes.ContractId<RejectedMarginCalculation>, MarginCalculation.Key>;
};

export declare namespace MarginCalculation {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<MarginCalculation, MarginCalculation.Key, typeof MarginCalculation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<MarginCalculation, typeof MarginCalculation.templateId>
  export type Event = damlLedger.Event<MarginCalculation, MarginCalculation.Key, typeof MarginCalculation.templateId>
  export type QueryResult = damlLedger.QueryResult<MarginCalculation, MarginCalculation.Key, typeof MarginCalculation.templateId>
}



export declare type MemberStanding_AddObservers = {
  newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const MemberStanding_AddObservers:
  damlTypes.Serializable<MemberStanding_AddObservers> & {
  }
;


export declare type MemberStanding_UpdateMTM = {
  newMtmSatisied: boolean;
};

export declare const MemberStanding_UpdateMTM:
  damlTypes.Serializable<MemberStanding_UpdateMTM> & {
  }
;


export declare type MemberStanding_UpdateMargin = {
  newMarginSatisfied: boolean;
};

export declare const MemberStanding_UpdateMargin:
  damlTypes.Serializable<MemberStanding_UpdateMargin> & {
  }
;


export declare type MemberStanding = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  marginSatisfied: boolean;
  mtmSatisfied: boolean;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const MemberStanding:
  damlTypes.Template<MemberStanding, MemberStanding.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:MemberStanding'> & {
  Archive: damlTypes.Choice<MemberStanding, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, MemberStanding.Key>;
  MemberStanding_UpdateMargin: damlTypes.Choice<MemberStanding, MemberStanding_UpdateMargin, damlTypes.ContractId<MemberStanding>, MemberStanding.Key>;
  MemberStanding_UpdateMTM: damlTypes.Choice<MemberStanding, MemberStanding_UpdateMTM, damlTypes.ContractId<MemberStanding>, MemberStanding.Key>;
  MemberStanding_AddObservers: damlTypes.Choice<MemberStanding, MemberStanding_AddObservers, damlTypes.ContractId<MemberStanding>, MemberStanding.Key>;
};

export declare namespace MemberStanding {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<MemberStanding, MemberStanding.Key, typeof MemberStanding.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<MemberStanding, typeof MemberStanding.templateId>
  export type Event = damlLedger.Event<MemberStanding, MemberStanding.Key, typeof MemberStanding.templateId>
  export type QueryResult = damlLedger.QueryResult<MemberStanding, MemberStanding.Key, typeof MemberStanding.templateId>
}


