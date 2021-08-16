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


exports.OperatorOnboard_OnboardIssuer = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, custodian: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
    custodian: damlTypes.Party.encode(__typed__.custodian),
  };
}
,
};



exports.OperatorOnboard_OnboardCustodian = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
  };
}
,
};



exports.OperatorOnboard_OnboardExchange = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
  };
}
,
};



exports.OperatorOnboard_OnboardClearinghouse = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, custodian: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
    custodian: damlTypes.Party.encode(__typed__.custodian),
  };
}
,
};



exports.OperatorOnboard_OnboardInvestor = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, custodian: damlTypes.Party.decoder, auctionhouse: damlTypes.Party.decoder, exchanges: damlTypes.List(damlTypes.Party).decoder, optClearinghouse: damlTypes.Optional(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
    custodian: damlTypes.Party.encode(__typed__.custodian),
    auctionhouse: damlTypes.Party.encode(__typed__.auctionhouse),
    exchanges: damlTypes.List(damlTypes.Party).encode(__typed__.exchanges),
    optClearinghouse: damlTypes.Optional(damlTypes.Party).encode(__typed__.optClearinghouse),
  };
}
,
};



exports.OperatorOnboard_Onboard = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, instructions: damlTypes.List(exports.OnboardingInstruction).decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
    instructions: damlTypes.List(exports.OnboardingInstruction).encode(__typed__.instructions),
  };
}
,
};



exports.OperatorOnboard_OnboardAll = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({instructions: damlTypes.List(pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.List(exports.OnboardingInstruction))).decoder, }); }),
  encode: function (__typed__) {
  return {
    instructions: damlTypes.List(pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.List(exports.OnboardingInstruction))).encode(__typed__.instructions),
  };
}
,
};



exports.OperatorOnboarding = {
  templateId: 'f8e99cac2523c1b45252898d59ae9b86ae321addcdc0eec34b831c96bb76c3a6:UI.Onboarding:OperatorOnboarding',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
  };
}
,
  OperatorOnboard_Onboard: {
    template: function () { return exports.OperatorOnboarding; },
    choiceName: 'OperatorOnboard_Onboard',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OperatorOnboard_Onboard.decoder; }),
    argumentEncode: function (__typed__) { return exports.OperatorOnboard_Onboard.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OperatorOnboard_OnboardAll: {
    template: function () { return exports.OperatorOnboarding; },
    choiceName: 'OperatorOnboard_OnboardAll',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OperatorOnboard_OnboardAll.decoder; }),
    argumentEncode: function (__typed__) { return exports.OperatorOnboard_OnboardAll.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OperatorOnboard_OnboardInvestor: {
    template: function () { return exports.OperatorOnboarding; },
    choiceName: 'OperatorOnboard_OnboardInvestor',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OperatorOnboard_OnboardInvestor.decoder; }),
    argumentEncode: function (__typed__) { return exports.OperatorOnboard_OnboardInvestor.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OperatorOnboard_OnboardClearinghouse: {
    template: function () { return exports.OperatorOnboarding; },
    choiceName: 'OperatorOnboard_OnboardClearinghouse',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OperatorOnboard_OnboardClearinghouse.decoder; }),
    argumentEncode: function (__typed__) { return exports.OperatorOnboard_OnboardClearinghouse.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OperatorOnboard_OnboardExchange: {
    template: function () { return exports.OperatorOnboarding; },
    choiceName: 'OperatorOnboard_OnboardExchange',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OperatorOnboard_OnboardExchange.decoder; }),
    argumentEncode: function (__typed__) { return exports.OperatorOnboard_OnboardExchange.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OperatorOnboard_OnboardCustodian: {
    template: function () { return exports.OperatorOnboarding; },
    choiceName: 'OperatorOnboard_OnboardCustodian',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OperatorOnboard_OnboardCustodian.decoder; }),
    argumentEncode: function (__typed__) { return exports.OperatorOnboard_OnboardCustodian.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.OperatorOnboarding; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OperatorOnboard_OnboardIssuer: {
    template: function () { return exports.OperatorOnboarding; },
    choiceName: 'OperatorOnboard_OnboardIssuer',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OperatorOnboard_OnboardIssuer.decoder; }),
    argumentEncode: function (__typed__) { return exports.OperatorOnboard_OnboardIssuer.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.OperatorOnboarding);



exports.PartyOnboarding_Sign = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({requestCid: damlTypes.ContractId(exports.OnboardCustomer).decoder, }); }),
  encode: function (__typed__) {
  return {
    requestCid: damlTypes.ContractId(exports.OnboardCustomer).encode(__typed__.requestCid),
  };
}
,
};



exports.PartyOnboarding = {
  templateId: 'f8e99cac2523c1b45252898d59ae9b86ae321addcdc0eec34b831c96bb76c3a6:UI.Onboarding:PartyOnboarding',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, operator: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
    operator: damlTypes.Party.encode(__typed__.operator),
  };
}
,
  PartyOnboarding_Sign: {
    template: function () { return exports.PartyOnboarding; },
    choiceName: 'PartyOnboarding_Sign',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.PartyOnboarding_Sign.decoder; }),
    argumentEncode: function (__typed__) { return exports.PartyOnboarding_Sign.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.OnboardCustomer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.OnboardCustomer).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.PartyOnboarding; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.PartyOnboarding);



exports.OnboardCustomer_Sign = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.OnboardCustomer_Archive = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({ctrl: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    ctrl: damlTypes.Party.encode(__typed__.ctrl),
  };
}
,
};



exports.OnboardCustomer_Finish = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.OnboardCustomer = {
  templateId: 'f8e99cac2523c1b45252898d59ae9b86ae321addcdc0eec34b831c96bb76c3a6:UI.Onboarding:OnboardCustomer',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, customer: damlTypes.Party.decoder, instructions: damlTypes.List(exports.OnboardingInstruction).decoder, signed: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    customer: damlTypes.Party.encode(__typed__.customer),
    instructions: damlTypes.List(exports.OnboardingInstruction).encode(__typed__.instructions),
    signed: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set(damlTypes.Party).encode(__typed__.signed),
  };
}
,
  OnboardCustomer_Finish: {
    template: function () { return exports.OnboardCustomer; },
    choiceName: 'OnboardCustomer_Finish',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OnboardCustomer_Finish.decoder; }),
    argumentEncode: function (__typed__) { return exports.OnboardCustomer_Finish.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OnboardCustomer_Archive: {
    template: function () { return exports.OnboardCustomer; },
    choiceName: 'OnboardCustomer_Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OnboardCustomer_Archive.decoder; }),
    argumentEncode: function (__typed__) { return exports.OnboardCustomer_Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OnboardCustomer_Sign: {
    template: function () { return exports.OnboardCustomer; },
    choiceName: 'OnboardCustomer_Sign',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OnboardCustomer_Sign.decoder; }),
    argumentEncode: function (__typed__) { return exports.OnboardCustomer_Sign.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.OnboardCustomer).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.OnboardCustomer).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.OnboardCustomer; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
};


damlTypes.registerTemplate(exports.OnboardCustomer);



exports.OnboardingInstruction = {
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.object({tag: jtv.constant('OnboardExchange'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('OnboardDistributor'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('OnboardCustodian'), value: damlTypes.Unit.decoder, }), jtv.object({tag: jtv.constant('OnboardClearinghouse'), value: exports.OnboardingInstruction.OnboardClearinghouse.decoder, }), jtv.object({tag: jtv.constant('OnboardMarketClearing'), value: exports.OnboardingInstruction.OnboardMarketClearing.decoder, }), jtv.object({tag: jtv.constant('OnboardCustody'), value: exports.OnboardingInstruction.OnboardCustody.decoder, }), jtv.object({tag: jtv.constant('OnboardTrading'), value: exports.OnboardingInstruction.OnboardTrading.decoder, }), jtv.object({tag: jtv.constant('OnboardClearing'), value: exports.OnboardingInstruction.OnboardClearing.decoder, }), jtv.object({tag: jtv.constant('OnboardIssuance'), value: exports.OnboardingInstruction.OnboardIssuance.decoder, }), jtv.object({tag: jtv.constant('OnboardAuction'), value: exports.OnboardingInstruction.OnboardAuction.decoder, }), jtv.object({tag: jtv.constant('OnboardBidding'), value: exports.OnboardingInstruction.OnboardBidding.decoder, })); }),
  encode: function (__typed__) {
  switch(__typed__.tag) {
    case 'OnboardExchange': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'OnboardDistributor': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'OnboardCustodian': return {tag: __typed__.tag, value: damlTypes.Unit.encode(__typed__.value)};
    case 'OnboardClearinghouse': return {tag: __typed__.tag, value: exports.OnboardingInstruction.OnboardClearinghouse.encode(__typed__.value)};
    case 'OnboardMarketClearing': return {tag: __typed__.tag, value: exports.OnboardingInstruction.OnboardMarketClearing.encode(__typed__.value)};
    case 'OnboardCustody': return {tag: __typed__.tag, value: exports.OnboardingInstruction.OnboardCustody.encode(__typed__.value)};
    case 'OnboardTrading': return {tag: __typed__.tag, value: exports.OnboardingInstruction.OnboardTrading.encode(__typed__.value)};
    case 'OnboardClearing': return {tag: __typed__.tag, value: exports.OnboardingInstruction.OnboardClearing.encode(__typed__.value)};
    case 'OnboardIssuance': return {tag: __typed__.tag, value: exports.OnboardingInstruction.OnboardIssuance.encode(__typed__.value)};
    case 'OnboardAuction': return {tag: __typed__.tag, value: exports.OnboardingInstruction.OnboardAuction.encode(__typed__.value)};
    case 'OnboardBidding': return {tag: __typed__.tag, value: exports.OnboardingInstruction.OnboardBidding.encode(__typed__.value)};
    default: throw 'unrecognized type tag: ' + __typed__.tag + ' while serializing a value of type OnboardingInstruction';
  }
}
,
  OnboardClearinghouse:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({custodian: damlTypes.Party.decoder, optClearingAccount: damlTypes.Optional(damlTypes.Text).decoder, }); }),
    encode: function (__typed__) {
  return {
    custodian: damlTypes.Party.encode(__typed__.custodian),
    optClearingAccount: damlTypes.Optional(damlTypes.Text).encode(__typed__.optClearingAccount),
  };
}
,
  }),
  OnboardMarketClearing:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, }); }),
    encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
  };
}
,
  }),
  OnboardCustody:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, }); }),
    encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
  };
}
,
  }),
  OnboardTrading:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, custodian: damlTypes.Party.decoder, optTradingAccount: damlTypes.Optional(damlTypes.Text).decoder, }); }),
    encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    custodian: damlTypes.Party.encode(__typed__.custodian),
    optTradingAccount: damlTypes.Optional(damlTypes.Text).encode(__typed__.optTradingAccount),
  };
}
,
  }),
  OnboardClearing:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, custodian: damlTypes.Party.decoder, optClearingAccount: damlTypes.Optional(damlTypes.Text).decoder, }); }),
    encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    custodian: damlTypes.Party.encode(__typed__.custodian),
    optClearingAccount: damlTypes.Optional(damlTypes.Text).encode(__typed__.optClearingAccount),
  };
}
,
  }),
  OnboardIssuance:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, custodian: damlTypes.Party.decoder, optSafekeepingAccount: damlTypes.Optional(damlTypes.Text).decoder, }); }),
    encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    custodian: damlTypes.Party.encode(__typed__.custodian),
    optSafekeepingAccount: damlTypes.Optional(damlTypes.Text).encode(__typed__.optSafekeepingAccount),
  };
}
,
  }),
  OnboardAuction:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, custodian: damlTypes.Party.decoder, optTradingAccount: damlTypes.Optional(damlTypes.Text).decoder, optReceivableAccount: damlTypes.Optional(damlTypes.Text).decoder, }); }),
    encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    custodian: damlTypes.Party.encode(__typed__.custodian),
    optTradingAccount: damlTypes.Optional(damlTypes.Text).encode(__typed__.optTradingAccount),
    optReceivableAccount: damlTypes.Optional(damlTypes.Text).encode(__typed__.optReceivableAccount),
  };
}
,
  }),
  OnboardBidding:({
    decoder: damlTypes.lazyMemo(function () { return jtv.object({provider: damlTypes.Party.decoder, custodian: damlTypes.Party.decoder, optTradingAccount: damlTypes.Optional(damlTypes.Text).decoder, }); }),
    encode: function (__typed__) {
  return {
    provider: damlTypes.Party.encode(__typed__.provider),
    custodian: damlTypes.Party.encode(__typed__.custodian),
    optTradingAccount: damlTypes.Optional(damlTypes.Text).encode(__typed__.optTradingAccount),
  };
}
,
  }),
};



















exports.OnboardingAccount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({custodian: damlTypes.Party.decoder, name: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    custodian: damlTypes.Party.encode(__typed__.custodian),
    name: damlTypes.Text.encode(__typed__.name),
  };
}
,
};

