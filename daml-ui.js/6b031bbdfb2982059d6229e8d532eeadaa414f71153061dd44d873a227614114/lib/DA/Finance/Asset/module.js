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

var DA_Finance_Types = require('../../../DA/Finance/Types/module');


exports.AssetCategorization_SetObservers = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.newObservers),
  };
}
,
};



exports.AssetCategorization = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Asset:AssetCategorization',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({id: DA_Finance_Types.Id.decoder, assetType: damlTypes.Text.decoder, assetClass: damlTypes.Text.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    id: DA_Finance_Types.Id.encode(__typed__.id),
    assetType: damlTypes.Text.encode(__typed__.assetType),
    assetClass: damlTypes.Text.encode(__typed__.assetClass),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.AssetCategorization; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  AssetCategorization_SetObservers: {
    template: function () { return exports.AssetCategorization; },
    choiceName: 'AssetCategorization_SetObservers',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AssetCategorization_SetObservers.decoder; }),
    argumentEncode: function (__typed__) { return exports.AssetCategorization_SetObservers.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AssetCategorization).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AssetCategorization).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.AssetCategorization);



exports.AssetDeposit_Merge = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({depositCids: damlTypes.List(damlTypes.ContractId(exports.AssetDeposit)).decoder, }); }),
  encode: function (__typed__) {
  return {
    depositCids: damlTypes.List(damlTypes.ContractId(exports.AssetDeposit)).encode(__typed__.depositCids),
  };
}
,
};



exports.AssetDeposit_Split = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({quantities: damlTypes.List(damlTypes.Numeric(10)).decoder, }); }),
  encode: function (__typed__) {
  return {
    quantities: damlTypes.List(damlTypes.Numeric(10)).encode(__typed__.quantities),
  };
}
,
};



exports.AssetDeposit_SetObservers = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.newObservers),
  };
}
,
};



exports.AssetDeposit = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Asset:AssetDeposit',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({account: DA_Finance_Types.Account.decoder, asset: DA_Finance_Types.Asset.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    account: DA_Finance_Types.Account.encode(__typed__.account),
    asset: DA_Finance_Types.Asset.encode(__typed__.asset),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.AssetDeposit; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  AssetDeposit_Merge: {
    template: function () { return exports.AssetDeposit; },
    choiceName: 'AssetDeposit_Merge',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AssetDeposit_Merge.decoder; }),
    argumentEncode: function (__typed__) { return exports.AssetDeposit_Merge.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AssetDeposit).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AssetDeposit).encode(__typed__); },
  },
  AssetDeposit_Split: {
    template: function () { return exports.AssetDeposit; },
    choiceName: 'AssetDeposit_Split',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AssetDeposit_Split.decoder; }),
    argumentEncode: function (__typed__) { return exports.AssetDeposit_Split.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.List(damlTypes.ContractId(exports.AssetDeposit)).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.List(damlTypes.ContractId(exports.AssetDeposit)).encode(__typed__); },
  },
  AssetDeposit_SetObservers: {
    template: function () { return exports.AssetDeposit; },
    choiceName: 'AssetDeposit_SetObservers',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AssetDeposit_SetObservers.decoder; }),
    argumentEncode: function (__typed__) { return exports.AssetDeposit_SetObservers.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AssetDeposit).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AssetDeposit).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.AssetDeposit);

