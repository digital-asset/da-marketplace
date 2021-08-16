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

var Marketplace_Custody_Service = require('../../../Marketplace/Custody/Service/module');
var Marketplace_Issuance_Service = require('../../../Marketplace/Issuance/Service/module');


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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Role:Request',
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
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Issuance_Service.Service), damlTypes.ContractId(Marketplace_Custody_Service.Service)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Issuance_Service.Service), damlTypes.ContractId(Marketplace_Custody_Service.Service)).encode(__typed__); },
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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Role:Offer',
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
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Issuance_Service.Service), damlTypes.ContractId(Marketplace_Custody_Service.Service)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(exports.Role), damlTypes.ContractId(Marketplace_Issuance_Service.Service), damlTypes.ContractId(Marketplace_Custody_Service.Service)).encode(__typed__); },
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



exports.TerminateIssuanceService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({issuanceServiceCid: damlTypes.ContractId(Marketplace_Issuance_Service.Service).decoder, }); }),
  encode: function (__typed__) {
  return {
    issuanceServiceCid: damlTypes.ContractId(Marketplace_Issuance_Service.Service).encode(__typed__.issuanceServiceCid),
  };
}
,
};



exports.ApproveIssuanceRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({issuanceServiceRequestCid: damlTypes.ContractId(Marketplace_Issuance_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    issuanceServiceRequestCid: damlTypes.ContractId(Marketplace_Issuance_Service.Request).encode(__typed__.issuanceServiceRequestCid),
  };
}
,
};



exports.OfferIssuanceService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
  };
}
,
};



exports.TerminateCustodyService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({custodyServiceCid: damlTypes.ContractId(Marketplace_Custody_Service.Service).decoder, }); }),
  encode: function (__typed__) {
  return {
    custodyServiceCid: damlTypes.ContractId(Marketplace_Custody_Service.Service).encode(__typed__.custodyServiceCid),
  };
}
,
};



exports.ApproveCustodyRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({custodyRequestCid: damlTypes.ContractId(Marketplace_Custody_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    custodyRequestCid: damlTypes.ContractId(Marketplace_Custody_Service.Request).encode(__typed__.custodyRequestCid),
  };
}
,
};



exports.OfferCustodyService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
  };
}
,
};



exports.Role = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Custody.Role:Role',
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
  OfferCustodyService: {
    template: function () { return exports.Role; },
    choiceName: 'OfferCustodyService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferCustodyService.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferCustodyService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Custody_Service.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Custody_Service.Offer).encode(__typed__); },
  },
  ApproveCustodyRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveCustodyRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveCustodyRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveCustodyRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Custody_Service.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Custody_Service.Service).encode(__typed__); },
  },
  TerminateCustodyService: {
    template: function () { return exports.Role; },
    choiceName: 'TerminateCustodyService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TerminateCustodyService.decoder; }),
    argumentEncode: function (__typed__) { return exports.TerminateCustodyService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OfferIssuanceService: {
    template: function () { return exports.Role; },
    choiceName: 'OfferIssuanceService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferIssuanceService.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferIssuanceService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Issuance_Service.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Issuance_Service.Offer).encode(__typed__); },
  },
  ApproveIssuanceRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveIssuanceRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveIssuanceRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveIssuanceRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Issuance_Service.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Issuance_Service.Service).encode(__typed__); },
  },
  TerminateIssuanceService: {
    template: function () { return exports.Role; },
    choiceName: 'TerminateIssuanceService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TerminateIssuanceService.decoder; }),
    argumentEncode: function (__typed__) { return exports.TerminateIssuanceService.encode(__typed__); },
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

