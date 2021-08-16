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

var DA_Finance_Types = require('../../../DA/Finance/Types/module');
var Marketplace_Trading_Model = require('../../../Marketplace/Trading/Model/module');


exports.ClearedTradeSide = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:ClearedTradeSide',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({clearinghouse: damlTypes.Party.decoder, exchange: damlTypes.Party.decoder, participant: damlTypes.Party.decoder, order: Marketplace_Trading_Model.Order.decoder, execution: Marketplace_Trading_Model.Execution.decoder, timeNovated: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    clearinghouse: damlTypes.Party.encode(__typed__.clearinghouse),
    exchange: damlTypes.Party.encode(__typed__.exchange),
    participant: damlTypes.Party.encode(__typed__.participant),
    order: Marketplace_Trading_Model.Order.encode(__typed__.order),
    execution: Marketplace_Trading_Model.Execution.encode(__typed__.execution),
    timeNovated: damlTypes.Time.encode(__typed__.timeNovated),
  };
}
,
  Archive: {
    template: function () { return exports.ClearedTradeSide; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.ClearedTradeSide);



exports.ClearedTrade_Novate = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.ClearedTrade = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:ClearedTrade',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, clearinghouse: damlTypes.Party.decoder, makerOrder: Marketplace_Trading_Model.Order.decoder, takerOrder: Marketplace_Trading_Model.Order.decoder, execution: Marketplace_Trading_Model.Execution.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    clearinghouse: damlTypes.Party.encode(__typed__.clearinghouse),
    makerOrder: Marketplace_Trading_Model.Order.encode(__typed__.makerOrder),
    takerOrder: Marketplace_Trading_Model.Order.encode(__typed__.takerOrder),
    execution: Marketplace_Trading_Model.Execution.encode(__typed__.execution),
  };
}
,
  Archive: {
    template: function () { return exports.ClearedTrade; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ClearedTrade_Novate: {
    template: function () { return exports.ClearedTrade; },
    choiceName: 'ClearedTrade_Novate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ClearedTrade_Novate.decoder; }),
    argumentEncode: function (__typed__) { return exports.ClearedTrade_Novate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.ClearedTradeSide), damlTypes.ContractId(exports.ClearedTradeSide)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.ClearedTradeSide), damlTypes.ContractId(exports.ClearedTradeSide)).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.ClearedTrade);



exports.FulfilledMarkToMarketCalculation = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:FulfilledMarkToMarketCalculation',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, calculation: exports.MarkToMarketCalculation.decoder, note: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    calculation: exports.MarkToMarketCalculation.encode(__typed__.calculation),
    note: damlTypes.Text.encode(__typed__.note),
  };
}
,
  Archive: {
    template: function () { return exports.FulfilledMarkToMarketCalculation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.FulfilledMarkToMarketCalculation);



exports.RejectedMarkToMarketCalculation_Retry = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.RejectedMarkToMarketCalculation_Cancel = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RejectedMarkToMarketCalculation = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:RejectedMarkToMarketCalculation',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, calculation: exports.MarkToMarketCalculation.decoder, note: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    calculation: exports.MarkToMarketCalculation.encode(__typed__.calculation),
    note: damlTypes.Text.encode(__typed__.note),
  };
}
,
  Archive: {
    template: function () { return exports.RejectedMarkToMarketCalculation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RejectedMarkToMarketCalculation_Cancel: {
    template: function () { return exports.RejectedMarkToMarketCalculation; },
    choiceName: 'RejectedMarkToMarketCalculation_Cancel',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectedMarkToMarketCalculation_Cancel.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectedMarkToMarketCalculation_Cancel.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RejectedMarkToMarketCalculation_Retry: {
    template: function () { return exports.RejectedMarkToMarketCalculation; },
    choiceName: 'RejectedMarkToMarketCalculation_Retry',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectedMarkToMarketCalculation_Retry.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectedMarkToMarketCalculation_Retry.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MarkToMarketCalculation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MarkToMarketCalculation).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.RejectedMarkToMarketCalculation);



exports.MarkToMarketCalculation_Reject = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({note: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    note: damlTypes.Text.encode(__typed__.note),
  };
}
,
};



exports.MarkToMarketCalculation_Resolve = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({note: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    note: damlTypes.Text.encode(__typed__.note),
  };
}
,
};



exports.MarkToMarketCalculation = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:MarkToMarketCalculation',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, accountId: DA_Finance_Types.Id.decoder, currency: DA_Finance_Types.Id.decoder, mtmAmount: damlTypes.Numeric(10).decoder, calculationTime: damlTypes.Time.decoder, calculationId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
    mtmAmount: damlTypes.Numeric(10).encode(__typed__.mtmAmount),
    calculationTime: damlTypes.Time.encode(__typed__.calculationTime),
    calculationId: damlTypes.Text.encode(__typed__.calculationId),
  };
}
,
  Archive: {
    template: function () { return exports.MarkToMarketCalculation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  MarkToMarketCalculation_Resolve: {
    template: function () { return exports.MarkToMarketCalculation; },
    choiceName: 'MarkToMarketCalculation_Resolve',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkToMarketCalculation_Resolve.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkToMarketCalculation_Resolve.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.FulfilledMarkToMarketCalculation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.FulfilledMarkToMarketCalculation).encode(__typed__); },
  },
  MarkToMarketCalculation_Reject: {
    template: function () { return exports.MarkToMarketCalculation; },
    choiceName: 'MarkToMarketCalculation_Reject',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkToMarketCalculation_Reject.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkToMarketCalculation_Reject.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RejectedMarkToMarketCalculation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RejectedMarkToMarketCalculation).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.MarkToMarketCalculation);



exports.RejectedMarginCalculation_Retry = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.RejectedMarginCalculation_Cancel = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RejectedMarginCalculation = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:RejectedMarginCalculation',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, calculation: exports.MarginCalculation.decoder, note: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    calculation: exports.MarginCalculation.encode(__typed__.calculation),
    note: damlTypes.Text.encode(__typed__.note),
  };
}
,
  Archive: {
    template: function () { return exports.RejectedMarginCalculation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RejectedMarginCalculation_Cancel: {
    template: function () { return exports.RejectedMarginCalculation; },
    choiceName: 'RejectedMarginCalculation_Cancel',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectedMarginCalculation_Cancel.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectedMarginCalculation_Cancel.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RejectedMarginCalculation_Retry: {
    template: function () { return exports.RejectedMarginCalculation; },
    choiceName: 'RejectedMarginCalculation_Retry',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectedMarginCalculation_Retry.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectedMarginCalculation_Retry.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MarginCalculation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MarginCalculation).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.RejectedMarginCalculation);



exports.FulfilledMarginCalculation = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:FulfilledMarginCalculation',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, calculation: exports.MarginCalculation.decoder, note: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    calculation: exports.MarginCalculation.encode(__typed__.calculation),
    note: damlTypes.Text.encode(__typed__.note),
  };
}
,
  Archive: {
    template: function () { return exports.FulfilledMarginCalculation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.FulfilledMarginCalculation);



exports.MarginCalculation_Reject = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({note: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    note: damlTypes.Text.encode(__typed__.note),
  };
}
,
};



exports.MarginCalculation_Resolve = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({note: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    note: damlTypes.Text.encode(__typed__.note),
  };
}
,
};



exports.MarginCalculation = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:MarginCalculation',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, accountId: DA_Finance_Types.Id.decoder, currency: DA_Finance_Types.Id.decoder, targetAmount: damlTypes.Numeric(10).decoder, calculationTime: damlTypes.Time.decoder, calculationId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
    targetAmount: damlTypes.Numeric(10).encode(__typed__.targetAmount),
    calculationTime: damlTypes.Time.encode(__typed__.calculationTime),
    calculationId: damlTypes.Text.encode(__typed__.calculationId),
  };
}
,
  Archive: {
    template: function () { return exports.MarginCalculation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  MarginCalculation_Resolve: {
    template: function () { return exports.MarginCalculation; },
    choiceName: 'MarginCalculation_Resolve',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarginCalculation_Resolve.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarginCalculation_Resolve.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.FulfilledMarginCalculation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.FulfilledMarginCalculation).encode(__typed__); },
  },
  MarginCalculation_Reject: {
    template: function () { return exports.MarginCalculation; },
    choiceName: 'MarginCalculation_Reject',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarginCalculation_Reject.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarginCalculation_Reject.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.RejectedMarginCalculation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.RejectedMarginCalculation).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.MarginCalculation);



exports.MemberStanding_AddObservers = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.newObservers),
  };
}
,
};



exports.MemberStanding_UpdateMTM = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newMtmSatisied: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    newMtmSatisied: damlTypes.Bool.encode(__typed__.newMtmSatisied),
  };
}
,
};



exports.MemberStanding_UpdateMargin = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newMarginSatisfied: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    newMarginSatisfied: damlTypes.Bool.encode(__typed__.newMarginSatisfied),
  };
}
,
};



exports.MemberStanding = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Model:MemberStanding',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, marginSatisfied: damlTypes.Bool.decoder, mtmSatisfied: damlTypes.Bool.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    marginSatisfied: damlTypes.Bool.encode(__typed__.marginSatisfied),
    mtmSatisfied: damlTypes.Bool.encode(__typed__.mtmSatisfied),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.MemberStanding; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  MemberStanding_UpdateMargin: {
    template: function () { return exports.MemberStanding; },
    choiceName: 'MemberStanding_UpdateMargin',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MemberStanding_UpdateMargin.decoder; }),
    argumentEncode: function (__typed__) { return exports.MemberStanding_UpdateMargin.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MemberStanding).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MemberStanding).encode(__typed__); },
  },
  MemberStanding_UpdateMTM: {
    template: function () { return exports.MemberStanding; },
    choiceName: 'MemberStanding_UpdateMTM',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MemberStanding_UpdateMTM.decoder; }),
    argumentEncode: function (__typed__) { return exports.MemberStanding_UpdateMTM.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MemberStanding).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MemberStanding).encode(__typed__); },
  },
  MemberStanding_AddObservers: {
    template: function () { return exports.MemberStanding; },
    choiceName: 'MemberStanding_AddObservers',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MemberStanding_AddObservers.decoder; }),
    argumentEncode: function (__typed__) { return exports.MemberStanding_AddObservers.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MemberStanding).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MemberStanding).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.MemberStanding);

