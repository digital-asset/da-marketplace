// Generated from DA/Finance/Trade/Dvp.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657 from '@daml.js/97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Trade_Types from '../../../../DA/Finance/Trade/Types/module';
import * as DA_Finance_Types from '../../../../DA/Finance/Types/module';

export declare type Dvp = {
  masterAgreement: DA_Finance_Types.MasterAgreement;
  tradeId: DA_Finance_Types.Id;
  buyer: damlTypes.Party;
  status: DA_Finance_Trade_Types.SettlementStatus;
  settlementDate: damlTypes.Optional<damlTypes.Date>;
  payments: DA_Finance_Types.Asset[];
  deliveries: DA_Finance_Types.Asset[];
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Dvp:
  damlTypes.Template<Dvp, Dvp.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Trade.Dvp:Dvp'> & {
  Archive: damlTypes.Choice<Dvp, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Dvp.Key>;
};

export declare namespace Dvp {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<DA_Finance_Types.Id, DA_Finance_Types.Id>
  export type CreateEvent = damlLedger.CreateEvent<Dvp, Dvp.Key, typeof Dvp.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Dvp, typeof Dvp.templateId>
  export type Event = damlLedger.Event<Dvp, Dvp.Key, typeof Dvp.templateId>
  export type QueryResult = damlLedger.QueryResult<Dvp, Dvp.Key, typeof Dvp.templateId>
}


