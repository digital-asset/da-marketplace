// Generated from Marketplace/Listing/Service.daml
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
import * as Marketplace_Listing_Model from '../../../Marketplace/Listing/Model/module';
import * as Marketplace_Trading_Error from '../../../Marketplace/Trading/Error/module';

export declare type DisableListingRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  listingCid: damlTypes.ContractId<Marketplace_Listing_Model.Listing>;
};

export declare const DisableListingRequest:
  damlTypes.Template<DisableListingRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:DisableListingRequest'> & {
  Archive: damlTypes.Choice<DisableListingRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace DisableListingRequest {
  export type CreateEvent = damlLedger.CreateEvent<DisableListingRequest, undefined, typeof DisableListingRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<DisableListingRequest, typeof DisableListingRequest.templateId>
  export type Event = damlLedger.Event<DisableListingRequest, undefined, typeof DisableListingRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<DisableListingRequest, undefined, typeof DisableListingRequest.templateId>
}



export declare type FailedListingCreation = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  error: Marketplace_Trading_Error.Error;
  symbol: string;
  listingType: Marketplace_Listing_Model.ListingType;
  calendarId: string;
  description: string;
  tradedAssetId: DA_Finance_Types.Id;
  quotedAssetId: DA_Finance_Types.Id;
  tradedAssetPrecision: damlTypes.Int;
  quotedAssetPrecision: damlTypes.Int;
  minimumTradableQuantity: damlTypes.Numeric;
  maximumTradableQuantity: damlTypes.Numeric;
  status: Marketplace_Listing_Model.Status;
};

export declare const FailedListingCreation:
  damlTypes.Template<FailedListingCreation, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:FailedListingCreation'> & {
  Archive: damlTypes.Choice<FailedListingCreation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace FailedListingCreation {
  export type CreateEvent = damlLedger.CreateEvent<FailedListingCreation, undefined, typeof FailedListingCreation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<FailedListingCreation, typeof FailedListingCreation.templateId>
  export type Event = damlLedger.Event<FailedListingCreation, undefined, typeof FailedListingCreation.templateId>
  export type QueryResult = damlLedger.QueryResult<FailedListingCreation, undefined, typeof FailedListingCreation.templateId>
}



export declare type ListingRequestFailure = {
  message: string;
  name: string;
  code: string;
};

export declare const ListingRequestFailure:
  damlTypes.Serializable<ListingRequestFailure> & {
  }
;


export declare type ListingRequestSuccess = {
  providerId: string;
};

export declare const ListingRequestSuccess:
  damlTypes.Serializable<ListingRequestSuccess> & {
  }
;


export declare type CreateListingRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  symbol: string;
  listingType: Marketplace_Listing_Model.ListingType;
  calendarId: string;
  description: string;
  tradedAssetId: DA_Finance_Types.Id;
  quotedAssetId: DA_Finance_Types.Id;
  tradedAssetPrecision: damlTypes.Int;
  quotedAssetPrecision: damlTypes.Int;
  minimumTradableQuantity: damlTypes.Numeric;
  maximumTradableQuantity: damlTypes.Numeric;
  status: Marketplace_Listing_Model.Status;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const CreateListingRequest:
  damlTypes.Template<CreateListingRequest, CreateListingRequest.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:CreateListingRequest'> & {
  Archive: damlTypes.Choice<CreateListingRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, CreateListingRequest.Key>;
  ListingRequestFailure: damlTypes.Choice<CreateListingRequest, ListingRequestFailure, damlTypes.ContractId<FailedListingCreation>, CreateListingRequest.Key>;
  ListingRequestSuccess: damlTypes.Choice<CreateListingRequest, ListingRequestSuccess, damlTypes.ContractId<Marketplace_Listing_Model.Listing>, CreateListingRequest.Key>;
};

export declare namespace CreateListingRequest {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<CreateListingRequest, CreateListingRequest.Key, typeof CreateListingRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<CreateListingRequest, typeof CreateListingRequest.templateId>
  export type Event = damlLedger.Event<CreateListingRequest, CreateListingRequest.Key, typeof CreateListingRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<CreateListingRequest, CreateListingRequest.Key, typeof CreateListingRequest.templateId>
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
  damlTypes.Template<Request, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:Request'> & {
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
  damlTypes.Template<Offer, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:Offer'> & {
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



export declare type Terminate = {
  ctrl: damlTypes.Party;
};

export declare const Terminate:
  damlTypes.Serializable<Terminate> & {
  }
;


export declare type DisableListing = {
  disableListingRequestCid: damlTypes.ContractId<DisableListingRequest>;
};

export declare const DisableListing:
  damlTypes.Serializable<DisableListing> & {
  }
;


export declare type ListingFailure = {
  createListingRequestCid: damlTypes.ContractId<CreateListingRequest>;
  message: string;
  name: string;
  code: string;
};

export declare const ListingFailure:
  damlTypes.Serializable<ListingFailure> & {
  }
;


export declare type CreateListing = {
  createListingRequestCid: damlTypes.ContractId<CreateListingRequest>;
  providerId: string;
};

export declare const CreateListing:
  damlTypes.Serializable<CreateListing> & {
  }
;


export declare type RequestDisableListing = {
  listingCid: damlTypes.ContractId<Marketplace_Listing_Model.Listing>;
};

export declare const RequestDisableListing:
  damlTypes.Serializable<RequestDisableListing> & {
  }
;


export declare type RequestCreateListing = {
  listingType: ListingTypeRequest;
  symbol: string;
  calendarId: string;
  description: string;
  tradedAssetId: DA_Finance_Types.Id;
  quotedAssetId: DA_Finance_Types.Id;
  tradedAssetPrecision: damlTypes.Int;
  quotedAssetPrecision: damlTypes.Int;
  minimumTradableQuantity: damlTypes.Numeric;
  maximumTradableQuantity: damlTypes.Numeric;
  observers: damlTypes.Party[];
};

export declare const RequestCreateListing:
  damlTypes.Serializable<RequestCreateListing> & {
  }
;


export declare type Service = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
};

export declare const Service:
  damlTypes.Template<Service, Service.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:Service'> & {
  Archive: damlTypes.Choice<Service, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Service.Key>;
  RequestCreateListing: damlTypes.Choice<Service, RequestCreateListing, damlTypes.ContractId<CreateListingRequest>, Service.Key>;
  Terminate: damlTypes.Choice<Service, Terminate, {}, Service.Key>;
  RequestDisableListing: damlTypes.Choice<Service, RequestDisableListing, damlTypes.ContractId<DisableListingRequest>, Service.Key>;
  CreateListing: damlTypes.Choice<Service, CreateListing, damlTypes.ContractId<Marketplace_Listing_Model.Listing>, Service.Key>;
  ListingFailure: damlTypes.Choice<Service, ListingFailure, damlTypes.ContractId<FailedListingCreation>, Service.Key>;
  DisableListing: damlTypes.Choice<Service, DisableListing, damlTypes.ContractId<Marketplace_Listing_Model.Listing>, Service.Key>;
};

export declare namespace Service {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<Service, Service.Key, typeof Service.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Service, typeof Service.templateId>
  export type Event = damlLedger.Event<Service, Service.Key, typeof Service.templateId>
  export type QueryResult = damlLedger.QueryResult<Service, Service.Key, typeof Service.templateId>
}



export declare type ListingTypeRequest =
  |  { tag: 'CollateralizedRequest'; value: {} }
  |  { tag: 'ClearedRequest'; value: damlTypes.Party }
;

export declare const ListingTypeRequest:
  damlTypes.Serializable<ListingTypeRequest> & {
  }
;

