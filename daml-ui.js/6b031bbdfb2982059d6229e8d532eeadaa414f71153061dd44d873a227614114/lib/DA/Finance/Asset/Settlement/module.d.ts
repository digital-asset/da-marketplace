// Generated from DA/Finance/Asset/Settlement.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Asset from '../../../../DA/Finance/Asset/module';
import * as DA_Finance_Types from '../../../../DA/Finance/Types/module';

export declare type AssetSettlement_Credit = {
  asset: DA_Finance_Types.Asset;
  ctrl: damlTypes.Party;
};

export declare const AssetSettlement_Credit:
  damlTypes.Serializable<AssetSettlement_Credit> & {
  }
;


export declare type AssetSettlement_Debit = {
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
};

export declare const AssetSettlement_Debit:
  damlTypes.Serializable<AssetSettlement_Debit> & {
  }
;


export declare type AssetSettlement_RemoveController = {
  ctrl: damlTypes.Party;
};

export declare const AssetSettlement_RemoveController:
  damlTypes.Serializable<AssetSettlement_RemoveController> & {
  }
;


export declare type AssetSettlement_AddController = {
  ctrl: damlTypes.Party;
};

export declare const AssetSettlement_AddController:
  damlTypes.Serializable<AssetSettlement_AddController> & {
  }
;


export declare type AssetSettlement_Transfer = {
  receiverAccountId: DA_Finance_Types.Id;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
};

export declare const AssetSettlement_Transfer:
  damlTypes.Serializable<AssetSettlement_Transfer> & {
  }
;


export declare type AssetSettlementRule = {
  account: DA_Finance_Types.Account;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
  ctrls: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const AssetSettlementRule:
  damlTypes.Template<AssetSettlementRule, AssetSettlementRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Asset.Settlement:AssetSettlementRule'> & {
  AssetSettlement_Debit: damlTypes.Choice<AssetSettlementRule, AssetSettlement_Debit, DA_Finance_Types.Asset, AssetSettlementRule.Key>;
  Archive: damlTypes.Choice<AssetSettlementRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, AssetSettlementRule.Key>;
  AssetSettlement_Credit: damlTypes.Choice<AssetSettlementRule, AssetSettlement_Credit, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>, AssetSettlementRule.Key>;
  AssetSettlement_AddController: damlTypes.Choice<AssetSettlementRule, AssetSettlement_AddController, damlTypes.ContractId<AssetSettlementRule>, AssetSettlementRule.Key>;
  AssetSettlement_RemoveController: damlTypes.Choice<AssetSettlementRule, AssetSettlement_RemoveController, damlTypes.ContractId<AssetSettlementRule>, AssetSettlementRule.Key>;
  AssetSettlement_Transfer: damlTypes.Choice<AssetSettlementRule, AssetSettlement_Transfer, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>, AssetSettlementRule.Key>;
};

export declare namespace AssetSettlementRule {
  export type Key = DA_Finance_Types.Id
  export type CreateEvent = damlLedger.CreateEvent<AssetSettlementRule, AssetSettlementRule.Key, typeof AssetSettlementRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AssetSettlementRule, typeof AssetSettlementRule.templateId>
  export type Event = damlLedger.Event<AssetSettlementRule, AssetSettlementRule.Key, typeof AssetSettlementRule.templateId>
  export type QueryResult = damlLedger.QueryResult<AssetSettlementRule, AssetSettlementRule.Key, typeof AssetSettlementRule.templateId>
}


