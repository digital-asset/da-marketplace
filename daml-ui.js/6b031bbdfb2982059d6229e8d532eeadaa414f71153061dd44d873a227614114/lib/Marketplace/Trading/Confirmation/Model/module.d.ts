// Generated from Marketplace/Trading/Confirmation/Model.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Types from '../../../../DA/Finance/Types/module';
import * as Marketplace_Settlement_Model from '../../../../Marketplace/Settlement/Model/module';
import * as Marketplace_Trading_Model from '../../../../Marketplace/Trading/Model/module';

export declare type Sign = {
  ctrl: damlTypes.Party;
  allocationAccount: DA_Finance_Types.Account;
  tradingAccount: DA_Finance_Types.Account;
};

export declare const Sign:
  damlTypes.Serializable<Sign> & {
  }
;


export declare type Process = {
  buyCid: damlTypes.ContractId<Marketplace_Trading_Model.Order>;
  sellCid: damlTypes.ContractId<Marketplace_Trading_Model.Order>;
};

export declare const Process:
  damlTypes.Serializable<Process> & {
  }
;


export declare type ProcessCleared = {
  buyCid: damlTypes.ContractId<Marketplace_Trading_Model.Order>;
  sellCid: damlTypes.ContractId<Marketplace_Trading_Model.Order>;
};

export declare const ProcessCleared:
  damlTypes.Serializable<ProcessCleared> & {
  }
;


export declare type Confirmation = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  buyer: damlTypes.Party;
  seller: damlTypes.Party;
  accounts: CustomerAccounts[];
  execution: Marketplace_Trading_Model.Execution;
  signed: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Confirmation:
  damlTypes.Template<Confirmation, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Trading.Confirmation.Model:Confirmation'> & {
  Process: damlTypes.Choice<Confirmation, Process, damlTypes.ContractId<Marketplace_Settlement_Model.SettlementInstruction>, undefined>;
  ProcessCleared: damlTypes.Choice<Confirmation, ProcessCleared, {}, undefined>;
  Sign: damlTypes.Choice<Confirmation, Sign, damlTypes.ContractId<Confirmation>, undefined>;
  Archive: damlTypes.Choice<Confirmation, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace Confirmation {
  export type CreateEvent = damlLedger.CreateEvent<Confirmation, undefined, typeof Confirmation.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Confirmation, typeof Confirmation.templateId>
  export type Event = damlLedger.Event<Confirmation, undefined, typeof Confirmation.templateId>
  export type QueryResult = damlLedger.QueryResult<Confirmation, undefined, typeof Confirmation.templateId>
}



export declare type CustomerAccounts = {
  customer: damlTypes.Party;
  allocationAccount: DA_Finance_Types.Account;
  tradingAccount: DA_Finance_Types.Account;
};

export declare const CustomerAccounts:
  damlTypes.Serializable<CustomerAccounts> & {
  }
;

