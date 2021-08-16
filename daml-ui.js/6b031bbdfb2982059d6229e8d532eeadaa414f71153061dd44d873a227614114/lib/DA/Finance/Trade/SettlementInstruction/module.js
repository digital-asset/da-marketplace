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

var DA_Finance_Asset = require('../../../../DA/Finance/Asset/module');
var DA_Finance_Types = require('../../../../DA/Finance/Types/module');


exports.SettlementInstruction_AllocateNext = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.SettlementInstruction_Archive = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.SettlementInstruction_Process = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.SettlementInstruction = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Trade.SettlementInstruction:SettlementInstruction',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(DA_Finance_Types.Id, DA_Finance_Types.Id, DA_Finance_Types.Id).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(DA_Finance_Types.Id, DA_Finance_Types.Id, DA_Finance_Types.Id).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({masterAgreement: DA_Finance_Types.MasterAgreement.decoder, tradeId: DA_Finance_Types.Id.decoder, asset: DA_Finance_Types.Asset.decoder, steps: damlTypes.List(exports.SettlementDetails).decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    masterAgreement: DA_Finance_Types.MasterAgreement.encode(__typed__.masterAgreement),
    tradeId: DA_Finance_Types.Id.encode(__typed__.tradeId),
    asset: DA_Finance_Types.Asset.encode(__typed__.asset),
    steps: damlTypes.List(exports.SettlementDetails).encode(__typed__.steps),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  SettlementInstruction_AllocateNext: {
    template: function () { return exports.SettlementInstruction; },
    choiceName: 'SettlementInstruction_AllocateNext',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SettlementInstruction_AllocateNext.decoder; }),
    argumentEncode: function (__typed__) { return exports.SettlementInstruction_AllocateNext.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.SettlementInstruction).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.SettlementInstruction).encode(__typed__); },
  },
  SettlementInstruction_Process: {
    template: function () { return exports.SettlementInstruction; },
    choiceName: 'SettlementInstruction_Process',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SettlementInstruction_Process.decoder; }),
    argumentEncode: function (__typed__) { return exports.SettlementInstruction_Process.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.SettlementInstruction; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  SettlementInstruction_Archive: {
    template: function () { return exports.SettlementInstruction; },
    choiceName: 'SettlementInstruction_Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SettlementInstruction_Archive.decoder; }),
    argumentEncode: function (__typed__) { return exports.SettlementInstruction_Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.SettlementInstruction);



exports.SettlementDetails = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({senderAccount: DA_Finance_Types.Account.decoder, receiverAccount: DA_Finance_Types.Account.decoder, depositCid: damlTypes.Optional(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, }); }),
  encode: function (__typed__) {
  return {
    senderAccount: DA_Finance_Types.Account.encode(__typed__.senderAccount),
    receiverAccount: DA_Finance_Types.Account.encode(__typed__.receiverAccount),
    depositCid: damlTypes.Optional(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.depositCid),
  };
}
,
};

