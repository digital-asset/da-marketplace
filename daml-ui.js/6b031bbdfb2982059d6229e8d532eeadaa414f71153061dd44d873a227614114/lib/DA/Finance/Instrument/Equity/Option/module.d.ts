// Generated from DA/Finance/Instrument/Equity/Option.daml
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

export declare type EquityOption_SetObservers = {
  newObservers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const EquityOption_SetObservers:
  damlTypes.Serializable<EquityOption_SetObservers> & {
  }
;


export declare type EquityOption = {
  id: DA_Finance_Types.Id;
  underlyingId: DA_Finance_Types.Id;
  optionType: OptionType;
  exerciseType: ExerciseType;
  strike: damlTypes.Numeric;
  contractSize: damlTypes.Numeric;
  maturity: damlTypes.Date;
  settlementType: SettlementType;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const EquityOption:
  damlTypes.Template<EquityOption, EquityOption.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.Equity.Option:EquityOption'> & {
  Archive: damlTypes.Choice<EquityOption, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, EquityOption.Key>;
  EquityOption_SetObservers: damlTypes.Choice<EquityOption, EquityOption_SetObservers, damlTypes.ContractId<EquityOption>, EquityOption.Key>;
};

export declare namespace EquityOption {
  export type Key = DA_Finance_Types.Id
  export type CreateEvent = damlLedger.CreateEvent<EquityOption, EquityOption.Key, typeof EquityOption.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<EquityOption, typeof EquityOption.templateId>
  export type Event = damlLedger.Event<EquityOption, EquityOption.Key, typeof EquityOption.templateId>
  export type QueryResult = damlLedger.QueryResult<EquityOption, EquityOption.Key, typeof EquityOption.templateId>
}



export declare type SettlementType =
  | 'CASH'
  | 'PHYSICAL'
;

export declare const SettlementType:
  damlTypes.Serializable<SettlementType> & {
  }
& { readonly keys: SettlementType[] } & { readonly [e in SettlementType]: e }
;


export declare type ExerciseType =
  | 'EUROPEAN'
  | 'AMERICAN'
;

export declare const ExerciseType:
  damlTypes.Serializable<ExerciseType> & {
  }
& { readonly keys: ExerciseType[] } & { readonly [e in ExerciseType]: e }
;


export declare type OptionType =
  | 'PUT'
  | 'CALL'
;

export declare const OptionType:
  damlTypes.Serializable<OptionType> & {
  }
& { readonly keys: OptionType[] } & { readonly [e in OptionType]: e }
;

