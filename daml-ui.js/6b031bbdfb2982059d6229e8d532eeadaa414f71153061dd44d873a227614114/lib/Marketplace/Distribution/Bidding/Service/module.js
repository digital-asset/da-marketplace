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
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

var DA_Finance_Asset = require('../../../../DA/Finance/Asset/module');
var DA_Finance_Types = require('../../../../DA/Finance/Types/module');
var Marketplace_Distribution_Bidding_Model = require('../../../../Marketplace/Distribution/Bidding/Model/module');
var Marketplace_Settlement_Model = require('../../../../Marketplace/Settlement/Model/module');


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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Bidding.Service:Request',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, tradingAccount: DA_Finance_Types.Account.decoder, allocationAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
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
  decoder: damlTypes.lazyMemo(function () { return jtv.object({tradingAccount: DA_Finance_Types.Account.decoder, allocationAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
  };
}
,
};



exports.Offer = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Bidding.Service:Offer',
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



exports.GenerateSettlementInstruction = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({issuer: damlTypes.Party.decoder, delivery: Marketplace_Settlement_Model.SettlementDetails.decoder, payment: Marketplace_Settlement_Model.SettlementDetails.decoder, }); }),
  encode: function (__typed__) {
  return {
    issuer: damlTypes.Party.encode(__typed__.issuer),
    delivery: Marketplace_Settlement_Model.SettlementDetails.encode(__typed__.delivery),
    payment: Marketplace_Settlement_Model.SettlementDetails.encode(__typed__.payment),
  };
}
,
};



exports.RejectAllocation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({bidCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid).decoder, newStatus: Marketplace_Distribution_Bidding_Model.Status.decoder, }); }),
  encode: function (__typed__) {
  return {
    bidCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid).encode(__typed__.bidCid),
    newStatus: Marketplace_Distribution_Bidding_Model.Status.encode(__typed__.newStatus),
  };
}
,
};



exports.ProcessAllocation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({bidCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid).decoder, quantity: damlTypes.Numeric(10).decoder, amount: damlTypes.Numeric(10).decoder, price: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    bidCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid).encode(__typed__.bidCid),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    price: damlTypes.Numeric(10).encode(__typed__.price),
  };
}
,
};



exports.RequestBid = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({issuer: damlTypes.Party.decoder, auctionId: damlTypes.Text.decoder, asset: DA_Finance_Types.Asset.decoder, quotedAssetId: DA_Finance_Types.Id.decoder, publishedBidCids: damlTypes.List(damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid)).decoder, }); }),
  encode: function (__typed__) {
  return {
    issuer: damlTypes.Party.encode(__typed__.issuer),
    auctionId: damlTypes.Text.encode(__typed__.auctionId),
    asset: DA_Finance_Types.Asset.encode(__typed__.asset),
    quotedAssetId: DA_Finance_Types.Id.encode(__typed__.quotedAssetId),
    publishedBidCids: damlTypes.List(damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid)).encode(__typed__.publishedBidCids),
  };
}
,
};



exports.SubmitBid = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({auctionCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).decoder, price: damlTypes.Numeric(10).decoder, quantity: damlTypes.Numeric(10).decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, allowPublishing: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    auctionCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).encode(__typed__.auctionCid),
    price: damlTypes.Numeric(10).encode(__typed__.price),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
    allowPublishing: damlTypes.Bool.encode(__typed__.allowPublishing),
  };
}
,
};



exports.Service = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Bidding.Service:Service',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, tradingAccount: DA_Finance_Types.Account.decoder, allocationAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
  };
}
,
  SubmitBid: {
    template: function () { return exports.Service; },
    choiceName: 'SubmitBid',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SubmitBid.decoder; }),
    argumentEncode: function (__typed__) { return exports.SubmitBid.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid).encode(__typed__); },
  },
  RequestBid: {
    template: function () { return exports.Service; },
    choiceName: 'RequestBid',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestBid.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestBid.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).encode(__typed__); },
  },
  ProcessAllocation: {
    template: function () { return exports.Service; },
    choiceName: 'ProcessAllocation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ProcessAllocation.decoder; }),
    argumentEncode: function (__typed__) { return exports.ProcessAllocation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid), damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid), damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__); },
  },
  RejectAllocation: {
    template: function () { return exports.Service; },
    choiceName: 'RejectAllocation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectAllocation.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectAllocation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid), damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid), damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__); },
  },
  GenerateSettlementInstruction: {
    template: function () { return exports.Service; },
    choiceName: 'GenerateSettlementInstruction',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.GenerateSettlementInstruction.decoder; }),
    argumentEncode: function (__typed__) { return exports.GenerateSettlementInstruction.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Settlement_Model.SettlementInstruction).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Settlement_Model.SettlementInstruction).encode(__typed__); },
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

