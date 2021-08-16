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

var DA_Finance_Types = require('../../../DA/Finance/Types/module');
var Marketplace_Trading_Confirmation_Model = require('../../../Marketplace/Trading/Confirmation/Model/module');
var Marketplace_Trading_Model = require('../../../Marketplace/Trading/Model/module');


exports.FailureCancel = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({errorCode: damlTypes.Int.decoder, errorMessage: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    errorCode: damlTypes.Int.encode(__typed__.errorCode),
    errorMessage: damlTypes.Text.encode(__typed__.errorMessage),
  };
}
,
};



exports.AcknowledgeCancel = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.CancelOrderRequest = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Service:CancelOrderRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, operator: damlTypes.Party.decoder, details: Marketplace_Trading_Model.Details.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    operator: damlTypes.Party.encode(__typed__.operator),
    details: Marketplace_Trading_Model.Details.encode(__typed__.details),
  };
}
,
  Archive: {
    template: function () { return exports.CancelOrderRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  FailureCancel: {
    template: function () { return exports.CancelOrderRequest; },
    choiceName: 'FailureCancel',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.FailureCancel.decoder; }),
    argumentEncode: function (__typed__) { return exports.FailureCancel.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Trading_Model.Order).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Trading_Model.Order).encode(__typed__); },
  },
  AcknowledgeCancel: {
    template: function () { return exports.CancelOrderRequest; },
    choiceName: 'AcknowledgeCancel',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcknowledgeCancel.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcknowledgeCancel.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.CancelOrderRequest);



exports.CancelRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({providerOrderId: damlTypes.Text.decoder, cancelledQuantity: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    providerOrderId: damlTypes.Text.encode(__typed__.providerOrderId),
    cancelledQuantity: damlTypes.Numeric(10).encode(__typed__.cancelledQuantity),
  };
}
,
};



exports.RejectRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({errorCode: damlTypes.Int.decoder, errorMessage: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    errorCode: damlTypes.Int.encode(__typed__.errorCode),
    errorMessage: damlTypes.Text.encode(__typed__.errorMessage),
  };
}
,
};



exports.AcknowledgeRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({providerOrderId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    providerOrderId: damlTypes.Text.encode(__typed__.providerOrderId),
  };
}
,
};



exports.CreateOrderRequest = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Service:CreateOrderRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, operator: damlTypes.Party.decoder, details: Marketplace_Trading_Model.Details.decoder, collateral: Marketplace_Trading_Model.TradeCollateral.decoder, }); }),
  encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    operator: damlTypes.Party.encode(__typed__.operator),
    details: Marketplace_Trading_Model.Details.encode(__typed__.details),
    collateral: Marketplace_Trading_Model.TradeCollateral.encode(__typed__.collateral),
  };
}
,
  Archive: {
    template: function () { return exports.CreateOrderRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  CancelRequest: {
    template: function () { return exports.CreateOrderRequest; },
    choiceName: 'CancelRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CancelRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.CancelRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).encode(__typed__); },
  },
  RejectRequest: {
    template: function () { return exports.CreateOrderRequest; },
    choiceName: 'RejectRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).encode(__typed__); },
  },
  AcknowledgeRequest: {
    template: function () { return exports.CreateOrderRequest; },
    choiceName: 'AcknowledgeRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcknowledgeRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcknowledgeRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Trading_Model.Order).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Trading_Model.Order).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.CreateOrderRequest);



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
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Service:Request',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, tradingAccount: DA_Finance_Types.Account.decoder, allocationAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
    provider: damlTypes.Party.encode(__typed__.provider),
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
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
  decoder: damlTypes.lazyMemo(function () { return jtv.object({tradingAccount: DA_Finance_Types.Account.decoder, allocationAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
  };
}
,
};



exports.Offer = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Service:Offer',
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



exports.SignConfirmation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({confirmationCid: damlTypes.ContractId(Marketplace_Trading_Confirmation_Model.Confirmation).decoder, }); }),
  encode: function (__typed__) {
  return {
    confirmationCid: damlTypes.ContractId(Marketplace_Trading_Confirmation_Model.Confirmation).encode(__typed__.confirmationCid),
  };
}
,
};



exports.RejectCancellation = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cancelOrderRequestCid: damlTypes.ContractId(exports.CancelOrderRequest).decoder, errorCode: damlTypes.Int.decoder, errorMessage: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    cancelOrderRequestCid: damlTypes.ContractId(exports.CancelOrderRequest).encode(__typed__.cancelOrderRequestCid),
    errorCode: damlTypes.Int.encode(__typed__.errorCode),
    errorMessage: damlTypes.Text.encode(__typed__.errorMessage),
  };
}
,
};



exports.CancelOrder = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({cancelOrderRequestCid: damlTypes.ContractId(exports.CancelOrderRequest).decoder, }); }),
  encode: function (__typed__) {
  return {
    cancelOrderRequestCid: damlTypes.ContractId(exports.CancelOrderRequest).encode(__typed__.cancelOrderRequestCid),
  };
}
,
};



exports.MarketOrderCancelRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({createOrderRequestCid: damlTypes.ContractId(exports.CreateOrderRequest).decoder, providerOrderId: damlTypes.Text.decoder, cancelledQuantity: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    createOrderRequestCid: damlTypes.ContractId(exports.CreateOrderRequest).encode(__typed__.createOrderRequestCid),
    providerOrderId: damlTypes.Text.encode(__typed__.providerOrderId),
    cancelledQuantity: damlTypes.Numeric(10).encode(__typed__.cancelledQuantity),
  };
}
,
};



exports.RejectOrderRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({createOrderRequestCid: damlTypes.ContractId(exports.CreateOrderRequest).decoder, errorCode: damlTypes.Int.decoder, errorMessage: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    createOrderRequestCid: damlTypes.ContractId(exports.CreateOrderRequest).encode(__typed__.createOrderRequestCid),
    errorCode: damlTypes.Int.encode(__typed__.errorCode),
    errorMessage: damlTypes.Text.encode(__typed__.errorMessage),
  };
}
,
};



exports.AcknowledgeOrderRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({createOrderRequestCid: damlTypes.ContractId(exports.CreateOrderRequest).decoder, providerOrderId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    createOrderRequestCid: damlTypes.ContractId(exports.CreateOrderRequest).encode(__typed__.createOrderRequestCid),
    providerOrderId: damlTypes.Text.encode(__typed__.providerOrderId),
  };
}
,
};



exports.RequestCancelOrder = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({orderCid: damlTypes.ContractId(Marketplace_Trading_Model.Order).decoder, }); }),
  encode: function (__typed__) {
  return {
    orderCid: damlTypes.ContractId(Marketplace_Trading_Model.Order).encode(__typed__.orderCid),
  };
}
,
};



exports.RequestCreateOrder = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({collateral: Marketplace_Trading_Model.TradeCollateral.decoder, details: Marketplace_Trading_Model.Details.decoder, }); }),
  encode: function (__typed__) {
  return {
    collateral: Marketplace_Trading_Model.TradeCollateral.encode(__typed__.collateral),
    details: Marketplace_Trading_Model.Details.encode(__typed__.details),
  };
}
,
};



exports.Service = {
  templateId: '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Service:Service',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, provider: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, tradingAccount: DA_Finance_Types.Account.decoder, allocationAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    provider: damlTypes.Party.encode(__typed__.provider),
    customer: damlTypes.Party.encode(__typed__.customer),
    tradingAccount: DA_Finance_Types.Account.encode(__typed__.tradingAccount),
    allocationAccount: DA_Finance_Types.Account.encode(__typed__.allocationAccount),
  };
}
,
  RejectCancellation: {
    template: function () { return exports.Service; },
    choiceName: 'RejectCancellation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectCancellation.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectCancellation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Trading_Model.Order).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Trading_Model.Order).encode(__typed__); },
  },
  CancelOrder: {
    template: function () { return exports.Service; },
    choiceName: 'CancelOrder',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CancelOrder.decoder; }),
    argumentEncode: function (__typed__) { return exports.CancelOrder.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).encode(__typed__); },
  },
  Terminate: {
    template: function () { return exports.Service; },
    choiceName: 'Terminate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Terminate.decoder; }),
    argumentEncode: function (__typed__) { return exports.Terminate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  MarketOrderCancelRequest: {
    template: function () { return exports.Service; },
    choiceName: 'MarketOrderCancelRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarketOrderCancelRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarketOrderCancelRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).encode(__typed__); },
  },
  RejectOrderRequest: {
    template: function () { return exports.Service; },
    choiceName: 'RejectOrderRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectOrderRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectOrderRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), Marketplace_Trading_Model.TradeCollateral).encode(__typed__); },
  },
  AcknowledgeOrderRequest: {
    template: function () { return exports.Service; },
    choiceName: 'AcknowledgeOrderRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcknowledgeOrderRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcknowledgeOrderRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Trading_Model.Order).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Trading_Model.Order).encode(__typed__); },
  },
  RequestCancelOrder: {
    template: function () { return exports.Service; },
    choiceName: 'RequestCancelOrder',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestCancelOrder.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestCancelOrder.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), damlTypes.ContractId(exports.CancelOrderRequest)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Marketplace_Trading_Model.Order), damlTypes.ContractId(exports.CancelOrderRequest)).encode(__typed__); },
  },
  RequestCreateOrder: {
    template: function () { return exports.Service; },
    choiceName: 'RequestCreateOrder',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestCreateOrder.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestCreateOrder.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Either(damlTypes.ContractId(Marketplace_Trading_Model.Order), pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(Marketplace_Trading_Model.Order), damlTypes.ContractId(exports.CreateOrderRequest), Marketplace_Trading_Model.TradeCollateral)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Either(damlTypes.ContractId(Marketplace_Trading_Model.Order), pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(Marketplace_Trading_Model.Order), damlTypes.ContractId(exports.CreateOrderRequest), Marketplace_Trading_Model.TradeCollateral)).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Service; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  SignConfirmation: {
    template: function () { return exports.Service; },
    choiceName: 'SignConfirmation',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SignConfirmation.decoder; }),
    argumentEncode: function (__typed__) { return exports.SignConfirmation.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Marketplace_Trading_Confirmation_Model.Confirmation).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Marketplace_Trading_Confirmation_Model.Confirmation).encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.Service);

