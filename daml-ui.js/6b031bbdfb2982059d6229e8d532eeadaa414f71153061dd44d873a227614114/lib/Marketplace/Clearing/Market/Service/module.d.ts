// Generated from Marketplace/Clearing/Market/Service.daml
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

import * as DA_Finance_Types from '../../../../DA/Finance/Types/module';
import * as Marketplace_Clearing_Market_Model from '../../../../Marketplace/Clearing/Market/Model/module';
import * as Marketplace_Listing_Model from '../../../../Marketplace/Listing/Model/module';

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
  damlTypes.Template<Request, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Service:Request'> & {
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
  damlTypes.Template<Offer, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Service:Offer'> & {
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



export declare type Terminate = {
  ctrl: damlTypes.Party;
};

export declare const Terminate:
  damlTypes.Serializable<Terminate> & {
  }
;


export declare type RequestFairValues = {
  party: damlTypes.Party;
  listingIds: string[];
  currency: DA_Finance_Types.Id;
};

export declare const RequestFairValues:
  damlTypes.Serializable<RequestFairValues> & {
  }
;


export declare type RequestAllFairValues = {
  party: damlTypes.Party;
  currency: DA_Finance_Types.Id;
};

export declare const RequestAllFairValues:
  damlTypes.Serializable<RequestAllFairValues> & {
  }
;


export declare type ApproveClearedListing = {
  symbol: string;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const ApproveClearedListing:
  damlTypes.Serializable<ApproveClearedListing> & {
  }
;


export declare type CreateManualFairValueRequest = {
  listingId: string;
  currency: DA_Finance_Types.Id;
  upTo: damlTypes.Time;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const CreateManualFairValueRequest:
  damlTypes.Serializable<CreateManualFairValueRequest> & {
  }
;


export declare type CreateFairValue = {
  listingId: string;
  price: damlTypes.Numeric;
  currency: DA_Finance_Types.Id;
  timestamp: damlTypes.Time;
  upTo: damlTypes.Time;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const CreateFairValue:
  damlTypes.Serializable<CreateFairValue> & {
  }
;


export declare type Service = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
};

export declare const Service:
  damlTypes.Template<Service, Service.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Service:Service'> & {
  CreateFairValue: damlTypes.Choice<Service, CreateFairValue, damlTypes.ContractId<Marketplace_Clearing_Market_Model.FairValue>, Service.Key>;
  CreateManualFairValueRequest: damlTypes.Choice<Service, CreateManualFairValueRequest, damlTypes.ContractId<Marketplace_Clearing_Market_Model.ManualFairValueCalculation>, Service.Key>;
  ApproveClearedListing: damlTypes.Choice<Service, ApproveClearedListing, damlTypes.ContractId<Marketplace_Listing_Model.ClearedListingApproval>, Service.Key>;
  RequestAllFairValues: damlTypes.Choice<Service, RequestAllFairValues, damlTypes.ContractId<Marketplace_Clearing_Market_Model.FairValueCalculationRequest>, Service.Key>;
  RequestFairValues: damlTypes.Choice<Service, RequestFairValues, damlTypes.ContractId<Marketplace_Clearing_Market_Model.FairValueCalculationRequest>, Service.Key>;
  Terminate: damlTypes.Choice<Service, Terminate, {}, Service.Key>;
  Archive: damlTypes.Choice<Service, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Service.Key>;
};

export declare namespace Service {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<Service, Service.Key, typeof Service.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Service, typeof Service.templateId>
  export type Event = damlLedger.Event<Service, Service.Key, typeof Service.templateId>
  export type QueryResult = damlLedger.QueryResult<Service, Service.Key, typeof Service.templateId>
}


