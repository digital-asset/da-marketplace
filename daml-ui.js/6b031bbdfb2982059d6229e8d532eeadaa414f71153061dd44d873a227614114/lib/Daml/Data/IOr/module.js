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


exports.IOr = function (a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('Left'), value: a.decoder, }), jtv.object({tag: jtv.constant('Right'), value: b.decoder, }), jtv.object({tag: jtv.constant('Both'), value: exports.IOr.Both(a, b).decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'Left': return {tag: __typed__.tag, value: a.encode(__typed__.value)};
    case 'Right': return {tag: __typed__.tag, value: b.encode(__typed__.value)};
    case 'Both': return {tag: __typed__.tag, value: exports.IOr.Both(a, b).encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type IOr';
  }
}
,
}); };
exports.IOr.Both = function (a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({left: a.decoder, right: b.decoder, }); }),
  encode: function (__typed__) {
  return {
    left: a.encode(__typed__.left),
    right: b.encode(__typed__.right),
  };
}
,
}); };



