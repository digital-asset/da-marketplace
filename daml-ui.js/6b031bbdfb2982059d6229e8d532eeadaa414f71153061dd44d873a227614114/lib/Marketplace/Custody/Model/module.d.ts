// Generated from Marketplace/Custody/Model.daml
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

export declare type Process = {
  investor: damlTypes.Party;
  safekeepingDepositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  fixings: damlTypes.Map<string, damlTypes.Map<damlTypes.Date, damlTypes.Numeric>>;
  uniquePayoutId: string;
};

export declare const Process:
  damlTypes.Serializable<Process> & {
  }
;


export declare type LifecycleRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  assetDepositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  choice: ContingentClaims_Claim_Serializable.Claim<damlTypes.Date, damlTypes.Numeric, DA_Finance_Types.Id>;
};

export declare const LifecycleRequest:
  damlTypes.Template<LifecycleRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Model:LifecycleRequest'> & {
  Process: damlTypes.Choice<LifecycleRequest, Process, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>, damlTypes.ContractId<DA_Finance_Trade_SettlementInstruction.SettlementInstruction>[]>, undefined>;
  Archive: damlTypes.Choice<LifecycleRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace LifecycleRequest {
  export type CreateEvent = damlLedger.CreateEvent<LifecycleRequest, undefined, typeof LifecycleRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<LifecycleRequest, typeof LifecycleRequest.templateId>
  export type Event = damlLedger.Event<LifecycleRequest, undefined, typeof LifecycleRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<LifecycleRequest, undefined, typeof LifecycleRequest.templateId>
}



export declare type TransferDepositRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  accountId: DA_Finance_Types.Id;
  transfer: DA_Finance_Asset_Settlement.AssetSettlement_Transfer;
};

export declare const TransferDepositRequest:
  damlTypes.Template<TransferDepositRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Model:TransferDepositRequest'> & {
  Archive: damlTypes.Choice<TransferDepositRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace TransferDepositRequest {
  export type CreateEvent = damlLedger.CreateEvent<TransferDepositRequest, undefined, typeof TransferDepositRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TransferDepositRequest, typeof TransferDepositRequest.templateId>
  export type Event = damlLedger.Event<TransferDepositRequest, undefined, typeof TransferDepositRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<TransferDepositRequest, undefined, typeof TransferDepositRequest.templateId>
}



export declare type DebitAccountRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  accountId: DA_Finance_Types.Id;
  debit: DA_Finance_Asset_Settlement.AssetSettlement_Debit;
};

export declare const DebitAccountRequest:
  damlTypes.Template<DebitAccountRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Model:DebitAccountRequest'> & {
  Archive: damlTypes.Choice<DebitAccountRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace DebitAccountRequest {
  export type CreateEvent = damlLedger.CreateEvent<DebitAccountRequest, undefined, typeof DebitAccountRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<DebitAccountRequest, typeof DebitAccountRequest.templateId>
  export type Event = damlLedger.Event<DebitAccountRequest, undefined, typeof DebitAccountRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<DebitAccountRequest, undefined, typeof DebitAccountRequest.templateId>
}



export declare type CreditAccountRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  accountId: DA_Finance_Types.Id;
  asset: DA_Finance_Types.Asset;
};

export declare const CreditAccountRequest:
  damlTypes.Template<CreditAccountRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Model:CreditAccountRequest'> & {
  Archive: damlTypes.Choice<CreditAccountRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace CreditAccountRequest {
  export type CreateEvent = damlLedger.CreateEvent<CreditAccountRequest, undefined, typeof CreditAccountRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<CreditAccountRequest, typeof CreditAccountRequest.templateId>
  export type Event = damlLedger.Event<CreditAccountRequest, undefined, typeof CreditAccountRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<CreditAccountRequest, undefined, typeof CreditAccountRequest.templateId>
}



export declare type CloseAllocationAccountRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  accountId: DA_Finance_Types.Id;
};

export declare const CloseAllocationAccountRequest:
  damlTypes.Template<CloseAllocationAccountRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Model:CloseAllocationAccountRequest'> & {
  Archive: damlTypes.Choice<CloseAllocationAccountRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace CloseAllocationAccountRequest {
  export type CreateEvent = damlLedger.CreateEvent<CloseAllocationAccountRequest, undefined, typeof CloseAllocationAccountRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<CloseAllocationAccountRequest, typeof CloseAllocationAccountRequest.templateId>
  export type Event = damlLedger.Event<CloseAllocationAccountRequest, undefined, typeof CloseAllocationAccountRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<CloseAllocationAccountRequest, undefined, typeof CloseAllocationAccountRequest.templateId>
}



export declare type CloseAccountRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  accountId: DA_Finance_Types.Id;
};

export declare const CloseAccountRequest:
  damlTypes.Template<CloseAccountRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Model:CloseAccountRequest'> & {
  Archive: damlTypes.Choice<CloseAccountRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace CloseAccountRequest {
  export type CreateEvent = damlLedger.CreateEvent<CloseAccountRequest, undefined, typeof CloseAccountRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<CloseAccountRequest, typeof CloseAccountRequest.templateId>
  export type Event = damlLedger.Event<CloseAccountRequest, undefined, typeof CloseAccountRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<CloseAccountRequest, undefined, typeof CloseAccountRequest.templateId>
}



export declare type OpenAllocationAccountRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  nominee: damlTypes.Party;
  accountId: DA_Finance_Types.Id;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const OpenAllocationAccountRequest:
  damlTypes.Template<OpenAllocationAccountRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Model:OpenAllocationAccountRequest'> & {
  Archive: damlTypes.Choice<OpenAllocationAccountRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace OpenAllocationAccountRequest {
  export type CreateEvent = damlLedger.CreateEvent<OpenAllocationAccountRequest, undefined, typeof OpenAllocationAccountRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<OpenAllocationAccountRequest, typeof OpenAllocationAccountRequest.templateId>
  export type Event = damlLedger.Event<OpenAllocationAccountRequest, undefined, typeof OpenAllocationAccountRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<OpenAllocationAccountRequest, undefined, typeof OpenAllocationAccountRequest.templateId>
}



export declare type OpenAccountRequest = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  accountId: DA_Finance_Types.Id;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
  ctrls: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const OpenAccountRequest:
  damlTypes.Template<OpenAccountRequest, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Model:OpenAccountRequest'> & {
  Archive: damlTypes.Choice<OpenAccountRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace OpenAccountRequest {
  export type CreateEvent = damlLedger.CreateEvent<OpenAccountRequest, undefined, typeof OpenAccountRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<OpenAccountRequest, typeof OpenAccountRequest.templateId>
  export type Event = damlLedger.Event<OpenAccountRequest, undefined, typeof OpenAccountRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<OpenAccountRequest, undefined, typeof OpenAccountRequest.templateId>
}


