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

var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

var DA_Finance_Asset = require('../../../DA/Finance/Asset/module');
var DA_Finance_Types = require('../../../DA/Finance/Types/module');


exports.Settle = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.SettlementInstruction = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Settlement.Model:SettlementInstruction',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, details: damlTypes.List(exports.SettlementDetails).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    details: damlTypes.List(exports.SettlementDetails).encode(__typed__.details),
  };
}
,
  Archive: {
    template: function () { return exports.SettlementInstruction; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Settle: {
    template: function () { return exports.SettlementInstruction; },
    choiceName: 'Settle',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Settle.decoder; }),
    argumentEncode: function (__typed__) { return exports.Settle.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.SettlementInstruction);



exports.SettlementDetails = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({senderAccount: DA_Finance_Types.Account.decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, receiverAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    senderAccount: DA_Finance_Types.Account.encode(__typed__.senderAccount),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
    receiverAccount: DA_Finance_Types.Account.encode(__typed__.receiverAccount),
  };
}
,
};

