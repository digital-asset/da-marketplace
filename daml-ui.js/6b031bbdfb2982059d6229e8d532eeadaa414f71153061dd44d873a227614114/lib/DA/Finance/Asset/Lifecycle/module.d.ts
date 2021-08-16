// Generated from DA/Finance/Asset/Lifecycle.daml
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

export declare type LifecycleEffects_SetObservers = {
  newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const LifecycleEffects_SetObservers:
  damlTypes.Serializable<LifecycleEffects_SetObservers> & {
  }
;


export declare type LifecycleEffects = {
  id: DA_Finance_Types.Id;
  label: string;
  consuming: DA_Finance_Types.Asset[];
  effects: DA_Finance_Types.Asset[];
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const LifecycleEffects:
  damlTypes.Template<LifecycleEffects, LifecycleEffects.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Asset.Lifecycle:LifecycleEffects'> & {
  Archive: damlTypes.Choice<LifecycleEffects, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, LifecycleEffects.Key>;
  LifecycleEffects_SetObservers: damlTypes.Choice<LifecycleEffects, LifecycleEffects_SetObservers, damlTypes.ContractId<LifecycleEffects>, LifecycleEffects.Key>;
};

export declare namespace LifecycleEffects {
  export type Key = DA_Finance_Types.Id
  export type CreateEvent = damlLedger.CreateEvent<LifecycleEffects, LifecycleEffects.Key, typeof LifecycleEffects.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<LifecycleEffects, typeof LifecycleEffects.templateId>
  export type Event = damlLedger.Event<LifecycleEffects, LifecycleEffects.Key, typeof LifecycleEffects.templateId>
  export type QueryResult = damlLedger.QueryResult<LifecycleEffects, LifecycleEffects.Key, typeof LifecycleEffects.templateId>
}



export declare type AssetLifecycle_Process = {
  lifecycleEffectsCid: damlTypes.ContractId<LifecycleEffects>;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  consumingDepositCids: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[];
  accountIds: damlTypes.Optional<DA_Finance_Types.Id[]>;
};

export declare const AssetLifecycle_Process:
  damlTypes.Serializable<AssetLifecycle_Process> & {
  }
;


export declare type AssetLifecycleRule = {
  account: DA_Finance_Types.Account;
};

export declare const AssetLifecycleRule:
  damlTypes.Template<AssetLifecycleRule, AssetLifecycleRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Asset.Lifecycle:AssetLifecycleRule'> & {
  Archive: damlTypes.Choice<AssetLifecycleRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, AssetLifecycleRule.Key>;
  AssetLifecycle_Process: damlTypes.Choice<AssetLifecycleRule, AssetLifecycle_Process, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[], AssetLifecycleRule.Key>;
};

export declare namespace AssetLifecycleRule {
  export type Key = DA_Finance_Types.Id
  export type CreateEvent = damlLedger.CreateEvent<AssetLifecycleRule, AssetLifecycleRule.Key, typeof AssetLifecycleRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AssetLifecycleRule, typeof AssetLifecycleRule.templateId>
  export type Event = damlLedger.Event<AssetLifecycleRule, AssetLifecycleRule.Key, typeof AssetLifecycleRule.templateId>
  export type QueryResult = damlLedger.QueryResult<AssetLifecycleRule, AssetLifecycleRule.Key, typeof AssetLifecycleRule.templateId>
}


