[← back](../README.md)

# User Guide

## Initial party & relationship setup

1. Deploy DIT to a new ledger on Daml Hub
2. Create the following parties:
   - `UserAdmin`
   - `Bank`
   - `Ccp`
   - `Issuer`
   - `Exchange`
   - `Alice`
   - `Bob`
3. Download `parties.json`
4. Open deployed UI → Quick Setup
5. Upload `parties.json` and click Next
6. Wait for all auto-approve triggers for all parties to deploy...
7. Assign roles to specific parties:
    - Exchange: Pick party `Exchange`
      - Market Clearing Service Contract (optional): `CCp` as provider
    - Bank: Pick party `Bank`
    - Clearing House: Pick party `Ccp`
        - Clearing House Role Contract: `Bank` as the custodian and `Clearing-Bank` for the clearing account
    - Investor: Pick parties `Alice` and `Bob`
        - Custody Service Contract: `Bank` as provider
        - Trading Service Contract: `Exchange` as provider, `Bank` as custodian and enter `Exchange-TradingAccount` for the trading account
        - Bidding Service Contract: `Bank` as provider and custodian, and enter `Bidding-TradingAccount` for the trading account
        - Clearing Service Contract (optional): `Ccp` as provider, `Bank` as custodian and enter `Clearing-ClearingAccount` for clearing account
    - Issuer: Pick party `Issuer`
        - Issuance Service Contract: `Bank` as provider and custodian, and enter `Issuance-optSafekeepingAccount` for the safekeeping account
        - Auction Service Contract: `Bank` as provider and custodian, enter `Auction-TradingAccount` for the trading account and enter `Auction-ReceivableAccount` for the  receivable account
        - Custody Service Contract: `Bank` as provider

## Issuing new assets

1. Login as `Issuer`
2. `Issuer`: go to Setup and create a base instrument for USD
    - **Account** : Issuer-Bank-MainAuctionAccount
3. `Issuer`: go to Setup and create a base instrument for BTC
    - **Account** : Issuer-Bank-MainAuctionAccount
4. `Issuer`: go to Setup and create an issuance of USD
    - **Issuance ID**: `iss1`
    - **Account** : Issuer-Bank-MainAuctionAccount
    - **Quantity**: `1000`
5. `Issuer`: go to Setup and create an issuance of BTC
    - **Issuance ID**: `iss2`
    - **Account** : Issuer-Bank-MainAuctionAccount
    - **Quantity**: `1000`

## Primary distribution

Auctioning off assets

1. `Issuer`: go to Setup and create a new auction
    - **Auctioned Asset** : `BTC`
    - **Quoted Asset** : `USD`
    - **Quantity** : `500`
    - **Floor Price** : `300`
    - **Auction ID** : `auc1`
2. Login as `Alice`
3. Go to "Wallet" and click on Alice-Bank-BiddingAccount
4. `Alice`: Deposit 5000 US Dollars to account
5. Login as `Bank`
6. `Bank`: Go to Auctions, click on the auction opened by the Issuer, and Request Bid from `Alice`
7. Login as `Alice`
8. `Alice`: Go to Bidding Auctions, click on the auction, and submit a Bid
    - **Quantity**: `2`
    - **Price**: `500`
    - **Publish Bid**: ✅
9. Login as `Bank`
10. Go to auction, click `Close Auction`

## Secondary distribution

Setting up tradeable, collateralized markets

1. Login as `Exchange`
2. On "Setup" page, click "Setup Automations"
    - If you are planning to use Exberry, deploy the Exberry Adapter and set up the integration in the console.
    - If you are not planning to use Exberry, deploy the `Matching Engine trigger`
3. `Exchange`: Go to Setup, Create New Listing
    - **Traded Asset** : `BTC`
    - **Traded Asset Precision**: `6`
    - **Quoted Asset** : `USD`
    - **Quoted Asset Precision**: `2`
    - **Minimum Tradable Quantity**: `1`
    - **Maximum Tradable Quantity**: `10000`
    - **Symbol**: `BTCUSD`
    - **Description**: `Bitcoin vs USD`
    - **Cleared by**: `-- Collateralized Market --`
4. Login as `Alice`
5. `Alice`: Go to Wallet, click on row for `Alice-Exchange-ExchangeTradingAccount`
6. `Alice`: Deposit 1000 USD
7. `Alice`: Go to BTCUSD Market, place an order
    - **Buy**
    - **Limit**
    - **Time in Force** : `Good Till Cancelled`
    - **Price** : `500`
    - **Quantity** : `2`
8. Login as `Bob`
9. `Bob`: Go to Wallet, click on row for `Bob-Exchange-ExchangeTradingAccount`, Deposit 500 BTC
10. `Bob`: Go to BTCUSD Market, place an order (to partially match `Alice`'s Buy)
    - **Sell**
    - **Limit**
    - **Time in Force** : `Good Till Cancelled`
    - **Price** : `500`
    - **Quantity** : `1.0`

## Setup Clearinghouse
1. Login as `Ccp`
2. `Ccp`: Go to Manage/Clearing and "Accept" Clearing Role
    - **Clearing Account**: `Clearing-Bank`
3. Login as `Alice`
4. `Alice`: Go to Wallet, click on row for `Alice-Ccp-ClearingAccount`, Deposit 10,000 USD
5. Login as `Bob`
6. `Bob`: Go to Wallet, click on row for `Bob-Ccp-ClearingAccount`, Deposit 10,000 USD

### Test Margin Calls
Perform successful margin call for Alice

1. Login as `Ccp`
2. `Ccp`: on `Members` page, click "Perform Margin Call":
    - **Customer**: `Alice`
    - **Amount**: 5000

Fail and retry a margin calculation for `Bob`

1. `Ccp`: on `Members` page, click "Perform Margin Call":
    - **Customer** : `Bob`
    - **Amount** : 12000
2. Login as `Bob`
3. `Bob`: Go to Wallet, click on row for `ClearingBob-Bank`, Deposit 5000 USD
4. `Bob`: Go to Clearing page, click "Retry" on failed Margin Call


### Test Mark to Market
Transfer funds from Alice to Bob via central countrerparty.

1. `Ccp`: on `Members` page, click "Perform Mark to Market":
    - **Customer**: `Alice`
    - **Amount**: 5000
2. `Ccp`: on `Members` page, click "Perform Mark to Market":
    - **Customer** : `Bob`
    - **Amount** : -5000

## Cleared Secondary Market
Setting up tradeable, cleared markets

1. Login as `Exchange`
2. `Exchange`: Go to Setup, Create New Listing
    - **Traded Asset** : `BTC`
    - **Traded Asset Precision**: `6`
    - **Quoted Asset** : `USD`
    - **Quoted Asset Precision**: `2`
    - **Minimum Tradable Quantity**: `1`
    - **Maximum Tradable Quantity**: `10000`
    - **Symbol**: `BTCUSD-CLR`
    - **Description**: `Cleared Bitcoin vs USD`
    - **Cleared by**: `CCP`
3. Login as `Alice`
4. `Alice`: Go to BTCUSD-CLR Market, place an order
    - **Buy**
    - **Limit**
    - **Time in Force** : `Good Till Cancelled`
    - **Price** : `500`
    - **Quantity** : `2`
5. Login as `Bob`
6. `Bob`: Go to BTCUSD-CLR Market, place an order (to partially match `Alice`'s Buy)
    - **Sell**
    - **Market**
    - **Time in Force** : `Good Till Cancelled`
    - **Quantity** : `1.0`
7. Login as `Ccp`
8. On Manage/Clearing, click "Request FV" next to Exchange's Market.Clearing role
    - **Currency** : USD

# Read More

- [Build &amp; deploy source code to Daml Hub](./damlhub_deployment.md)
- [Set up a local development environment](./local_development.md)
