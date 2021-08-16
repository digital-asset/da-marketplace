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

var pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 = require('@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657');
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

var DA_Finance_Asset = require('../../../../DA/Finance/Asset/module');
var DA_Finance_Types = require('../../../../DA/Finance/Types/module');


exports.AssetSettlement_Credit = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({asset: DA_Finance_Types.Asset.decoder, ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    asset: DA_Finance_Types.Asset.encode(__typed__.asset),
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.AssetSettlement_Debit = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
  };
}
,
};



exports.AssetSettlement_RemoveController = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.AssetSettlement_AddController = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.AssetSettlement_Transfer = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({receiverAccountId: DA_Finance_Types.Id.decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    receiverAccountId: DA_Finance_Types.Id.encode(__typed__.receiverAccountId),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
  };
}
,
};



exports.AssetSettlementRule = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Asset.Settlement:AssetSettlementRule',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return DA_Finance_Types.Id.decoder; }); }),
  keyEncode: function (__typed__) { return DA_Finance_Types.Id.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({account: DA_Finance_Types.Account.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, ctrls: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    account: DA_Finance_Types.Account.encode(__typed__.account),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
    ctrls: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.ctrls),
  };
}
,
  AssetSettlement_Debit: {
    template: function () { return exports.AssetSettlementRule; },
    choiceName: 'AssetSettlement_Debit',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AssetSettlement_Debit.decoder; }),
    argumentEncode: function (__typed__) { return exports.AssetSettlement_Debit.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return DA_Finance_Types.Asset.decoder; }),
    resultEncode: function (__typed__) { return DA_Finance_Types.Asset.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.AssetSettlementRule; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  AssetSettlement_Credit: {
    template: function () { return exports.AssetSettlementRule; },
    choiceName: 'AssetSettlement_Credit',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AssetSettlement_Credit.decoder; }),
    argumentEncode: function (__typed__) { return exports.AssetSettlement_Credit.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__); },
  },
  AssetSettlement_AddController: {
    template: function () { return exports.AssetSettlementRule; },
    choiceName: 'AssetSettlement_AddController',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AssetSettlement_AddController.decoder; }),
    argumentEncode: function (__typed__) { return exports.AssetSettlement_AddController.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AssetSettlementRule).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AssetSettlementRule).encode(__typed__); },
  },
  AssetSettlement_RemoveController: {
    template: function () { return exports.AssetSettlementRule; },
    choiceName: 'AssetSettlement_RemoveController',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AssetSettlement_RemoveController.decoder; }),
    argumentEncode: function (__typed__) { return exports.AssetSettlement_RemoveController.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AssetSettlementRule).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AssetSettlementRule).encode(__typed__); },
  },
  AssetSettlement_Transfer: {
    template: function () { return exports.AssetSettlementRule; },
    choiceName: 'AssetSettlement_Transfer',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AssetSettlement_Transfer.decoder; }),
    argumentEncode: function (__typed__) { return exports.AssetSettlement_Transfer.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.AssetSettlementRule);

