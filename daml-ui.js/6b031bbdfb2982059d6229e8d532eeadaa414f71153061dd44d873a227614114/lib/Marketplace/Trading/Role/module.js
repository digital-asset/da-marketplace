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

var DA_Finance_Types = require('../../../DA/Finance/Types/module');
var Marketplace_Listing_Service = require('../../../Marketplace/Listing/Service/module');
var Marketplace_Settlement_Service = require('../../../Marketplace/Settlement/Service/module');
var Marketplace_Trading_Matching_Service = require('../../../Marketplace/Trading/Matching/Service/module');
var Marketplace_Trading_Model = require('../../../Marketplace/Trading/Model/module');
var Marketplace_Trading_Service = require('../../../Marketplace/Trading/Service/module');


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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Role:Request',
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
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Trading_Matching_Service.Service), damlTypes.ContractId(Marketplace_Listing_Service.Service), damlTypes.ContractId(Marketplace_Settlement_Service.Service)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Trading_Matching_Service.Service), damlTypes.ContractId(Marketplace_Listing_Service.Service), damlTypes.ContractId(Marketplace_Settlement_Service.Service)).encode(__typed__); },
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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Role:Offer',
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
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Trading_Matching_Service.Service), damlTypes.ContractId(Marketplace_Listing_Service.Service), damlTypes.ContractId(Marketplace_Settlement_Service.Service)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Trading_Matching_Service.Service), damlTypes.ContractId(Marketplace_Listing_Service.Service), damlTypes.ContractId(Marketplace_Settlement_Service.Service)).encode(__typed__); },
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



exports.CreateFeeSchedule = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({currency: DA_Finance_Types.Id.decoder, feeAccount: DA_Finance_Types.Account.decoder, quantity: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
    feeAccount: DA_Finance_Types.Account.encode(__typed__.feeAccount),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
  };
}
,
};



exports.TerminateListingService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({listingServiceCid: damlTypes.ContractId(Marketplace_Listing_Service.Service).decoder, }); }),
  encode: function (__typed__) {
  return {
    listingServiceCid: damlTypes.ContractId(Marketplace_Listing_Service.Service).encode(__typed__.listingServiceCid),
  };
}
,
};



exports.ApproveListingServiceRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({listingRequestCid: damlTypes.ContractId(Marketplace_Listing_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    listingRequestCid: damlTypes.ContractId(Marketplace_Listing_Service.Request).encode(__typed__.listingRequestCid),
  };
}
,
};



exports.OfferListingService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
  };
}
,
};



exports.TerminateTradingService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({tradingServiceCid: damlTypes.ContractId(Marketplace_Trading_Service.Service).decoder, }); }),
  encode: function (__typed__) {
  return {
    tradingServiceCid: damlTypes.ContractId(Marketplace_Trading_Service.Service).encode(__typed__.tradingServiceCid),
  };
}
,
};



exports.ApproveTradingServiceRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({tradingRequestCid: damlTypes.ContractId(Marketplace_Trading_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    tradingRequestCid: damlTypes.ContractId(Marketplace_Trading_Service.Request).encode(__typed__.tradingRequestCid),
  };
}
,
};



exports.OfferTradingService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
  };
}
,
};



exports.Role = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Role:Role',
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
  OfferTradingService: {
    template: function () { return exports.Role; },
    choiceName: 'OfferTradingService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferTradingService.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferTradingService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Trading_Service.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Trading_Service.Offer).encode(__typed__); },
  },
  ApproveTradingServiceRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveTradingServiceRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveTradingServiceRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveTradingServiceRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Trading_Service.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Trading_Service.Service).encode(__typed__); },
  },
  TerminateTradingService: {
    template: function () { return exports.Role; },
    choiceName: 'TerminateTradingService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TerminateTradingService.decoder; }),
    argumentEncode: function (__typed__) { return exports.TerminateTradingService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OfferListingService: {
    template: function () { return exports.Role; },
    choiceName: 'OfferListingService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferListingService.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferListingService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Listing_Service.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Listing_Service.Offer).encode(__typed__); },
  },
  ApproveListingServiceRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveListingServiceRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveListingServiceRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveListingServiceRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Listing_Service.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Listing_Service.Service).encode(__typed__); },
  },
  TerminateListingService: {
    template: function () { return exports.Role; },
    choiceName: 'TerminateListingService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TerminateListingService.decoder; }),
    argumentEncode: function (__typed__) { return exports.TerminateListingService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  CreateFeeSchedule: {
    template: function () { return exports.Role; },
    choiceName: 'CreateFeeSchedule',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CreateFeeSchedule.decoder; }),
    argumentEncode: function (__typed__) { return exports.CreateFeeSchedule.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Trading_Model.FeeSchedule).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Trading_Model.FeeSchedule).encode(__typed__); },
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

