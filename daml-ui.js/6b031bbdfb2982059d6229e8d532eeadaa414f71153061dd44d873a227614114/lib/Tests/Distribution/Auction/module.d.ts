// Generated from Tests/Distribution/Auction.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as Common from '../../../Common/module';
import * as DA_Finance_Asset from '../../../DA/Finance/Asset/module';
import * as Marketplace_Distribution_Auction_Model from '../../../Marketplace/Distribution/Auction/Model/module';
import * as Marketplace_Distribution_Auction_Service from '../../../Marketplace/Distribution/Auction/Service/module';
import * as Marketplace_Distribution_Bidding_Model from '../../../Marketplace/Distribution/Bidding/Model/module';

export declare type Fixture = {
  bank: damlTypes.Party;
  issuer: Common.Customer;
  alice: Common.Customer;
  bob: Common.Customer;
  charlie: Common.Customer;
  dave: Common.Customer;
  aliceDepositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  bobDepositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  charlieDepositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  daveDepositCid: damlTypes.ContractId<DA_Finance_Asset.AssetDeposit>;
  aliceAuctionCid: damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Auction>;
  bobAuctionCid: damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Auction>;
  charlieAuctionCid: damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Auction>;
  daveAuctionCid: damlTypes.ContractId<Marketplace_Distribution_Bidding_Model.Auction>;
  auctionServiceCid: damlTypes.ContractId<Marketplace_Distribution_Auction_Service.Service>;
  auctionCid: damlTypes.ContractId<Marketplace_Distribution_Auction_Model.Auction>;
  originalDeposits: DA_Finance_Asset.AssetDeposit[];
};

export declare const Fixture:
  damlTypes.Serializable<Fixture> & {
  }
;

