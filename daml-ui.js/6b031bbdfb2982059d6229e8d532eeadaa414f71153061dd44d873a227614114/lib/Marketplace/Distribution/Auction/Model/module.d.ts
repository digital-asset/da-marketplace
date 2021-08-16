// Generated from Marketplace/Distribution/Auction/Model.daml
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
import * as Marketplace_Distribution_Bidding_Model from '../../../../Marketplace/Distribution/Bidding/Model/module';

export declare type Auction = {
  operator: damlTypes.Party;
  provider: damlTypes.Party;
  customer: damlTypes.Party;
  auctionId: string;
  asset: DA_Finance_Types.Asset;
  quotedAssetId: DA_Finance_Types.Id;
  depositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  receivableAccount: DA_Finance_Types.Account;
  floorPrice: damlTypes.Numeric;
  status: Status;
};

export declare const Auction:
  damlTypes.Template<Auction, Auction.Key, '6b031bbdfb2982059d6229e8d532eeadaa414f71153061dd44d873a227614114:Marketplace.Distribution.Auction.Model:Auction'> & {
  Archive: damlTypes.Choice<Auction, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Auction.Key>;
};

export declare namespace Auction {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<Auction, Auction.Key, typeof Auction.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Auction, typeof Auction.templateId>
  export type Event = damlLedger.Event<Auction, Auction.Key, typeof Auction.templateId>
  export type QueryResult = damlLedger.QueryResult<Auction, Auction.Key, typeof Auction.templateId>
}



export declare type Status =
  |  { tag: 'Open'; value: {} }
  |  { tag: 'PartiallyAllocated'; value: Status.PartiallyAllocated }
  |  { tag: 'FullyAllocated'; value: Status.FullyAllocated }
  |  { tag: 'NoValidBids'; value: {} }
;

export declare const Status:
  damlTypes.Serializable<Status> & {
  PartiallyAllocated: damlTypes.Serializable<Status.PartiallyAllocated>;
  FullyAllocated: damlTypes.Serializable<Status.FullyAllocated>;
  }
;


export namespace Status {
  type PartiallyAllocated = {
    finalPrice: damlTypes.Numeric;
    remaining: damlTypes.Numeric;
  };
} //namespace Status


export namespace Status {
  type FullyAllocated = {
    finalPrice: damlTypes.Numeric;
  };
} //namespace Status


export declare type SettleAllocation = {
  allocation: Allocation;
  price: damlTypes.Numeric;
  issuer: damlTypes.Party;
  issuerReceivableAccount: DA_Finance_Types.Account;
};

export declare const SettleAllocation:
  damlTypes.Serializable<SettleAllocation> & {
  }
;


export declare type Allocation = {
  bid: Marketplace_Distribution_Bidding_Model.Bid;
  quantity: damlTypes.Numeric;
};

export declare const Allocation:
  damlTypes.Serializable<Allocation> & {
  }
;

