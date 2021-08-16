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
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

var DA_Finance_Asset = require('../../../DA/Finance/Asset/module');
var DA_Finance_Types = require('../../../DA/Finance/Types/module');
var Marketplace_Clearing_Model = require('../../../Marketplace/Clearing/Model/module');


exports.Approve = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, ccpAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    ccpAccount: DA_Finance_Types.Account.encode(__typed__.ccpAccount),
  };
}
,
};



exports.Reject = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Cancel = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Request = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Service:Request',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, clearingAccount: DA_Finance_Types.Account.decoder, marginAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
    provider: damlTypes.Party.encode(__typed__.provider),
    clearingAccount: DA_Finance_Types.Account.encode(__typed__.clearingAccount),
    marginAccount: DA_Finance_Types.Account.encode(__typed__.marginAccount),
  };
}
,
  Approve: {
    template: function () { return exports.Request; },
    choiceName: 'Approve',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Approve.decoder; }),
    argumentEncode: function (__typed__) { return exports.Approve.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Service).encode(__typed__); },
  },
  Cancel: {
    template: function () { return exports.Request; },
    choiceName: 'Cancel',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Cancel.decoder; }),
    argumentEncode: function (__typed__) { return exports.Cancel.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Request; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Reject: {
    template: function () { return exports.Request; },
    choiceName: 'Reject',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Reject.decoder; }),
    argumentEncode: function (__typed__) { return exports.Reject.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Request);



exports.Withdraw = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Decline = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Accept = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({clearingAccount: DA_Finance_Types.Account.decoder, marginAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    clearingAccount: DA_Finance_Types.Account.encode(__typed__.clearingAccount),
    marginAccount: DA_Finance_Types.Account.encode(__typed__.marginAccount),
  };
}
,
};



exports.Offer = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Service:Offer',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, ccpAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    ccpAccount: DA_Finance_Types.Account.encode(__typed__.ccpAccount),
  };
}
,
  Accept: {
    template: function () { return exports.Offer; },
    choiceName: 'Accept',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Accept.decoder; }),
    argumentEncode: function (__typed__) { return exports.Accept.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Service).encode(__typed__); },
  },
  Decline: {
    template: function () { return exports.Offer; },
    choiceName: 'Decline',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Decline.decoder; }),
    argumentEncode: function (__typed__) { return exports.Decline.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Withdraw: {
    template: function () { return exports.Offer; },
    choiceName: 'Withdraw',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Withdraw.decoder; }),
    argumentEncode: function (__typed__) { return exports.Withdraw.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Offer; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Offer);



exports.Terminate = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.TransferToMargin = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({depositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    depositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.depositCids),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
};



exports.TransferFromMargin = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({marginDepositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    marginDepositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.marginDepositCids),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
};



exports.TransferToProvider = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amount: damlTypes.Numeric(10).decoder, depositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, }); }),
  encode: function (__typed__) {
  return {
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    depositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.depositCids),
  };
}
,
};



exports.TransferFromProvider = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({depositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    depositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.depositCids),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
};



exports.PerformMarkToMarket = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({providerDepositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, customerDepositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, calculationCid: damlTypes.ContractId(Marketplace_Clearing_Model.MarkToMarketCalculation).decoder, }); }),
  encode: function (__typed__) {
  return {
    providerDepositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.providerDepositCids),
    customerDepositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.customerDepositCids),
    calculationCid: damlTypes.ContractId(Marketplace_Clearing_Model.MarkToMarketCalculation).encode(__typed__.calculationCid),
  };
}
,
};



exports.PerformMarginFill = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({depositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, marginDepositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, calculationCid: damlTypes.ContractId(Marketplace_Clearing_Model.MarginCalculation).decoder, }); }),
  encode: function (__typed__) {
  return {
    depositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.depositCids),
    marginDepositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.marginDepositCids),
    calculationCid: damlTypes.ContractId(Marketplace_Clearing_Model.MarginCalculation).encode(__typed__.calculationCid),
  };
}
,
};



exports.CreateMarkToMarket = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({mtmAmount: damlTypes.Numeric(10).decoder, currency: DA_Finance_Types.Id.decoder, calculationId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    mtmAmount: damlTypes.Numeric(10).encode(__typed__.mtmAmount),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
    calculationId: damlTypes.Text.encode(__typed__.calculationId),
  };
}
,
};



exports.CreateMarginCalculation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({targetAmount: damlTypes.Numeric(10).decoder, currency: DA_Finance_Types.Id.decoder, calculationId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    targetAmount: damlTypes.Numeric(10).encode(__typed__.targetAmount),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
    calculationId: damlTypes.Text.encode(__typed__.calculationId),
  };
}
,
};



exports.ApproveTrade = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Service = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Service:Service',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, ccpAccount: DA_Finance_Types.Account.decoder, clearingAccount: DA_Finance_Types.Account.decoder, marginAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    ccpAccount: DA_Finance_Types.Account.encode(__typed__.ccpAccount),
    clearingAccount: DA_Finance_Types.Account.encode(__typed__.clearingAccount),
    marginAccount: DA_Finance_Types.Account.encode(__typed__.marginAccount),
  };
}
,
  Terminate: {
    template: function () { return exports.Service; },
    choiceName: 'Terminate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Terminate.decoder; }),
    argumentEncode: function (__typed__) { return exports.Terminate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  TransferToMargin: {
    template: function () { return exports.Service; },
    choiceName: 'TransferToMargin',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TransferToMargin.decoder; }),
    argumentEncode: function (__typed__) { return exports.TransferToMargin.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.DepositWithRemaining.decoder; }),
    resultEncode: function (__typed__) { return exports.DepositWithRemaining.encode(__typed__); },
  },
  TransferFromMargin: {
    template: function () { return exports.Service; },
    choiceName: 'TransferFromMargin',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TransferFromMargin.decoder; }),
    argumentEncode: function (__typed__) { return exports.TransferFromMargin.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.DepositWithRemaining.decoder; }),
    resultEncode: function (__typed__) { return exports.DepositWithRemaining.encode(__typed__); },
  },
  TransferToProvider: {
    template: function () { return exports.Service; },
    choiceName: 'TransferToProvider',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TransferToProvider.decoder; }),
    argumentEncode: function (__typed__) { return exports.TransferToProvider.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.DepositWithRemaining.decoder; }),
    resultEncode: function (__typed__) { return exports.DepositWithRemaining.encode(__typed__); },
  },
  TransferFromProvider: {
    template: function () { return exports.Service; },
    choiceName: 'TransferFromProvider',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TransferFromProvider.decoder; }),
    argumentEncode: function (__typed__) { return exports.TransferFromProvider.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.DepositWithRemaining.decoder; }),
    resultEncode: function (__typed__) { return exports.DepositWithRemaining.encode(__typed__); },
  },
  PerformMarkToMarket: {
    template: function () { return exports.Service; },
    choiceName: 'PerformMarkToMarket',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.PerformMarkToMarket.decoder; }),
    argumentEncode: function (__typed__) { return exports.PerformMarkToMarket.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.CalculationResult(Marketplace_Clearing_Model.FulfilledMarkToMarketCalculation, Marketplace_Clearing_Model.RejectedMarkToMarketCalculation).decoder; }),
    resultEncode: function (__typed__) { return exports.CalculationResult(Marketplace_Clearing_Model.FulfilledMarkToMarketCalculation, Marketplace_Clearing_Model.RejectedMarkToMarketCalculation).encode(__typed__); },
  },
  PerformMarginFill: {
    template: function () { return exports.Service; },
    choiceName: 'PerformMarginFill',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.PerformMarginFill.decoder; }),
    argumentEncode: function (__typed__) { return exports.PerformMarginFill.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.CalculationResult(Marketplace_Clearing_Model.FulfilledMarginCalculation, Marketplace_Clearing_Model.RejectedMarginCalculation).decoder; }),
    resultEncode: function (__typed__) { return exports.CalculationResult(Marketplace_Clearing_Model.FulfilledMarginCalculation, Marketplace_Clearing_Model.RejectedMarginCalculation).encode(__typed__); },
  },
  CreateMarkToMarket: {
    template: function () { return exports.Service; },
    choiceName: 'CreateMarkToMarket',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CreateMarkToMarket.decoder; }),
    argumentEncode: function (__typed__) { return exports.CreateMarkToMarket.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Clearing_Model.MarkToMarketCalculation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Clearing_Model.MarkToMarketCalculation).encode(__typed__); },
  },
  CreateMarginCalculation: {
    template: function () { return exports.Service; },
    choiceName: 'CreateMarginCalculation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CreateMarginCalculation.decoder; }),
    argumentEncode: function (__typed__) { return exports.CreateMarginCalculation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Clearing_Model.MarginCalculation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Clearing_Model.MarginCalculation).encode(__typed__); },
  },
  ApproveTrade: {
    template: function () { return exports.Service; },
    choiceName: 'ApproveTrade',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveTrade.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveTrade.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Bool.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Bool.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Service; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Service);



exports.CalculationResult = function (a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('CalculationSuccess'), value: exports.CalculationResult.CalculationSuccess(a, b).decoder, }), jtv.object({tag: jtv.constant('CalculationFailure'), value: exports.CalculationResult.CalculationFailure(a, b).decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'CalculationSuccess': return {tag: __typed__.tag, value: exports.CalculationResult.CalculationSuccess(a, b).encode(__typed__.value)};
    case 'CalculationFailure': return {tag: __typed__.tag, value: exports.CalculationResult.CalculationFailure(a, b).encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type CalculationResult';
  }
}
,
}); };
exports.CalculationResult.CalculationSuccess = function (a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({successCid: damlTypes.ContractId(a).decoder, deposits: damlTypes.Optional(exports.DepositWithRemaining).decoder, }); }),
  encode: function (__typed__) {
  return {
    successCid: damlTypes.ContractId(a).encode(__typed__.successCid),
    deposits: damlTypes.Optional(exports.DepositWithRemaining).encode(__typed__.deposits),
  };
}
,
}); };
exports.CalculationResult.CalculationFailure = function (a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({failureCid: damlTypes.ContractId(b).decoder, }); }),
  encode: function (__typed__) {
  return {
    failureCid: damlTypes.ContractId(b).encode(__typed__.failureCid),
  };
}
,
}); };







exports.DepositWithRemaining = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({deposit: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, remaining: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, }); }),
  encode: function (__typed__) {
  return {
    deposit: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.deposit),
    remaining: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.remaining),
  };
}
,
};

