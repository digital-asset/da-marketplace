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


exports.Parties = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, public: damlTypes.Party.decoder, bank: damlTypes.Party.decoder, auctionhouse: damlTypes.Party.decoder, exchange: damlTypes.Party.decoder, issuer: damlTypes.Party.decoder, ccp: damlTypes.Party.decoder, alice: damlTypes.Party.decoder, bob: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    public: damlTypes.Party.encode(__typed__.public),
    bank: damlTypes.Party.encode(__typed__.bank),
    auctionhouse: damlTypes.Party.encode(__typed__.auctionhouse),
    exchange: damlTypes.Party.encode(__typed__.exchange),
    issuer: damlTypes.Party.encode(__typed__.issuer),
    ccp: damlTypes.Party.encode(__typed__.ccp),
    alice: damlTypes.Party.encode(__typed__.alice),
    bob: damlTypes.Party.encode(__typed__.bob),
  };
}
,
};

