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

var DA_Finance_Asset = require('../../../../../DA/Finance/Asset/module');
var DA_Finance_Trade_Dvp = require('../../../../../DA/Finance/Trade/Dvp/module');
var DA_Finance_Trade_SettlementInstruction = require('../../../../../DA/Finance/Trade/SettlementInstruction/module');
var DA_Finance_Types = require('../../../../../DA/Finance/Types/module');


exports.DvpSettlement_Process = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({dvpCid: damlTypes.ContractId(DA_Finance_Trade_Dvp.Dvp).decoder, paymentInstructionCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Trade_SettlementInstruction.SettlementInstruction)).decoder, deliveryInstructionCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Trade_SettlementInstruction.SettlementInstruction)).decoder, ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    dvpCid: damlTypes.ContractId(DA_Finance_Trade_Dvp.Dvp).encode(__typed__.dvpCid),
    paymentInstructionCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Trade_SettlementInstruction.SettlementInstruction)).encode(__typed__.paymentInstructionCids),
    deliveryInstructionCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Trade_SettlementInstruction.SettlementInstruction)).encode(__typed__.deliveryInstructionCids),
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.DvpSettlementRule = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Trade.Dvp.Settlement:DvpSettlementRule',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return DA_Finance_Types.Id.decoder; }); }),
  keyEncode: function (__typed__) { return DA_Finance_Types.Id.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({masterAgreement: DA_Finance_Types.MasterAgreement.decoder, }); }),
  encode: function (__typed__) {
  return {
    masterAgreement: DA_Finance_Types.MasterAgreement.encode(__typed__.masterAgreement),
  };
}
,
  DvpSettlement_Process: {
    template: function () { return exports.DvpSettlementRule; },
    choiceName: 'DvpSettlement_Process',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.DvpSettlement_Process.decoder; }),
    argumentEncode: function (__typed__) { return exports.DvpSettlement_Process.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return exports.DvpSettlement_Process_Result.decoder; }),
    resultEncode: function (__typed__) { return exports.DvpSettlement_Process_Result.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.DvpSettlementRule; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.DvpSettlementRule);



exports.DvpSettlement_Process_Result = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({dvpCid: damlTypes.ContractId(DA_Finance_Trade_Dvp.Dvp).decoder, paymentDepositCids: damlTypes.List(damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit))).decoder, deliveryDepositCids: damlTypes.List(damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit))).decoder, }); }),
  encode: function (__typed__) {
  return {
    dvpCid: damlTypes.ContractId(DA_Finance_Trade_Dvp.Dvp).encode(__typed__.dvpCid),
    paymentDepositCids: damlTypes.List(damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit))).encode(__typed__.paymentDepositCids),
    deliveryDepositCids: damlTypes.List(damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit))).encode(__typed__.deliveryDepositCids),
  };
}
,
};

