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

var DA_Finance_Asset = require('../../../DA/Finance/Asset/module');
var DA_Finance_Types = require('../../../DA/Finance/Types/module');


exports.WithdrawalRequest = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Rule.AllocationAccount:WithdrawalRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, account: DA_Finance_Types.Account.decoder, transferTo: DA_Finance_Types.Account.decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    account: DA_Finance_Types.Account.encode(__typed__.account),
    transferTo: DA_Finance_Types.Account.encode(__typed__.transferTo),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
  };
}
,
  Archive: {
    template: function () { return exports.WithdrawalRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.WithdrawalRequest);



exports.Transfer = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({transferTo: DA_Finance_Types.Account.decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    transferTo: DA_Finance_Types.Account.encode(__typed__.transferTo),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
  };
}
,
};



exports.CancelWithdrawalRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({withdrawalRequestCid: damlTypes.ContractId(exports.WithdrawalRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    withdrawalRequestCid: damlTypes.ContractId(exports.WithdrawalRequest).encode(__typed__.withdrawalRequestCid),
  };
}
,
};



exports.RequestWithdrawal = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({transferTo: DA_Finance_Types.Account.decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    transferTo: DA_Finance_Types.Account.encode(__typed__.transferTo),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
  };
}
,
};



exports.RejectWithdrawal = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({withdrawalRequestCid: damlTypes.ContractId(exports.WithdrawalRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    withdrawalRequestCid: damlTypes.ContractId(exports.WithdrawalRequest).encode(__typed__.withdrawalRequestCid),
  };
}
,
};



exports.ApproveWithdrawal = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({unallocateCid: damlTypes.ContractId(exports.WithdrawalRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    unallocateCid: damlTypes.ContractId(exports.WithdrawalRequest).encode(__typed__.unallocateCid),
  };
}
,
};



exports.Withdraw = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({transferTo: DA_Finance_Types.Account.decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    transferTo: DA_Finance_Types.Account.encode(__typed__.transferTo),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
  };
}
,
};



exports.Deposit = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
  };
}
,
};



exports.AllocationAccountRule = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Rule.AllocationAccount:AllocationAccountRule',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return DA_Finance_Types.Id.decoder; }); }),
  keyEncode: function (__typed__) { return DA_Finance_Types.Id.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, account: DA_Finance_Types.Account.decoder, nominee: damlTypes.Party.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    account: DA_Finance_Types.Account.encode(__typed__.account),
    nominee: damlTypes.Party.encode(__typed__.nominee),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Withdraw: {
    template: function () { return exports.AllocationAccountRule; },
    choiceName: 'Withdraw',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Withdraw.decoder; }),
    argumentEncode: function (__typed__) { return exports.Withdraw.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.AllocationAccountRule; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Transfer: {
    template: function () { return exports.AllocationAccountRule; },
    choiceName: 'Transfer',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Transfer.decoder; }),
    argumentEncode: function (__typed__) { return exports.Transfer.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__); },
  },
  CancelWithdrawalRequest: {
    template: function () { return exports.AllocationAccountRule; },
    choiceName: 'CancelWithdrawalRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CancelWithdrawalRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.CancelWithdrawalRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RequestWithdrawal: {
    template: function () { return exports.AllocationAccountRule; },
    choiceName: 'RequestWithdrawal',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestWithdrawal.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestWithdrawal.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.WithdrawalRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.WithdrawalRequest).encode(__typed__); },
  },
  RejectWithdrawal: {
    template: function () { return exports.AllocationAccountRule; },
    choiceName: 'RejectWithdrawal',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectWithdrawal.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectWithdrawal.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ApproveWithdrawal: {
    template: function () { return exports.AllocationAccountRule; },
    choiceName: 'ApproveWithdrawal',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveWithdrawal.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveWithdrawal.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__); },
  },
  Deposit: {
    template: function () { return exports.AllocationAccountRule; },
    choiceName: 'Deposit',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Deposit.decoder; }),
    argumentEncode: function (__typed__) { return exports.Deposit.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.AllocationAccountRule);

