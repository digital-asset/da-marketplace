// Generated from DA/Finance/Trade/Dvp/Lifecycle.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Asset_Lifecycle from '../../../../../DA/Finance/Asset/Lifecycle/module';
import * as DA_Finance_Trade_Dvp from '../../../../../DA/Finance/Trade/Dvp/module';
import * as DA_Finance_Types from '../../../../../DA/Finance/Types/module';

export declare type DvpLifecycle_Process = {
  dvpCid: damlTypes.ContractId<DA_Finance_Trade_Dvp.Dvp>;
  lifecycleEffectsCid: damlTypes.ContractId<DA_Finance_Asset_Lifecycle.LifecycleEffects>;
  ctrl: damlTypes.Party;
};

export declare const DvpLifecycle_Process:
  damlTypes.Serializable<DvpLifecycle_Process> & {
  }
;


export declare type DvpLifecycleRule = {
  masterAgreement: DA_Finance_Types.MasterAgreement;
};

export declare const DvpLifecycleRule:
  damlTypes.Template<DvpLifecycleRule, DvpLifecycleRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Trade.Dvp.Lifecycle:DvpLifecycleRule'> & {
  DvpLifecycle_Process: damlTypes.Choice<DvpLifecycleRule, DvpLifecycle_Process, damlTypes.ContractId<DA_Finance_Trade_Dvp.Dvp>, DvpLifecycleRule.Key>;
  Archive: damlTypes.Choice<DvpLifecycleRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, DvpLifecycleRule.Key>;
};

export declare namespace DvpLifecycleRule {
  export type Key = DA_Finance_Types.Id
  export type CreateEvent = damlLedger.CreateEvent<DvpLifecycleRule, DvpLifecycleRule.Key, typeof DvpLifecycleRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<DvpLifecycleRule, typeof DvpLifecycleRule.templateId>
  export type Event = damlLedger.Event<DvpLifecycleRule, DvpLifecycleRule.Key, typeof DvpLifecycleRule.templateId>
  export type QueryResult = damlLedger.QueryResult<DvpLifecycleRule, DvpLifecycleRule.Key, typeof DvpLifecycleRule.templateId>
}


