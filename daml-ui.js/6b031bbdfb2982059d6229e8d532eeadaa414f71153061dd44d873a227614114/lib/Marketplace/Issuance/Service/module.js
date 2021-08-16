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

var ContingentClaims_Claim_Serializable = require('../../../ContingentClaims/Claim/Serializable/module');
var DA_Finance_Asset = require('../../../DA/Finance/Asset/module');
var DA_Finance_Types = require('../../../DA/Finance/Types/module');
var Marketplace_Issuance_AssetDescription = require('../../../Marketplace/Issuance/AssetDescription/module');
var Marketplace_Issuance_CFI = require('../../../Marketplace/Issuance/CFI/module');
var Marketplace_Issuance_Model = require('../../../Marketplace/Issuance/Model/module');


exports.OriginationRequest = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:OriginationRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, assetLabel: damlTypes.Text.decoder, cfi: Marketplace_Issuance_CFI.CFI.decoder, description: damlTypes.Text.decoder, claims: ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id).decoder, safekeepingAccount: DA_Finance_Types.Account.decoder, observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    assetLabel: damlTypes.Text.encode(__typed__.assetLabel),
    cfi: Marketplace_Issuance_CFI.CFI.encode(__typed__.cfi),
    description: damlTypes.Text.encode(__typed__.description),
    claims: ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id).encode(__typed__.claims),
    safekeepingAccount: DA_Finance_Types.Account.encode(__typed__.safekeepingAccount),
    observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  Archive: {
    template: function () { return exports.OriginationRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.OriginationRequest);



exports.ReduceIssuanceRequest = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:ReduceIssuanceRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, issuanceId: damlTypes.Text.decoder, accountId: DA_Finance_Types.Id.decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    issuanceId: damlTypes.Text.encode(__typed__.issuanceId),
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
  };
}
,
  Archive: {
    template: function () { return exports.ReduceIssuanceRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.ReduceIssuanceRequest);



exports.CreateIssuanceRequest = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:CreateIssuanceRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, issuanceId: damlTypes.Text.decoder, assetId: DA_Finance_Types.Id.decoder, accountId: DA_Finance_Types.Id.decoder, quantity: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    issuanceId: damlTypes.Text.encode(__typed__.issuanceId),
    assetId: DA_Finance_Types.Id.encode(__typed__.assetId),
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
  };
}
,
  Archive: {
    template: function () { return exports.CreateIssuanceRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.CreateIssuanceRequest);



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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:Request',
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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:Offer',
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



exports.ReduceIssuance = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({reduceIssuanceRequestCid: damlTypes.ContractId(exports.ReduceIssuanceRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    reduceIssuanceRequestCid: damlTypes.ContractId(exports.ReduceIssuanceRequest).encode(__typed__.reduceIssuanceRequestCid),
  };
}
,
};



exports.CreateIssuance = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({createIssuanceRequestCid: damlTypes.ContractId(exports.CreateIssuanceRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    createIssuanceRequestCid: damlTypes.ContractId(exports.CreateIssuanceRequest).encode(__typed__.createIssuanceRequestCid),
  };
}
,
};



exports.Originate = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({createOriginationCid: damlTypes.ContractId(exports.OriginationRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    createOriginationCid: damlTypes.ContractId(exports.OriginationRequest).encode(__typed__.createOriginationCid),
  };
}
,
};



exports.RequestReduceIssuance = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({issuanceId: damlTypes.Text.decoder, accountId: DA_Finance_Types.Id.decoder, depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    issuanceId: damlTypes.Text.encode(__typed__.issuanceId),
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
    depositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.depositCid),
  };
}
,
};



exports.RequestCreateIssuance = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({issuanceId: damlTypes.Text.decoder, accountId: DA_Finance_Types.Id.decoder, assetId: DA_Finance_Types.Id.decoder, quantity: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    issuanceId: damlTypes.Text.encode(__typed__.issuanceId),
    accountId: DA_Finance_Types.Id.encode(__typed__.accountId),
    assetId: DA_Finance_Types.Id.encode(__typed__.assetId),
    quantity: damlTypes.Numeric(10).encode(__typed__.quantity),
  };
}
,
};



exports.RequestOrigination = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assetLabel: damlTypes.Text.decoder, cfi: Marketplace_Issuance_CFI.CFI.decoder, description: damlTypes.Text.decoder, claims: ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id).decoder, safekeepingAccount: DA_Finance_Types.Account.decoder, observers: damlTypes.List(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    assetLabel: damlTypes.Text.encode(__typed__.assetLabel),
    cfi: Marketplace_Issuance_CFI.CFI.encode(__typed__.cfi),
    description: damlTypes.Text.encode(__typed__.description),
    claims: ContingentClaims_Claim_Serializable.Claim(damlTypes.Date, damlTypes.Numeric(10), DA_Finance_Types.Id).encode(__typed__.claims),
    safekeepingAccount: DA_Finance_Types.Account.encode(__typed__.safekeepingAccount),
    observers: damlTypes.List(damlTypes.Party).encode(__typed__.observers),
  };
}
,
};



exports.Service = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Service:Service',
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
  Originate: {
    template: function () { return exports.Service; },
    choiceName: 'Originate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Originate.decoder; }),
    argumentEncode: function (__typed__) { return exports.Originate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Issuance_AssetDescription.AssetDescription), Marketplace_Issuance_AssetDescription.AssetDescription).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Issuance_AssetDescription.AssetDescription), Marketplace_Issuance_AssetDescription.AssetDescription).encode(__typed__); },
  },
  CreateIssuance: {
    template: function () { return exports.Service; },
    choiceName: 'CreateIssuance',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CreateIssuance.decoder; }),
    argumentEncode: function (__typed__) { return exports.CreateIssuance.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Issuance_Model.Issuance), damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Issuance_Model.Issuance), damlTypes.ContractId(DA_Finance_Asset.AssetDeposit)).encode(__typed__); },
  },
  RequestOrigination: {
    template: function () { return exports.Service; },
    choiceName: 'RequestOrigination',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestOrigination.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestOrigination.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.OriginationRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.OriginationRequest).encode(__typed__); },
  },
  RequestCreateIssuance: {
    template: function () { return exports.Service; },
    choiceName: 'RequestCreateIssuance',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestCreateIssuance.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestCreateIssuance.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.CreateIssuanceRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.CreateIssuanceRequest).encode(__typed__); },
  },
  RequestReduceIssuance: {
    template: function () { return exports.Service; },
    choiceName: 'RequestReduceIssuance',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestReduceIssuance.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestReduceIssuance.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ReduceIssuanceRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ReduceIssuanceRequest).encode(__typed__); },
  },
  ReduceIssuance: {
    template: function () { return exports.Service; },
    choiceName: 'ReduceIssuance',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ReduceIssuance.decoder; }),
    argumentEncode: function (__typed__) { return exports.ReduceIssuance.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Issuance_Model.Issuance).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Issuance_Model.Issuance).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Service);

