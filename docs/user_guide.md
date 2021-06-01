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
    - Assign `Exchange` the `Custody`, `Trading`, `Matching`, and `Settlement` roles
    - Assign `Ccp` the `Clearing` role
9. Drag and drop automation to specific parties: (then click Next)
    - Assign `Bank` the `SettlementInstructionTrigger`
    - Assign `Exchange` the `MatchingEngine`, and `SettlementInstructionTrigger`
    - Assign `Ccp` the `ClearingTrigger`
9. Request services from specific parties: (then click Next)
    - As `Issuer` request `Custody`, `Issuance` services from `Bank`
    - As `Bank` request `Custody` services from `Alice`
    - As `Ccp` request `Custody` services from `Bank`
    - As `Exchange` request `Listing` services from `Exchange`
    - As `Alice` request `Custody` services from `Exchange`
    - As `Bob` request `Custody` services from `Exchange` and `Bank`

## Issuing new assets

11. Login as `Issuer`
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

## Setup Clearinghouse
52. Login as `Ccp`
53. `Ccp`: Go to Wallet, create a regular account
    - **Provider**: `Bank`
    - **Account Name** : `Clearing-Bank`
    - **Account Type** : `Regular`
54. `Ccp`: Go to Manage/Clearing and "Accept" Clearing Role
    - **Clearing Account**: `Clearing-Bank`
55. Login as `Alice`
56. `Alice`: Go to Wallet, create a regular account
    - **Provider**: `Bank`
    - **Account Name** : `ClearingAlice-Bank`
    - **Account Type** : `Regular`
57. `Alice`: Go to Wallet, create an allocation account
    - **Provider**: `Bank`
    - **Account Name** : `MarginAlice-Bank`
    - **Account Type** : `Allocation`
    - **Nominee** : `Ccp`
58. `Alice`: On Landing, click "Request Clearing Service"
    - **Provider**: `CCP`
    - **Clearing Account**: `ClearingAlice-Bank`
    - **Margin Account**: `MarginAlice-Bank`
59. `Alice`: Go to Wallet, click on row for `ClearingBob-Bank`, Deposit 10,000 USD
60. Login as `Bob`
61. `Bob`: Go to Wallet, create a regular account
    - **Provider**: `Bank`
    - **Account Name** : `ClearingBob-Bank`
    - **Account Type** : `Regular`
62. `Bob`: Go to Wallet, create an allocation account
    - **Provider**: `Bank`
    - **Account Name** : `MarginBob-Bank`
    - **Account Type** : `Allocation`
    - **Nominee** : `Ccp`
63. `Bob`: On Landing, click "Request Clearing Service"
    - **Provider**: `CCP`
    - **Clearing Account**: `ClearingBob-Bank`
    - **Margin Account**: `MarginBob-Bank`
64. `Bob`: Go to Wallet, click on row for `ClearingBob-Bank`, Deposit 10,000 USD

### Test Margin Calls
Perform successful margin call for Alice

65. Login as `Ccp`
66. `Ccp`: on `Members` page, click "Perform Margin Call":
    - **Customer**: `Alice`
    - **Amount**: 5000

Fail and retry a margin calculation for `Bob`

67. `Ccp`: on `Members` page, click "Perform Margin Call":
    - **Customer** : `Bob`
    - **Amount** : 12000
68. Login as `Bob`
69. `Bob`: Go to Wallet, click on row for `ClearingBob-Bank`, Deposit 5000 USD
70. `Bob`: Go to Clearing page, click "Retry" on failed Margin Call


### Test Mark to Market
Transfer funds from Alice to Bob via central countrerparty.

71. `Ccp`: on `Members` page, click "Perform Mark to Market":
    - **Customer**: `Alice`
    - **Amount**: 5000
72. `Ccp`: on `Members` page, click "Perform Mark to Market":
    - **Customer** : `Bob`
    - **Amount** : -5000

## Cleared Secondary Market
Setting up tradeable, cleared markets

73. Login as `Exchange`
74. On landing page, click "Request Market Clearing"
    - **Provider** : `Ccp`
75. `Exchange`: Go to Setup, Create New Listing
    - **Traded Asset** : `BTC`
    - **Traded Asset Precision**: `6`
    - **Quoted Asset** : `USD`
    - **Quoted Asset Precision**: `2`
    - **Minimum Tradable Quantity**: `1`
    - **Maximum Tradable Quantity**: `10000`
    - **Symbol**: `BTCUSD-CLR`
    - **Description**: `Cleared Bitcoin vs USD`
    - **Cleared by**: `CCP`
76. Login as `Alice`
77. `Alice`: Go to BTCUSD-CLR Market, place an order
    - **Buy**
    - **Limit**
    - **Time in Force** : `Good Till Cancelled`
    - **Price** : `500`
    - **Quantity** : `2`
78. Login as `Bob`
79. `Bob`: Go to BTCUSD-CLR Market, place an order (to partially match `Alice`'s Buy)
    - **Sell**
    - **Market**
    - **Time in Force** : `Good Till Cancelled`
    - **Quantity** : `1.0`
80. Login as `Ccp`
81. On Manage/Clearing, click "Request FV" next to Exchange's Market.Clearing role
    - **Currency** : USD

# Read More

- [Build &amp; deploy source code to Daml Hub](./damlhub_deployment.md)
- [Set up a local development environment](./local_development.md)
