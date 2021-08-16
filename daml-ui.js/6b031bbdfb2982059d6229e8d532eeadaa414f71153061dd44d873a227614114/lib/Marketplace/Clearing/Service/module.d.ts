// Generated from Marketplace/Clearing/Service.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Asset from '../../../DA/Finance/Asset/module';
import * as DA_Finance_Types from '../../../DA/Finance/Types/module';
import * as Marketplace_Clearing_Model from '../../../Marketplace/Clearing/Model/module';

export declare type Approve = {
  operator: damlTypes.Party;
  ccpAccount: DA_Finance_Types.Account;
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
  clearingAccount: DA_Finance_Types.Account;
  marginAccount: DA_Finance_Types.Account;
};

export declare const Request:
  damlTypes.Template<Request, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Service:Request'> & {
  Approve: damlTypes.Choice<Request, Approve, damlTypes.ContractId<Service>, undefined>;
  Cancel: damlTypes.Choice<Request, Cancel, {}, undefined>;
  Archive: damlTypes.Choice<Request, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  Reject: damlTypes.Choice<Request, Reject, {}, undefined>;
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
  clearingAccount: DA_Finance_Types.Account;
  marginAccount: DA_Finance_Types.Account;
};

export declare const Accept:
  damlTypes.Serializable<Accept> & {
  }
;


export declare type Offer = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  ccpAccount: DA_Finance_Types.Account;
};

export declare const Offer:
  damlTypes.Template<Offer, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Service:Offer'> & {
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


export declare type TransferToMargin = {
  depositCids: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[];
  amount: damlTypes.Numeric;
};

export declare const TransferToMargin:
  damlTypes.Serializable<TransferToMargin> & {
  }
;


export declare type TransferFromMargin = {
  marginDepositCids: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[];
  amount: damlTypes.Numeric;
};

export declare const TransferFromMargin:
  damlTypes.Serializable<TransferFromMargin> & {
  }
;


export declare type TransferToProvider = {
  amount: damlTypes.Numeric;
  depositCids: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[];
};

export declare const TransferToProvider:
  damlTypes.Serializable<TransferToProvider> & {
  }
;


export declare type TransferFromProvider = {
  depositCids: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[];
  amount: damlTypes.Numeric;
};

export declare const TransferFromProvider:
  damlTypes.Serializable<TransferFromProvider> & {
  }
;


export declare type PerformMarkToMarket = {
  providerDepositCids: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[];
  customerDepositCids: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[];
  calculationCid: damlTypes.ContractId<Marketplace_Clearing_Model.MarkToMarketCalculation>;
};

export declare const PerformMarkToMarket:
  damlTypes.Serializable<PerformMarkToMarket> & {
  }
;


export declare type PerformMarginFill = {
  depositCids: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[];
  marginDepositCids: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[];
  calculationCid: damlTypes.ContractId<Marketplace_Clearing_Model.MarginCalculation>;
};

export declare const PerformMarginFill:
  damlTypes.Serializable<PerformMarginFill> & {
  }
;


export declare type CreateMarkToMarket = {
  mtmAmount: damlTypes.Numeric;
  currency: DA_Finance_Types.Id;
  calculationId: string;
};

export declare const CreateMarkToMarket:
  damlTypes.Serializable<CreateMarkToMarket> & {
  }
;


export declare type CreateMarginCalculation = {
  targetAmount: damlTypes.Numeric;
  currency: DA_Finance_Types.Id;
  calculationId: string;
};

export declare const CreateMarginCalculation:
  damlTypes.Serializable<CreateMarginCalculation> & {
  }
;


export declare type ApproveTrade = {
};

export declare const ApproveTrade:
  damlTypes.Serializable<ApproveTrade> & {
  }
;


export declare type Service = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  ccpAccount: DA_Finance_Types.Account;
  clearingAccount: DA_Finance_Types.Account;
  marginAccount: DA_Finance_Types.Account;
};

export declare const Service:
  damlTypes.Template<Service, Service.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Service:Service'> & {
  Terminate: damlTypes.Choice<Service, Terminate, {}, Service.Key>;
  TransferToMargin: damlTypes.Choice<Service, TransferToMargin, DepositWithRemaining, Service.Key>;
  TransferFromMargin: damlTypes.Choice<Service, TransferFromMargin, DepositWithRemaining, Service.Key>;
  TransferToProvider: damlTypes.Choice<Service, TransferToProvider, DepositWithRemaining, Service.Key>;
  TransferFromProvider: damlTypes.Choice<Service, TransferFromProvider, DepositWithRemaining, Service.Key>;
  PerformMarkToMarket: damlTypes.Choice<Service, PerformMarkToMarket, CalculationResult<Marketplace_Clearing_Model.FulfilledMarkToMarketCalculation, Marketplace_Clearing_Model.RejectedMarkToMarketCalculation>, Service.Key>;
  PerformMarginFill: damlTypes.Choice<Service, PerformMarginFill, CalculationResult<Marketplace_Clearing_Model.FulfilledMarginCalculation, Marketplace_Clearing_Model.RejectedMarginCalculation>, Service.Key>;
  CreateMarkToMarket: damlTypes.Choice<Service, CreateMarkToMarket, damlTypes.ContractId<Marketplace_Clearing_Model.MarkToMarketCalculation>, Service.Key>;
  CreateMarginCalculation: damlTypes.Choice<Service, CreateMarginCalculation, damlTypes.ContractId<Marketplace_Clearing_Model.MarginCalculation>, Service.Key>;
  ApproveTrade: damlTypes.Choice<Service, ApproveTrade, boolean, Service.Key>;
  Archive: damlTypes.Choice<Service, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Service.Key>;
};

export declare namespace Service {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<Service, Service.Key, typeof Service.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Service, typeof Service.templateId>
  export type Event = damlLedger.Event<Service, Service.Key, typeof Service.templateId>
  export type QueryResult = damlLedger.QueryResult<Service, Service.Key, typeof Service.templateId>
}



export declare type CalculationResult<a, b> =
  |  { tag: 'CalculationSuccess'; value: CalculationResult.CalculationSuccess<a, b> }
  |  { tag: 'CalculationFailure'; value: CalculationResult.CalculationFailure<a, b> }
;

export declare const CalculationResult :
  (<a, b>(a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<CalculationResult<a, b>>) & {
  CalculationSuccess: (<a, b>(a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<CalculationResult.CalculationSuccess<a, b>>);
  CalculationFailure: (<a, b>(a: damlTypes.Serializable<a>, b: damlTypes.Serializable<b>) => damlTypes.Serializable<CalculationResult.CalculationFailure<a, b>>);
};


export namespace CalculationResult {
  type CalculationSuccess<a, b> = {
    successCid: damlTypes.ContractId<a>;
    deposits: damlTypes.Optional<DepositWithRemaining>;
  };
} //namespace CalculationResult


export namespace CalculationResult {
  type CalculationFailure<a, b> = {
    failureCid: damlTypes.ContractId<b>;
  };
} //namespace CalculationResult


export declare type DepositWithRemaining = {
  deposit: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  remaining: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[];
};

export declare const DepositWithRemaining:
  damlTypes.Serializable<DepositWithRemaining> & {
  }
;

