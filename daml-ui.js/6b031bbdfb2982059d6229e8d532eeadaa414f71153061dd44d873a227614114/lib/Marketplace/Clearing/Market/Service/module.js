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

var DA_Finance_Types = require('../../../../DA/Finance/Types/module');
var Marketplace_Clearing_Market_Model = require('../../../../Marketplace/Clearing/Market/Model/module');
var Marketplace_Listing_Model = require('../../../../Marketplace/Listing/Model/module');


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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Service:Request',
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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Service:Offer',
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



exports.RequestFairValues = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, listingIds: damlTypes.List(damlTypes.Text).decoder, currency: DA_Finance_Types.Id.decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
    listingIds: damlTypes.List(damlTypes.Text).encode(__typed__.listingIds),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
  };
}
,
};



exports.RequestAllFairValues = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, currency: DA_Finance_Types.Id.decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
  };
}
,
};



exports.ApproveClearedListing = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({symbol: damlTypes.Text.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    symbol: damlTypes.Text.encode(__typed__.symbol),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
};



exports.CreateManualFairValueRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({listingId: damlTypes.Text.decoder, currency: DA_Finance_Types.Id.decoder, upTo: damlTypes.Time.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    listingId: damlTypes.Text.encode(__typed__.listingId),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
    upTo: damlTypes.Time.encode(__typed__.upTo),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
};



exports.CreateFairValue = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({listingId: damlTypes.Text.decoder, price: damlTypes.Numeric(10).decoder, currency: DA_Finance_Types.Id.decoder, timestamp: damlTypes.Time.decoder, upTo: damlTypes.Time.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    listingId: damlTypes.Text.encode(__typed__.listingId),
    price: damlTypes.Numeric(10).encode(__typed__.price),
    currency: DA_Finance_Types.Id.encode(__typed__.currency),
    timestamp: damlTypes.Time.encode(__typed__.timestamp),
    upTo: damlTypes.Time.encode(__typed__.upTo),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
};



exports.Service = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Clearing.Market.Service:Service',
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
  CreateFairValue: {
    template: function () { return exports.Service; },
    choiceName: 'CreateFairValue',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CreateFairValue.decoder; }),
    argumentEncode: function (__typed__) { return exports.CreateFairValue.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Clearing_Market_Model.FairValue).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Clearing_Market_Model.FairValue).encode(__typed__); },
  },
  CreateManualFairValueRequest: {
    template: function () { return exports.Service; },
    choiceName: 'CreateManualFairValueRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CreateManualFairValueRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.CreateManualFairValueRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Clearing_Market_Model.ManualFairValueCalculation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Clearing_Market_Model.ManualFairValueCalculation).encode(__typed__); },
  },
  ApproveClearedListing: {
    template: function () { return exports.Service; },
    choiceName: 'ApproveClearedListing',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveClearedListing.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveClearedListing.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Listing_Model.ClearedListingApproval).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Listing_Model.ClearedListingApproval).encode(__typed__); },
  },
  RequestAllFairValues: {
    template: function () { return exports.Service; },
    choiceName: 'RequestAllFairValues',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestAllFairValues.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestAllFairValues.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Clearing_Market_Model.FairValueCalculationRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Clearing_Market_Model.FairValueCalculationRequest).encode(__typed__); },
  },
  RequestFairValues: {
    template: function () { return exports.Service; },
    choiceName: 'RequestFairValues',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestFairValues.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestFairValues.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Clearing_Market_Model.FairValueCalculationRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Clearing_Market_Model.FairValueCalculationRequest).encode(__typed__); },
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

