// Generated from Marketplace/Settlement/Model.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Asset from '../../../DA/Finance/Asset/module';
import * as DA_Finance_Types from '../../../DA/Finance/Types/module';

export declare type Settle = {
};

export declare const Settle:
  damlTypes.Serializable<Settle> & {
  }
;


export declare type SettlementInstruction = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  details: SettlementDetails[];
};

export declare const SettlementInstruction:
  damlTypes.Template<SettlementInstruction, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Settlement.Model:SettlementInstruction'> & {
  Archive: damlTypes.Choice<SettlementInstruction, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
  Settle: damlTypes.Choice<SettlementInstruction, Settle, damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[], undefined>;
};

export declare namespace SettlementInstruction {
  export type CreateEvent = damlLedger.CreateEvent<SettlementInstruction, undefined, typeof SettlementInstruction.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<SettlementInstruction, typeof SettlementInstruction.templateId>
  export type Event = damlLedger.Event<SettlementInstruction, undefined, typeof SettlementInstruction.templateId>
  export type QueryResult = damlLedger.QueryResult<SettlementInstruction, undefined, typeof SettlementInstruction.templateId>
}



export declare type SettlementDetails = {
  senderAccount: DA_Finance_Types.Account;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  receiverAccount: DA_Finance_Types.Account;
};

export declare const SettlementDetails:
  damlTypes.Serializable<SettlementDetails> & {
  }
;

