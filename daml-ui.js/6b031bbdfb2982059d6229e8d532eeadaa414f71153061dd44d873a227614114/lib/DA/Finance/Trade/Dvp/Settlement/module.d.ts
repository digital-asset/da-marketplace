// Generated from DA/Finance/Trade/Dvp/Settlement.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Asset from '../../../../../DA/Finance/Asset/module';
import * as DA_Finance_Trade_Dvp from '../../../../../DA/Finance/Trade/Dvp/module';
import * as DA_Finance_Trade_SettlementInstruction from '../../../../../DA/Finance/Trade/SettlementInstruction/module';
import * as DA_Finance_Types from '../../../../../DA/Finance/Types/module';

export declare type DvpSettlement_Process = {
  dvpCid: damlTypes.ContractId<DA_Finance_Trade_Dvp.Dvp>;
  paymentInstructionCids: damlTypes.ContractId<DA_Finance_Trade_SettlementInstruction.SettlementInstruction>[];
  deliveryInstructionCids: damlTypes.ContractId<DA_Finance_Trade_SettlementInstruction.SettlementInstruction>[];
  ctrl: damlTypes.Party;
};

export declare const DvpSettlement_Process:
  damlTypes.Serializable<DvpSettlement_Process> & {
  }
;


export declare type DvpSettlementRule = {
  masterAgreement: DA_Finance_Types.MasterAgreement;
};

export declare const DvpSettlementRule:
  damlTypes.Template<DvpSettlementRule, DvpSettlementRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Trade.Dvp.Settlement:DvpSettlementRule'> & {
  DvpSettlement_Process: damlTypes.Choice<DvpSettlementRule, DvpSettlement_Process, DvpSettlement_Process_Result, DvpSettlementRule.Key>;
  Archive: damlTypes.Choice<DvpSettlementRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, DvpSettlementRule.Key>;
};

export declare namespace DvpSettlementRule {
  export type Key = DA_Finance_Types.Id
  export type CreateEvent = damlLedger.CreateEvent<DvpSettlementRule, DvpSettlementRule.Key, typeof DvpSettlementRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<DvpSettlementRule, typeof DvpSettlementRule.templateId>
  export type Event = damlLedger.Event<DvpSettlementRule, DvpSettlementRule.Key, typeof DvpSettlementRule.templateId>
  export type QueryResult = damlLedger.QueryResult<DvpSettlementRule, DvpSettlementRule.Key, typeof DvpSettlementRule.templateId>
}



export declare type DvpSettlement_Process_Result = {
  dvpCid: damlTypes.ContractId<DA_Finance_Trade_Dvp.Dvp>;
  paymentDepositCids: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[][];
  deliveryDepositCids: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>[][];
};

export declare const DvpSettlement_Process_Result:
  damlTypes.Serializable<DvpSettlement_Process_Result> & {
  }
;

