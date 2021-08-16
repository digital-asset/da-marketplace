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
var Marketplace_Distribution_Auction_Model = require('../../../../Marketplace/Distribution/Auction/Model/module');
var Marketplace_Distribution_Bidding_Model = require('../../../../Marketplace/Distribution/Bidding/Model/module');
var Marketplace_Settlement_Model = require('../../../../Marketplace/Settlement/Model/module');


exports.CreateAuctionRequest = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Auction.Service:CreateAuctionRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, auctionId: damlTypes.Text.decoder, asset: DA_Finance_Types.Asset.decoder, quotedAssetId: DA_Finance_Types.Id.decoder, floorPrice: damlTypes.Numeric(10).decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    auctionId: damlTypes.Text.encode(__typed__.auctionId),
    asset: DA_Finance_Types.Asset.encode(__typed__.asset),
    quotedAssetId: DA_Finance_Types.Id.encode(__typed__.quotedAssetId),
    floorPrice: damlTypes.Numeric(10).encode(__typed__.floorPrice),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
  };
}
,
  Archive: {
    template: function () { return exports.CreateAuctionRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.CreateAuctionRequest);



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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Auction.Service:Request',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, tradingAccount: DA_Finance_Types.Account.decoder, allocationAccount: DA_Finance_Types.Account.decoder, receivableAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
    receivableAccount: DA_Finance_Types.Account.encode(__typed__.receivableAccount),
  };
}
,
  Archive: {
    template: function () { return exports.Request; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
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
  decoder: damlTypes.lazyMemo(function () { return jtv.object({tradingAccount: DA_Finance_Types.Account.decoder, allocationAccount: DA_Finance_Types.Account.decoder, receivableAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
    receivableAccount: DA_Finance_Types.Account.encode(__typed__.receivableAccount),
  };
}
,
};



exports.Offer = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Auction.Service:Offer',
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
  Archive: {
    template: function () { return exports.Offer; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
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
  Accept: {
    template: function () { return exports.Offer; },
    choiceName: 'Accept',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Accept.decoder; }),
    argumentEncode: function (__typed__) { return exports.Accept.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Service).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Offer);



exports.ProcessAuction = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({auctionCid: damlTypes.ContractId(Marketplace_Distribution_Auction_Model.Auction).decoder, bidCids: damlTypes.List(damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid)).decoder, }); }),
  encode: function (__typed__) {
  return {
    auctionCid: damlTypes.ContractId(Marketplace_Distribution_Auction_Model.Auction).encode(__typed__.auctionCid),
    bidCids: damlTypes.List(damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Bid)).encode(__typed__.bidCids),
  };
}
,
};



exports.RejectAuction = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({createAuctionRequestCid: damlTypes.ContractId(exports.CreateAuctionRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    createAuctionRequestCid: damlTypes.ContractId(exports.CreateAuctionRequest).encode(__typed__.createAuctionRequestCid),
  };
}
,
};



exports.CreateAuction = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({createAuctionRequestCid: damlTypes.ContractId(exports.CreateAuctionRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    createAuctionRequestCid: damlTypes.ContractId(exports.CreateAuctionRequest).encode(__typed__.createAuctionRequestCid),
  };
}
,
};



exports.CancelAuctionRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({createAuctionRequestCid: damlTypes.ContractId(exports.CreateAuctionRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    createAuctionRequestCid: damlTypes.ContractId(exports.CreateAuctionRequest).encode(__typed__.createAuctionRequestCid),
  };
}
,
};



exports.RequestCreateAuction = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({auctionId: damlTypes.Text.decoder, asset: DA_Finance_Types.Asset.decoder, quotedAssetId: DA_Finance_Types.Id.decoder, floorPrice: damlTypes.Numeric(10).decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    auctionId: damlTypes.Text.encode(__typed__.auctionId),
    asset: DA_Finance_Types.Asset.encode(__typed__.asset),
    quotedAssetId: DA_Finance_Types.Id.encode(__typed__.quotedAssetId),
    floorPrice: damlTypes.Numeric(10).encode(__typed__.floorPrice),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
  };
}
,
};



exports.Service = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Auction.Service:Service',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, tradingAccount: DA_Finance_Types.Account.decoder, allocationAccount: DA_Finance_Types.Account.decoder, receivableAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
    receivableAccount: DA_Finance_Types.Account.encode(__typed__.receivableAccount),
  };
}
,
  CreateAuction: {
    template: function () { return exports.Service; },
    choiceName: 'CreateAuction',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CreateAuction.decoder; }),
    argumentEncode: function (__typed__) { return exports.CreateAuction.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Distribution_Auction_Model.Auction).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Distribution_Auction_Model.Auction).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Service; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ProcessAuction: {
    template: function () { return exports.Service; },
    choiceName: 'ProcessAuction',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ProcessAuction.decoder; }),
    argumentEncode: function (__typed__) { return exports.ProcessAuction.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Distribution_Auction_Model.Auction), damlTypes.List(damlTypes.ContractId(Marketplace_Settlement_Model.SettlementInstruction))).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Distribution_Auction_Model.Auction), damlTypes.List(damlTypes.ContractId(Marketplace_Settlement_Model.SettlementInstruction))).encode(__typed__); },
  },
  RequestCreateAuction: {
    template: function () { return exports.Service; },
    choiceName: 'RequestCreateAuction',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestCreateAuction.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestCreateAuction.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.CreateAuctionRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.CreateAuctionRequest).encode(__typed__); },
  },
  CancelAuctionRequest: {
    template: function () { return exports.Service; },
    choiceName: 'CancelAuctionRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CancelAuctionRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.CancelAuctionRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RejectAuction: {
    template: function () { return exports.Service; },
    choiceName: 'RejectAuction',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectAuction.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectAuction.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Service);

