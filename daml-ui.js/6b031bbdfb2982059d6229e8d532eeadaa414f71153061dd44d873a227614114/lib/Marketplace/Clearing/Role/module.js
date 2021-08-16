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
var Marketplace_Clearing_Market_Service = require('../../../Marketplace/Clearing/Market/Service/module');
var Marketplace_Clearing_Service = require('../../../Marketplace/Clearing/Service/module');


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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Role:Request',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, operator: damlTypes.Party.decoder, ccpAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    operator: damlTypes.Party.encode(__typed__.operator),
    ccpAccount: DA_Finance_Types.Account.encode(__typed__.ccpAccount),
  };
}
,
  Approve: {
    template: function () { return exports.Request; },
    choiceName: 'Approve',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Approve.decoder; }),
    argumentEncode: function (__typed__) { return exports.Approve.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Clearing_Market_Service.Service)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Clearing_Market_Service.Service)).encode(__typed__); },
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
  decoder: damlTypes.lazyMemo(function () { return jtv.object({ccpAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    ccpAccount: DA_Finance_Types.Account.encode(__typed__.ccpAccount),
  };
}
,
};



exports.Offer = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Role:Offer',
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
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Clearing_Market_Service.Service)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Clearing_Market_Service.Service)).encode(__typed__); },
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



exports.TerminateMarketService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({marketServiceCid: damlTypes.ContractId(Marketplace_Clearing_Market_Service.Service).decoder, }); }),
  encode: function (__typed__) {
  return {
    marketServiceCid: damlTypes.ContractId(Marketplace_Clearing_Market_Service.Service).encode(__typed__.marketServiceCid),
  };
}
,
};



exports.RejectMarketRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({marketRequestCid: damlTypes.ContractId(Marketplace_Clearing_Market_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    marketRequestCid: damlTypes.ContractId(Marketplace_Clearing_Market_Service.Request).encode(__typed__.marketRequestCid),
  };
}
,
};



exports.ApproveMarketRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({marketRequestCid: damlTypes.ContractId(Marketplace_Clearing_Market_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    marketRequestCid: damlTypes.ContractId(Marketplace_Clearing_Market_Service.Request).encode(__typed__.marketRequestCid),
  };
}
,
};



exports.OfferMarketService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
  };
}
,
};



exports.TerminateClearingService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({custodyServiceCid: damlTypes.ContractId(Marketplace_Clearing_Service.Service).decoder, }); }),
  encode: function (__typed__) {
  return {
    custodyServiceCid: damlTypes.ContractId(Marketplace_Clearing_Service.Service).encode(__typed__.custodyServiceCid),
  };
}
,
};



exports.RejectClearingRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({clearingRequestCid: damlTypes.ContractId(Marketplace_Clearing_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    clearingRequestCid: damlTypes.ContractId(Marketplace_Clearing_Service.Request).encode(__typed__.clearingRequestCid),
  };
}
,
};



exports.ApproveClearingRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({clearingRequestCid: damlTypes.ContractId(Marketplace_Clearing_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    clearingRequestCid: damlTypes.ContractId(Marketplace_Clearing_Service.Request).encode(__typed__.clearingRequestCid),
  };
}
,
};



exports.OfferClearingService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
  };
}
,
};



exports.Role = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Role:Role',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, ccpAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
    ccpAccount: DA_Finance_Types.Account.encode(__typed__.ccpAccount),
  };
}
,
  OfferClearingService: {
    template: function () { return exports.Role; },
    choiceName: 'OfferClearingService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferClearingService.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferClearingService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Clearing_Service.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Clearing_Service.Offer).encode(__typed__); },
  },
  ApproveClearingRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveClearingRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveClearingRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveClearingRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Clearing_Service.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Clearing_Service.Service).encode(__typed__); },
  },
  RejectClearingRequest: {
    template: function () { return exports.Role; },
    choiceName: 'RejectClearingRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectClearingRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectClearingRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  TerminateClearingService: {
    template: function () { return exports.Role; },
    choiceName: 'TerminateClearingService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TerminateClearingService.decoder; }),
    argumentEncode: function (__typed__) { return exports.TerminateClearingService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OfferMarketService: {
    template: function () { return exports.Role; },
    choiceName: 'OfferMarketService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferMarketService.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferMarketService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Clearing_Market_Service.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Clearing_Market_Service.Offer).encode(__typed__); },
  },
  ApproveMarketRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveMarketRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveMarketRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveMarketRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Clearing_Market_Service.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Clearing_Market_Service.Service).encode(__typed__); },
  },
  RejectMarketRequest: {
    template: function () { return exports.Role; },
    choiceName: 'RejectMarketRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectMarketRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectMarketRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  TerminateMarketService: {
    template: function () { return exports.Role; },
    choiceName: 'TerminateMarketService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TerminateMarketService.decoder; }),
    argumentEncode: function (__typed__) { return exports.TerminateMarketService.encode(__typed__); },
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

