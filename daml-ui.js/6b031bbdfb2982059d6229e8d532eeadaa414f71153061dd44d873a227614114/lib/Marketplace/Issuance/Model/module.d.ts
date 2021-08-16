// Generated from Marketplace/Issuance/Model.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Types from '../../../DA/Finance/Types/module';

export declare type Issuance = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  issuanceId: string;
  assetId: DA_Finance_Types.Id;
  accountId: DA_Finance_Types.Id;
  quantity: damlTypes.Numeric;
};

export declare const Issuance:
  damlTypes.Template<Issuance, Issuance.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Issuance.Model:Issuance'> & {
  Archive: damlTypes.Choice<Issuance, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Issuance.Key>;
};

export declare namespace Issuance {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<Issuance, Issuance.Key, typeof Issuance.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Issuance, typeof Issuance.templateId>
  export type Event = damlLedger.Event<Issuance, Issuance.Key, typeof Issuance.templateId>
  export type QueryResult = damlLedger.QueryResult<Issuance, Issuance.Key, typeof Issuance.templateId>
}


