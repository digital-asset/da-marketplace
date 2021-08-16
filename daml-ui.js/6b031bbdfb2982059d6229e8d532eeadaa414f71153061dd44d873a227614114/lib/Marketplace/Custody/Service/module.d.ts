// Generated from Marketplace/Custody/Service.daml
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
import * as DA_Finance_Asset_Settlement from '../../../DA/Finance/Asset/Settlement/module';
import * as DA_Finance_Trade_SettlementInstruction from '../../../DA/Finance/Trade/SettlementInstruction/module';
import * as DA_Finance_Types from '../../../DA/Finance/Types/module';
import * as Marketplace_Custody_Model from '../../../Marketplace/Custody/Model/module';
import * as Marketplace_Rule_AllocationAccount from '../../../Marketplace/Rule/AllocationAccount/module';

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
  damlTypes.Template<Request, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Service:Request'> & {
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
  damlTypes.Template<Offer, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Service:Offer'> & {
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


export declare type Lifecycle = {
  lifecycleRequestCid: damlTypes.ContractId<Marketplace_Custody_Model.LifecycleRequest>;
  safekeepingDepositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  fixings: damlTypes.Map<string, damlTypes.Map<damlTypes.Date, damlTypes.Numeric>>;
  uniquePayoutId: string;
};

export declare const Lifecycle:
  damlTypes.Serializable<Lifecycle> & {
  }
;


export declare type TransferDeposit = {
  transferDepositRequestCid: damlTypes.ContractId<Marketplace_Custody_Model.TransferDepositRequest>;
};

export declare const TransferDeposit:
  damlTypes.Serializable<TransferDeposit> & {
  }
;


export declare type DebitAccount = {
  debitAccountRequestCid: damlTypes.ContractId<Marketplace_Custody_Model.DebitAccountRequest>;
};

export declare const DebitAccount:
  damlTypes.Serializable<DebitAccount> & {
  }
;


export declare type CreditAccount = {
  creditAccountRequestCid: damlTypes.ContractId<Marketplace_Custody_Model.CreditAccountRequest>;
};

export declare const CreditAccount:
  damlTypes.Serializable<CreditAccount> & {
  }
;


export declare type CloseAllocationAccount = {
  closeAllocationAccountRequestCid: damlTypes.ContractId<Marketplace_Custody_Model.CloseAllocationAccountRequest>;
};

export declare const CloseAllocationAccount:
  damlTypes.Serializable<CloseAllocationAccount> & {
  }
;


export declare type CloseAccount = {
  closeAccountRequestCid: damlTypes.ContractId<Marketplace_Custody_Model.CloseAccountRequest>;
};

export declare const CloseAccount:
  damlTypes.Serializable<CloseAccount> & {
  }
;


export declare type OpenAllocationAccount = {
  openAllocationAccountRequestCid: damlTypes.ContractId<Marketplace_Custody_Model.OpenAllocationAccountRequest>;
};

export declare const OpenAllocationAccount:
  damlTypes.Serializable<OpenAllocationAccount> & {
  }
;


export declare type OpenAccount = {
  openAccountRequestCid: damlTypes.ContractId<Marketplace_Custody_Model.OpenAccountRequest>;
};

export declare const OpenAccount:
  damlTypes.Serializable<OpenAccount> & {
  }
;


export declare type RequestLifecycle = {
  assetDepositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  choice: ContingentClaims_Claim_Serializable.Claim<damlTypes.Date, damlTypes.Numeric, DA_Finance_Types.Id>;
};

export declare const RequestLifecycle:
  damlTypes.Serializable<RequestLifecycle> & {
  }
;


export declare type RequestTransferDeposit = {
  accountId: DA_Finance_Types.Id;
  transfer: DA_Finance_Asset_Settlement.AssetSettlement_Transfer;
};

export declare const RequestTransferDeposit:
  damlTypes.Serializable<RequestTransferDeposit> & {
  }
;


export declare type RequestDebitAccount = {
  accountId: DA_Finance_Types.Id;
  debit: DA_Finance_Asset_Settlement.AssetSettlement_Debit;
};

export declare const RequestDebitAccount:
  damlTypes.Serializable<RequestDebitAccount> & {
  }
;


export declare type RequestCreditAccount = {
  accountId: DA_Finance_Types.Id;
  asset: DA_Finance_Types.Asset;
};

export declare const RequestCreditAccount:
  damlTypes.Serializable<RequestCreditAccount> & {
  }
;


export declare type RequestCloseAccount = {
  accountId: DA_Finance_Types.Id;
};

export declare const RequestCloseAccount:
  damlTypes.Serializable<RequestCloseAccount> & {
  }
;


export declare type RequestOpenAllocationAccount = {
  accountId: DA_Finance_Types.Id;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
  nominee: damlTypes.Party;
};

export declare const RequestOpenAllocationAccount:
  damlTypes.Serializable<RequestOpenAllocationAccount> & {
  }
;


export declare type RequestOpenAccount = {
  accountId: DA_Finance_Types.Id;
  observers: damlTypes.Party[];
  ctrls: damlTypes.Party[];
};

export declare const RequestOpenAccount:
  damlTypes.Serializable<RequestOpenAccount> & {
  }
;


export declare type Service = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
};

export declare const Service:
  damlTypes.Template<Service, Service.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Service:Service'> & {
  RequestOpenAccount: damlTypes.Choice<Service, RequestOpenAccount, damlTypes.ContractId<Marketplace_Custody_Model.OpenAccountRequest>, Service.Key>;
  RequestOpenAllocationAccount: damlTypes.Choice<Service, RequestOpenAllocationAccount, damlTypes.ContractId<Marketplace_Custody_Model.OpenAllocationAccountRequest>, Service.Key>;
  RequestCloseAccount: damlTypes.Choice<Service, RequestCloseAccount, damlTypes.ContractId<Marketplace_Custody_Model.CloseAccountRequest>, Service.Key>;
  RequestCreditAccount: damlTypes.Choice<Service, RequestCreditAccount, damlTypes.ContractId<Marketplace_Custody_Model.CreditAccountRequest>, Service.Key>;
  RequestDebitAccount: damlTypes.Choice<Service, RequestDebitAccount, damlTypes.ContractId<Marketplace_Custody_Model.DebitAccountRequest>, Service.Key>;
  RequestTransferDeposit: damlTypes.Choice<Service, RequestTransferDeposit, damlTypes.ContractId<Marketplace_Custody_Model.TransferDepositRequest>, Service.Key>;
  RequestLifecycle: damlTypes.Choice<Service, RequestLifecycle, damlTypes.ContractId<Marketplace_Custody_Model.LifecycleRequest>, Service.Key>;
  OpenAccount: damlTypes.Choice<Service, OpenAccount, damlTypes.ContractId<DA_Finance_Asset_Settlement.AssetSettlementRule>, Service.Key>;
  OpenAllocationAccount: damlTypes.Choice<Service, OpenAllocationAccount, damlTypes.ContractId<Marketplace_Rule_AllocationAccount.AllocationAccountRule>, Service.Key>;
  CloseAccount: damlTypes.Choice<Service, CloseAccount, {}, Service.Key>;
  CloseAllocationAccount: damlTypes.Choice<Service, CloseAllocationAccount, {}, Service.Key>;
  CreditAccount: damlTypes.Choice<Service, CreditAccount, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>, Service.Key>;
  DebitAccount: damlTypes.Choice<Service, DebitAccount, DA_Finance_Types.Asset, Service.Key>;
  TransferDeposit: damlTypes.Choice<Service, TransferDeposit, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>, Service.Key>;
  Lifecycle: damlTypes.Choice<Service, Lifecycle, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>, damlTypes.ContractId<DA_Finance_Trade_SettlementInstruction.SettlementInstruction>[]>, Service.Key>;
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


