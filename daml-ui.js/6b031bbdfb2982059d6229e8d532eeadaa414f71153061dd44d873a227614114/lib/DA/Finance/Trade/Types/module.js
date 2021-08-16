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


exports.SettlementStatus = {
  SettlementStatus_Pending: 'SettlementStatus_Pending',
  SettlementStatus_Instructed: 'SettlementStatus_Instructed',
  SettlementStatus_Settled: 'SettlementStatus_Settled',
  keys: ['SettlementStatus_Pending','SettlementStatus_Instructed','SettlementStatus_Settled',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.SettlementStatus.SettlementStatus_Pending), jtv.constant(exports.SettlementStatus.SettlementStatus_Instructed), jtv.constant(exports.SettlementStatus.SettlementStatus_Settled)); }),
  encode: function (__typed__) { return __typed__; },
};

