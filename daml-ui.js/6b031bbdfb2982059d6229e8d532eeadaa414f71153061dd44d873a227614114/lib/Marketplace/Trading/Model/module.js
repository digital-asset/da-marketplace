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

var DA_Finance_Asset = require('../../../DA/Finance/Asset/module');
var DA_Finance_Types = require('../../../DA/Finance/Types/module');
var Marketplace_Trading_Error = require('../../../Marketplace/Trading/Error/module');


exports.UpdateFeeSchedule = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amount: damlTypes.Numeric(10).decoder, currency: DA_Finance_Types.Id.decoder, }); }),
  encode: function (__typed__) {
  return {
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
  };
}
,
};



exports.FeeSchedule = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Model:FeeSchedule',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, currentFee: exports.Fee.decoder, pastFees: damlTypes.List(exports.Fee).decoder, feeAccount: DA_Finance_Types.Account.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    currentFee: exports.Fee.encode(__typed__.currentFee),
    pastFees: damlTypes.List(exports.Fee).encode(__typed__.pastFees),
    feeAccount: DA_Finance_Types.Account.encode(__typed__.feeAccount),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.FeeSchedule; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  UpdateFeeSchedule: {
    template: function () { return exports.FeeSchedule; },
    choiceName: 'UpdateFeeSchedule',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateFeeSchedule.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateFeeSchedule.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.FeeSchedule).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.FeeSchedule).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.FeeSchedule);



exports.Fee = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amount: damlTypes.Numeric(10).decoder, currency: DA_Finance_Types.Id.decoder, timeInEffect: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
    timeInEffect: damlTypes.Time.encode(__typed__.timeInEffect),
  };
}
,
};



exports.Order = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Model:Order',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, status: exports.Status.decoder, details: exports.Details.decoder, providerOrderId: damlTypes.Optional(damlTypes.Text).decoder, executions: damlTypes.List(exports.Execution).decoder, remainingQuantity: damlTypes.Numeric(10).decoder, collateral: exports.TradeCollateral.decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    status: exports.Status.encode(__typed__.status),
    details: exports.Details.encode(__typed__.details),
    providerOrderId: damlTypes.Optional(damlTypes.Text).encode(__typed__.providerOrderId),
    executions: damlTypes.List(exports.Execution).encode(__typed__.executions),
    remainingQuantity: damlTypes.Numeric(10).encode(__typed__.remainingQuantity),
    collateral: exports.TradeCollateral.encode(__typed__.collateral),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
  };
}
,
  Archive: {
    template: function () { return exports.Order; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Order);



exports.TradeCollateral = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('Cleared'), value: exports.TradeCollateral.Cleared.decoder, }), jtv.object({tag: jtv.constant('Collateral'), value: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'Cleared': return {tag: __typed__.tag, value: exports.TradeCollateral.Cleared.encode(__typed__.value)};
    case 'Collateral': return {tag: __typed__.tag, value: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type TradeCollateral';
  }
}
,
  Cleared:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({clearinghouse: damlTypes.Party.decoder, }); }),
    encode: function (__typed__) {
  return {
    clearinghouse: damlTypes.Party.encode(__typed__.clearinghouse),
  };
}
,
  }),
};





exports.Execution = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({matchId: damlTypes.Text.decoder, makerOrderId: damlTypes.Text.decoder, takerOrderId: damlTypes.Text.decoder, quantity: damlTypes.Numeric(10).decoder, price: damlTypes.Numeric(10).decoder, timestamp: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    matchId: damlTypes.Text.encode(__typed__.matchId),
    makerOrderId: damlTypes.Text.encode(__typed__.makerOrderId),
    takerOrderId: damlTypes.Text.encode(__typed__.takerOrderId),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
    price: damlTypes.Numeric(10).encode(__typed__.price),
    timestamp: damlTypes.Text.encode(__typed__.timestamp),
  };
}
,
};



exports.Status = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('New'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('PendingExecution'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('PartiallyExecuted'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('FullyExecuted'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('Rejected'), value: exports.Status.Rejected.decoder, }), jtv.object({tag: jtv.constant('PendingCancellation'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('CancellationRejected'), value: exports.Status.CancellationRejected.decoder, }), jtv.object({tag: jtv.constant('Cancelled'), value: damlTypes.Unit.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'New': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'PendingExecution': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'PartiallyExecuted': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'FullyExecuted': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'Rejected': return {tag: __typed__.tag, value: exports.Status.Rejected.encode(__typed__.value)};
    case 'PendingCancellation': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'CancellationRejected': return {tag: __typed__.tag, value: exports.Status.CancellationRejected.encode(__typed__.value)};
    case 'Cancelled': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type Status';
  }
}
,
  Rejected:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({reason: Marketplace_Trading_Error.Error.decoder, }); }),
    encode: function (__typed__) {
  return {
    reason: Marketplace_Trading_Error.Error.encode(__typed__.reason),
  };
}
,
  }),
  CancellationRejected:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({reason: Marketplace_Trading_Error.Error.decoder, }); }),
    encode: function (__typed__) {
  return {
    reason: Marketplace_Trading_Error.Error.encode(__typed__.reason),
  };
}
,
  }),
};







exports.Details = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({id: damlTypes.Text.decoder, listingId: damlTypes.Text.decoder, asset: DA_Finance_Types.Asset.decoder, side: exports.Side.decoder, orderType: exports.OrderType.decoder, timeInForce: exports.TimeInForce.decoder, optExchangeFee: damlTypes.Optional(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, }); }),
  encode: function (__typed__) {
  return {
    id: damlTypes.Text.encode(__typed__.id),
    listingId: damlTypes.Text.encode(__typed__.listingId),
    asset: DA_Finance_Types.Asset.encode(__typed__.asset),
    side: exports.Side.encode(__typed__.side),
    orderType: exports.OrderType.encode(__typed__.orderType),
    timeInForce: exports.TimeInForce.encode(__typed__.timeInForce),
    optExchangeFee: damlTypes.Optional(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.optExchangeFee),
  };
}
,
};



exports.TimeInForce = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('GTC'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('GTD'), value: exports.TimeInForce.GTD.decoder, }), jtv.object({tag: jtv.constant('GAA'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('IOC'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('FOK'), value: damlTypes.Unit.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'GTC': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'GTD': return {tag: __typed__.tag, value: exports.TimeInForce.GTD.encode(__typed__.value)};
    case 'GAA': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'IOC': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'FOK': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type TimeInForce';
  }
}
,
  GTD:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({expiryDate: damlTypes.Int.decoder, }); }),
    encode: function (__typed__) {
  return {
    expiryDate: damlTypes.Int.encode(__typed__.expiryDate),
  };
}
,
  }),
};





exports.OrderType = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('Market'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('Limit'), value: exports.OrderType.Limit.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'Market': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'Limit': return {tag: __typed__.tag, value: exports.OrderType.Limit.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type OrderType';
  }
}
,
  Limit:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({price: damlTypes.Numeric(10).decoder, }); }),
    encode: function (__typed__) {
  return {
    price: damlTypes.Numeric(10).encode(__typed__.price),
  };
}
,
  }),
};





exports.Side = {
  Buy: 'Buy',
  Sell: 'Sell',
  keys: ['Buy','Sell',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.Side.Buy), jtv.constant(exports.Side.Sell)); }),
  encode: function (__typed__) { return __typed__; },
};

