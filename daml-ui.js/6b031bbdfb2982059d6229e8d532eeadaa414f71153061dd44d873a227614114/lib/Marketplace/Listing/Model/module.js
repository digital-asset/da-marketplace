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


exports.ClearedListingApproval = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Model:ClearedListingApproval',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, clearinghouse: damlTypes.Party.decoder, symbol: damlTypes.Text.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    clearinghouse: damlTypes.Party.encode(__typed__.clearinghouse),
    symbol: damlTypes.Text.encode(__typed__.symbol),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.ClearedListingApproval; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.ClearedListingApproval);



exports.Listing = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Model:Listing',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, listingType: exports.ListingType.decoder, listingId: damlTypes.Text.decoder, calendarId: damlTypes.Text.decoder, description: damlTypes.Text.decoder, tradedAssetId: DA_Finance_Types.Id.decoder, quotedAssetId: DA_Finance_Types.Id.decoder, tradedAssetPrecision: damlTypes.Int.decoder, quotedAssetPrecision: damlTypes.Int.decoder, minimumTradableQuantity: damlTypes.Numeric(10).decoder, maximumTradableQuantity: damlTypes.Numeric(10).decoder, providerId: damlTypes.Text.decoder, status: exports.Status.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    listingType: exports.ListingType.encode(__typed__.listingType),
    listingId: damlTypes.Text.encode(__typed__.listingId),
    calendarId: damlTypes.Text.encode(__typed__.calendarId),
    description: damlTypes.Text.encode(__typed__.description),
    tradedAssetId: DA_Finance_Types.Id.encode(__typed__.tradedAssetId),
    quotedAssetId: DA_Finance_Types.Id.encode(__typed__.quotedAssetId),
    tradedAssetPrecision: damlTypes.Int.encode(__typed__.tradedAssetPrecision),
    quotedAssetPrecision: damlTypes.Int.encode(__typed__.quotedAssetPrecision),
    minimumTradableQuantity: damlTypes.Numeric(10).encode(__typed__.minimumTradableQuantity),
    maximumTradableQuantity: damlTypes.Numeric(10).encode(__typed__.maximumTradableQuantity),
    providerId: damlTypes.Text.encode(__typed__.providerId),
    status: exports.Status.encode(__typed__.status),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.Listing; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Listing);



exports.ListingType = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('Cleared'), value: exports.ListingType.Cleared.decoder, }), jtv.object({tag: jtv.constant('Collateralized'), value: damlTypes.Unit.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'Cleared': return {tag: __typed__.tag, value: exports.ListingType.Cleared.encode(__typed__.value)};
    case 'Collateralized': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type ListingType';
  }
}
,
  Cleared:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({clearinghouse: damlTypes.Party.decoder, approvalCid: damlTypes.ContractId(exports.ClearedListingApproval).decoder, }); }),
    encode: function (__typed__) {
  return {
    clearinghouse: damlTypes.Party.encode(__typed__.clearinghouse),
    approvalCid: damlTypes.ContractId(exports.ClearedListingApproval).encode(__typed__.approvalCid),
  };
}
,
  }),
};





exports.Status = {
  Active: 'Active',
  Disabled: 'Disabled',
  keys: ['Active','Disabled',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.Status.Active), jtv.constant(exports.Status.Disabled)); }),
  encode: function (__typed__) { return __typed__; },
};

