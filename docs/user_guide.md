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
5. Upload `parties.json`
6. Wait ~5 mins for all auto-approve triggers for all parties to deploy
7. Set up `Bank`
   - **Legal Name**: `Bank`
   - **Location**: `NYC`
   - **Services**: `Custody`, `Distribution`, `Settlement`
   - **Automation**: `SettlementInstructionTrigger`
8. Set up `Exchange`
   - **Legal Name**: `Exchange`
   - **Location**: `NYC`
   - **Services**: `Custody`, `Trading`, `Matching`, `Settlement`
   - **Automation**: `MatchingEngine`, `SettlementInstructionTrigger`
9. Set up `Ccp`
   - **Legal Name**: `Central Clearing Counterparty`
   - **Location**: `NYC`
   - **Services**: `Clearing`
   - **Automation**: `ClearingTrigger`
10. \*Optional - if any of the above parties still lack a Legal Name after being added in Quick Setup, login as that party and request identity verification from the Landing page

## Issuing new assets

11. Login as `Issuer`
12. `Issuer`: Request `Custody`, `Issuance` services from the `Bank`
13. `Issuer`: go to Wallet and create a regular account
    - **Provider**: `Bank`
    - **Account Name** : `MainIssuer-Bank`
    - **Account Type** : `Regular`
14. `Issuer`: go to Wallet and create an allocation account
    - **Provider**: `Bank`
    - **Account Name** : `AllocIssuer-Bank`
    - **Account Type** : `Allocation`
    - **Nominee** : `Bank`
15. `Issuer`: go to Setup and create a base instrument for USD
16. `Issuer`: go to Setup and create a base instrument for BTC
17. `Issuer`: go to Setup and create an issuance of USD
    - **Issuance ID**: `iss1`
    - **Quantity**: `1000`
18. `Issuer`: go to Setup and create an issuance of BTC
    - **Issuance ID**: `iss2`
    - **Quantity**: `1000`

## Primary distribution

Auctioning off assets

19. `Issuer`: on Landing, request `Auction` service from the `Bank`
    - **Provider**: `Bank`
    - **Trading Account**: `MainIssuer-Bank`
    - **Allocation Account**: `AllocIssuer-Bank`
    - **Receivable Account**: `MainIssuer-Bank`
20. `Issuer`: go to Setup and create a new auction
    - **Auctioned Asset** : `BTC`
    - **Quoted Asset** : `USD`
    - **Quantity** : `500`
    - **Floor Price** : `300`
    - **Auction ID** : `auc1`
21. Login as `Alice`
22. `Alice`: Request `Custody` service from `Bank`
23. `Alice`: Go to Wallet, create a regular account with `Bank`
    - **Provider**: `Bank`
    - **Account Name** : `MainAlice-Bank`
    - **Account Type** : `Regular`
24. `Alice`: Click on newly created account row
25. `Alice`: Deposit 5000 US Dollars to account
26. `Alice`: Go to Wallet, create an allocation account
    - **Provider**: `Bank`
    - **Account Name** : `AllocAlice-Bank`
    - **Account Type** : `Allocation`
    - **Nominee** : `Bank`
27. `Alice`: Request `Bidding` service from `Bank`
    - **Trading Account**: `MainAlice-Bank`
    - **Allocation Account**: `AllocAlice-Bank`
28. Login as `Bank`
29. `Bank`: Go to Auctions, click on the auction opened by the Issuer, and Request Bid from `Alice`
30. Login as `Alice`
31. `Alice`: Go to Bidding Auctions, click on the auction, and submit a Bid
    - **Quantity**: `2`
    - **Price**: `500`
    - **Publish Bid**: ✅
32. Login as `Bank`
33. Go to auction, click `Close Auction`

## Secondary distribution

Setting up tradeable, collateralized markets

34. Login as `Exchange`
35. `Exchange`: Request `Listing` service from `Exchange`
36. `Exchange`: Go to Setup, Create New Listing
    - **Traded Asset** : `BTC`
    - **Traded Asset Precision**: `6`
    - **Quoted Asset** : `USD`
    - **Quoted Asset Precision**: `2`
    - **Minimum Tradable Quantity**: `1`
    - **Maximum Tradable Quantity**: `10000`
    - **Symbol**: `BTCUSD`
    - **Description**: `Bitcoin vs USD`
    - **Cleared by**: `-- Collateralized Market --`
37. Login as `Alice`
38. `Alice`: Request `Custody` service from the `Exchange`
39. `Alice`: Go to Wallet, create a regular account
    - **Provider**: `Exchange`
    - **Account Name** : `MainAlice-Exchange`
    - **Account Type** : `Regular`
40. `Alice`: Go to Wallet, create an allocation account
    - **Provider**: `Exchange`
    - **Account Name** : `AllocAlice-Exchange`
    - **Account Type** : `Allocation`
    - **Nominee** : `Exchange`
41. `Alice`: Go to Wallet, click on row for `MainAlice-Exchange`
42. `Alice`: Deposit 1000 USD into `MainAlice-Exchange`
43. `Alice`: Request `Trading` service from `Exchange`
    - **Provider**: `Exchange`
    - **Trading Account**: `MainAlice-Exchange`
    - **Allocation Account**: `AllocAlice-Exchange`
44. `Alice`: Go to BTCUSD Market, place an order
    - **Buy**
    - **Limit**
    - **Time in Force** : `Good Till Cancelled`
    - **Price** : `500`
    - **Quantity** : `2`
45. Login as `Bob`
46. `Bob`: Request `Custody` service from `Exchange`
47. `Bob`: Go to Wallet, create a regular account
    - **Provider**: `Exchange`
    - **Account Name** : `MainBob-Exchange`
    - **Account Type** : `Regular`
48. `Bob`: Go to Wallet, create an allocation account
    - **Provider**: `Exchange`
    - **Account Name** : `AllocBob-Exchange`
    - **Account Type** : `Allocation`
    - **Nominee** : `Exchange`
49. `Bob`: Go to Wallet, click on row for `MainBob-Exchange`, Deposit 500 BTC
50. `Bob`: Request `Trading` service from `Exchange`
    - **Provider**: `Exchange`
    - **Trading Account**: `MainBob-Exchange`
    - **Allocation Account**: `AllocBob-Exchange`
51. `Bob`: Go to BTCUSD Market, place an order (to partially match `Alice`'s Buy)
    - **Sell**
    - **Limit**
    - **Time in Force** : `Good Till Cancelled`
    - **Price** : `500`
    - **Quantity** : `1.0`

## Central counterparty clearing

Trading mediated through a CCP

52. Login as `Ccp`
53. `Ccp`: Request Custody from `Bank`

# Read More

- [Build &amp; deploy source code to Daml Hub](./damlhub_deployment.md)
- [Set up a local development environment](./local_development.md)
