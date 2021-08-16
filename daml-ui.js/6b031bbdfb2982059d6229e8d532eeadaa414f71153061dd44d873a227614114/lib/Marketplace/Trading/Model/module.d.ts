// Generated from Marketplace/Trading/Model.daml
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

import * as DA_Finance_Asset from '../../../DA/Finance/Asset/module';
import * as DA_Finance_Types from '../../../DA/Finance/Types/module';
import * as Marketplace_Trading_Error from '../../../Marketplace/Trading/Error/module';

export declare type UpdateFeeSchedule = {
  amount: damlTypes.Numeric;
  currency: DA_Finance_Types.Id;
};

export declare const UpdateFeeSchedule:
  damlTypes.Serializable<UpdateFeeSchedule> & {
  }
;


export declare type FeeSchedule = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  currentFee: Fee;
  pastFees: Fee[];
  feeAccount: DA_Finance_Types.Account;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const FeeSchedule:
  damlTypes.Template<FeeSchedule, FeeSchedule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Model:FeeSchedule'> & {
  Archive: damlTypes.Choice<FeeSchedule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, FeeSchedule.Key>;
  UpdateFeeSchedule: damlTypes.Choice<FeeSchedule, UpdateFeeSchedule, damlTypes.ContractId<FeeSchedule>, FeeSchedule.Key>;
};

export declare namespace FeeSchedule {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<FeeSchedule, FeeSchedule.Key, typeof FeeSchedule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<FeeSchedule, typeof FeeSchedule.templateId>
  export type Event = damlLedger.Event<FeeSchedule, FeeSchedule.Key, typeof FeeSchedule.templateId>
  export type QueryResult = damlLedger.QueryResult<FeeSchedule, FeeSchedule.Key, typeof FeeSchedule.templateId>
}



export declare type Fee = {
  amount: damlTypes.Numeric;
  currency: DA_Finance_Types.Id;
  timeInEffect: damlTypes.Time;
};

export declare const Fee:
  damlTypes.Serializable<Fee> & {
  }
;


export declare type Order = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  status: Status;
  details: Details;
  providerOrderId: damlTypes.Optional<string>;
  executions: Execution[];
  remainingQuantity: damlTypes.Numeric;
  collateral: TradeCollateral;
  createdAt: damlTypes.Time;
};

export declare const Order:
  damlTypes.Template<Order, Order.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Model:Order'> & {
  Archive: damlTypes.Choice<Order, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Order.Key>;
};

export declare namespace Order {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<Order, Order.Key, typeof Order.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Order, typeof Order.templateId>
  export type Event = damlLedger.Event<Order, Order.Key, typeof Order.templateId>
  export type QueryResult = damlLedger.QueryResult<Order, Order.Key, typeof Order.templateId>
}



export declare type TradeCollateral =
  |  { tag: 'Cleared'; value: TradeCollateral.Cleared }
  |  { tag: 'Collateral'; value: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit> }
;

export declare const TradeCollateral:
  damlTypes.Serializable<TradeCollateral> & {
  Cleared: damlTypes.Serializable<TradeCollateral.Cleared>;
  }
;


export namespace TradeCollateral {
  type Cleared = {
    clearinghouse: damlTypes.Party;
  };
} //namespace TradeCollateral


export declare type Execution = {
  matchId: string;
  makerOrderId: string;
  takerOrderId: string;
  quantity: damlTypes.Numeric;
  price: damlTypes.Numeric;
  timestamp: string;
};

export declare const Execution:
  damlTypes.Serializable<Execution> & {
  }
;


export declare type Status =
  |  { tag: 'New'; value: {} }
  |  { tag: 'PendingExecution'; value: {} }
  |  { tag: 'PartiallyExecuted'; value: {} }
  |  { tag: 'FullyExecuted'; value: {} }
  |  { tag: 'Rejected'; value: Status.Rejected }
  |  { tag: 'PendingCancellation'; value: {} }
  |  { tag: 'CancellationRejected'; value: Status.CancellationRejected }
  |  { tag: 'Cancelled'; value: {} }
;

export declare const Status:
  damlTypes.Serializable<Status> & {
  Rejected: damlTypes.Serializable<Status.Rejected>;
  CancellationRejected: damlTypes.Serializable<Status.CancellationRejected>;
  }
;


export namespace Status {
  type Rejected = {
    reason: Marketplace_Trading_Error.Error;
  };
} //namespace Status


export namespace Status {
  type CancellationRejected = {
    reason: Marketplace_Trading_Error.Error;
  };
} //namespace Status


export declare type Details = {
  id: string;
  listingId: string;
  asset: DA_Finance_Types.Asset;
  side: Side;
  orderType: OrderType;
  timeInForce: TimeInForce;
  optExchangeFee: damlTypes.Optional<damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>>;
};

export declare const Details:
  damlTypes.Serializable<Details> & {
  }
;


export declare type TimeInForce =
  |  { tag: 'GTC'; value: {} }
  |  { tag: 'GTD'; value: TimeInForce.GTD }
  |  { tag: 'GAA'; value: {} }
  |  { tag: 'IOC'; value: {} }
  |  { tag: 'FOK'; value: {} }
;

export declare const TimeInForce:
  damlTypes.Serializable<TimeInForce> & {
  GTD: damlTypes.Serializable<TimeInForce.GTD>;
  }
;


export namespace TimeInForce {
  type GTD = {
    expiryDate: damlTypes.Int;
  };
} //namespace TimeInForce


export declare type OrderType =
  |  { tag: 'Market'; value: {} }
  |  { tag: 'Limit'; value: OrderType.Limit }
;

export declare const OrderType:
  damlTypes.Serializable<OrderType> & {
  Limit: damlTypes.Serializable<OrderType.Limit>;
  }
;


export namespace OrderType {
  type Limit = {
    price: damlTypes.Numeric;
  };
} //namespace OrderType


export declare type Side =
  | 'Buy'
  | 'Sell'
;

export declare const Side:
  damlTypes.Serializable<Side> & {
  }
& { readonly keys: Side[] } & { readonly [e in Side]: e }
;

