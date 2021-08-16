// Generated from DA/Finance/Trade/Types.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

export declare type SettlementStatus =
  | 'SettlementStatus_Pending'
  | 'SettlementStatus_Instructed'
  | 'SettlementStatus_Settled'
;

export declare const SettlementStatus:
  damlTypes.Serializable<SettlementStatus> & {
  }
& { readonly keys: SettlementStatus[] } & { readonly [e in SettlementStatus]: e }
;

