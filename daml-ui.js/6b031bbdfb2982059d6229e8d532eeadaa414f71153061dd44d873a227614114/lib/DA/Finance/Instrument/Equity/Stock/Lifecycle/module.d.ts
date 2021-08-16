// Generated from DA/Finance/Instrument/Equity/Stock/Lifecycle.daml
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
import * as DA_Finance_Instrument_Equity_CashDividend from '../../../../../../DA/Finance/Instrument/Equity/CashDividend/module';
import * as DA_Finance_Instrument_Equity_Stock from '../../../../../../DA/Finance/Instrument/Equity/Stock/module';
import * as DA_Finance_Instrument_Equity_StockSplit from '../../../../../../DA/Finance/Instrument/Equity/StockSplit/module';

export declare type EquityStockSplit_Lifecycle = {
  stockSplitCid: damlTypes.ContractId<DA_Finance_Instrument_Equity_StockSplit.EquityStockSplit>;
};

export declare const EquityStockSplit_Lifecycle:
  damlTypes.Serializable<EquityStockSplit_Lifecycle> & {
  }
;


export declare type EquityStockSplitRule = {
  signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const EquityStockSplitRule:
  damlTypes.Template<EquityStockSplitRule, EquityStockSplitRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Equity.Stock.Lifecycle:EquityStockSplitRule'> & {
  Archive: damlTypes.Choice<EquityStockSplitRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, EquityStockSplitRule.Key>;
  EquityStockSplit_Lifecycle: damlTypes.Choice<EquityStockSplitRule, EquityStockSplit_Lifecycle, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<DA_Finance_Instrument_Equity_Stock.EquityStock>, damlTypes.ContractId<DA_Finance_Asset_Lifecycle.LifecycleEffects>>, EquityStockSplitRule.Key>;
};

export declare namespace EquityStockSplitRule {
  export type Key = pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<EquityStockSplitRule, EquityStockSplitRule.Key, typeof EquityStockSplitRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<EquityStockSplitRule, typeof EquityStockSplitRule.templateId>
  export type Event = damlLedger.Event<EquityStockSplitRule, EquityStockSplitRule.Key, typeof EquityStockSplitRule.templateId>
  export type QueryResult = damlLedger.QueryResult<EquityStockSplitRule, EquityStockSplitRule.Key, typeof EquityStockSplitRule.templateId>
}



export declare type EquityStockCashDividend_Lifecycle = {
  dividendCid: damlTypes.ContractId<DA_Finance_Instrument_Equity_CashDividend.EquityCashDividend>;
  entitlementIdLabel: string;
};

export declare const EquityStockCashDividend_Lifecycle:
  damlTypes.Serializable<EquityStockCashDividend_Lifecycle> & {
  }
;


export declare type EquityStockCashDividendRule = {
  signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const EquityStockCashDividendRule:
  damlTypes.Template<EquityStockCashDividendRule, EquityStockCashDividendRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Equity.Stock.Lifecycle:EquityStockCashDividendRule'> & {
  EquityStockCashDividend_Lifecycle: damlTypes.Choice<EquityStockCashDividendRule, EquityStockCashDividend_Lifecycle, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.ContractId<DA_Finance_Instrument_Equity_Stock.EquityStock>, damlTypes.ContractId<DA_Finance_Instrument_Entitlement.Entitlement>, damlTypes.ContractId<DA_Finance_Asset_Lifecycle.LifecycleEffects>>, EquityStockCashDividendRule.Key>;
  Archive: damlTypes.Choice<EquityStockCashDividendRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, EquityStockCashDividendRule.Key>;
};

export declare namespace EquityStockCashDividendRule {
  export type Key = pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<EquityStockCashDividendRule, EquityStockCashDividendRule.Key, typeof EquityStockCashDividendRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<EquityStockCashDividendRule, typeof EquityStockCashDividendRule.templateId>
  export type Event = damlLedger.Event<EquityStockCashDividendRule, EquityStockCashDividendRule.Key, typeof EquityStockCashDividendRule.templateId>
  export type QueryResult = damlLedger.QueryResult<EquityStockCashDividendRule, EquityStockCashDividendRule.Key, typeof EquityStockCashDividendRule.templateId>
}


