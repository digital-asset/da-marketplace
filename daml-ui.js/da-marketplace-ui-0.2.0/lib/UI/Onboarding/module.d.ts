// Generated from UI/Onboarding.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type OperatorOnboard_OnboardIssuer = {
  party: damlTypes.Party;
  custodian: damlTypes.Party;
};

export declare const OperatorOnboard_OnboardIssuer:
  damlTypes.Serializable<OperatorOnboard_OnboardIssuer> & {
  }
;


export declare type OperatorOnboard_OnboardCustodian = {
  party: damlTypes.Party;
};

export declare const OperatorOnboard_OnboardCustodian:
  damlTypes.Serializable<OperatorOnboard_OnboardCustodian> & {
  }
;


export declare type OperatorOnboard_OnboardExchange = {
  party: damlTypes.Party;
};

export declare const OperatorOnboard_OnboardExchange:
  damlTypes.Serializable<OperatorOnboard_OnboardExchange> & {
  }
;


export declare type OperatorOnboard_OnboardClearinghouse = {
  party: damlTypes.Party;
  custodian: damlTypes.Party;
};

export declare const OperatorOnboard_OnboardClearinghouse:
  damlTypes.Serializable<OperatorOnboard_OnboardClearinghouse> & {
  }
;


export declare type OperatorOnboard_OnboardInvestor = {
  party: damlTypes.Party;
  custodian: damlTypes.Party;
  auctionhouse: damlTypes.Party;
  exchanges: damlTypes.Party[];
  optClearinghouse: damlTypes.Optional<damlTypes.Party>;
};

export declare const OperatorOnboard_OnboardInvestor:
  damlTypes.Serializable<OperatorOnboard_OnboardInvestor> & {
  }
;


export declare type OperatorOnboard_Onboard = {
  party: damlTypes.Party;
  instructions: OnboardingInstruction[];
};

export declare const OperatorOnboard_Onboard:
  damlTypes.Serializable<OperatorOnboard_Onboard> & {
  }
;


export declare type OperatorOnboard_OnboardAll = {
  instructions: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, OnboardingInstruction[]>[];
};

export declare const OperatorOnboard_OnboardAll:
  damlTypes.Serializable<OperatorOnboard_OnboardAll> & {
  }
;


export declare type OperatorOnboarding = {
  operator: damlTypes.Party;
};

export declare const OperatorOnboarding:
  damlTypes.Template<OperatorOnboarding, undefined, 'f8e99cac2523c1b45252898d59ae9b86ae321addcdc0eec34b831c96bb76c3a6:UI.Onboarding:OperatorOnboarding'> & {
  OperatorOnboard_Onboard: damlTypes.Choice<OperatorOnboarding, OperatorOnboard_Onboard, {}, undefined>;
  OperatorOnboard_OnboardAll: damlTypes.Choice<OperatorOnboarding, OperatorOnboard_OnboardAll, {}, undefined>;
  OperatorOnboard_OnboardInvestor: damlTypes.Choice<OperatorOnboarding, OperatorOnboard_OnboardInvestor, {}, undefined>;
  OperatorOnboard_OnboardClearinghouse: damlTypes.Choice<OperatorOnboarding, OperatorOnboard_OnboardClearinghouse, {}, undefined>;
  OperatorOnboard_OnboardExchange: damlTypes.Choice<OperatorOnboarding, OperatorOnboard_OnboardExchange, {}, undefined>;
  OperatorOnboard_OnboardCustodian: damlTypes.Choice<OperatorOnboarding, OperatorOnboard_OnboardCustodian, {}, undefined>;
  Archive: damlTypes.Choice<OperatorOnboarding, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  OperatorOnboard_OnboardIssuer: damlTypes.Choice<OperatorOnboarding, OperatorOnboard_OnboardIssuer, {}, undefined>;
};

export declare namespace OperatorOnboarding {
  export type CreateEvent = damlLedger.CreateEvent<OperatorOnboarding, undefined, typeof OperatorOnboarding.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<OperatorOnboarding, typeof OperatorOnboarding.templateId>
  export type Event = damlLedger.Event<OperatorOnboarding, undefined, typeof OperatorOnboarding.templateId>
  export type QueryResult = damlLedger.QueryResult<OperatorOnboarding, undefined, typeof OperatorOnboarding.templateId>
}



export declare type PartyOnboarding_Sign = {
  requestCid: damlTypes.ContractId<OnboardCustomer>;
};

export declare const PartyOnboarding_Sign:
  damlTypes.Serializable<PartyOnboarding_Sign> & {
  }
;


export declare type PartyOnboarding = {
  party: damlTypes.Party;
  operator: damlTypes.Party;
};

export declare const PartyOnboarding:
  damlTypes.Template<PartyOnboarding, PartyOnboarding.Key, 'f8e99cac2523c1b45252898d59ae9b86ae321addcdc0eec34b831c96bb76c3a6:UI.Onboarding:PartyOnboarding'> & {
  PartyOnboarding_Sign: damlTypes.Choice<PartyOnboarding, PartyOnboarding_Sign, damlTypes.ContractId<OnboardCustomer>, PartyOnboarding.Key>;
  Archive: damlTypes.Choice<PartyOnboarding, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, PartyOnboarding.Key>;
};

export declare namespace PartyOnboarding {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<PartyOnboarding, PartyOnboarding.Key, typeof PartyOnboarding.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<PartyOnboarding, typeof PartyOnboarding.templateId>
  export type Event = damlLedger.Event<PartyOnboarding, PartyOnboarding.Key, typeof PartyOnboarding.templateId>
  export type QueryResult = damlLedger.QueryResult<PartyOnboarding, PartyOnboarding.Key, typeof PartyOnboarding.templateId>
}



export declare type OnboardCustomer_Sign = {
  ctrl: damlTypes.Party;
};

export declare const OnboardCustomer_Sign:
  damlTypes.Serializable<OnboardCustomer_Sign> & {
  }
;


export declare type OnboardCustomer_Archive = {
  ctrl: damlTypes.Party;
};

export declare const OnboardCustomer_Archive:
  damlTypes.Serializable<OnboardCustomer_Archive> & {
  }
;


export declare type OnboardCustomer_Finish = {
};

export declare const OnboardCustomer_Finish:
  damlTypes.Serializable<OnboardCustomer_Finish> & {
  }
;


export declare type OnboardCustomer = {
  operator: damlTypes.Party;
  customer: damlTypes.Party;
  instructions: OnboardingInstruction[];
  signed: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const OnboardCustomer:
  damlTypes.Template<OnboardCustomer, undefined, 'f8e99cac2523c1b45252898d59ae9b86ae321addcdc0eec34b831c96bb76c3a6:UI.Onboarding:OnboardCustomer'> & {
  OnboardCustomer_Finish: damlTypes.Choice<OnboardCustomer, OnboardCustomer_Finish, {}, undefined>;
  OnboardCustomer_Archive: damlTypes.Choice<OnboardCustomer, OnboardCustomer_Archive, {}, undefined>;
  OnboardCustomer_Sign: damlTypes.Choice<OnboardCustomer, OnboardCustomer_Sign, damlTypes.ContractId<OnboardCustomer>, undefined>;
  Archive: damlTypes.Choice<OnboardCustomer, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace OnboardCustomer {
  export type CreateEvent = damlLedger.CreateEvent<OnboardCustomer, undefined, typeof OnboardCustomer.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<OnboardCustomer, typeof OnboardCustomer.templateId>
  export type Event = damlLedger.Event<OnboardCustomer, undefined, typeof OnboardCustomer.templateId>
  export type QueryResult = damlLedger.QueryResult<OnboardCustomer, undefined, typeof OnboardCustomer.templateId>
}



export declare type OnboardingInstruction =
  |  { tag: 'OnboardExchange'; value: {} }
  |  { tag: 'OnboardDistributor'; value: {} }
  |  { tag: 'OnboardCustodian'; value: {} }
  |  { tag: 'OnboardClearinghouse'; value: OnboardingInstruction.OnboardClearinghouse }
  |  { tag: 'OnboardMarketClearing'; value: OnboardingInstruction.OnboardMarketClearing }
  |  { tag: 'OnboardCustody'; value: OnboardingInstruction.OnboardCustody }
  |  { tag: 'OnboardTrading'; value: OnboardingInstruction.OnboardTrading }
  |  { tag: 'OnboardClearing'; value: OnboardingInstruction.OnboardClearing }
  |  { tag: 'OnboardIssuance'; value: OnboardingInstruction.OnboardIssuance }
  |  { tag: 'OnboardAuction'; value: OnboardingInstruction.OnboardAuction }
  |  { tag: 'OnboardBidding'; value: OnboardingInstruction.OnboardBidding }
;

export declare const OnboardingInstruction:
  damlTypes.Serializable<OnboardingInstruction> & {
  OnboardClearinghouse: damlTypes.Serializable<OnboardingInstruction.OnboardClearinghouse>;
  OnboardMarketClearing: damlTypes.Serializable<OnboardingInstruction.OnboardMarketClearing>;
  OnboardCustody: damlTypes.Serializable<OnboardingInstruction.OnboardCustody>;
  OnboardTrading: damlTypes.Serializable<OnboardingInstruction.OnboardTrading>;
  OnboardClearing: damlTypes.Serializable<OnboardingInstruction.OnboardClearing>;
  OnboardIssuance: damlTypes.Serializable<OnboardingInstruction.OnboardIssuance>;
  OnboardAuction: damlTypes.Serializable<OnboardingInstruction.OnboardAuction>;
  OnboardBidding: damlTypes.Serializable<OnboardingInstruction.OnboardBidding>;
  }
;


export namespace OnboardingInstruction {
  type OnboardClearinghouse = {
    custodian: damlTypes.Party;
    optClearingAccount: damlTypes.Optional<string>;
  };
} //namespace OnboardingInstruction


export namespace OnboardingInstruction {
  type OnboardMarketClearing = {
    provider: damlTypes.Party;
  };
} //namespace OnboardingInstruction


export namespace OnboardingInstruction {
  type OnboardCustody = {
    provider: damlTypes.Party;
  };
} //namespace OnboardingInstruction


export namespace OnboardingInstruction {
  type OnboardTrading = {
    provider: damlTypes.Party;
    custodian: damlTypes.Party;
    optTradingAccount: damlTypes.Optional<string>;
  };
} //namespace OnboardingInstruction


export namespace OnboardingInstruction {
  type OnboardClearing = {
    provider: damlTypes.Party;
    custodian: damlTypes.Party;
    optClearingAccount: damlTypes.Optional<string>;
  };
} //namespace OnboardingInstruction


export namespace OnboardingInstruction {
  type OnboardIssuance = {
    provider: damlTypes.Party;
    custodian: damlTypes.Party;
    optSafekeepingAccount: damlTypes.Optional<string>;
  };
} //namespace OnboardingInstruction


export namespace OnboardingInstruction {
  type OnboardAuction = {
    provider: damlTypes.Party;
    custodian: damlTypes.Party;
    optTradingAccount: damlTypes.Optional<string>;
    optReceivableAccount: damlTypes.Optional<string>;
  };
} //namespace OnboardingInstruction


export namespace OnboardingInstruction {
  type OnboardBidding = {
    provider: damlTypes.Party;
    custodian: damlTypes.Party;
    optTradingAccount: damlTypes.Optional<string>;
  };
} //namespace OnboardingInstruction


export declare type OnboardingAccount = {
  custodian: damlTypes.Party;
  name: string;
};

export declare const OnboardingAccount:
  damlTypes.Serializable<OnboardingAccount> & {
  }
;

