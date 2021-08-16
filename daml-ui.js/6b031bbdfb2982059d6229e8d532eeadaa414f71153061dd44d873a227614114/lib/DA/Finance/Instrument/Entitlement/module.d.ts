// Generated from DA/Finance/Instrument/Entitlement.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Asset_Lifecycle from '../../../../DA/Finance/Asset/Lifecycle/module';
import * as DA_Finance_Types from '../../../../DA/Finance/Types/module';

export declare type Entitlement_Lifecycle = {
};

export declare const Entitlement_Lifecycle:
  damlTypes.Serializable<Entitlement_Lifecycle> & {
  }
;


export declare type Entitlement_SetObservers = {
  newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Entitlement_SetObservers:
  damlTypes.Serializable<Entitlement_SetObservers> & {
  }
;


export declare type Entitlement = {
  id: DA_Finance_Types.Id;
  settlementDate: damlTypes.Date;
  underlying: DA_Finance_Types.Asset;
  payment: damlTypes.Optional<DA_Finance_Types.Asset>;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Entitlement:
  damlTypes.Template<Entitlement, Entitlement.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Entitlement:Entitlement'> & {
  Entitlement_SetObservers: damlTypes.Choice<Entitlement, Entitlement_SetObservers, damlTypes.ContractId<Entitlement>, Entitlement.Key>;
  Archive: damlTypes.Choice<Entitlement, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Entitlement.Key>;
  Entitlement_Lifecycle: damlTypes.Choice<Entitlement, Entitlement_Lifecycle, damlTypes.ContractId<DA_Finance_Asset_Lifecycle.LifecycleEffects>, Entitlement.Key>;
};

export declare namespace Entitlement {
  export type Key = DA_Finance_Types.Id
  export type CreateEvent = damlLedger.CreateEvent<Entitlement, Entitlement.Key, typeof Entitlement.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Entitlement, typeof Entitlement.templateId>
  export type Event = damlLedger.Event<Entitlement, Entitlement.Key, typeof Entitlement.templateId>
  export type QueryResult = damlLedger.QueryResult<Entitlement, Entitlement.Key, typeof Entitlement.templateId>
}


