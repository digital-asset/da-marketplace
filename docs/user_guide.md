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
5. Upload `parties.json`, refresh the page and click Next
6. Wait for all auto-approve triggers for all parties to deploy...
7. Drag and drop roles to specific parties: (then click Next)
    - Assign `Bank` the `Custody`, `Distribution`, and `Settlement` roles
    - Assign `Exchange` the `Exchange` role
    - Assign `Ccp` the `Clearing` role
8. Request services from specific parties: (then click Next)
    - As `Issuer` request `Custody`, `Issuance` services from `Bank`
    - As `Alice` request `Custody` services from `Bank`
    - As `Alice`, request `Trading` services from `Exchange` and `Clearing` services from `Ccp`, use `Bank` as custody provider
    - As `Bob` request `Custody` services from `Bank`
    - As `Bob`, request `Trading` services from `Exchange` and `Clearing` services from `Ccp`, use `Bank` as custody provider
    - As `Ccp` request `Custody` services from `Bank`
    - As `Exchange` request `MarketClearing` services from `Ccp`

## Issuing new assets

1. Login as `Issuer`
2. `Issuer`: go to Wallet and create a regular account
    - **Provider**: `Bank`
    - **Account Name** : `MainIssuer-Bank`
    - **Account Type** : `Regular`
3. `Issuer`: go to Wallet and create an allocation account
    - **Provider**: `Bank`
    - **Account Name** : `AllocIssuer-Bank`
    - **Account Type** : `Allocation`
    - **Nominee** : `Bank`
4. `Issuer`: go to Setup and create a base instrument for USD
    - **Account** : MainIssuer-Bank
5. `Issuer`: go to Setup and create a base instrument for BTC
    - **Account** : MainIssuer-Bank
6. `Issuer`: go to Setup and create an issuance of USD
    - **Issuance ID**: `iss1`
    - **Account** : MainIssuer-Bank
    - **Quantity**: `1000`
7. `Issuer`: go to Setup and create an issuance of BTC
    - **Issuance ID**: `iss2`
    - **Account** : MainIssuer-Bank
    - **Quantity**: `1000`

## Primary distribution

Auctioning off assets

1. `Issuer`: on Landing, request `Auction` service from the `Bank`
    - **Provider**: `Bank`
    - **Trading Account**: `MainIssuer-Bank`
    - **Allocation Account**: `AllocIssuer-Bank`
    - **Receivable Account**: `MainIssuer-Bank`
2. `Issuer`: go to Setup and create a new auction
    - **Auctioned Asset** : `BTC`
    - **Quoted Asset** : `USD`
    - **Quantity** : `500`
    - **Floor Price** : `300`
    - **Auction ID** : `auc1`
3. Login as `Alice`
4. `Alice`: Go to Wallet, create a regular account with `Bank`
    - **Provider**: `Bank`
    - **Account Name** : `MainAlice-Bank`
    - **Account Type** : `Regular`
    - **Observers** : `Exchange`
5. `Alice`: Click on newly created account row
6. `Alice`: Deposit 5000 US Dollars to account
7. `Alice`: Go to Wallet, create an allocation account
    - **Provider**: `Bank`
    - **Account Name** : `AllocAlice-Bank`
    - **Account Type** : `Allocation`
    - **Nominee** : `Bank`
8. `Alice`: Request `Bidding` service from `Bank`
    - **Trading Account**: `MainAlice-Bank`
    - **Allocation Account**: `AllocAlice-Bank`
9. Login as `Bank`
10. `Bank`: Go to Auctions, click on the auction opened by the Issuer, and Request Bid from `Alice`
11. Login as `Alice`
12. `Alice`: Go to Bidding Auctions, click on the auction, and submit a Bid
    - **Quantity**: `2`
    - **Price**: `500`
    - **Publish Bid**: ✅
13. Login as `Bank`
14. Go to auction, click `Close Auction`

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
5. `Alice`: Go to Wallet, click on row for `Alice-Exchange-trading`
6. `Alice`: Deposit 1000 USD into `Alice-Exchange-trading`
7. `Alice`: Go to BTCUSD Market, place an order
    - **Buy**
    - **Limit**
    - **Time in Force** : `Good Till Cancelled`
    - **Price** : `500`
    - **Quantity** : `2`
8. Login as `Bob`
9. `Bob`: Go to Wallet, click on row for `Bob-Exchange-trading`, Deposit 500 BTC
10. `Bob`: Go to BTCUSD Market, place an order (to partially match `Alice`'s Buy)
    - **Sell**
    - **Limit**
    - **Time in Force** : `Good Till Cancelled`
    - **Price** : `500`
    - **Quantity** : `1.0`

## Setup Clearinghouse
1. Login as `Ccp`
2. `Ccp`: Go to Wallet, create a regular account
    - **Provider**: `Bank`
    - **Account Name** : `Clearing-Bank`
    - **Account Type** : `Regular`
3. `Ccp`: Go to Manage/Clearing and "Accept" Clearing Role
    - **Clearing Account**: `Clearing-Bank`
4. Login as `Alice`
5. `Alice`: Go to Wallet, click on row for `Alice-Ccp-clearing`, Deposit 10,000 USD
6. Login as `Bob`
7. `Bob`: Go to Wallet, click on row for `Bob-Ccp-clearing`, Deposit 10,000 USD

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

3. Login as `Exchange`
4. `Exchange`: Go to Setup, Create New Listing
    - **Traded Asset** : `BTC`
    - **Traded Asset Precision**: `6`
    - **Quoted Asset** : `USD`
    - **Quoted Asset Precision**: `2`
    - **Minimum Tradable Quantity**: `1`
    - **Maximum Tradable Quantity**: `10000`
    - **Symbol**: `BTCUSD-CLR`
    - **Description**: `Cleared Bitcoin vs USD`
    - **Cleared by**: `CCP`
5. Login as `Alice`
6. `Alice`: Go to BTCUSD-CLR Market, place an order
    - **Buy**
    - **Limit**
    - **Time in Force** : `Good Till Cancelled`
    - **Price** : `500`
    - **Quantity** : `2`
7. Login as `Bob`
8. `Bob`: Go to BTCUSD-CLR Market, place an order (to partially match `Alice`'s Buy)
    - **Sell**
    - **Market**
    - **Time in Force** : `Good Till Cancelled`
    - **Quantity** : `1.0`
9. Login as `Ccp`
10. On Manage/Clearing, click "Request FV" next to Exchange's Market.Clearing role
    - **Currency** : USD

# Read More

- [Build &amp; deploy source code to Daml Hub](./damlhub_deployment.md)
- [Set up a local development environment](./local_development.md)
