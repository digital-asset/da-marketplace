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


exports.Auction = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Auction.Model:Auction',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, auctionId: damlTypes.Text.decoder, asset: DA_Finance_Types.Asset.decoder, quotedAssetId: DA_Finance_Types.Id.decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, receivableAccount: DA_Finance_Types.Account.decoder, floorPrice: damlTypes.Numeric(10).decoder, status: exports.Status.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    auctionId: damlTypes.Text.encode(__typed__.auctionId),
    asset: DA_Finance_Types.Asset.encode(__typed__.asset),
    quotedAssetId: DA_Finance_Types.Id.encode(__typed__.quotedAssetId),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
    receivableAccount: DA_Finance_Types.Account.encode(__typed__.receivableAccount),
    floorPrice: damlTypes.Numeric(10).encode(__typed__.floorPrice),
    status: exports.Status.encode(__typed__.status),
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



exports.Status = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('Open'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('PartiallyAllocated'), value: exports.Status.PartiallyAllocated.decoder, }), jtv.object({tag: jtv.constant('FullyAllocated'), value: exports.Status.FullyAllocated.decoder, }), jtv.object({tag: jtv.constant('NoValidBids'), value: damlTypes.Unit.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'Open': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'PartiallyAllocated': return {tag: __typed__.tag, value: exports.Status.PartiallyAllocated.encode(__typed__.value)};
    case 'FullyAllocated': return {tag: __typed__.tag, value: exports.Status.FullyAllocated.encode(__typed__.value)};
    case 'NoValidBids': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type Status';
  }
}
,
  PartiallyAllocated:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({finalPrice: damlTypes.Numeric(10).decoder, remaining: damlTypes.Numeric(10).decoder, }); }),
    encode: function (__typed__) {
  return {
    finalPrice: damlTypes.Numeric(10).encode(__typed__.finalPrice),
    remaining: damlTypes.Numeric(10).encode(__typed__.remaining),
  };
}
,
  }),
  FullyAllocated:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({finalPrice: damlTypes.Numeric(10).decoder, }); }),
    encode: function (__typed__) {
  return {
    finalPrice: damlTypes.Numeric(10).encode(__typed__.finalPrice),
  };
}
,
  }),
};







exports.SettleAllocation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({allocation: exports.Allocation.decoder, price: damlTypes.Numeric(10).decoder, issuer: damlTypes.Party.decoder, issuerReceivableAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    allocation: exports.Allocation.encode(__typed__.allocation),
    price: damlTypes.Numeric(10).encode(__typed__.price),
    issuer: damlTypes.Party.encode(__typed__.issuer),
    issuerReceivableAccount: DA_Finance_Types.Account.encode(__typed__.issuerReceivableAccount),
  };
}
,
};



exports.Allocation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({bid: Marketplace_Distribution_Bidding_Model.Bid.decoder, quantity: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    bid: Marketplace_Distribution_Bidding_Model.Bid.encode(__typed__.bid),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
  };
}
,
};

