// Generated from Marketplace/Distribution/Bidding/Model.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as DA_Finance_Asset from '../../../../DA/Finance/Asset/module';
import * as DA_Finance_Types from '../../../../DA/Finance/Types/module';

export declare type UpdateStatus = {
  newStatus: Status;
};

export declare const UpdateStatus:
  damlTypes.Serializable<UpdateStatus> & {
  }
;


export declare type Bid = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  issuer: damlTypes.Party;
  auctionId: string;
  assetId: DA_Finance_Types.Id;
  details: Details;
  quotedAssetId: DA_Finance_Types.Id;
  tradingAccount: DA_Finance_Types.Account;
  allocationAccount: DA_Finance_Types.Account;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  allowPublishing: boolean;
  status: Status;
};

export declare const Bid:
  damlTypes.Template<Bid, Bid.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Bidding.Model:Bid'> & {
  Archive: damlTypes.Choice<Bid, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Bid.Key>;
  UpdateStatus: damlTypes.Choice<Bid, UpdateStatus, damlTypes.ContractId<Bid>, Bid.Key>;
};

export declare namespace Bid {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<Bid, Bid.Key, typeof Bid.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Bid, typeof Bid.templateId>
  export type Event = damlLedger.Event<Bid, Bid.Key, typeof Bid.templateId>
  export type QueryResult = damlLedger.QueryResult<Bid, Bid.Key, typeof Bid.templateId>
}



export declare type Status =
  |  { tag: 'Pending'; value: {} }
  |  { tag: 'FullAllocation'; value: Status.FullAllocation }
  |  { tag: 'PartialAllocation'; value: Status.PartialAllocation }
  |  { tag: 'NoAllocation'; value: {} }
  |  { tag: 'Invalid'; value: {} }
;

export declare const Status:
  damlTypes.Serializable<Status> & {
  FullAllocation: damlTypes.Serializable<Status.FullAllocation>;
  PartialAllocation: damlTypes.Serializable<Status.PartialAllocation>;
  }
;


export namespace Status {
  type FullAllocation = {
    price: damlTypes.Numeric;
  };
} //namespace Status


export namespace Status {
  type PartialAllocation = {
    price: damlTypes.Numeric;
    quantity: damlTypes.Numeric;
  };
} //namespace Status


export declare type Auction = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  issuer: damlTypes.Party;
  auctionId: string;
  asset: DA_Finance_Types.Asset;
  quotedAssetId: DA_Finance_Types.Id;
  publishedBids: PublishedBid[];
};

export declare const Auction:
  damlTypes.Template<Auction, undefined, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Bidding.Model:Auction'> & {
  Archive: damlTypes.Choice<Auction, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined>;
};

export declare namespace Auction {
  export type CreateEvent = damlLedger.CreateEvent<Auction, undefined, typeof Auction.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Auction, typeof Auction.templateId>
  export type Event = damlLedger.Event<Auction, undefined, typeof Auction.templateId>
  export type QueryResult = damlLedger.QueryResult<Auction, undefined, typeof Auction.templateId>
}



export declare type PublishedBid = {
  investor: damlTypes.Party;
  auctionId: string;
  quantity: damlTypes.Numeric;
};

export declare const PublishedBid:
  damlTypes.Serializable<PublishedBid> & {
  }
;


export declare type Details = {
  price: damlTypes.Numeric;
  quantity: damlTypes.Numeric;
  time: damlTypes.Time;
};

export declare const Details:
  damlTypes.Serializable<Details> & {
  }
;

