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

var ContingentClaims_Claim_Serializable = require('../../../ContingentClaims/Claim/Serializable/module');
var DA_Finance_Types = require('../../../DA/Finance/Types/module');
var Marketplace_Issuance_CFI = require('../../../Marketplace/Issuance/CFI/module');


exports.LookupOrInsert = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({claims: ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id).decoder, }); }),
  encode: function (__typed__) {
  return {
    claims: ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id).encode(__typed__.claims),
  };
}
,
};



exports.Index = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.AssetDescription:Index',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party), damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party), damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assetLabel: damlTypes.Text.decoder, descriptionSignatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, versions: damlTypes.Map(ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id), damlTypes.Int).decoder, }); }),
  encode: function (__typed__) {
  return {
    assetLabel: damlTypes.Text.encode(__typed__.assetLabel),
    descriptionSignatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.descriptionSignatories),
    versions: damlTypes.Map(ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id), damlTypes.Int).encode(__typed__.versions),
  };
}
,
  Archive: {
    template: function () { return exports.Index; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  LookupOrInsert: {
    template: function () { return exports.Index; },
    choiceName: 'LookupOrInsert',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.LookupOrInsert.decoder; }),
    argumentEncode: function (__typed__) { return exports.LookupOrInsert.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Index), damlTypes.Int).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Index), damlTypes.Int).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Index);



exports.Multipliers = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
  };
}
,
};



exports.Underlying = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
  };
}
,
};



exports.Expiry = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
  };
}
,
};



exports.AssetDescription = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.AssetDescription:AssetDescription',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return DA_Finance_Types.Id.decoder; }); }),
  keyEncode: function (__typed__) { return DA_Finance_Types.Id.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assetId: DA_Finance_Types.Id.decoder, description: damlTypes.Text.decoder, cfi: Marketplace_Issuance_CFI.CFI.decoder, issuer: damlTypes.Party.decoder, claims: ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id).decoder, safekeepingAccount: DA_Finance_Types.Account.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    assetId: DA_Finance_Types.Id.encode(__typed__.assetId),
    description: damlTypes.Text.encode(__typed__.description),
    cfi: Marketplace_Issuance_CFI.CFI.encode(__typed__.cfi),
    issuer: damlTypes.Party.encode(__typed__.issuer),
    claims: ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id).encode(__typed__.claims),
    safekeepingAccount: DA_Finance_Types.Account.encode(__typed__.safekeepingAccount),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.AssetDescription; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Expiry: {
    template: function () { return exports.AssetDescription; },
    choiceName: 'Expiry',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Expiry.decoder; }),
    argumentEncode: function (__typed__) { return exports.Expiry.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Optional(damlTypes.Date).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Optional(damlTypes.Date).encode(__typed__); },
  },
  Underlying: {
    template: function () { return exports.AssetDescription; },
    choiceName: 'Underlying',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Underlying.decoder; }),
    argumentEncode: function (__typed__) { return exports.Underlying.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.List(DA_Finance_Types.Id).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.List(DA_Finance_Types.Id).encode(__typed__); },
  },
  Multipliers: {
    template: function () { return exports.AssetDescription; },
    choiceName: 'Multipliers',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Multipliers.decoder; }),
    argumentEncode: function (__typed__) { return exports.Multipliers.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.List(damlTypes.Numeric(10)).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.List(damlTypes.Numeric(10)).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.AssetDescription);

