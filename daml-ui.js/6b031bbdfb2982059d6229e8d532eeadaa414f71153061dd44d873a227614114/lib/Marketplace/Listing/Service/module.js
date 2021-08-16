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
var Marketplace_Listing_Model = require('../../../Marketplace/Listing/Model/module');
var Marketplace_Trading_Error = require('../../../Marketplace/Trading/Error/module');


exports.DisableListingRequest = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:DisableListingRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, listingCid: damlTypes.ContractId(Marketplace_Listing_Model.Listing).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    listingCid: damlTypes.ContractId(Marketplace_Listing_Model.Listing).encode(__typed__.listingCid),
  };
}
,
  Archive: {
    template: function () { return exports.DisableListingRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.DisableListingRequest);



exports.FailedListingCreation = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:FailedListingCreation',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, error: Marketplace_Trading_Error.Error.decoder, symbol: damlTypes.Text.decoder, listingType: Marketplace_Listing_Model.ListingType.decoder, calendarId: damlTypes.Text.decoder, description: damlTypes.Text.decoder, tradedAssetId: DA_Finance_Types.Id.decoder, quotedAssetId: DA_Finance_Types.Id.decoder, tradedAssetPrecision: damlTypes.Int.decoder, quotedAssetPrecision: damlTypes.Int.decoder, minimumTradableQuantity: damlTypes.Numeric(10).decoder, maximumTradableQuantity: damlTypes.Numeric(10).decoder, status: Marketplace_Listing_Model.Status.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    error: Marketplace_Trading_Error.Error.encode(__typed__.error),
    symbol: damlTypes.Text.encode(__typed__.symbol),
    listingType: Marketplace_Listing_Model.ListingType.encode(__typed__.listingType),
    calendarId: damlTypes.Text.encode(__typed__.calendarId),
    description: damlTypes.Text.encode(__typed__.description),
    tradedAssetId: DA_Finance_Types.Id.encode(__typed__.tradedAssetId),
    quotedAssetId: DA_Finance_Types.Id.encode(__typed__.quotedAssetId),
    tradedAssetPrecision: damlTypes.Int.encode(__typed__.tradedAssetPrecision),
    quotedAssetPrecision: damlTypes.Int.encode(__typed__.quotedAssetPrecision),
    minimumTradableQuantity: damlTypes.Numeric(10).encode(__typed__.minimumTradableQuantity),
    maximumTradableQuantity: damlTypes.Numeric(10).encode(__typed__.maximumTradableQuantity),
    status: Marketplace_Listing_Model.Status.encode(__typed__.status),
  };
}
,
  Archive: {
    template: function () { return exports.FailedListingCreation; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.FailedListingCreation);



exports.ListingRequestFailure = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({message: damlTypes.Text.decoder, name: damlTypes.Text.decoder, code: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    message: damlTypes.Text.encode(__typed__.message),
    name: damlTypes.Text.encode(__typed__.name),
    code: damlTypes.Text.encode(__typed__.code),
  };
}
,
};



exports.ListingRequestSuccess = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({providerId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    providerId: damlTypes.Text.encode(__typed__.providerId),
  };
}
,
};



exports.CreateListingRequest = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:CreateListingRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, symbol: damlTypes.Text.decoder, listingType: Marketplace_Listing_Model.ListingType.decoder, calendarId: damlTypes.Text.decoder, description: damlTypes.Text.decoder, tradedAssetId: DA_Finance_Types.Id.decoder, quotedAssetId: DA_Finance_Types.Id.decoder, tradedAssetPrecision: damlTypes.Int.decoder, quotedAssetPrecision: damlTypes.Int.decoder, minimumTradableQuantity: damlTypes.Numeric(10).decoder, maximumTradableQuantity: damlTypes.Numeric(10).decoder, status: Marketplace_Listing_Model.Status.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    symbol: damlTypes.Text.encode(__typed__.symbol),
    listingType: Marketplace_Listing_Model.ListingType.encode(__typed__.listingType),
    calendarId: damlTypes.Text.encode(__typed__.calendarId),
    description: damlTypes.Text.encode(__typed__.description),
    tradedAssetId: DA_Finance_Types.Id.encode(__typed__.tradedAssetId),
    quotedAssetId: DA_Finance_Types.Id.encode(__typed__.quotedAssetId),
    tradedAssetPrecision: damlTypes.Int.encode(__typed__.tradedAssetPrecision),
    quotedAssetPrecision: damlTypes.Int.encode(__typed__.quotedAssetPrecision),
    minimumTradableQuantity: damlTypes.Numeric(10).encode(__typed__.minimumTradableQuantity),
    maximumTradableQuantity: damlTypes.Numeric(10).encode(__typed__.maximumTradableQuantity),
    status: Marketplace_Listing_Model.Status.encode(__typed__.status),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.CreateListingRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ListingRequestFailure: {
    template: function () { return exports.CreateListingRequest; },
    choiceName: 'ListingRequestFailure',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ListingRequestFailure.decoder; }),
    argumentEncode: function (__typed__) { return exports.ListingRequestFailure.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.FailedListingCreation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.FailedListingCreation).encode(__typed__); },
  },
  ListingRequestSuccess: {
    template: function () { return exports.CreateListingRequest; },
    choiceName: 'ListingRequestSuccess',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ListingRequestSuccess.decoder; }),
    argumentEncode: function (__typed__) { return exports.ListingRequestSuccess.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Listing_Model.Listing).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Listing_Model.Listing).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.CreateListingRequest);



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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:Request',
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
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Offer = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:Offer',
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



exports.Terminate = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.DisableListing = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({disableListingRequestCid: damlTypes.ContractId(exports.DisableListingRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    disableListingRequestCid: damlTypes.ContractId(exports.DisableListingRequest).encode(__typed__.disableListingRequestCid),
  };
}
,
};



exports.ListingFailure = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({createListingRequestCid: damlTypes.ContractId(exports.CreateListingRequest).decoder, message: damlTypes.Text.decoder, name: damlTypes.Text.decoder, code: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    createListingRequestCid: damlTypes.ContractId(exports.CreateListingRequest).encode(__typed__.createListingRequestCid),
    message: damlTypes.Text.encode(__typed__.message),
    name: damlTypes.Text.encode(__typed__.name),
    code: damlTypes.Text.encode(__typed__.code),
  };
}
,
};



exports.CreateListing = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({createListingRequestCid: damlTypes.ContractId(exports.CreateListingRequest).decoder, providerId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    createListingRequestCid: damlTypes.ContractId(exports.CreateListingRequest).encode(__typed__.createListingRequestCid),
    providerId: damlTypes.Text.encode(__typed__.providerId),
  };
}
,
};



exports.RequestDisableListing = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({listingCid: damlTypes.ContractId(Marketplace_Listing_Model.Listing).decoder, }); }),
  encode: function (__typed__) {
  return {
    listingCid: damlTypes.ContractId(Marketplace_Listing_Model.Listing).encode(__typed__.listingCid),
  };
}
,
};



exports.RequestCreateListing = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({listingType: exports.ListingTypeRequest.decoder, symbol: damlTypes.Text.decoder, calendarId: damlTypes.Text.decoder, description: damlTypes.Text.decoder, tradedAssetId: DA_Finance_Types.Id.decoder, quotedAssetId: DA_Finance_Types.Id.decoder, tradedAssetPrecision: damlTypes.Int.decoder, quotedAssetPrecision: damlTypes.Int.decoder, minimumTradableQuantity: damlTypes.Numeric(10).decoder, maximumTradableQuantity: damlTypes.Numeric(10).decoder, observers: damlTypes.List(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    listingType: exports.ListingTypeRequest.encode(__typed__.listingType),
    symbol: damlTypes.Text.encode(__typed__.symbol),
    calendarId: damlTypes.Text.encode(__typed__.calendarId),
    description: damlTypes.Text.encode(__typed__.description),
    tradedAssetId: DA_Finance_Types.Id.encode(__typed__.tradedAssetId),
    quotedAssetId: DA_Finance_Types.Id.encode(__typed__.quotedAssetId),
    tradedAssetPrecision: damlTypes.Int.encode(__typed__.tradedAssetPrecision),
    quotedAssetPrecision: damlTypes.Int.encode(__typed__.quotedAssetPrecision),
    minimumTradableQuantity: damlTypes.Numeric(10).encode(__typed__.minimumTradableQuantity),
    maximumTradableQuantity: damlTypes.Numeric(10).encode(__typed__.maximumTradableQuantity),
    observers: damlTypes.List(damlTypes.Party).encode(__typed__.observers),
  };
}
,
};



exports.Service = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Service:Service',
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
  Archive: {
    template: function () { return exports.Service; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RequestCreateListing: {
    template: function () { return exports.Service; },
    choiceName: 'RequestCreateListing',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestCreateListing.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestCreateListing.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.CreateListingRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.CreateListingRequest).encode(__typed__); },
  },
  Terminate: {
    template: function () { return exports.Service; },
    choiceName: 'Terminate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Terminate.decoder; }),
    argumentEncode: function (__typed__) { return exports.Terminate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RequestDisableListing: {
    template: function () { return exports.Service; },
    choiceName: 'RequestDisableListing',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestDisableListing.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestDisableListing.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.DisableListingRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.DisableListingRequest).encode(__typed__); },
  },
  CreateListing: {
    template: function () { return exports.Service; },
    choiceName: 'CreateListing',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CreateListing.decoder; }),
    argumentEncode: function (__typed__) { return exports.CreateListing.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Listing_Model.Listing).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Listing_Model.Listing).encode(__typed__); },
  },
  ListingFailure: {
    template: function () { return exports.Service; },
    choiceName: 'ListingFailure',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ListingFailure.decoder; }),
    argumentEncode: function (__typed__) { return exports.ListingFailure.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.FailedListingCreation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.FailedListingCreation).encode(__typed__); },
  },
  DisableListing: {
    template: function () { return exports.Service; },
    choiceName: 'DisableListing',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.DisableListing.decoder; }),
    argumentEncode: function (__typed__) { return exports.DisableListing.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Listing_Model.Listing).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Listing_Model.Listing).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Service);



exports.ListingTypeRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('CollateralizedRequest'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('ClearedRequest'), value: damlTypes.Party.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'CollateralizedRequest': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'ClearedRequest': return {tag: __typed__.tag, value: damlTypes.Party.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type ListingTypeRequest';
  }
}
,
};

