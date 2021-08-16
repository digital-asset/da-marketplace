// Generated from DA/Finance/Trade/SettlementInstruction.daml
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

import * as DA_Finance_Asset from '../../../../DA/Finance/Asset/module';
import * as DA_Finance_Types from '../../../../DA/Finance/Types/module';

export declare type SettlementInstruction_AllocateNext = {
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  ctrl: damlTypes.Party;
};

export declare const SettlementInstruction_AllocateNext:
  damlTypes.Serializable<SettlementInstruction_AllocateNext> & {
  }
;


export declare type SettlementInstruction_Archive = {
};

export declare const SettlementInstruction_Archive:
  damlTypes.Serializable<SettlementInstruction_Archive> & {
  }
;


export declare type SettlementInstruction_Process = {
};

export declare const SettlementInstruction_Process:
  damlTypes.Serializable<SettlementInstruction_Process> & {
  }
;


export declare type SettlementInstruction = {
  masterAgreement: DA_Finance_Types.MasterAgreement;
  tradeId: DA_Finance_Types.Id;
  asset: DA_Finance_Types.Asset;
  steps: SettlementDetails[];
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const SettlementInstruction:
  damlTypes.Template<SettlementInstruction, SettlementInstruction.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Trade.SettlementInstruction:SettlementInstruction'> & {
  SettlementInstruction_AllocateNext: damlTypes.Choice<SettlementInstruction, SettlementInstruction_AllocateNext, damlTypes.ContractId<SettlementInstruction>, SettlementInstruction.Key>;
  SettlementInstruction_Process: damlTypes.Choice<SettlementInstruction, SettlementInstruction_Process, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[], SettlementInstruction.Key>;
  Archive: damlTypes.Choice<SettlementInstruction, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, SettlementInstruction.Key>;
  SettlementInstruction_Archive: damlTypes.Choice<SettlementInstruction, SettlementInstruction_Archive, {}, SettlementInstruction.Key>;
};

export declare namespace SettlementInstruction {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<DA_Finance_Types.Id, DA_Finance_Types.Id, DA_Finance_Types.Id>
  export type CreateEvent = damlLedger.CreateEvent<SettlementInstruction, SettlementInstruction.Key, typeof SettlementInstruction.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<SettlementInstruction, typeof SettlementInstruction.templateId>
  export type Event = damlLedger.Event<SettlementInstruction, SettlementInstruction.Key, typeof SettlementInstruction.templateId>
  export type QueryResult = damlLedger.QueryResult<SettlementInstruction, SettlementInstruction.Key, typeof SettlementInstruction.templateId>
}



export declare type SettlementDetails = {
  senderAccount: DA_Finance_Types.Account;
  receiverAccount: DA_Finance_Types.Account;
  depositCid: damlTypes.Optional<damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>>;
};

export declare const SettlementDetails:
  damlTypes.Serializable<SettlementDetails> & {
  }
;

