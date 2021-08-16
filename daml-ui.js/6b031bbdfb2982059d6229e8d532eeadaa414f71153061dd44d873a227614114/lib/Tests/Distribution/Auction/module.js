"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');
/* eslint-disable-next-line no-unused-vars */
var damlLedger = require('@daml/ledger');

var Common = require('../../../Common/module');
var DA_Finance_Asset = require('../../../DA/Finance/Asset/module');
var Marketplace_Distribution_Auction_Model = require('../../../Marketplace/Distribution/Auction/Model/module');
var Marketplace_Distribution_Auction_Service = require('../../../Marketplace/Distribution/Auction/Service/module');
var Marketplace_Distribution_Bidding_Model = require('../../../Marketplace/Distribution/Bidding/Model/module');


exports.Fixture = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({bank: damlTypes.Party.decoder, issuer: Common.Customer.decoder, alice: Common.Customer.decoder, bob: Common.Customer.decoder, charlie: Common.Customer.decoder, dave: Common.Customer.decoder, aliceDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, bobDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, charlieDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, daveDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).decoder, aliceAuctionCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).decoder, bobAuctionCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).decoder, charlieAuctionCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).decoder, daveAuctionCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).decoder, auctionServiceCid: damlTypes.ContractId(Marketplace_Distribution_Auction_Service.Service).decoder, auctionCid: damlTypes.ContractId(Marketplace_Distribution_Auction_Model.Auction).decoder, originalDeposits: damlTypes.List(DA_Finance_Asset.AssetDeposit).decoder, }); }),
  encode: function (__typed__) {
  return {
    bank: damlTypes.Party.encode(__typed__.bank),
    issuer: Common.Customer.encode(__typed__.issuer),
    alice: Common.Customer.encode(__typed__.alice),
    bob: Common.Customer.encode(__typed__.bob),
    charlie: Common.Customer.encode(__typed__.charlie),
    dave: Common.Customer.encode(__typed__.dave),
    aliceDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.aliceDepositCid),
    bobDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.bobDepositCid),
    charlieDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.charlieDepositCid),
    daveDepositCid: damlTypes.ContractId(DA_Finance_Asset.AssetDeposit).encode(__typed__.daveDepositCid),
    aliceAuctionCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).encode(__typed__.aliceAuctionCid),
    bobAuctionCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).encode(__typed__.bobAuctionCid),
    charlieAuctionCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).encode(__typed__.charlieAuctionCid),
    daveAuctionCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Model.Auction).encode(__typed__.daveAuctionCid),
    auctionServiceCid: damlTypes.ContractId(Marketplace_Distribution_Auction_Service.Service).encode(__typed__.auctionServiceCid),
    auctionCid: damlTypes.ContractId(Marketplace_Distribution_Auction_Model.Auction).encode(__typed__.auctionCid),
    originalDeposits: damlTypes.List(DA_Finance_Asset.AssetDeposit).encode(__typed__.originalDeposits),
  };
}
,
};

