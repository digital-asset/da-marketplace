// Generated from Marketplace/Clearing/Market/Model.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Types from '../../../../DA/Finance/Types/module';

export declare type FairValue = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  listingId: string;
  price: damlTypes.Numeric;
  currency: DA_Finance_Types.Id;
  timestamp: damlTypes.Time;
  upTo: damlTypes.Time;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const FairValue:
  damlTypes.Template<FairValue, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Model:FairValue'> & {
  Archive: damlTypes.Choice<FairValue, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace FairValue {
  export type CreateEvent = damlLedger.CreateEvent<FairValue, undefined, typeof FairValue.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<FairValue, typeof FairValue.templateId>
  export type Event = damlLedger.Event<FairValue, undefined, typeof FairValue.templateId>
  export type QueryResult = damlLedger.QueryResult<FairValue, undefined, typeof FairValue.templateId>
}



export declare type ManualFairValueCalculation_Calculate = {
  price: damlTypes.Numeric;
};

export declare const ManualFairValueCalculation_Calculate:
  damlTypes.Serializable<ManualFairValueCalculation_Calculate> & {
  }
;


export declare type ManualFairValueCalculation = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  listingId: string;
  currency: DA_Finance_Types.Id;
  upTo: damlTypes.Time;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const ManualFairValueCalculation:
  damlTypes.Template<ManualFairValueCalculation, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Model:ManualFairValueCalculation'> & {
  Archive: damlTypes.Choice<ManualFairValueCalculation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  ManualFairValueCalculation_Calculate: damlTypes.Choice<ManualFairValueCalculation, ManualFairValueCalculation_Calculate, damlTypes.ContractId<FairValue>, undefined>;
};

export declare namespace ManualFairValueCalculation {
  export type CreateEvent = damlLedger.CreateEvent<ManualFairValueCalculation, undefined, typeof ManualFairValueCalculation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ManualFairValueCalculation, typeof ManualFairValueCalculation.templateId>
  export type Event = damlLedger.Event<ManualFairValueCalculation, undefined, typeof ManualFairValueCalculation.templateId>
  export type QueryResult = damlLedger.QueryResult<ManualFairValueCalculation, undefined, typeof ManualFairValueCalculation.templateId>
}



export declare type FairValueCalculationRequest_Ack = {
};

export declare const FairValueCalculationRequest_Ack:
  damlTypes.Serializable<FairValueCalculationRequest_Ack> & {
  }
;


export declare type FairValueCalculationRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  optListingIds: damlTypes.Optional<string[]>;
  currency: DA_Finance_Types.Id;
  upTo: damlTypes.Time;
};

export declare const FairValueCalculationRequest:
  damlTypes.Template<FairValueCalculationRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Model:FairValueCalculationRequest'> & {
  Archive: damlTypes.Choice<FairValueCalculationRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  FairValueCalculationRequest_Ack: damlTypes.Choice<FairValueCalculationRequest, FairValueCalculationRequest_Ack, {}, undefined>;
};

export declare namespace FairValueCalculationRequest {
  export type CreateEvent = damlLedger.CreateEvent<FairValueCalculationRequest, undefined, typeof FairValueCalculationRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<FairValueCalculationRequest, typeof FairValueCalculationRequest.templateId>
  export type Event = damlLedger.Event<FairValueCalculationRequest, undefined, typeof FairValueCalculationRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<FairValueCalculationRequest, undefined, typeof FairValueCalculationRequest.templateId>
}


