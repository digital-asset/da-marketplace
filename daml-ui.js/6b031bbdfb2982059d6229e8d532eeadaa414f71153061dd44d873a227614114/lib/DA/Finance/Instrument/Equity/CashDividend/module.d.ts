// Generated from DA/Finance/Instrument/Equity/CashDividend.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Types from '../../../../../DA/Finance/Types/module';

export declare type EquityCashDividend_SetObservers = {
  newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const EquityCashDividend_SetObservers:
  damlTypes.Serializable<EquityCashDividend_SetObservers> & {
  }
;


export declare type EquityCashDividend = {
  id: DA_Finance_Types.Id;
  exDate: damlTypes.Date;
  settlementDate: damlTypes.Date;
  perShare: damlTypes.Numeric;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const EquityCashDividend:
  damlTypes.Template<EquityCashDividend, EquityCashDividend.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Equity.CashDividend:EquityCashDividend'> & {
  Archive: damlTypes.Choice<EquityCashDividend, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, EquityCashDividend.Key>;
  EquityCashDividend_SetObservers: damlTypes.Choice<EquityCashDividend, EquityCashDividend_SetObservers, damlTypes.ContractId<EquityCashDividend>, EquityCashDividend.Key>;
};

export declare namespace EquityCashDividend {
  export type Key = DA_Finance_Types.Id
  export type CreateEvent = damlLedger.CreateEvent<EquityCashDividend, EquityCashDividend.Key, typeof EquityCashDividend.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<EquityCashDividend, typeof EquityCashDividend.templateId>
  export type Event = damlLedger.Event<EquityCashDividend, EquityCashDividend.Key, typeof EquityCashDividend.templateId>
  export type QueryResult = damlLedger.QueryResult<EquityCashDividend, EquityCashDividend.Key, typeof EquityCashDividend.templateId>
}


