// Generated from Marketplace/Trading/Service.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Types from '../../../DA/Finance/Types/module';
import * as Marketplace_Trading_Confirmation_Model from '../../../Marketplace/Trading/Confirmation/Model/module';
import * as Marketplace_Trading_Model from '../../../Marketplace/Trading/Model/module';

export declare type FailureCancel = {
  errorCode: damlTypes.Int;
  errorMessage: string;
};

export declare const FailureCancel:
  damlTypes.Serializable<FailureCancel> & {
  }
;


export declare type AcknowledgeCancel = {
};

export declare const AcknowledgeCancel:
  damlTypes.Serializable<AcknowledgeCancel> & {
  }
;


export declare type CancelOrderRequest = {
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  operator: damlTypes.Party;
  details: Marketplace_Trading_Model.Details;
};

export declare const CancelOrderRequest:
  damlTypes.Template<CancelOrderRequest, CancelOrderRequest.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Service:CancelOrderRequest'> & {
  Archive: damlTypes.Choice<CancelOrderRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, CancelOrderRequest.Key>;
  FailureCancel: damlTypes.Choice<CancelOrderRequest, FailureCancel, damlTypes.ContractId<Marketplace_Trading_Model.Order>, CancelOrderRequest.Key>;
  AcknowledgeCancel: damlTypes.Choice<CancelOrderRequest, AcknowledgeCancel, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Trading_Model.Order>, Marketplace_Trading_Model.TradeCollateral>, CancelOrderRequest.Key>;
};

export declare namespace CancelOrderRequest {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<CancelOrderRequest, CancelOrderRequest.Key, typeof CancelOrderRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<CancelOrderRequest, typeof CancelOrderRequest.templateId>
  export type Event = damlLedger.Event<CancelOrderRequest, CancelOrderRequest.Key, typeof CancelOrderRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<CancelOrderRequest, CancelOrderRequest.Key, typeof CancelOrderRequest.templateId>
}



export declare type CancelRequest = {
  providerOrderId: string;
  cancelledQuantity: damlTypes.Numeric;
};

export declare const CancelRequest:
  damlTypes.Serializable<CancelRequest> & {
  }
;


export declare type RejectRequest = {
  errorCode: damlTypes.Int;
  errorMessage: string;
};

export declare const RejectRequest:
  damlTypes.Serializable<RejectRequest> & {
  }
;


export declare type AcknowledgeRequest = {
  providerOrderId: string;
};

export declare const AcknowledgeRequest:
  damlTypes.Serializable<AcknowledgeRequest> & {
  }
;


export declare type CreateOrderRequest = {
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  operator: damlTypes.Party;
  details: Marketplace_Trading_Model.Details;
  collateral: Marketplace_Trading_Model.TradeCollateral;
};

export declare const CreateOrderRequest:
  damlTypes.Template<CreateOrderRequest, CreateOrderRequest.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Service:CreateOrderRequest'> & {
  Archive: damlTypes.Choice<CreateOrderRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, CreateOrderRequest.Key>;
  CancelRequest: damlTypes.Choice<CreateOrderRequest, CancelRequest, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Trading_Model.Order>, Marketplace_Trading_Model.TradeCollateral>, CreateOrderRequest.Key>;
  RejectRequest: damlTypes.Choice<CreateOrderRequest, RejectRequest, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Trading_Model.Order>, Marketplace_Trading_Model.TradeCollateral>, CreateOrderRequest.Key>;
  AcknowledgeRequest: damlTypes.Choice<CreateOrderRequest, AcknowledgeRequest, damlTypes.ContractId<Marketplace_Trading_Model.Order>, CreateOrderRequest.Key>;
};

export declare namespace CreateOrderRequest {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<CreateOrderRequest, CreateOrderRequest.Key, typeof CreateOrderRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<CreateOrderRequest, typeof CreateOrderRequest.templateId>
  export type Event = damlLedger.Event<CreateOrderRequest, CreateOrderRequest.Key, typeof CreateOrderRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<CreateOrderRequest, CreateOrderRequest.Key, typeof CreateOrderRequest.templateId>
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
  tradingAccount: DA_Finance_Types.Account;
  allocationAccount: DA_Finance_Types.Account;
};

export declare const Request:
  damlTypes.Template<Request, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Service:Request'> & {
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
  damlTypes.Template<Offer, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Service:Offer'> & {
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


export declare type SignConfirmation = {
  confirmationCid: damlTypes.ContractId<Marketplace_Trading_Confirmation_Model.Confirmation>;
};

export declare const SignConfirmation:
  damlTypes.Serializable<SignConfirmation> & {
  }
;


export declare type RejectCancellation = {
  cancelOrderRequestCid: damlTypes.ContractId<CancelOrderRequest>;
  errorCode: damlTypes.Int;
  errorMessage: string;
};

export declare const RejectCancellation:
  damlTypes.Serializable<RejectCancellation> & {
  }
;


export declare type CancelOrder = {
  cancelOrderRequestCid: damlTypes.ContractId<CancelOrderRequest>;
};

export declare const CancelOrder:
  damlTypes.Serializable<CancelOrder> & {
  }
;


export declare type MarketOrderCancelRequest = {
  createOrderRequestCid: damlTypes.ContractId<CreateOrderRequest>;
  providerOrderId: string;
  cancelledQuantity: damlTypes.Numeric;
};

export declare const MarketOrderCancelRequest:
  damlTypes.Serializable<MarketOrderCancelRequest> & {
  }
;


export declare type RejectOrderRequest = {
  createOrderRequestCid: damlTypes.ContractId<CreateOrderRequest>;
  errorCode: damlTypes.Int;
  errorMessage: string;
};

export declare const RejectOrderRequest:
  damlTypes.Serializable<RejectOrderRequest> & {
  }
;


export declare type AcknowledgeOrderRequest = {
  createOrderRequestCid: damlTypes.ContractId<CreateOrderRequest>;
  providerOrderId: string;
};

export declare const AcknowledgeOrderRequest:
  damlTypes.Serializable<AcknowledgeOrderRequest> & {
  }
;


export declare type RequestCancelOrder = {
  orderCid: damlTypes.ContractId<Marketplace_Trading_Model.Order>;
};

export declare const RequestCancelOrder:
  damlTypes.Serializable<RequestCancelOrder> & {
  }
;


export declare type RequestCreateOrder = {
  collateral: Marketplace_Trading_Model.TradeCollateral;
  details: Marketplace_Trading_Model.Details;
};

export declare const RequestCreateOrder:
  damlTypes.Serializable<RequestCreateOrder> & {
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
  damlTypes.Template<Service, Service.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Service:Service'> & {
  RejectCancellation: damlTypes.Choice<Service, RejectCancellation, damlTypes.ContractId<Marketplace_Trading_Model.Order>, Service.Key>;
  CancelOrder: damlTypes.Choice<Service, CancelOrder, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Trading_Model.Order>, Marketplace_Trading_Model.TradeCollateral>, Service.Key>;
  Terminate: damlTypes.Choice<Service, Terminate, {}, Service.Key>;
  MarketOrderCancelRequest: damlTypes.Choice<Service, MarketOrderCancelRequest, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Trading_Model.Order>, Marketplace_Trading_Model.TradeCollateral>, Service.Key>;
  RejectOrderRequest: damlTypes.Choice<Service, RejectOrderRequest, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Trading_Model.Order>, Marketplace_Trading_Model.TradeCollateral>, Service.Key>;
  AcknowledgeOrderRequest: damlTypes.Choice<Service, AcknowledgeOrderRequest, damlTypes.ContractId<Marketplace_Trading_Model.Order>, Service.Key>;
  RequestCancelOrder: damlTypes.Choice<Service, RequestCancelOrder, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Trading_Model.Order>, damlTypes.ContractId<CancelOrderRequest>>, Service.Key>;
  RequestCreateOrder: damlTypes.Choice<Service, RequestCreateOrder, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Either<damlTypes.ContractId<Marketplace_Trading_Model.Order>, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.ContractId<Marketplace_Trading_Model.Order>, damlTypes.ContractId<CreateOrderRequest>, Marketplace_Trading_Model.TradeCollateral>>, Service.Key>;
  Archive: damlTypes.Choice<Service, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Service.Key>;
  SignConfirmation: damlTypes.Choice<Service, SignConfirmation, damlTypes.ContractId<Marketplace_Trading_Confirmation_Model.Confirmation>, Service.Key>;
};

export declare namespace Service {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<Service, Service.Key, typeof Service.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Service, typeof Service.templateId>
  export type Event = damlLedger.Event<Service, Service.Key, typeof Service.templateId>
  export type QueryResult = damlLedger.QueryResult<Service, Service.Key, typeof Service.templateId>
}


