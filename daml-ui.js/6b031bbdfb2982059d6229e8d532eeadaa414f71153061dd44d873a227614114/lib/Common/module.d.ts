// Generated from Common.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as DA_Finance_Types from '../DA/Finance/Types/module';
import * as Marketplace_Clearing_Role from '../Marketplace/Clearing/Role/module';
import * as Marketplace_Clearing_Service from '../Marketplace/Clearing/Service/module';
import * as Marketplace_Custody_Role from '../Marketplace/Custody/Role/module';
import * as Marketplace_Custody_Service from '../Marketplace/Custody/Service/module';
import * as Marketplace_Distribution_Bidding_Service from '../Marketplace/Distribution/Bidding/Service/module';
import * as Marketplace_Distribution_Role from '../Marketplace/Distribution/Role/module';
import * as Marketplace_Issuance_Service from '../Marketplace/Issuance/Service/module';
import * as Marketplace_Listing_Service from '../Marketplace/Listing/Service/module';
import * as Marketplace_Operator_Role from '../Marketplace/Operator/Role/module';
import * as Marketplace_Trading_Matching_Service from '../Marketplace/Trading/Matching/Service/module';
import * as Marketplace_Trading_Role from '../Marketplace/Trading/Role/module';
import * as Marketplace_Trading_Service from '../Marketplace/Trading/Service/module';

export declare type Customer = {
  customer: damlTypes.Party;
  tradingServiceCid: damlTypes.ContractId<Marketplace_Trading_Service.Service>;
  listingServiceCid: damlTypes.ContractId<Marketplace_Listing_Service.Service>;
  issuanceServiceCid: damlTypes.ContractId<Marketplace_Issuance_Service.Service>;
  clearingServiceCid: damlTypes.ContractId<Marketplace_Clearing_Service.Service>;
  custodyServiceCid: damlTypes.ContractId<Marketplace_Custody_Service.Service>;
  biddingServiceCid: damlTypes.ContractId<Marketplace_Distribution_Bidding_Service.Service>;
  mainAccount: DA_Finance_Types.Account;
  exchangeLockedAccount: DA_Finance_Types.Account;
  auctionLockedAccount: DA_Finance_Types.Account;
  clearingAccount: DA_Finance_Types.Account;
  marginAccount: DA_Finance_Types.Account;
};

export declare const Customer:
  damlTypes.Serializable<Customer> & {
  }
;


export declare type Providers = {
  operator: damlTypes.Party;
  bank: damlTypes.Party;
  exchange: damlTypes.Party;
  clearinghouse: damlTypes.Party;
  public: damlTypes.Party;
  operatorRoleCid: damlTypes.ContractId<Marketplace_Operator_Role.Role>;
  clearingRoleCid: damlTypes.ContractId<Marketplace_Clearing_Role.Role>;
  custodianRoleCid: damlTypes.ContractId<Marketplace_Custody_Role.Role>;
  exchangeRoleCid: damlTypes.ContractId<Marketplace_Trading_Role.Role>;
  matchingServiceCid: damlTypes.ContractId<Marketplace_Trading_Matching_Service.Service>;
  distributorRoleCid: damlTypes.ContractId<Marketplace_Distribution_Role.Role>;
};

export declare const Providers:
  damlTypes.Serializable<Providers> & {
  }
;


export declare type Assets = {
  usd: DA_Finance_Types.Asset;
  eur: DA_Finance_Types.Asset;
  tsla: DA_Finance_Types.Asset;
  nflx: DA_Finance_Types.Asset;
  libor: DA_Finance_Types.Asset;
};

export declare const Assets:
  damlTypes.Serializable<Assets> & {
  }
;

