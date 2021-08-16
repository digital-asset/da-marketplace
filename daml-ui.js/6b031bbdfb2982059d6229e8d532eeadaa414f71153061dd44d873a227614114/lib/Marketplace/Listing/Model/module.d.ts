// Generated from Marketplace/Listing/Model.daml
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

import * as DA_Finance_Types from '../../../DA/Finance/Types/module';

export declare type ClearedListingApproval = {
  provider: damlTypes.Party;
  clearinghouse: damlTypes.Party;
  symbol: string;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const ClearedListingApproval:
  damlTypes.Template<ClearedListingApproval, ClearedListingApproval.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Model:ClearedListingApproval'> & {
  Archive: damlTypes.Choice<ClearedListingApproval, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, ClearedListingApproval.Key>;
};

export declare namespace ClearedListingApproval {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<ClearedListingApproval, ClearedListingApproval.Key, typeof ClearedListingApproval.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ClearedListingApproval, typeof ClearedListingApproval.templateId>
  export type Event = damlLedger.Event<ClearedListingApproval, ClearedListingApproval.Key, typeof ClearedListingApproval.templateId>
  export type QueryResult = damlLedger.QueryResult<ClearedListingApproval, ClearedListingApproval.Key, typeof ClearedListingApproval.templateId>
}



export declare type Listing = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  listingType: ListingType;
  listingId: string;
  calendarId: string;
  description: string;
  tradedAssetId: DA_Finance_Types.Id;
  quotedAssetId: DA_Finance_Types.Id;
  tradedAssetPrecision: damlTypes.Int;
  quotedAssetPrecision: damlTypes.Int;
  minimumTradableQuantity: damlTypes.Numeric;
  maximumTradableQuantity: damlTypes.Numeric;
  providerId: string;
  status: Status;
  observers: pkg97b883cd8a2b7f49f90d5d39c981cf6e110cf1f1c64427a28a6d58ec88c43657.DA.Set.Types.Set<damlTypes.Party>;
};

export declare const Listing:
  damlTypes.Template<Listing, Listing.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Listing.Model:Listing'> & {
  Archive: damlTypes.Choice<Listing, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Listing.Key>;
};

export declare namespace Listing {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<Listing, Listing.Key, typeof Listing.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Listing, typeof Listing.templateId>
  export type Event = damlLedger.Event<Listing, Listing.Key, typeof Listing.templateId>
  export type QueryResult = damlLedger.QueryResult<Listing, Listing.Key, typeof Listing.templateId>
}



export declare type ListingType =
  |  { tag: 'Cleared'; value: ListingType.Cleared }
  |  { tag: 'Collateralized'; value: {} }
;

export declare const ListingType:
  damlTypes.Serializable<ListingType> & {
  Cleared: damlTypes.Serializable<ListingType.Cleared>;
  }
;


export namespace ListingType {
  type Cleared = {
    clearinghouse: damlTypes.Party;
    approvalCid: damlTypes.ContractId<ClearedListingApproval>;
  };
} //namespace ListingType


export declare type Status =
  | 'Active'
  | 'Disabled'
;

export declare const Status:
  damlTypes.Serializable<Status> & {
  }
& { readonly keys: Status[] } & { readonly [e in Status]: e }
;

