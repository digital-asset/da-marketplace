// Generated from DA/Finance/Instrument/FX/Currency.daml
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

export declare type EquityStock_SetObservers = {
  newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const EquityStock_SetObservers:
  damlTypes.Serializable<EquityStock_SetObservers> & {
  }
;


export declare type Currency = {
  id: DA_Finance_Types.Id;
  isoCode: string;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Currency:
  damlTypes.Template<Currency, Currency.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.FX.Currency:Currency'> & {
  Archive: damlTypes.Choice<Currency, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Currency.Key>;
  EquityStock_SetObservers: damlTypes.Choice<Currency, EquityStock_SetObservers, damlTypes.ContractId<Currency>, Currency.Key>;
};

export declare namespace Currency {
  export type Key = DA_Finance_Types.Id
  export type CreateEvent = damlLedger.CreateEvent<Currency, Currency.Key, typeof Currency.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Currency, typeof Currency.templateId>
  export type Event = damlLedger.Event<Currency, Currency.Key, typeof Currency.templateId>
  export type QueryResult = damlLedger.QueryResult<Currency, Currency.Key, typeof Currency.templateId>
}


