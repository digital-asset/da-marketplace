// Generated from DA/Finance/Instrument/Equity/Option/Lifecycle.daml
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

import * as DA_Finance_Asset_Lifecycle from '../../../../../../DA/Finance/Asset/Lifecycle/module';
import * as DA_Finance_Instrument_Entitlement from '../../../../../../DA/Finance/Instrument/Entitlement/module';
import * as DA_Finance_Instrument_Equity_Option from '../../../../../../DA/Finance/Instrument/Equity/Option/module';
import * as DA_Finance_Instrument_Equity_StockSplit from '../../../../../../DA/Finance/Instrument/Equity/StockSplit/module';

export declare type EquityOptionStockSplit_Lifecycle = {
  optionCid: damlTypes.ContractId<DA_Finance_Instrument_Equity_Option.EquityOption>;
  stockSplitCid: damlTypes.ContractId<DA_Finance_Instrument_Equity_StockSplit.EquityStockSplit>;
};

export declare const EquityOptionStockSplit_Lifecycle:
  damlTypes.Serializable<EquityOptionStockSplit_Lifecycle> & {
  }
;


export declare type EquityOptionStockSplitRule = {
  signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const EquityOptionStockSplitRule:
  damlTypes.Template<EquityOptionStockSplitRule, EquityOptionStockSplitRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Equity.Option.Lifecycle:EquityOptionStockSplitRule'> & {
  Archive: damlTypes.Choice<EquityOptionStockSplitRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, EquityOptionStockSplitRule.Key>;
  EquityOptionStockSplit_Lifecycle: damlTypes.Choice<EquityOptionStockSplitRule, EquityOptionStockSplit_Lifecycle, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<DA_Finance_Instrument_Equity_Option.EquityOption>, damlTypes.ContractId<DA_Finance_Asset_Lifecycle.LifecycleEffects>>, EquityOptionStockSplitRule.Key>;
};

export declare namespace EquityOptionStockSplitRule {
  export type Key = pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<EquityOptionStockSplitRule, EquityOptionStockSplitRule.Key, typeof EquityOptionStockSplitRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<EquityOptionStockSplitRule, typeof EquityOptionStockSplitRule.templateId>
  export type Event = damlLedger.Event<EquityOptionStockSplitRule, EquityOptionStockSplitRule.Key, typeof EquityOptionStockSplitRule.templateId>
  export type QueryResult = damlLedger.QueryResult<EquityOptionStockSplitRule, EquityOptionStockSplitRule.Key, typeof EquityOptionStockSplitRule.templateId>
}



export declare type EquityOptionExercise_Lifecycle = {
  optionCid: damlTypes.ContractId<DA_Finance_Instrument_Equity_Option.EquityOption>;
  underlyingPrice: damlTypes.Optional<damlTypes.Numeric>;
  entitlementIdLabel: string;
  settlementDate: damlTypes.Date;
};

export declare const EquityOptionExercise_Lifecycle:
  damlTypes.Serializable<EquityOptionExercise_Lifecycle> & {
  }
;


export declare type EquityOptionExerciseRule = {
  signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const EquityOptionExerciseRule:
  damlTypes.Template<EquityOptionExerciseRule, EquityOptionExerciseRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Equity.Option.Lifecycle:EquityOptionExerciseRule'> & {
  EquityOptionExercise_Lifecycle: damlTypes.Choice<EquityOptionExerciseRule, EquityOptionExercise_Lifecycle, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<DA_Finance_Instrument_Entitlement.Entitlement>, damlTypes.ContractId<DA_Finance_Asset_Lifecycle.LifecycleEffects>>, EquityOptionExerciseRule.Key>;
  Archive: damlTypes.Choice<EquityOptionExerciseRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, EquityOptionExerciseRule.Key>;
};

export declare namespace EquityOptionExerciseRule {
  export type Key = pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<EquityOptionExerciseRule, EquityOptionExerciseRule.Key, typeof EquityOptionExerciseRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<EquityOptionExerciseRule, typeof EquityOptionExerciseRule.templateId>
  export type Event = damlLedger.Event<EquityOptionExerciseRule, EquityOptionExerciseRule.Key, typeof EquityOptionExerciseRule.templateId>
  export type QueryResult = damlLedger.QueryResult<EquityOptionExerciseRule, EquityOptionExerciseRule.Key, typeof EquityOptionExerciseRule.templateId>
}


