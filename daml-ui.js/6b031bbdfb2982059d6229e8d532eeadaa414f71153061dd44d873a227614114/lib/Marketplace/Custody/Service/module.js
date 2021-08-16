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
var pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 = require('@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657');
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

var ContingentClaims_Claim_Serializable = require('../../../ContingentClaims/Claim/Serializable/module');
var DA_Finance_Asset = require('../../../DA/Finance/Asset/module');
var DA_Finance_Asset_Settlement = require('../../../DA/Finance/Asset/Settlement/module');
var DA_Finance_Trade_SettlementInstruction = require('../../../DA/Finance/Trade/SettlementInstruction/module');
var DA_Finance_Types = require('../../../DA/Finance/Types/module');
var Marketplace_Custody_Model = require('../../../Marketplace/Custody/Model/module');
var Marketplace_Rule_AllocationAccount = require('../../../Marketplace/Rule/AllocationAccount/module');


exports.Approve = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
  };
}
,
};



exports.Reject = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Cancel = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Request = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Service:Request',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
    provider: damlTypes.Party.encode(__typed__.provider),
  };
}
,
  Cancel: {
    template: function () { return exports.Request; },
    choiceName: 'Cancel',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Cancel.decoder; }),
    argumentEncode: function (__typed__) { return exports.Cancel.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Reject: {
    template: function () { return exports.Request; },
    choiceName: 'Reject',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Reject.decoder; }),
    argumentEncode: function (__typed__) { return exports.Reject.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Approve: {
    template: function () { return exports.Request; },
    choiceName: 'Approve',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Approve.decoder; }),
    argumentEncode: function (__typed__) { return exports.Approve.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Service).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Request; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Request);



exports.Withdraw = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Decline = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Accept = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Offer = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Service:Offer',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
  };
}
,
  Accept: {
    template: function () { return exports.Offer; },
    choiceName: 'Accept',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Accept.decoder; }),
    argumentEncode: function (__typed__) { return exports.Accept.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Service).encode(__typed__); },
  },
  Decline: {
    template: function () { return exports.Offer; },
    choiceName: 'Decline',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Decline.decoder; }),
    argumentEncode: function (__typed__) { return exports.Decline.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Withdraw: {
    template: function () { return exports.Offer; },
    choiceName: 'Withdraw',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Withdraw.decoder; }),
    argumentEncode: function (__typed__) { return exports.Withdraw.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Offer; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Offer);



exports.Terminate = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.Lifecycle = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({lifecycleRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.LifecycleRequest).decoder, safekeepingDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, fixings: damlTypes.Map(damlTypes.Text, damlTypes.Map(damlTypes.Date, damlTypes.Numeric(10))).decoder, uniquePayoutId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    lifecycleRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.LifecycleRequest).encode(__typed__.lifecycleRequestCid),
    safekeepingDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.safekeepingDepositCid),
    fixings: damlTypes.Map(damlTypes.Text, damlTypes.Map(damlTypes.Date, damlTypes.Numeric(10))).encode(__typed__.fixings),
    uniquePayoutId: damlTypes.Text.encode(__typed__.uniquePayoutId),
  };
}
,
};



exports.TransferDeposit = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({transferDepositRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.TransferDepositRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    transferDepositRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.TransferDepositRequest).encode(__typed__.transferDepositRequestCid),
  };
}
,
};



exports.DebitAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({debitAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.DebitAccountRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    debitAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.DebitAccountRequest).encode(__typed__.debitAccountRequestCid),
  };
}
,
};



exports.CreditAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({creditAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.CreditAccountRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    creditAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.CreditAccountRequest).encode(__typed__.creditAccountRequestCid),
  };
}
,
};



exports.CloseAllocationAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({closeAllocationAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.CloseAllocationAccountRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    closeAllocationAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.CloseAllocationAccountRequest).encode(__typed__.closeAllocationAccountRequestCid),
  };
}
,
};



exports.CloseAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({closeAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.CloseAccountRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    closeAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.CloseAccountRequest).encode(__typed__.closeAccountRequestCid),
  };
}
,
};



exports.OpenAllocationAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({openAllocationAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.OpenAllocationAccountRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    openAllocationAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.OpenAllocationAccountRequest).encode(__typed__.openAllocationAccountRequestCid),
  };
}
,
};



exports.OpenAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({openAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.OpenAccountRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    openAccountRequestCid: damlTypes.ContractId(Marketplace_Custody_Model.OpenAccountRequest).encode(__typed__.openAccountRequestCid),
  };
}
,
};



exports.RequestLifecycle = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assetDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, choice: ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id).decoder, }); }),
  encode: function (__typed__) {
  return {
    assetDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.assetDepositCid),
    choice: ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id).encode(__typed__.choice),
  };
}
,
};



exports.RequestTransferDeposit = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({accountId: DA_Finance_Types.Id.decoder, transfer: DA_Finance_Asset_Settlement.AssetSettlement_Transfer.decoder, }); }),
  encode: function (__typed__) {
  return {
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
    transfer: DA_Finance_Asset_Settlement.AssetSettlement_Transfer.encode(__typed__.transfer),
  };
}
,
};



exports.RequestDebitAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({accountId: DA_Finance_Types.Id.decoder, debit: DA_Finance_Asset_Settlement.AssetSettlement_Debit.decoder, }); }),
  encode: function (__typed__) {
  return {
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
    debit: DA_Finance_Asset_Settlement.AssetSettlement_Debit.encode(__typed__.debit),
  };
}
,
};



exports.RequestCreditAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({accountId: DA_Finance_Types.Id.decoder, asset: DA_Finance_Types.Asset.decoder, }); }),
  encode: function (__typed__) {
  return {
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
    asset: DA_Finance_Types.Asset.encode(__typed__.asset),
  };
}
,
};



exports.RequestCloseAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({accountId: DA_Finance_Types.Id.decoder, }); }),
  encode: function (__typed__) {
  return {
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
  };
}
,
};



exports.RequestOpenAllocationAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({accountId: DA_Finance_Types.Id.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, nominee: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
    nominee: damlTypes.Party.encode(__typed__.nominee),
  };
}
,
};



exports.RequestOpenAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({accountId: DA_Finance_Types.Id.decoder, observers: damlTypes.List(damlTypes.Party).decoder, ctrls: damlTypes.List(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
    observers: damlTypes.List(damlTypes.Party).encode(__typed__.observers),
    ctrls: damlTypes.List(damlTypes.Party).encode(__typed__.ctrls),
  };
}
,
};



exports.Service = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Service:Service',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
  };
}
,
  RequestOpenAccount: {
    template: function () { return exports.Service; },
    choiceName: 'RequestOpenAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestOpenAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestOpenAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Custody_Model.OpenAccountRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Custody_Model.OpenAccountRequest).encode(__typed__); },
  },
  RequestOpenAllocationAccount: {
    template: function () { return exports.Service; },
    choiceName: 'RequestOpenAllocationAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestOpenAllocationAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestOpenAllocationAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Custody_Model.OpenAllocationAccountRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Custody_Model.OpenAllocationAccountRequest).encode(__typed__); },
  },
  RequestCloseAccount: {
    template: function () { return exports.Service; },
    choiceName: 'RequestCloseAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestCloseAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestCloseAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Custody_Model.CloseAccountRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Custody_Model.CloseAccountRequest).encode(__typed__); },
  },
  RequestCreditAccount: {
    template: function () { return exports.Service; },
    choiceName: 'RequestCreditAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestCreditAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestCreditAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Custody_Model.CreditAccountRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Custody_Model.CreditAccountRequest).encode(__typed__); },
  },
  RequestDebitAccount: {
    template: function () { return exports.Service; },
    choiceName: 'RequestDebitAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestDebitAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestDebitAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Custody_Model.DebitAccountRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Custody_Model.DebitAccountRequest).encode(__typed__); },
  },
  RequestTransferDeposit: {
    template: function () { return exports.Service; },
    choiceName: 'RequestTransferDeposit',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestTransferDeposit.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestTransferDeposit.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Custody_Model.TransferDepositRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Custody_Model.TransferDepositRequest).encode(__typed__); },
  },
  RequestLifecycle: {
    template: function () { return exports.Service; },
    choiceName: 'RequestLifecycle',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestLifecycle.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestLifecycle.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Custody_Model.LifecycleRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Custody_Model.LifecycleRequest).encode(__typed__); },
  },
  OpenAccount: {
    template: function () { return exports.Service; },
    choiceName: 'OpenAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OpenAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.OpenAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(DA_Finance_Asset_Settlement.AssetSettlementRule).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(DA_Finance_Asset_Settlement.AssetSettlementRule).encode(__typed__); },
  },
  OpenAllocationAccount: {
    template: function () { return exports.Service; },
    choiceName: 'OpenAllocationAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OpenAllocationAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.OpenAllocationAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Rule_AllocationAccount.AllocationAccountRule).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Rule_AllocationAccount.AllocationAccountRule).encode(__typed__); },
  },
  CloseAccount: {
    template: function () { return exports.Service; },
    choiceName: 'CloseAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CloseAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.CloseAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  CloseAllocationAccount: {
    template: function () { return exports.Service; },
    choiceName: 'CloseAllocationAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CloseAllocationAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.CloseAllocationAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  CreditAccount: {
    template: function () { return exports.Service; },
    choiceName: 'CreditAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CreditAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.CreditAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__); },
  },
  DebitAccount: {
    template: function () { return exports.Service; },
    choiceName: 'DebitAccount',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.DebitAccount.decoder; }),
    argumentEncode: function (__typed__) { return exports.DebitAccount.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return DA_Finance_Types.Asset.decoder; }),
    resultEncode: function (__typed__) { return DA_Finance_Types.Asset.encode(__typed__); },
  },
  TransferDeposit: {
    template: function () { return exports.Service; },
    choiceName: 'TransferDeposit',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TransferDeposit.decoder; }),
    argumentEncode: function (__typed__) { return exports.TransferDeposit.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__); },
  },
  Lifecycle: {
    template: function () { return exports.Service; },
    choiceName: 'Lifecycle',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Lifecycle.decoder; }),
    argumentEncode: function (__typed__) { return exports.Lifecycle.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit), damlTypes.List(damlTypes.ContractId(DA_Finance_Trade_SettlementInstruction.SettlementInstruction))).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(DA_Finance_Asset.AssetDeposit), damlTypes.List(damlTypes.ContractId(DA_Finance_Trade_SettlementInstruction.SettlementInstruction))).encode(__typed__); },
  },
  Terminate: {
    template: function () { return exports.Service; },
    choiceName: 'Terminate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Terminate.decoder; }),
    argumentEncode: function (__typed__) { return exports.Terminate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Service; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Service);

