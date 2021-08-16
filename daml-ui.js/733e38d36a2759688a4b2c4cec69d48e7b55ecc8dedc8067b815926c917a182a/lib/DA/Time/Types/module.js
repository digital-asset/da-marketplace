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


exports.RelTime = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({microseconds: damlTypes.Int.decoder, }); }),
  encode: function (__typed__) {
  return {
    microseconds: damlTypes.Int.encode(__typed__.microseconds),
  };
}
,
};

