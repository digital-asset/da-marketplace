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

var DA_Finance_Asset_Lifecycle = require('../../../../../DA/Finance/Asset/Lifecycle/module');
var DA_Finance_Trade_Dvp = require('../../../../../DA/Finance/Trade/Dvp/module');
var DA_Finance_Types = require('../../../../../DA/Finance/Types/module');


exports.DvpLifecycle_Process = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({dvpCid: damlTypes.ContractId(DA_Finance_Trade_Dvp.Dvp).decoder, lifecycleEffectsCid: damlTypes.ContractId(DA_Finance_Asset_Lifecycle.LifecycleEffects).decoder, ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    dvpCid: damlTypes.ContractId(DA_Finance_Trade_Dvp.Dvp).encode(__typed__.dvpCid),
    lifecycleEffectsCid: damlTypes.ContractId(DA_Finance_Asset_Lifecycle.LifecycleEffects).encode(__typed__.lifecycleEffectsCid),
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.DvpLifecycleRule = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Trade.Dvp.Lifecycle:DvpLifecycleRule',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return DA_Finance_Types.Id.decoder; }); }),
  keyEncode: function (__typed__) { return DA_Finance_Types.Id.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({masterAgreement: DA_Finance_Types.MasterAgreement.decoder, }); }),
  encode: function (__typed__) {
  return {
    masterAgreement: DA_Finance_Types.MasterAgreement.encode(__typed__.masterAgreement),
  };
}
,
  DvpLifecycle_Process: {
    template: function () { return exports.DvpLifecycleRule; },
    choiceName: 'DvpLifecycle_Process',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.DvpLifecycle_Process.decoder; }),
    argumentEncode: function (__typed__) { return exports.DvpLifecycle_Process.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(DA_Finance_Trade_Dvp.Dvp).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(DA_Finance_Trade_Dvp.Dvp).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.DvpLifecycleRule; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.DvpLifecycleRule);

