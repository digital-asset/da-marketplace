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


exports.MasterAgreement = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({id: exports.Id.decoder, party1: damlTypes.Party.decoder, party2: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    id: exports.Id.encode(__typed__.id),
    party1: damlTypes.Party.encode(__typed__.party1),
    party2: damlTypes.Party.encode(__typed__.party2),
  };
}
,
};



exports.Asset = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({id: exports.Id.decoder, quantity: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    id: exports.Id.encode(__typed__.id),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
  };
}
,
};



exports.Account = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({id: exports.Id.decoder, provider: damlTypes.Party.decoder, owner: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    id: exports.Id.encode(__typed__.id),
    provider: damlTypes.Party.encode(__typed__.provider),
    owner: damlTypes.Party.encode(__typed__.owner),
  };
}
,
};



exports.Id = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, label: damlTypes.Text.decoder, version: damlTypes.Int.decoder, }); }),
  encode: function (__typed__) {
  return {
    signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.signatories),
    label: damlTypes.Text.encode(__typed__.label),
    version: damlTypes.Int.encode(__typed__.version),
  };
}
,
};

