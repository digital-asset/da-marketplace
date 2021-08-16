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


exports.ObservationF = function (t, x, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('ConstF'), value: exports.ObservationF.ConstF(t, x, b).decoder, }), jtv.object({tag: jtv.constant('ObserveF'), value: exports.ObservationF.ObserveF(t, x, b).decoder, }), jtv.object({tag: jtv.constant('AddF'), value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(b, b).decoder, }), jtv.object({tag: jtv.constant('NegF'), value: b.decoder, }), jtv.object({tag: jtv.constant('MulF'), value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(b, b).decoder, }), jtv.object({tag: jtv.constant('DivF'), value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(b, b).decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'ConstF': return {tag: __typed__.tag, value: exports.ObservationF.ConstF(t, x, b).encode(__typed__.value)};
    case 'ObserveF': return {tag: __typed__.tag, value: exports.ObservationF.ObserveF(t, x, b).encode(__typed__.value)};
    case 'AddF': return {tag: __typed__.tag, value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(b, b).encode(__typed__.value)};
    case 'NegF': return {tag: __typed__.tag, value: b.encode(__typed__.value)};
    case 'MulF': return {tag: __typed__.tag, value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(b, b).encode(__typed__.value)};
    case 'DivF': return {tag: __typed__.tag, value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(b, b).encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type ObservationF';
  }
}
,
}); };
exports.ObservationF.ConstF = function (t, x, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({value: x.decoder, }); }),
  encode: function (__typed__) {
  return {
    value: x.encode(__typed__.value),
  };
}
,
}); };
exports.ObservationF.ObserveF = function (t, x, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({key: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    key: damlTypes.Text.encode(__typed__.key),
  };
}
,
}); };







exports.Observation = function (t, x) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('Const'), value: exports.Observation.Const(t, x).decoder, }), jtv.object({tag: jtv.constant('Observe'), value: exports.Observation.Observe(t, x).decoder, }), jtv.object({tag: jtv.constant('Add'), value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(exports.Observation(t, x), exports.Observation(t, x)).decoder, }), jtv.object({tag: jtv.constant('Neg'), value: exports.Observation(t, x).decoder, }), jtv.object({tag: jtv.constant('Mul'), value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(exports.Observation(t, x), exports.Observation(t, x)).decoder, }), jtv.object({tag: jtv.constant('Div'), value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(exports.Observation(t, x), exports.Observation(t, x)).decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'Const': return {tag: __typed__.tag, value: exports.Observation.Const(t, x).encode(__typed__.value)};
    case 'Observe': return {tag: __typed__.tag, value: exports.Observation.Observe(t, x).encode(__typed__.value)};
    case 'Add': return {tag: __typed__.tag, value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(exports.Observation(t, x), exports.Observation(t, x)).encode(__typed__.value)};
    case 'Neg': return {tag: __typed__.tag, value: exports.Observation(t, x).encode(__typed__.value)};
    case 'Mul': return {tag: __typed__.tag, value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(exports.Observation(t, x), exports.Observation(t, x)).encode(__typed__.value)};
    case 'Div': return {tag: __typed__.tag, value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(exports.Observation(t, x), exports.Observation(t, x)).encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type Observation';
  }
}
,
}); };
exports.Observation.Const = function (t, x) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({value: x.decoder, }); }),
  encode: function (__typed__) {
  return {
    value: x.encode(__typed__.value),
  };
}
,
}); };
exports.Observation.Observe = function (t, x) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({key: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    key: damlTypes.Text.encode(__typed__.key),
  };
}
,
}); };





