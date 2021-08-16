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

var DA_Finance_Asset_Lifecycle = require('../../../../DA/Finance/Asset/Lifecycle/module');
var DA_Finance_Types = require('../../../../DA/Finance/Types/module');


exports.Entitlement_Lifecycle = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Entitlement_SetObservers = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.newObservers),
  };
}
,
};



exports.Entitlement = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Entitlement:Entitlement',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return DA_Finance_Types.Id.decoder; }); }),
  keyEncode: function (__typed__) { return DA_Finance_Types.Id.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({id: DA_Finance_Types.Id.decoder, settlementDate: damlTypes.Date.decoder, underlying: DA_Finance_Types.Asset.decoder, payment: damlTypes.Optional(DA_Finance_Types.Asset).decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    id: DA_Finance_Types.Id.encode(__typed__.id),
    settlementDate: damlTypes.Date.encode(__typed__.settlementDate),
    underlying: DA_Finance_Types.Asset.encode(__typed__.underlying),
    payment: damlTypes.Optional(DA_Finance_Types.Asset).encode(__typed__.payment),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Entitlement_SetObservers: {
    template: function () { return exports.Entitlement; },
    choiceName: 'Entitlement_SetObservers',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Entitlement_SetObservers.decoder; }),
    argumentEncode: function (__typed__) { return exports.Entitlement_SetObservers.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Entitlement).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Entitlement).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Entitlement; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Entitlement_Lifecycle: {
    template: function () { return exports.Entitlement; },
    choiceName: 'Entitlement_Lifecycle',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Entitlement_Lifecycle.decoder; }),
    argumentEncode: function (__typed__) { return exports.Entitlement_Lifecycle.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(DA_Finance_Asset_Lifecycle.LifecycleEffects).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(DA_Finance_Asset_Lifecycle.LifecycleEffects).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Entitlement);

