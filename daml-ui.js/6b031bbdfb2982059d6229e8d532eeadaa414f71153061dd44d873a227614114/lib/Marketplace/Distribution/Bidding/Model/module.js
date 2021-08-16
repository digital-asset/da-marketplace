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


exports.UpdateStatus = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newStatus: exports.Status.decoder, }); }),
  encode: function (__typed__) {
  return {
    newStatus: exports.Status.encode(__typed__.newStatus),
  };
}
,
};



exports.Bid = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Bidding.Model:Bid',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, issuer: damlTypes.Party.decoder, auctionId: damlTypes.Text.decoder, assetId: DA_Finance_Types.Id.decoder, details: exports.Details.decoder, quotedAssetId: DA_Finance_Types.Id.decoder, tradingAccount: DA_Finance_Types.Account.decoder, allocationAccount: DA_Finance_Types.Account.decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, allowPublishing: damlTypes.Bool.decoder, status: exports.Status.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    issuer: damlTypes.Party.encode(__typed__.issuer),
    auctionId: damlTypes.Text.encode(__typed__.auctionId),
    assetId: DA_Finance_Types.Id.encode(__typed__.assetId),
    details: exports.Details.encode(__typed__.details),
    quotedAssetId: DA_Finance_Types.Id.encode(__typed__.quotedAssetId),
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
    allowPublishing: damlTypes.Bool.encode(__typed__.allowPublishing),
    status: exports.Status.encode(__typed__.status),
  };
}
,
  Archive: {
    template: function () { return exports.Bid; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  UpdateStatus: {
    template: function () { return exports.Bid; },
    choiceName: 'UpdateStatus',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateStatus.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateStatus.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Bid).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Bid).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Bid);



exports.Status = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('Pending'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('FullAllocation'), value: exports.Status.FullAllocation.decoder, }), jtv.object({tag: jtv.constant('PartialAllocation'), value: exports.Status.PartialAllocation.decoder, }), jtv.object({tag: jtv.constant('NoAllocation'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('Invalid'), value: damlTypes.Unit.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'Pending': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'FullAllocation': return {tag: __typed__.tag, value: exports.Status.FullAllocation.encode(__typed__.value)};
    case 'PartialAllocation': return {tag: __typed__.tag, value: exports.Status.PartialAllocation.encode(__typed__.value)};
    case 'NoAllocation': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'Invalid': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type Status';
  }
}
,
  FullAllocation:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({price: damlTypes.Numeric(10).decoder, }); }),
    encode: function (__typed__) {
  return {
    price: damlTypes.Numeric(10).encode(__typed__.price),
  };
}
,
  }),
  PartialAllocation:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({price: damlTypes.Numeric(10).decoder, quantity: damlTypes.Numeric(10).decoder, }); }),
    encode: function (__typed__) {
  return {
    price: damlTypes.Numeric(10).encode(__typed__.price),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
  };
}
,
  }),
};







exports.Auction = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Bidding.Model:Auction',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, issuer: damlTypes.Party.decoder, auctionId: damlTypes.Text.decoder, asset: DA_Finance_Types.Asset.decoder, quotedAssetId: DA_Finance_Types.Id.decoder, publishedBids: damlTypes.List(exports.PublishedBid).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    issuer: damlTypes.Party.encode(__typed__.issuer),
    auctionId: damlTypes.Text.encode(__typed__.auctionId),
    asset: DA_Finance_Types.Asset.encode(__typed__.asset),
    quotedAssetId: DA_Finance_Types.Id.encode(__typed__.quotedAssetId),
    publishedBids: damlTypes.List(exports.PublishedBid).encode(__typed__.publishedBids),
  };
}
,
  Archive: {
    template: function () { return exports.Auction; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Auction);



exports.PublishedBid = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({investor: damlTypes.Party.decoder, auctionId: damlTypes.Text.decoder, quantity: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    investor: damlTypes.Party.encode(__typed__.investor),
    auctionId: damlTypes.Text.encode(__typed__.auctionId),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
  };
}
,
};



exports.Details = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({price: damlTypes.Numeric(10).decoder, quantity: damlTypes.Numeric(10).decoder, time: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    price: damlTypes.Numeric(10).encode(__typed__.price),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
    time: damlTypes.Time.encode(__typed__.time),
  };
}
,
};

