// Generated from DA/Finance/Asset.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Types from '../../../DA/Finance/Types/module';

export declare type AssetCategorization_SetObservers = {
  newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const AssetCategorization_SetObservers:
  damlTypes.Serializable<AssetCategorization_SetObservers> & {
  }
;


export declare type AssetCategorization = {
  id: DA_Finance_Types.Id;
  assetType: string;
  assetClass: string;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const AssetCategorization:
  damlTypes.Template<AssetCategorization, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Asset:AssetCategorization'> & {
  Archive: damlTypes.Choice<AssetCategorization, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  AssetCategorization_SetObservers: damlTypes.Choice<AssetCategorization, AssetCategorization_SetObservers, damlTypes.ContractId<AssetCategorization>, undefined>;
};

export declare namespace AssetCategorization {
  export type CreateEvent = damlLedger.CreateEvent<AssetCategorization, undefined, typeof AssetCategorization.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AssetCategorization, typeof AssetCategorization.templateId>
  export type Event = damlLedger.Event<AssetCategorization, undefined, typeof AssetCategorization.templateId>
  export type QueryResult = damlLedger.QueryResult<AssetCategorization, undefined, typeof AssetCategorization.templateId>
}



export declare type AssetDeposit_Merge = {
  depositCids: damlTypes.ContractId<AssetDeposit>[];
};

export declare const AssetDeposit_Merge:
  damlTypes.Serializable<AssetDeposit_Merge> & {
  }
;


export declare type AssetDeposit_Split = {
  quantities: damlTypes.Numeric[];
};

export declare const AssetDeposit_Split:
  damlTypes.Serializable<AssetDeposit_Split> & {
  }
;


export declare type AssetDeposit_SetObservers = {
  newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const AssetDeposit_SetObservers:
  damlTypes.Serializable<AssetDeposit_SetObservers> & {
  }
;


export declare type AssetDeposit = {
  account: DA_Finance_Types.Account;
  asset: DA_Finance_Types.Asset;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const AssetDeposit:
  damlTypes.Template<AssetDeposit, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Asset:AssetDeposit'> & {
  Archive: damlTypes.Choice<AssetDeposit, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  AssetDeposit_Merge: damlTypes.Choice<AssetDeposit, AssetDeposit_Merge, damlTypes.ContractId<AssetDeposit>, undefined>;
  AssetDeposit_Split: damlTypes.Choice<AssetDeposit, AssetDeposit_Split, damlTypes.ContractId<AssetDeposit>[], undefined>;
  AssetDeposit_SetObservers: damlTypes.Choice<AssetDeposit, AssetDeposit_SetObservers, damlTypes.ContractId<AssetDeposit>, undefined>;
};

export declare namespace AssetDeposit {
  export type CreateEvent = damlLedger.CreateEvent<AssetDeposit, undefined, typeof AssetDeposit.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AssetDeposit, typeof AssetDeposit.templateId>
  export type Event = damlLedger.Event<AssetDeposit, undefined, typeof AssetDeposit.templateId>
  export type QueryResult = damlLedger.QueryResult<AssetDeposit, undefined, typeof AssetDeposit.templateId>
}


