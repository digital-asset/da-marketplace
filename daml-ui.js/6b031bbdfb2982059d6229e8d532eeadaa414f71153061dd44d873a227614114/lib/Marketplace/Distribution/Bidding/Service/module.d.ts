// Generated from Marketplace/Distribution/Bidding/Service.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Asset from '../../../../DA/Finance/Asset/module';
import * as DA_Finance_Types from '../../../../DA/Finance/Types/module';
import * as Marketplace_Distribution_Bidding_Model from '../../../../Marketplace/Distribution/Bidding/Model/module';
import * as Marketplace_Settlement_Model from '../../../../Marketplace/Settlement/Model/module';

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
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  tradingAccount: DA_Finance_Types.Account;
  allocationAccount: DA_Finance_Types.Account;
};

export declare const Request:
  damlTypes.Template<Request, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Bidding.Service:Request'> & {
  Cancel: damlTypes.Choice<Request, Cancel, {}, undefined>;
  Reject: damlTypes.Choice<Request, Reject, {}, undefined>;
  Approve: damlTypes.Choice<Request, Approve, damlTypes.ContractId<Service>, undefined>;
  Archive: damlTypes.Choice<Request, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
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
  tradingAccount: DA_Finance_Types.Account;
  allocationAccount: DA_Finance_Types.Account;
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
  damlTypes.Template<Offer, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Bidding.Service:Offer'> & {
  Accept: damlTypes.Choice<Offer, Accept, damlTypes.ContractId<Service>, undefined>;
  Decline: damlTypes.Choice<Offer, Decline, {}, undefined>;
  Withdraw: damlTypes.Choice<Offer, Withdraw, {}, undefined>;
  Archive: damlTypes.Choice<Offer, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace Offer {
  export type CreateEvent = damlLedger.CreateEvent<Offer, undefined, typeof Offer.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Offer, typeof Offer.templateId>
  export type Event = damlLedger.Event<Offer, undefined, typeof Offer.templateId>
  export type QueryResult = damlLedger.QueryResult<Offer, undefined, typeof Offer.templateId>
}



export declare type GenerateSettlementInstruction = {
  issuer: damlTypes.Party;
  delivery: Marketplace_Settlement_Model.SettlementDetails;
  payment: Marketplace_Settlement_Model.SettlementDetails;
};

export declare const GenerateSettlementInstruction:
  damlTypes.Serializable<GenerateSettlementInstruction> & {
  }
;


export declare type RejectAllocation = {
  bidCid: damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Bid>;
  newStatus: Marketplace_Distribution_Bidding_Model.Status;
};

export declare const RejectAllocation:
  damlTypes.Serializable<RejectAllocation> & {
  }
;


export declare type ProcessAllocation = {
  bidCid: damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Bid>;
  quantity: damlTypes.Numeric;
  amount: damlTypes.Numeric;
  price: damlTypes.Numeric;
};

export declare const ProcessAllocation:
  damlTypes.Serializable<ProcessAllocation> & {
  }
;


export declare type RequestBid = {
  issuer: damlTypes.Party;
  auctionId: string;
  asset: DA_Finance_Types.Asset;
  quotedAssetId: DA_Finance_Types.Id;
  publishedBidCids: damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Bid>[];
};

export declare const RequestBid:
  damlTypes.Serializable<RequestBid> & {
  }
;


export declare type SubmitBid = {
  auctionCid: damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Auction>;
  price: damlTypes.Numeric;
  quantity: damlTypes.Numeric;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  allowPublishing: boolean;
};

export declare const SubmitBid:
  damlTypes.Serializable<SubmitBid> & {
  }
;


export declare type Service = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  tradingAccount: DA_Finance_Types.Account;
  allocationAccount: DA_Finance_Types.Account;
};

export declare const Service:
  damlTypes.Template<Service, Service.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Bidding.Service:Service'> & {
  SubmitBid: damlTypes.Choice<Service, SubmitBid, damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Bid>, Service.Key>;
  RequestBid: damlTypes.Choice<Service, RequestBid, damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Auction>, Service.Key>;
  ProcessAllocation: damlTypes.Choice<Service, ProcessAllocation, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Bid>, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>>, Service.Key>;
  RejectAllocation: damlTypes.Choice<Service, RejectAllocation, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Bid>, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>>, Service.Key>;
  GenerateSettlementInstruction: damlTypes.Choice<Service, GenerateSettlementInstruction, damlTypes.ContractId<Marketplace_Settlement_Model.SettlementInstruction>, Service.Key>;
  Archive: damlTypes.Choice<Service, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Service.Key>;
};

export declare namespace Service {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<Service, Service.Key, typeof Service.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Service, typeof Service.templateId>
  export type Event = damlLedger.Event<Service, Service.Key, typeof Service.templateId>
  export type QueryResult = damlLedger.QueryResult<Service, Service.Key, typeof Service.templateId>
}


