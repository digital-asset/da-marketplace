// Generated from DA/Finance/Instrument/Equity/ACBRC/Lifecycle.daml
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
import * as DA_Finance_Instrument_Equity_ACBRC from '../../../../../../DA/Finance/Instrument/Equity/ACBRC/module';
import * as DA_Finance_Instrument_Equity_StockSplit from '../../../../../../DA/Finance/Instrument/Equity/StockSplit/module';
import * as DA_Finance_RefData_Fixing from '../../../../../../DA/Finance/RefData/Fixing/module';

export declare type ACBRCFixing_Lifecycle = {
  acbrcCid: damlTypes.ContractId<DA_Finance_Instrument_Equity_ACBRC.ACBRC>;
  fixingCid: damlTypes.ContractId<DA_Finance_RefData_Fixing.Fixing>;
};

export declare const ACBRCFixing_Lifecycle:
  damlTypes.Serializable<ACBRCFixing_Lifecycle> & {
  }
;


export declare type ACBRCFixingRule = {
  signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const ACBRCFixingRule:
  damlTypes.Template<ACBRCFixingRule, ACBRCFixingRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Equity.ACBRC.Lifecycle:ACBRCFixingRule'> & {
  Archive: damlTypes.Choice<ACBRCFixingRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, ACBRCFixingRule.Key>;
  ACBRCFixing_Lifecycle: damlTypes.Choice<ACBRCFixingRule, ACBRCFixing_Lifecycle, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<DA_Finance_Instrument_Equity_ACBRC.ACBRC>, damlTypes.ContractId<DA_Finance_Asset_Lifecycle.LifecycleEffects>>, ACBRCFixingRule.Key>;
};

export declare namespace ACBRCFixingRule {
  export type Key = pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<ACBRCFixingRule, ACBRCFixingRule.Key, typeof ACBRCFixingRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ACBRCFixingRule, typeof ACBRCFixingRule.templateId>
  export type Event = damlLedger.Event<ACBRCFixingRule, ACBRCFixingRule.Key, typeof ACBRCFixingRule.templateId>
  export type QueryResult = damlLedger.QueryResult<ACBRCFixingRule, ACBRCFixingRule.Key, typeof ACBRCFixingRule.templateId>
}



export declare type ACBRCStockSplit_Lifecycle = {
  acbrcCid: damlTypes.ContractId<DA_Finance_Instrument_Equity_ACBRC.ACBRC>;
  stockSplitCid: damlTypes.ContractId<DA_Finance_Instrument_Equity_StockSplit.EquityStockSplit>;
};

export declare const ACBRCStockSplit_Lifecycle:
  damlTypes.Serializable<ACBRCStockSplit_Lifecycle> & {
  }
;


export declare type ACBRCStockSplitRule = {
  signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const ACBRCStockSplitRule:
  damlTypes.Template<ACBRCStockSplitRule, ACBRCStockSplitRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Equity.ACBRC.Lifecycle:ACBRCStockSplitRule'> & {
  ACBRCStockSplit_Lifecycle: damlTypes.Choice<ACBRCStockSplitRule, ACBRCStockSplit_Lifecycle, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<DA_Finance_Instrument_Equity_ACBRC.ACBRC>, damlTypes.ContractId<DA_Finance_Asset_Lifecycle.LifecycleEffects>>, ACBRCStockSplitRule.Key>;
  Archive: damlTypes.Choice<ACBRCStockSplitRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, ACBRCStockSplitRule.Key>;
};

export declare namespace ACBRCStockSplitRule {
  export type Key = pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<ACBRCStockSplitRule, ACBRCStockSplitRule.Key, typeof ACBRCStockSplitRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ACBRCStockSplitRule, typeof ACBRCStockSplitRule.templateId>
  export type Event = damlLedger.Event<ACBRCStockSplitRule, ACBRCStockSplitRule.Key, typeof ACBRCStockSplitRule.templateId>
  export type QueryResult = damlLedger.QueryResult<ACBRCStockSplitRule, ACBRCStockSplitRule.Key, typeof ACBRCStockSplitRule.templateId>
}


