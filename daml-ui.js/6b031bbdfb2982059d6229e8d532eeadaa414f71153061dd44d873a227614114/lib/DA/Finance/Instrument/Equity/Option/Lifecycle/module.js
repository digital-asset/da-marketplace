"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');
/* eslint-disable-next-line no-unused-vars */
var damlLedger = require('@daml/ledger');

var pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 = require('@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7');
var pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 = require('@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657');
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

var DA_Finance_Asset_Lifecycle = require('../../../../../../DA/Finance/Asset/Lifecycle/module');
var DA_Finance_Instrument_Entitlement = require('../../../../../../DA/Finance/Instrument/Entitlement/module');
var DA_Finance_Instrument_Equity_Option = require('../../../../../../DA/Finance/Instrument/Equity/Option/module');
var DA_Finance_Instrument_Equity_StockSplit = require('../../../../../../DA/Finance/Instrument/Equity/StockSplit/module');


exports.EquityOptionStockSplit_Lifecycle = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({optionCid: damlTypes.ContractId(DA_Finance_Instrument_Equity_Option.EquityOption).decoder, stockSplitCid: damlTypes.ContractId(DA_Finance_Instrument_Equity_StockSplit.EquityStockSplit).decoder, }); }),
  encode: function (__typed__) {
  return {
    optionCid: damlTypes.ContractId(DA_Finance_Instrument_Equity_Option.EquityOption).encode(__typed__.optionCid),
    stockSplitCid: damlTypes.ContractId(DA_Finance_Instrument_Equity_StockSplit.EquityStockSplit).encode(__typed__.stockSplitCid),
  };
}
,
};



exports.EquityOptionStockSplitRule = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Equity.Option.Lifecycle:EquityOptionStockSplitRule',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.signatories),
  };
}
,
  Archive: {
    template: function () { return exports.EquityOptionStockSplitRule; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  EquityOptionStockSplit_Lifecycle: {
    template: function () { return exports.EquityOptionStockSplitRule; },
    choiceName: 'EquityOptionStockSplit_Lifecycle',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.EquityOptionStockSplit_Lifecycle.decoder; }),
    argumentEncode: function (__typed__) { return exports.EquityOptionStockSplit_Lifecycle.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(DA_Finance_Instrument_Equity_Option.EquityOption), damlTypes.ContractId(DA_Finance_Asset_Lifecycle.LifecycleEffects)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(DA_Finance_Instrument_Equity_Option.EquityOption), damlTypes.ContractId(DA_Finance_Asset_Lifecycle.LifecycleEffects)).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.EquityOptionStockSplitRule);



exports.EquityOptionExercise_Lifecycle = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({optionCid: damlTypes.ContractId(DA_Finance_Instrument_Equity_Option.EquityOption).decoder, underlyingPrice: damlTypes.Optional(damlTypes.Numeric(10)).decoder, entitlementIdLabel: damlTypes.Text.decoder, settlementDate: damlTypes.Date.decoder, }); }),
  encode: function (__typed__) {
  return {
    optionCid: damlTypes.ContractId(DA_Finance_Instrument_Equity_Option.EquityOption).encode(__typed__.optionCid),
    underlyingPrice: damlTypes.Optional(damlTypes.Numeric(10)).encode(__typed__.underlyingPrice),
    entitlementIdLabel: damlTypes.Text.encode(__typed__.entitlementIdLabel),
    settlementDate: damlTypes.Date.encode(__typed__.settlementDate),
  };
}
,
};



exports.EquityOptionExerciseRule = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Equity.Option.Lifecycle:EquityOptionExerciseRule',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.signatories),
  };
}
,
  EquityOptionExercise_Lifecycle: {
    template: function () { return exports.EquityOptionExerciseRule; },
    choiceName: 'EquityOptionExercise_Lifecycle',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.EquityOptionExercise_Lifecycle.decoder; }),
    argumentEncode: function (__typed__) { return exports.EquityOptionExercise_Lifecycle.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(DA_Finance_Instrument_Entitlement.Entitlement), damlTypes.ContractId(DA_Finance_Asset_Lifecycle.LifecycleEffects)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(DA_Finance_Instrument_Entitlement.Entitlement), damlTypes.ContractId(DA_Finance_Asset_Lifecycle.LifecycleEffects)).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.EquityOptionExerciseRule; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.EquityOptionExerciseRule);

