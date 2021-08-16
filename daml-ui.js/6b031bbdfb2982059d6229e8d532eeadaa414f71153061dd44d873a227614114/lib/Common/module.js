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

var DA_Finance_Types = require('../DA/Finance/Types/module');
var Marketplace_Clearing_Role = require('../Marketplace/Clearing/Role/module');
var Marketplace_Clearing_Service = require('../Marketplace/Clearing/Service/module');
var Marketplace_Custody_Role = require('../Marketplace/Custody/Role/module');
var Marketplace_Custody_Service = require('../Marketplace/Custody/Service/module');
var Marketplace_Distribution_Bidding_Service = require('../Marketplace/Distribution/Bidding/Service/module');
var Marketplace_Distribution_Role = require('../Marketplace/Distribution/Role/module');
var Marketplace_Issuance_Service = require('../Marketplace/Issuance/Service/module');
var Marketplace_Listing_Service = require('../Marketplace/Listing/Service/module');
var Marketplace_Operator_Role = require('../Marketplace/Operator/Role/module');
var Marketplace_Trading_Matching_Service = require('../Marketplace/Trading/Matching/Service/module');
var Marketplace_Trading_Role = require('../Marketplace/Trading/Role/module');
var Marketplace_Trading_Service = require('../Marketplace/Trading/Service/module');


exports.Customer = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({customer: damlTypes.Party.decoder, tradingServiceCid: damlTypes.ContractId(Marketplace_Trading_Service.Service).decoder, listingServiceCid: damlTypes.ContractId(Marketplace_Listing_Service.Service).decoder, issuanceServiceCid: damlTypes.ContractId(Marketplace_Issuance_Service.Service).decoder, clearingServiceCid: damlTypes.ContractId(Marketplace_Clearing_Service.Service).decoder, custodyServiceCid: damlTypes.ContractId(Marketplace_Custody_Service.Service).decoder, biddingServiceCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Service.Service).decoder, mainAccount: DA_Finance_Types.Account.decoder, exchangeLockedAccount: DA_Finance_Types.Account.decoder, auctionLockedAccount: DA_Finance_Types.Account.decoder, clearingAccount: DA_Finance_Types.Account.decoder, marginAccount: DA_Finance_Types.Account.decoder, }); }),
  encode: function (__typed__) {
  return {
    customer: damlTypes.Party.encode(__typed__.customer),
    tradingServiceCid: damlTypes.ContractId(Marketplace_Trading_Service.Service).encode(__typed__.tradingServiceCid),
    listingServiceCid: damlTypes.ContractId(Marketplace_Listing_Service.Service).encode(__typed__.listingServiceCid),
    issuanceServiceCid: damlTypes.ContractId(Marketplace_Issuance_Service.Service).encode(__typed__.issuanceServiceCid),
    clearingServiceCid: damlTypes.ContractId(Marketplace_Clearing_Service.Service).encode(__typed__.clearingServiceCid),
    custodyServiceCid: damlTypes.ContractId(Marketplace_Custody_Service.Service).encode(__typed__.custodyServiceCid),
    biddingServiceCid: damlTypes.ContractId(Marketplace_Distribution_Bidding_Service.Service).encode(__typed__.biddingServiceCid),
    mainAccount: DA_Finance_Types.Account.encode(__typed__.mainAccount),
    exchangeLockedAccount: DA_Finance_Types.Account.encode(__typed__.exchangeLockedAccount),
    auctionLockedAccount: DA_Finance_Types.Account.encode(__typed__.auctionLockedAccount),
    clearingAccount: DA_Finance_Types.Account.encode(__typed__.clearingAccount),
    marginAccount: DA_Finance_Types.Account.encode(__typed__.marginAccount),
  };
}
,
};



exports.Providers = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, bank: damlTypes.Party.decoder, exchange: damlTypes.Party.decoder, clearinghouse: damlTypes.Party.decoder, public: damlTypes.Party.decoder, operatorRoleCid: damlTypes.ContractId(Marketplace_Operator_Role.Role).decoder, clearingRoleCid: damlTypes.ContractId(Marketplace_Clearing_Role.Role).decoder, custodianRoleCid: damlTypes.ContractId(Marketplace_Custody_Role.Role).decoder, exchangeRoleCid: damlTypes.ContractId(Marketplace_Trading_Role.Role).decoder, matchingServiceCid: damlTypes.ContractId(Marketplace_Trading_Matching_Service.Service).decoder, distributorRoleCid: damlTypes.ContractId(Marketplace_Distribution_Role.Role).decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    bank: damlTypes.Party.encode(__typed__.bank),
    exchange: damlTypes.Party.encode(__typed__.exchange),
    clearinghouse: damlTypes.Party.encode(__typed__.clearinghouse),
    public: damlTypes.Party.encode(__typed__.public),
    operatorRoleCid: damlTypes.ContractId(Marketplace_Operator_Role.Role).encode(__typed__.operatorRoleCid),
    clearingRoleCid: damlTypes.ContractId(Marketplace_Clearing_Role.Role).encode(__typed__.clearingRoleCid),
    custodianRoleCid: damlTypes.ContractId(Marketplace_Custody_Role.Role).encode(__typed__.custodianRoleCid),
    exchangeRoleCid: damlTypes.ContractId(Marketplace_Trading_Role.Role).encode(__typed__.exchangeRoleCid),
    matchingServiceCid: damlTypes.ContractId(Marketplace_Trading_Matching_Service.Service).encode(__typed__.matchingServiceCid),
    distributorRoleCid: damlTypes.ContractId(Marketplace_Distribution_Role.Role).encode(__typed__.distributorRoleCid),
  };
}
,
};



exports.Assets = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({usd: DA_Finance_Types.Asset.decoder, eur: DA_Finance_Types.Asset.decoder, tsla: DA_Finance_Types.Asset.decoder, nflx: DA_Finance_Types.Asset.decoder, libor: DA_Finance_Types.Asset.decoder, }); }),
  encode: function (__typed__) {
  return {
    usd: DA_Finance_Types.Asset.encode(__typed__.usd),
    eur: DA_Finance_Types.Asset.encode(__typed__.eur),
    tsla: DA_Finance_Types.Asset.encode(__typed__.tsla),
    nflx: DA_Finance_Types.Asset.encode(__typed__.nflx),
    libor: DA_Finance_Types.Asset.encode(__typed__.libor),
  };
}
,
};

