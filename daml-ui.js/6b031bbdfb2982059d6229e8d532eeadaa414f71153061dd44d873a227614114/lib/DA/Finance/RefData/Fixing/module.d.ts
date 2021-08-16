// Generated from DA/Finance/RefData/Fixing.daml
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

import * as DA_Finance_Types from '../../../../DA/Finance/Types/module';

export declare type Fixing = {
  id: DA_Finance_Types.Id;
  currency: DA_Finance_Types.Id;
  date: damlTypes.Date;
  value: damlTypes.Numeric;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Fixing:
  damlTypes.Template<Fixing, Fixing.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.RefData.Fixing:Fixing'> & {
  Archive: damlTypes.Choice<Fixing, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Fixing.Key>;
};

export declare namespace Fixing {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<DA_Finance_Types.Id, damlTypes.Date>
  export type CreateEvent = damlLedger.CreateEvent<Fixing, Fixing.Key, typeof Fixing.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Fixing, typeof Fixing.templateId>
  export type Event = damlLedger.Event<Fixing, Fixing.Key, typeof Fixing.templateId>
  export type QueryResult = damlLedger.QueryResult<Fixing, Fixing.Key, typeof Fixing.templateId>
}


