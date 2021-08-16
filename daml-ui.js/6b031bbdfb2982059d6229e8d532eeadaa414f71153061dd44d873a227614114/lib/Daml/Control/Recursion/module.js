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


exports.ListF = function (a, x) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('Nil'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('Cons'), value: exports.ListF.Cons(a, x).decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'Nil': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'Cons': return {tag: __typed__.tag, value: exports.ListF.Cons(a, x).encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type ListF';
  }
}
,
}); };
exports.ListF.Cons = function (a, x) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({value: a.decoder, pattern: x.decoder, }); }),
  encode: function (__typed__) {
  return {
    value: a.encode(__typed__.value),
    pattern: x.encode(__typed__.pattern),
  };
}
,
}); };



