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

var DA_Finance_Types = require('../../../../DA/Finance/Types/module');


exports.FairValue = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Model:FairValue',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, listingId: damlTypes.Text.decoder, price: damlTypes.Numeric(10).decoder, currency: DA_Finance_Types.Id.decoder, timestamp: damlTypes.Time.decoder, upTo: damlTypes.Time.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    listingId: damlTypes.Text.encode(__typed__.listingId),
    price: damlTypes.Numeric(10).encode(__typed__.price),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
    timestamp: damlTypes.Time.encode(__typed__.timestamp),
    upTo: damlTypes.Time.encode(__typed__.upTo),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.FairValue; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.FairValue);



exports.ManualFairValueCalculation_Calculate = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({price: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    price: damlTypes.Numeric(10).encode(__typed__.price),
  };
}
,
};



exports.ManualFairValueCalculation = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Model:ManualFairValueCalculation',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, listingId: damlTypes.Text.decoder, currency: DA_Finance_Types.Id.decoder, upTo: damlTypes.Time.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    listingId: damlTypes.Text.encode(__typed__.listingId),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
    upTo: damlTypes.Time.encode(__typed__.upTo),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.ManualFairValueCalculation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ManualFairValueCalculation_Calculate: {
    template: function () { return exports.ManualFairValueCalculation; },
    choiceName: 'ManualFairValueCalculation_Calculate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ManualFairValueCalculation_Calculate.decoder; }),
    argumentEncode: function (__typed__) { return exports.ManualFairValueCalculation_Calculate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.FairValue).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.FairValue).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.ManualFairValueCalculation);



exports.FairValueCalculationRequest_Ack = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.FairValueCalculationRequest = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Model:FairValueCalculationRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, optListingIds: damlTypes.Optional(damlTypes.List(damlTypes.Text)).decoder, currency: DA_Finance_Types.Id.decoder, upTo: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    optListingIds: damlTypes.Optional(damlTypes.List(damlTypes.Text)).encode(__typed__.optListingIds),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
    upTo: damlTypes.Time.encode(__typed__.upTo),
  };
}
,
  Archive: {
    template: function () { return exports.FairValueCalculationRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  FairValueCalculationRequest_Ack: {
    template: function () { return exports.FairValueCalculationRequest; },
    choiceName: 'FairValueCalculationRequest_Ack',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.FairValueCalculationRequest_Ack.decoder; }),
    argumentEncode: function (__typed__) { return exports.FairValueCalculationRequest_Ack.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.FairValueCalculationRequest);

