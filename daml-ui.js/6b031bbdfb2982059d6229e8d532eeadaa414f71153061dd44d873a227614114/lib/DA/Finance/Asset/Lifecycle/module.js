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


exports.LifecycleEffects_SetObservers = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.newObservers),
  };
}
,
};



exports.LifecycleEffects = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Asset.Lifecycle:LifecycleEffects',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return DA_Finance_Types.Id.decoder; }); }),
  keyEncode: function (__typed__) { return DA_Finance_Types.Id.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({id: DA_Finance_Types.Id.decoder, label: damlTypes.Text.decoder, consuming: damlTypes.List(DA_Finance_Types.Asset).decoder, effects: damlTypes.List(DA_Finance_Types.Asset).decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    id: DA_Finance_Types.Id.encode(__typed__.id),
    label: damlTypes.Text.encode(__typed__.label),
    consuming: damlTypes.List(DA_Finance_Types.Asset).encode(__typed__.consuming),
    effects: damlTypes.List(DA_Finance_Types.Asset).encode(__typed__.effects),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.LifecycleEffects; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  LifecycleEffects_SetObservers: {
    template: function () { return exports.LifecycleEffects; },
    choiceName: 'LifecycleEffects_SetObservers',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.LifecycleEffects_SetObservers.decoder; }),
    argumentEncode: function (__typed__) { return exports.LifecycleEffects_SetObservers.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LifecycleEffects).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LifecycleEffects).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.LifecycleEffects);



exports.AssetLifecycle_Process = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({lifecycleEffectsCid: damlTypes.ContractId(exports.LifecycleEffects).decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, consumingDepositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder, accountIds: damlTypes.Optional(damlTypes.List(DA_Finance_Types.Id)).decoder, }); }),
  encode: function (__typed__) {
  return {
    lifecycleEffectsCid: damlTypes.ContractId(exports.LifecycleEffects).encode(__typed__.lifecycleEffectsCid),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
    consumingDepositCids: damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__.consumingDepositCids),
    accountIds: damlTypes.Optional(damlTypes.List(DA_Finance_Types.Id)).encode(__typed__.accountIds),
  };
}
,
};



exports.AssetLifecycleRule = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Asset.Lifecycle:AssetLifecycleRule',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return DA_Finance_Types.Id.decoder; }); }),
  keyEncode: function (__typed__) { return DA_Finance_Types.Id.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({account: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    account: DA_Finance_Types.Account.encode(__typed__.account),
  };
}
,
  Archive: {
    template: function () { return exports.AssetLifecycleRule; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  AssetLifecycle_Process: {
    template: function () { return exports.AssetLifecycleRule; },
    choiceName: 'AssetLifecycle_Process',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AssetLifecycle_Process.decoder; }),
    argumentEncode: function (__typed__) { return exports.AssetLifecycle_Process.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.List(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.AssetLifecycleRule);

