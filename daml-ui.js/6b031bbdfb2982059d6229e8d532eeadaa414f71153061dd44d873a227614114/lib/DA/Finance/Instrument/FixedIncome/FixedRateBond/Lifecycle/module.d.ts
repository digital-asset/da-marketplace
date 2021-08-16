// Generated from DA/Finance/Instrument/FixedIncome/FixedRateBond/Lifecycle.daml
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

import * as DA_Finance_Asset_Lifecycle from '../../../../../../DA/Finance/Asset/Lifecycle/module';
import * as DA_Finance_Instrument_FixedIncome_FixedRateBond from '../../../../../../DA/Finance/Instrument/FixedIncome/FixedRateBond/module';

export declare type BondCoupon_Lifecycle = {
  bondCid: damlTypes.ContractId<DA_Finance_Instrument_FixedIncome_FixedRateBond.FixedRateBond>;
};

export declare const BondCoupon_Lifecycle:
  damlTypes.Serializable<BondCoupon_Lifecycle> & {
  }
;


export declare type FixedRateBondCouponRule = {
  signatories: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const FixedRateBondCouponRule:
  damlTypes.Template<FixedRateBondCouponRule, FixedRateBondCouponRule.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:DA.Finance.Instrument.FixedIncome.FixedRateBond.Lifecycle:FixedRateBondCouponRule'> & {
  Archive: damlTypes.Choice<FixedRateBondCouponRule, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, FixedRateBondCouponRule.Key>;
  BondCoupon_Lifecycle: damlTypes.Choice<FixedRateBondCouponRule, BondCoupon_Lifecycle, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<DA_Finance_Instrument_FixedIncome_FixedRateBond.FixedRateBond>, damlTypes.ContractId<DA_Finance_Asset_Lifecycle.LifecycleEffects>>, FixedRateBondCouponRule.Key>;
};

export declare namespace FixedRateBondCouponRule {
  export type Key = pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<FixedRateBondCouponRule, FixedRateBondCouponRule.Key, typeof FixedRateBondCouponRule.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<FixedRateBondCouponRule, typeof FixedRateBondCouponRule.templateId>
  export type Event = damlLedger.Event<FixedRateBondCouponRule, FixedRateBondCouponRule.Key, typeof FixedRateBondCouponRule.templateId>
  export type QueryResult = damlLedger.QueryResult<FixedRateBondCouponRule, FixedRateBondCouponRule.Key, typeof FixedRateBondCouponRule.templateId>
}


