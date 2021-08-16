// Generated from Marketplace/Issuance/AssetDescription.daml
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

import * as ContingentClaims_Claim_Serializable from '../../../ContingentClaims/Claim/Serializable/module';
import * as DA_Finance_Types from '../../../DA/Finance/Types/module';
import * as Marketplace_Issuance_CFI from '../../../Marketplace/Issuance/CFI/module';

export declare type LookupOrInsert = {
  claims: ContingentClaims_Claim_Serializable.Claim<damlTypes.Date, damlTypes.Numeric, DA_Finance_Types.Id>;
};

export declare const LookupOrInsert:
  damlTypes.Serializable<LookupOrInsert> & {
  }
;


export declare type Index = {
  assetLabel: string;
  descriptionSignatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
  versions: damlTypes.Map<ContingentClaims_Claim_Serializable.Claim<damlTypes.Date, damlTypes.Numeric, DA_Finance_Types.Id>, damlTypes.Int>;
};

export declare const Index:
  damlTypes.Template<Index, Index.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.AssetDescription:Index'> & {
  Archive: damlTypes.Choice<Index, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Index.Key>;
  LookupOrInsert: damlTypes.Choice<Index, LookupOrInsert, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Index>, damlTypes.Int>, Index.Key>;
};

export declare namespace Index {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>, string>
  export type CreateEvent = damlLedger.CreateEvent<Index, Index.Key, typeof Index.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Index, typeof Index.templateId>
  export type Event = damlLedger.Event<Index, Index.Key, typeof Index.templateId>
  export type QueryResult = damlLedger.QueryResult<Index, Index.Key, typeof Index.templateId>
}



export declare type Multipliers = {
  party: damlTypes.Party;
};

export declare const Multipliers:
  damlTypes.Serializable<Multipliers> & {
  }
;


export declare type Underlying = {
  party: damlTypes.Party;
};

export declare const Underlying:
  damlTypes.Serializable<Underlying> & {
  }
;


export declare type Expiry = {
  party: damlTypes.Party;
};

export declare const Expiry:
  damlTypes.Serializable<Expiry> & {
  }
;


export declare type AssetDescription = {
  assetId: DA_Finance_Types.Id;
  description: string;
  cfi: Marketplace_Issuance_CFI.CFI;
  issuer: damlTypes.Party;
  claims: ContingentClaims_Claim_Serializable.Claim<damlTypes.Date, damlTypes.Numeric, DA_Finance_Types.Id>;
  safekeepingAccount: DA_Finance_Types.Account;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const AssetDescription:
  damlTypes.Template<AssetDescription, AssetDescription.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.AssetDescription:AssetDescription'> & {
  Archive: damlTypes.Choice<AssetDescription, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, AssetDescription.Key>;
  Expiry: damlTypes.Choice<AssetDescription, Expiry, damlTypes.Optional<damlTypes.Date>, AssetDescription.Key>;
  Underlying: damlTypes.Choice<AssetDescription, Underlying, DA_Finance_Types.Id[], AssetDescription.Key>;
  Multipliers: damlTypes.Choice<AssetDescription, Multipliers, damlTypes.Numeric[], AssetDescription.Key>;
};

export declare namespace AssetDescription {
  export type Key = DA_Finance_Types.Id
  export type CreateEvent = damlLedger.CreateEvent<AssetDescription, AssetDescription.Key, typeof AssetDescription.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AssetDescription, typeof AssetDescription.templateId>
  export type Event = damlLedger.Event<AssetDescription, AssetDescription.Key, typeof AssetDescription.templateId>
  export type QueryResult = damlLedger.QueryResult<AssetDescription, AssetDescription.Key, typeof AssetDescription.templateId>
}


