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

var ContingentClaims_Observation = require('../../../ContingentClaims/Observation/module');


exports.ClaimF = function (t, x, a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('ZeroF'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('OneF'), value: a.decoder, }), jtv.object({tag: jtv.constant('GiveF'), value: b.decoder, }), jtv.object({tag: jtv.constant('AndF'), value: exports.ClaimF.AndF(t, x, a, b).decoder, }), jtv.object({tag: jtv.constant('OrF'), value: exports.ClaimF.OrF(t, x, a, b).decoder, }), jtv.object({tag: jtv.constant('CondF'), value: exports.ClaimF.CondF(t, x, a, b).decoder, }), jtv.object({tag: jtv.constant('ScaleF'), value: exports.ClaimF.ScaleF(t, x, a, b).decoder, }), jtv.object({tag: jtv.constant('WhenF'), value: exports.ClaimF.WhenF(t, x, a, b).decoder, }), jtv.object({tag: jtv.constant('AnytimeF'), value: exports.ClaimF.AnytimeF(t, x, a, b).decoder, }), jtv.object({tag: jtv.constant('UntilF'), value: exports.ClaimF.UntilF(t, x, a, b).decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'ZeroF': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'OneF': return {tag: __typed__.tag, value: a.encode(__typed__.value)};
    case 'GiveF': return {tag: __typed__.tag, value: b.encode(__typed__.value)};
    case 'AndF': return {tag: __typed__.tag, value: exports.ClaimF.AndF(t, x, a, b).encode(__typed__.value)};
    case 'OrF': return {tag: __typed__.tag, value: exports.ClaimF.OrF(t, x, a, b).encode(__typed__.value)};
    case 'CondF': return {tag: __typed__.tag, value: exports.ClaimF.CondF(t, x, a, b).encode(__typed__.value)};
    case 'ScaleF': return {tag: __typed__.tag, value: exports.ClaimF.ScaleF(t, x, a, b).encode(__typed__.value)};
    case 'WhenF': return {tag: __typed__.tag, value: exports.ClaimF.WhenF(t, x, a, b).encode(__typed__.value)};
    case 'AnytimeF': return {tag: __typed__.tag, value: exports.ClaimF.AnytimeF(t, x, a, b).encode(__typed__.value)};
    case 'UntilF': return {tag: __typed__.tag, value: exports.ClaimF.UntilF(t, x, a, b).encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type ClaimF';
  }
}
,
}); };
exports.ClaimF.AndF = function (t, x, a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({claims: damlTypes.List(b).decoder, }); }),
  encode: function (__typed__) {
  return {
    claims: damlTypes.List(b).encode(__typed__.claims),
  };
}
,
}); };
exports.ClaimF.OrF = function (t, x, a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({lhs: b.decoder, rhs: b.decoder, }); }),
  encode: function (__typed__) {
  return {
    lhs: b.encode(__typed__.lhs),
    rhs: b.encode(__typed__.rhs),
  };
}
,
}); };
exports.ClaimF.CondF = function (t, x, a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({predicate: exports.Inequality(t, x).decoder, success: b.decoder, failure: b.decoder, }); }),
  encode: function (__typed__) {
  return {
    predicate: exports.Inequality(t, x).encode(__typed__.predicate),
    success: b.encode(__typed__.success),
    failure: b.encode(__typed__.failure),
  };
}
,
}); };
exports.ClaimF.ScaleF = function (t, x, a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({k: ContingentClaims_Observation.Observation(t, x).decoder, claim: b.decoder, }); }),
  encode: function (__typed__) {
  return {
    k: ContingentClaims_Observation.Observation(t, x).encode(__typed__.k),
    claim: b.encode(__typed__.claim),
  };
}
,
}); };
exports.ClaimF.WhenF = function (t, x, a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({predicate: exports.Inequality(t, x).decoder, claim: b.decoder, }); }),
  encode: function (__typed__) {
  return {
    predicate: exports.Inequality(t, x).encode(__typed__.predicate),
    claim: b.encode(__typed__.claim),
  };
}
,
}); };
exports.ClaimF.AnytimeF = function (t, x, a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({predicate: exports.Inequality(t, x).decoder, claim: b.decoder, }); }),
  encode: function (__typed__) {
  return {
    predicate: exports.Inequality(t, x).encode(__typed__.predicate),
    claim: b.encode(__typed__.claim),
  };
}
,
}); };
exports.ClaimF.UntilF = function (t, x, a, b) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({predicate: exports.Inequality(t, x).decoder, claim: b.decoder, }); }),
  encode: function (__typed__) {
  return {
    predicate: exports.Inequality(t, x).encode(__typed__.predicate),
    claim: b.encode(__typed__.claim),
  };
}
,
}); };

















exports.Inequality = function (t, x) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('TimeGte'), value: t.decoder, }), jtv.object({tag: jtv.constant('Lte'), value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(ContingentClaims_Observation.Observation(t, x), ContingentClaims_Observation.Observation(t, x)).decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'TimeGte': return {tag: __typed__.tag, value: t.encode(__typed__.value)};
    case 'Lte': return {tag: __typed__.tag, value: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(ContingentClaims_Observation.Observation(t, x), ContingentClaims_Observation.Observation(t, x)).encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type Inequality';
  }
}
,
}); };



exports.Claim = function (t, x, a) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('Zero'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('One'), value: a.decoder, }), jtv.object({tag: jtv.constant('Give'), value: exports.Claim(t, x, a).decoder, }), jtv.object({tag: jtv.constant('And'), value: exports.Claim.And(t, x, a).decoder, }), jtv.object({tag: jtv.constant('Or'), value: exports.Claim.Or(t, x, a).decoder, }), jtv.object({tag: jtv.constant('Cond'), value: exports.Claim.Cond(t, x, a).decoder, }), jtv.object({tag: jtv.constant('Scale'), value: exports.Claim.Scale(t, x, a).decoder, }), jtv.object({tag: jtv.constant('When'), value: exports.Claim.When(t, x, a).decoder, }), jtv.object({tag: jtv.constant('Anytime'), value: exports.Claim.Anytime(t, x, a).decoder, }), jtv.object({tag: jtv.constant('Until'), value: exports.Claim.Until(t, x, a).decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'Zero': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'One': return {tag: __typed__.tag, value: a.encode(__typed__.value)};
    case 'Give': return {tag: __typed__.tag, value: exports.Claim(t, x, a).encode(__typed__.value)};
    case 'And': return {tag: __typed__.tag, value: exports.Claim.And(t, x, a).encode(__typed__.value)};
    case 'Or': return {tag: __typed__.tag, value: exports.Claim.Or(t, x, a).encode(__typed__.value)};
    case 'Cond': return {tag: __typed__.tag, value: exports.Claim.Cond(t, x, a).encode(__typed__.value)};
    case 'Scale': return {tag: __typed__.tag, value: exports.Claim.Scale(t, x, a).encode(__typed__.value)};
    case 'When': return {tag: __typed__.tag, value: exports.Claim.When(t, x, a).encode(__typed__.value)};
    case 'Anytime': return {tag: __typed__.tag, value: exports.Claim.Anytime(t, x, a).encode(__typed__.value)};
    case 'Until': return {tag: __typed__.tag, value: exports.Claim.Until(t, x, a).encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type Claim';
  }
}
,
}); };
exports.Claim.And = function (t, x, a) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({claims: damlTypes.List(exports.Claim(t, x, a)).decoder, }); }),
  encode: function (__typed__) {
  return {
    claims: damlTypes.List(exports.Claim(t, x, a)).encode(__typed__.claims),
  };
}
,
}); };
exports.Claim.Or = function (t, x, a) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({lhs: exports.Claim(t, x, a).decoder, rhs: exports.Claim(t, x, a).decoder, }); }),
  encode: function (__typed__) {
  return {
    lhs: exports.Claim(t, x, a).encode(__typed__.lhs),
    rhs: exports.Claim(t, x, a).encode(__typed__.rhs),
  };
}
,
}); };
exports.Claim.Cond = function (t, x, a) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({predicate: exports.Inequality(t, x).decoder, success: exports.Claim(t, x, a).decoder, failure: exports.Claim(t, x, a).decoder, }); }),
  encode: function (__typed__) {
  return {
    predicate: exports.Inequality(t, x).encode(__typed__.predicate),
    success: exports.Claim(t, x, a).encode(__typed__.success),
    failure: exports.Claim(t, x, a).encode(__typed__.failure),
  };
}
,
}); };
exports.Claim.Scale = function (t, x, a) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({k: ContingentClaims_Observation.Observation(t, x).decoder, claim: exports.Claim(t, x, a).decoder, }); }),
  encode: function (__typed__) {
  return {
    k: ContingentClaims_Observation.Observation(t, x).encode(__typed__.k),
    claim: exports.Claim(t, x, a).encode(__typed__.claim),
  };
}
,
}); };
exports.Claim.When = function (t, x, a) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({predicate: exports.Inequality(t, x).decoder, claim: exports.Claim(t, x, a).decoder, }); }),
  encode: function (__typed__) {
  return {
    predicate: exports.Inequality(t, x).encode(__typed__.predicate),
    claim: exports.Claim(t, x, a).encode(__typed__.claim),
  };
}
,
}); };
exports.Claim.Anytime = function (t, x, a) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({predicate: exports.Inequality(t, x).decoder, claim: exports.Claim(t, x, a).decoder, }); }),
  encode: function (__typed__) {
  return {
    predicate: exports.Inequality(t, x).encode(__typed__.predicate),
    claim: exports.Claim(t, x, a).encode(__typed__.claim),
  };
}
,
}); };
exports.Claim.Until = function (t, x, a) { return ({
  decoder: damlTypes.lazyMemo(function () { return jtv.object({predicate: exports.Inequality(t, x).decoder, claim: exports.Claim(t, x, a).decoder, }); }),
  encode: function (__typed__) {
  return {
    predicate: exports.Inequality(t, x).encode(__typed__.predicate),
    claim: exports.Claim(t, x, a).encode(__typed__.claim),
  };
}
,
}); };















