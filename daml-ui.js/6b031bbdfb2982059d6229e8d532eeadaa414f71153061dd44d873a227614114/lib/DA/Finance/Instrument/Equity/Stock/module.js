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

var DA_Finance_Types = require('../../../../../DA/Finance/Types/module');


exports.EquityStock_SetObservers = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.newObservers),
  };
}
,
};



exports.EquityStock = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Equity.Stock:EquityStock',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return DA_Finance_Types.Id.decoder; }); }),
  keyEncode: function (__typed__) { return DA_Finance_Types.Id.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({id: DA_Finance_Types.Id.decoder, ccy: DA_Finance_Types.Id.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    id: DA_Finance_Types.Id.encode(__typed__.id),
    ccy: DA_Finance_Types.Id.encode(__typed__.ccy),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.EquityStock; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  EquityStock_SetObservers: {
    template: function () { return exports.EquityStock; },
    choiceName: 'EquityStock_SetObservers',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.EquityStock_SetObservers.decoder; }),
    argumentEncode: function (__typed__) { return exports.EquityStock_SetObservers.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.EquityStock).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.EquityStock).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.EquityStock);

