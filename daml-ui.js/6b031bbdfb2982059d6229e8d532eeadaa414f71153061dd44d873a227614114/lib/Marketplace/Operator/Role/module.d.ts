// Generated from Marketplace/Operator/Role.daml
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

import * as Marketplace_Clearing_Market_Service from '../../../Marketplace/Clearing/Market/Service/module';
import * as Marketplace_Clearing_Role from '../../../Marketplace/Clearing/Role/module';
import * as Marketplace_Custody_Role from '../../../Marketplace/Custody/Role/module';
import * as Marketplace_Custody_Service from '../../../Marketplace/Custody/Service/module';
import * as Marketplace_Distribution_Role from '../../../Marketplace/Distribution/Role/module';
import * as Marketplace_Issuance_Service from '../../../Marketplace/Issuance/Service/module';
import * as Marketplace_Listing_Service from '../../../Marketplace/Listing/Service/module';
import * as Marketplace_Regulator_Role from '../../../Marketplace/Regulator/Role/module';
import * as Marketplace_Settlement_Service from '../../../Marketplace/Settlement/Service/module';
import * as Marketplace_Trading_Matching_Service from '../../../Marketplace/Trading/Matching/Service/module';
import * as Marketplace_Trading_Role from '../../../Marketplace/Trading/Role/module';

export declare type ApproveClearingRequest = {
  clearingRequestCid: damlTypes.ContractId<Marketplace_Clearing_Role.Request>;
};

export declare const ApproveClearingRequest:
  damlTypes.Serializable<ApproveClearingRequest> & {
  }
;


export declare type OfferClearingRole = {
  provider: damlTypes.Party;
};

export declare const OfferClearingRole:
  damlTypes.Serializable<OfferClearingRole> & {
  }
;


export declare type ApproveDistributorRequest = {
  distributorRequestCid: damlTypes.ContractId<Marketplace_Distribution_Role.Request>;
};

export declare const ApproveDistributorRequest:
  damlTypes.Serializable<ApproveDistributorRequest> & {
  }
;


export declare type OfferDistributorRole = {
  provider: damlTypes.Party;
};

export declare const OfferDistributorRole:
  damlTypes.Serializable<OfferDistributorRole> & {
  }
;


export declare type ApproveSettlementRequest = {
  settlementRequestCid: damlTypes.ContractId<Marketplace_Settlement_Service.Request>;
};

export declare const ApproveSettlementRequest:
  damlTypes.Serializable<ApproveSettlementRequest> & {
  }
;


export declare type OfferSettlementService = {
  provider: damlTypes.Party;
};

export declare const OfferSettlementService:
  damlTypes.Serializable<OfferSettlementService> & {
  }
;


export declare type ApproveMatchingRequest = {
  matchingRequestCid: damlTypes.ContractId<Marketplace_Trading_Matching_Service.Request>;
};

export declare const ApproveMatchingRequest:
  damlTypes.Serializable<ApproveMatchingRequest> & {
  }
;


export declare type OfferMatchingService = {
  provider: damlTypes.Party;
};

export declare const OfferMatchingService:
  damlTypes.Serializable<OfferMatchingService> & {
  }
;


export declare type ApproveRegulatorRequest = {
  regulatorRequestCid: damlTypes.ContractId<Marketplace_Regulator_Role.Request>;
};

export declare const ApproveRegulatorRequest:
  damlTypes.Serializable<ApproveRegulatorRequest> & {
  }
;


export declare type OfferRegulatorRole = {
  provider: damlTypes.Party;
};

export declare const OfferRegulatorRole:
  damlTypes.Serializable<OfferRegulatorRole> & {
  }
;


export declare type ApproveExchangeRequest = {
  exchangeRequestCid: damlTypes.ContractId<Marketplace_Trading_Role.Request>;
};

export declare const ApproveExchangeRequest:
  damlTypes.Serializable<ApproveExchangeRequest> & {
  }
;


export declare type OfferExchangeRole = {
  provider: damlTypes.Party;
};

export declare const OfferExchangeRole:
  damlTypes.Serializable<OfferExchangeRole> & {
  }
;


export declare type ApproveCustodianRequest = {
  custodianRequestCid: damlTypes.ContractId<Marketplace_Custody_Role.Request>;
};

export declare const ApproveCustodianRequest:
  damlTypes.Serializable<ApproveCustodianRequest> & {
  }
;


export declare type OfferCustodianRole = {
  provider: damlTypes.Party;
};

export declare const OfferCustodianRole:
  damlTypes.Serializable<OfferCustodianRole> & {
  }
;


export declare type Role = {
  operator: damlTypes.Party;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Role:
  damlTypes.Template<Role, Role.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Operator.Role:Role'> & {
  OfferCustodianRole: damlTypes.Choice<Role, OfferCustodianRole, damlTypes.ContractId<Marketplace_Custody_Role.Offer>, Role.Key>;
  ApproveCustodianRequest: damlTypes.Choice<Role, ApproveCustodianRequest, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.ContractId<Marketplace_Custody_Role.Role>, damlTypes.ContractId<Marketplace_Issuance_Service.Service>, damlTypes.ContractId<Marketplace_Custody_Service.Service>>, Role.Key>;
  OfferExchangeRole: damlTypes.Choice<Role, OfferExchangeRole, damlTypes.ContractId<Marketplace_Trading_Role.Offer>, Role.Key>;
  ApproveExchangeRequest: damlTypes.Choice<Role, ApproveExchangeRequest, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple4<damlTypes.ContractId<Marketplace_Trading_Role.Role>, damlTypes.ContractId<Marketplace_Trading_Matching_Service.Service>, damlTypes.ContractId<Marketplace_Listing_Service.Service>, damlTypes.ContractId<Marketplace_Settlement_Service.Service>>, Role.Key>;
  OfferRegulatorRole: damlTypes.Choice<Role, OfferRegulatorRole, damlTypes.ContractId<Marketplace_Regulator_Role.Offer>, Role.Key>;
  ApproveRegulatorRequest: damlTypes.Choice<Role, ApproveRegulatorRequest, damlTypes.ContractId<Marketplace_Regulator_Role.Role>, Role.Key>;
  OfferMatchingService: damlTypes.Choice<Role, OfferMatchingService, damlTypes.ContractId<Marketplace_Trading_Matching_Service.Offer>, Role.Key>;
  ApproveMatchingRequest: damlTypes.Choice<Role, ApproveMatchingRequest, damlTypes.ContractId<Marketplace_Trading_Matching_Service.Service>, Role.Key>;
  OfferSettlementService: damlTypes.Choice<Role, OfferSettlementService, damlTypes.ContractId<Marketplace_Settlement_Service.Offer>, Role.Key>;
  ApproveSettlementRequest: damlTypes.Choice<Role, ApproveSettlementRequest, damlTypes.ContractId<Marketplace_Settlement_Service.Service>, Role.Key>;
  OfferDistributorRole: damlTypes.Choice<Role, OfferDistributorRole, damlTypes.ContractId<Marketplace_Distribution_Role.Offer>, Role.Key>;
  ApproveDistributorRequest: damlTypes.Choice<Role, ApproveDistributorRequest, damlTypes.ContractId<Marketplace_Distribution_Role.Role>, Role.Key>;
  OfferClearingRole: damlTypes.Choice<Role, OfferClearingRole, damlTypes.ContractId<Marketplace_Clearing_Role.Offer>, Role.Key>;
  Archive: damlTypes.Choice<Role, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Role.Key>;
  ApproveClearingRequest: damlTypes.Choice<Role, ApproveClearingRequest, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Marketplace_Clearing_Role.Role>, damlTypes.ContractId<Marketplace_Clearing_Market_Service.Service>>, Role.Key>;
};

export declare namespace Role {
  export type Key = damlTypes.Party
  export type CreateEvent = damlLedger.CreateEvent<Role, Role.Key, typeof Role.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Role, typeof Role.templateId>
  export type Event = damlLedger.Event<Role, Role.Key, typeof Role.templateId>
  export type QueryResult = damlLedger.QueryResult<Role, Role.Key, typeof Role.templateId>
}


