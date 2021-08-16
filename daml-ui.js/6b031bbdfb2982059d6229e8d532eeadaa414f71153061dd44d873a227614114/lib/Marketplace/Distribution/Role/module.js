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

var Marketplace_Distribution_Auction_Service = require('../../../Marketplace/Distribution/Auction/Service/module');
var Marketplace_Distribution_Bidding_Service = require('../../../Marketplace/Distribution/Bidding/Service/module');


exports.Reject = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Approve = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
};



exports.Request = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Role:Request',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, operator: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    operator: damlTypes.Party.encode(__typed__.operator),
  };
}
,
  Approve: {
    template: function () { return exports.Request; },
    choiceName: 'Approve',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Approve.decoder; }),
    argumentEncode: function (__typed__) { return exports.Approve.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Role).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Role).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Request; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
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
};


damlTypes.registerTemplate(exports.Request);



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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Role:Offer',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Accept: {
    template: function () { return exports.Offer; },
    choiceName: 'Accept',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Accept.decoder; }),
    argumentEncode: function (__typed__) { return exports.Accept.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Role).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Role).encode(__typed__); },
  },
  Decline: {
    template: function () { return exports.Offer; },
    choiceName: 'Decline',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Decline.decoder; }),
    argumentEncode: function (__typed__) { return exports.Decline.encode(__typed__); },
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



exports.TerminateRole = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.TerminateBiddingService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({biddingServiceCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Service.Service).decoder, }); }),
  encode: function (__typed__) {
  return {
    biddingServiceCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Service.Service).encode(__typed__.biddingServiceCid),
  };
}
,
};



exports.ApproveBiddingServiceRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({biddingServiceRequestCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    biddingServiceRequestCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Service.Request).encode(__typed__.biddingServiceRequestCid),
  };
}
,
};



exports.OfferBiddingService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
  };
}
,
};



exports.TerminateAuctionService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({auctionServiceCid: damlTypes.ContractId(Marketplace_Distribution_Auction_Service.Service).decoder, }); }),
  encode: function (__typed__) {
  return {
    auctionServiceCid: damlTypes.ContractId(Marketplace_Distribution_Auction_Service.Service).encode(__typed__.auctionServiceCid),
  };
}
,
};



exports.ApproveAuctionServiceRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({auctionServiceRequestCid: damlTypes.ContractId(Marketplace_Distribution_Auction_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    auctionServiceRequestCid: damlTypes.ContractId(Marketplace_Distribution_Auction_Service.Request).encode(__typed__.auctionServiceRequestCid),
  };
}
,
};



exports.OfferAuctionService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
  };
}
,
};



exports.Role = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Role:Role',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  OfferAuctionService: {
    template: function () { return exports.Role; },
    choiceName: 'OfferAuctionService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferAuctionService.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferAuctionService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Distribution_Auction_Service.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Distribution_Auction_Service.Offer).encode(__typed__); },
  },
  ApproveAuctionServiceRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveAuctionServiceRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveAuctionServiceRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveAuctionServiceRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Distribution_Auction_Service.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Distribution_Auction_Service.Service).encode(__typed__); },
  },
  TerminateAuctionService: {
    template: function () { return exports.Role; },
    choiceName: 'TerminateAuctionService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TerminateAuctionService.decoder; }),
    argumentEncode: function (__typed__) { return exports.TerminateAuctionService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OfferBiddingService: {
    template: function () { return exports.Role; },
    choiceName: 'OfferBiddingService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferBiddingService.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferBiddingService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Distribution_Bidding_Service.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Distribution_Bidding_Service.Offer).encode(__typed__); },
  },
  ApproveBiddingServiceRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveBiddingServiceRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveBiddingServiceRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveBiddingServiceRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Distribution_Bidding_Service.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Distribution_Bidding_Service.Service).encode(__typed__); },
  },
  TerminateBiddingService: {
    template: function () { return exports.Role; },
    choiceName: 'TerminateBiddingService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TerminateBiddingService.decoder; }),
    argumentEncode: function (__typed__) { return exports.TerminateBiddingService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  TerminateRole: {
    template: function () { return exports.Role; },
    choiceName: 'TerminateRole',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TerminateRole.decoder; }),
    argumentEncode: function (__typed__) { return exports.TerminateRole.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Role; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Role);

