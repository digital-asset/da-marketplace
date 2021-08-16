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

var Marketplace_Clearing_Market_Service = require('../../../Marketplace/Clearing/Market/Service/module');
var Marketplace_Clearing_Role = require('../../../Marketplace/Clearing/Role/module');
var Marketplace_Custody_Role = require('../../../Marketplace/Custody/Role/module');
var Marketplace_Custody_Service = require('../../../Marketplace/Custody/Service/module');
var Marketplace_Distribution_Role = require('../../../Marketplace/Distribution/Role/module');
var Marketplace_Issuance_Service = require('../../../Marketplace/Issuance/Service/module');
var Marketplace_Listing_Service = require('../../../Marketplace/Listing/Service/module');
var Marketplace_Regulator_Role = require('../../../Marketplace/Regulator/Role/module');
var Marketplace_Settlement_Service = require('../../../Marketplace/Settlement/Service/module');
var Marketplace_Trading_Matching_Service = require('../../../Marketplace/Trading/Matching/Service/module');
var Marketplace_Trading_Role = require('../../../Marketplace/Trading/Role/module');


exports.ApproveClearingRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({clearingRequestCid: damlTypes.ContractId(Marketplace_Clearing_Role.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    clearingRequestCid: damlTypes.ContractId(Marketplace_Clearing_Role.Request).encode(__typed__.clearingRequestCid),
  };
}
,
};



exports.OfferClearingRole = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
  };
}
,
};



exports.ApproveDistributorRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({distributorRequestCid: damlTypes.ContractId(Marketplace_Distribution_Role.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    distributorRequestCid: damlTypes.ContractId(Marketplace_Distribution_Role.Request).encode(__typed__.distributorRequestCid),
  };
}
,
};



exports.OfferDistributorRole = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
  };
}
,
};



exports.ApproveSettlementRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({settlementRequestCid: damlTypes.ContractId(Marketplace_Settlement_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    settlementRequestCid: damlTypes.ContractId(Marketplace_Settlement_Service.Request).encode(__typed__.settlementRequestCid),
  };
}
,
};



exports.OfferSettlementService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
  };
}
,
};



exports.ApproveMatchingRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({matchingRequestCid: damlTypes.ContractId(Marketplace_Trading_Matching_Service.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    matchingRequestCid: damlTypes.ContractId(Marketplace_Trading_Matching_Service.Request).encode(__typed__.matchingRequestCid),
  };
}
,
};



exports.OfferMatchingService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
  };
}
,
};



exports.ApproveRegulatorRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({regulatorRequestCid: damlTypes.ContractId(Marketplace_Regulator_Role.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    regulatorRequestCid: damlTypes.ContractId(Marketplace_Regulator_Role.Request).encode(__typed__.regulatorRequestCid),
  };
}
,
};



exports.OfferRegulatorRole = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
  };
}
,
};



exports.ApproveExchangeRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({exchangeRequestCid: damlTypes.ContractId(Marketplace_Trading_Role.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    exchangeRequestCid: damlTypes.ContractId(Marketplace_Trading_Role.Request).encode(__typed__.exchangeRequestCid),
  };
}
,
};



exports.OfferExchangeRole = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
  };
}
,
};



exports.ApproveCustodianRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({custodianRequestCid: damlTypes.ContractId(Marketplace_Custody_Role.Request).decoder, }); }),
  encode: function (__typed__) {
  return {
    custodianRequestCid: damlTypes.ContractId(Marketplace_Custody_Role.Request).encode(__typed__.custodianRequestCid),
  };
}
,
};



exports.OfferCustodianRole = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
  };
}
,
};



exports.Role = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Operator.Role:Role',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return damlTypes.Party.decoder; }); }),
  keyEncode: function (__typed__) { return damlTypes.Party.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  OfferCustodianRole: {
    template: function () { return exports.Role; },
    choiceName: 'OfferCustodianRole',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferCustodianRole.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferCustodianRole.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Custody_Role.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Custody_Role.Offer).encode(__typed__); },
  },
  ApproveCustodianRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveCustodianRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveCustodianRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveCustodianRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(Marketplace_Custody_Role.Role), damlTypes.ContractId(Marketplace_Issuance_Service.Service), damlTypes.ContractId(Marketplace_Custody_Service.Service)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(Marketplace_Custody_Role.Role), damlTypes.ContractId(Marketplace_Issuance_Service.Service), damlTypes.ContractId(Marketplace_Custody_Service.Service)).encode(__typed__); },
  },
  OfferExchangeRole: {
    template: function () { return exports.Role; },
    choiceName: 'OfferExchangeRole',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferExchangeRole.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferExchangeRole.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Trading_Role.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Trading_Role.Offer).encode(__typed__); },
  },
  ApproveExchangeRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveExchangeRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveExchangeRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveExchangeRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4(damlTypes.ContractId(Marketplace_Trading_Role.Role), damlTypes.ContractId(Marketplace_Trading_Matching_Service.Service), damlTypes.ContractId(Marketplace_Listing_Service.Service), damlTypes.ContractId(Marketplace_Settlement_Service.Service)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4(damlTypes.ContractId(Marketplace_Trading_Role.Role), damlTypes.ContractId(Marketplace_Trading_Matching_Service.Service), damlTypes.ContractId(Marketplace_Listing_Service.Service), damlTypes.ContractId(Marketplace_Settlement_Service.Service)).encode(__typed__); },
  },
  OfferRegulatorRole: {
    template: function () { return exports.Role; },
    choiceName: 'OfferRegulatorRole',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferRegulatorRole.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferRegulatorRole.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Regulator_Role.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Regulator_Role.Offer).encode(__typed__); },
  },
  ApproveRegulatorRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveRegulatorRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveRegulatorRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveRegulatorRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Regulator_Role.Role).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Regulator_Role.Role).encode(__typed__); },
  },
  OfferMatchingService: {
    template: function () { return exports.Role; },
    choiceName: 'OfferMatchingService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferMatchingService.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferMatchingService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Trading_Matching_Service.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Trading_Matching_Service.Offer).encode(__typed__); },
  },
  ApproveMatchingRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveMatchingRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveMatchingRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveMatchingRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Trading_Matching_Service.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Trading_Matching_Service.Service).encode(__typed__); },
  },
  OfferSettlementService: {
    template: function () { return exports.Role; },
    choiceName: 'OfferSettlementService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferSettlementService.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferSettlementService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Settlement_Service.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Settlement_Service.Offer).encode(__typed__); },
  },
  ApproveSettlementRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveSettlementRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveSettlementRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveSettlementRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Settlement_Service.Service).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Settlement_Service.Service).encode(__typed__); },
  },
  OfferDistributorRole: {
    template: function () { return exports.Role; },
    choiceName: 'OfferDistributorRole',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferDistributorRole.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferDistributorRole.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Distribution_Role.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Distribution_Role.Offer).encode(__typed__); },
  },
  ApproveDistributorRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveDistributorRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveDistributorRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveDistributorRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Distribution_Role.Role).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Distribution_Role.Role).encode(__typed__); },
  },
  OfferClearingRole: {
    template: function () { return exports.Role; },
    choiceName: 'OfferClearingRole',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OfferClearingRole.decoder; }),
    argumentEncode: function (__typed__) { return exports.OfferClearingRole.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Clearing_Role.Offer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Clearing_Role.Offer).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Role; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ApproveClearingRequest: {
    template: function () { return exports.Role; },
    choiceName: 'ApproveClearingRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveClearingRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveClearingRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Clearing_Role.Role), damlTypes.ContractId(Marketplace_Clearing_Market_Service.Service)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Clearing_Role.Role), damlTypes.ContractId(Marketplace_Clearing_Market_Service.Service)).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Role);

