// Generated from Marketplace/Rule/AllocationAccount.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Asset from '../../../DA/Finance/Asset/module';
import * as DA_Finance_Types from '../../../DA/Finance/Types/module';

export declare type WithdrawalRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  account: DA_Finance_Types.Account;
  transferTo: DA_Finance_Types.Account;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
};

export declare const WithdrawalRequest:
  damlTypes.Template<WithdrawalRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Rule.AllocationAccount:WithdrawalRequest'> & {
  Archive: damlTypes.Choice<WithdrawalRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace WithdrawalRequest {
  export type CreateEvent = damlLedger.CreateEvent<WithdrawalRequest, undefined, typeof WithdrawalRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<WithdrawalRequest, typeof WithdrawalRequest.templateId>
  export type Event = damlLedger.Event<WithdrawalRequest, undefined, typeof WithdrawalRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<WithdrawalRequest, undefined, typeof WithdrawalRequest.templateId>
}



export declare type Transfer = {
  transferTo: DA_Finance_Types.Account;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
};

export declare const Transfer:
  damlTypes.Serializable<Transfer> & {
  }
;


export declare type CancelWithdrawalRequest = {
  withdrawalRequestCid: damlTypes.ContractId<WithdrawalRequest>;
};

export declare const CancelWithdrawalRequest:
  damlTypes.Serializable<CancelWithdrawalRequest> & {
  }
;


export declare type RequestWithdrawal = {
  transferTo: DA_Finance_Types.Account;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
};

export declare const RequestWithdrawal:
  damlTypes.Serializable<RequestWithdrawal> & {
  }
;


export declare type RejectWithdrawal = {
  withdrawalRequestCid: damlTypes.ContractId<WithdrawalRequest>;
};

export declare const RejectWithdrawal:
  damlTypes.Serializable<RejectWithdrawal> & {
  }
;


export declare type ApproveWithdrawal = {
  unallocateCid: damlTypes.ContractId<WithdrawalRequest>;
};

export declare const ApproveWithdrawal:
  damlTypes.Serializable<ApproveWithdrawal> & {
  }
;


export declare type Withdraw = {
  transferTo: DA_Finance_Types.Account;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
};

export declare const Withdraw:
  damlTypes.Serializable<Withdraw> & {
  }
;


export declare type Deposit = {
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
};

export declare const Deposit:
  damlTypes.Serializable<Deposit> & {
  }
;


export declare type AllocationAccountRule = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  account: DA_Finance_Types.Account;
  nominee: damlTypes.Party;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const AllocationAccountRule:
  damlTypes.Template<AllocationAccountRule, AllocationAccountRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Rule.AllocationAccount:AllocationAccountRule'> & {
  Withdraw: damlTypes.Choice<AllocationAccountRule, Withdraw, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>, AllocationAccountRule.Key>;
  Archive: damlTypes.Choice<AllocationAccountRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, AllocationAccountRule.Key>;
  Transfer: damlTypes.Choice<AllocationAccountRule, Transfer, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>, AllocationAccountRule.Key>;
  CancelWithdrawalRequest: damlTypes.Choice<AllocationAccountRule, CancelWithdrawalRequest, {}, AllocationAccountRule.Key>;
  RequestWithdrawal: damlTypes.Choice<AllocationAccountRule, RequestWithdrawal, damlTypes.ContractId<WithdrawalRequest>, AllocationAccountRule.Key>;
  RejectWithdrawal: damlTypes.Choice<AllocationAccountRule, RejectWithdrawal, {}, AllocationAccountRule.Key>;
  ApproveWithdrawal: damlTypes.Choice<AllocationAccountRule, ApproveWithdrawal, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>, AllocationAccountRule.Key>;
  Deposit: damlTypes.Choice<AllocationAccountRule, Deposit, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>, AllocationAccountRule.Key>;
};

export declare namespace AllocationAccountRule {
  export type Key = DA_Finance_Types.Id
  export type CreateEvent = damlLedger.CreateEvent<AllocationAccountRule, AllocationAccountRule.Key, typeof AllocationAccountRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AllocationAccountRule, typeof AllocationAccountRule.templateId>
  export type Event = damlLedger.Event<AllocationAccountRule, AllocationAccountRule.Key, typeof AllocationAccountRule.templateId>
  export type QueryResult = damlLedger.QueryResult<AllocationAccountRule, AllocationAccountRule.Key, typeof AllocationAccountRule.templateId>
}


