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
var Marketplace_Settlement_Model = require('../../../../Marketplace/Settlement/Model/module');
var Marketplace_Trading_Model = require('../../../../Marketplace/Trading/Model/module');


exports.Sign = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({ctrl: damlTypes.Party.decoder, allocationAccount: DA_Finance_Types.Account.decoder, tradingAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
  };
}
,
};



exports.Process = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({buyCid: damlTypes.ContractId(Marketplace_Trading_Model.Order).decoder, sellCid: damlTypes.ContractId(Marketplace_Trading_Model.Order).decoder, }); }),
  encode: function (__typed__) {
  return {
    buyCid: damlTypes.ContractId(Marketplace_Trading_Model.Order).encode(__typed__.buyCid),
    sellCid: damlTypes.ContractId(Marketplace_Trading_Model.Order).encode(__typed__.sellCid),
  };
}
,
};



exports.ProcessCleared = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({buyCid: damlTypes.ContractId(Marketplace_Trading_Model.Order).decoder, sellCid: damlTypes.ContractId(Marketplace_Trading_Model.Order).decoder, }); }),
  encode: function (__typed__) {
  return {
    buyCid: damlTypes.ContractId(Marketplace_Trading_Model.Order).encode(__typed__.buyCid),
    sellCid: damlTypes.ContractId(Marketplace_Trading_Model.Order).encode(__typed__.sellCid),
  };
}
,
};



exports.Confirmation = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Confirmation.Model:Confirmation',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, buyer: damlTypes.Party.decoder, seller: damlTypes.Party.decoder, accounts: damlTypes.List(exports.CustomerAccounts).decoder, execution: Marketplace_Trading_Model.Execution.decoder, signed: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    buyer: damlTypes.Party.encode(__typed__.buyer),
    seller: damlTypes.Party.encode(__typed__.seller),
    accounts: damlTypes.List(exports.CustomerAccounts).encode(__typed__.accounts),
    execution: Marketplace_Trading_Model.Execution.encode(__typed__.execution),
    signed: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.signed),
  };
}
,
  Process: {
    template: function () { return exports.Confirmation; },
    choiceName: 'Process',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Process.decoder; }),
    argumentEncode: function (__typed__) { return exports.Process.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Settlement_Model.SettlementInstruction).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Settlement_Model.SettlementInstruction).encode(__typed__); },
  },
  ProcessCleared: {
    template: function () { return exports.Confirmation; },
    choiceName: 'ProcessCleared',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ProcessCleared.decoder; }),
    argumentEncode: function (__typed__) { return exports.ProcessCleared.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Sign: {
    template: function () { return exports.Confirmation; },
    choiceName: 'Sign',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Sign.decoder; }),
    argumentEncode: function (__typed__) { return exports.Sign.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Confirmation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Confirmation).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Confirmation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Confirmation);



exports.CustomerAccounts = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, allocationAccount: DA_Finance_Types.Account.decoder, tradingAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
  };
}
,
};

