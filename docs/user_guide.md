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
4. Open deployed UI -> Quick Setup
5. Upload `parties.json`
6. Wait ~5 mins for all auto-approve triggers for all parties to deploy
7. Set up `Bank` with Custody, Distribution services
8. Set up `Exchange` with Trading, Matching services. MatchingEngine trigger
9. Set up `Ccp` with Clearing services.
10. \*Optional - if `Bank` or `Exchange` still lack a Legal Name after being added in Quick Setup, login as that party and request identity verification from the Landing page

## Issuing new assets

11. Login as `Issuer`
12. `Issuer`: Request `Custody` service from the `Bank`
13. `Issuer`: Request `Issuance` service from the `Bank`
14. `Issuer`: go to Wallet and create a regular account
15. `Issuer`: go to Wallet and create an allocation account
    - **Nominee**: `Bank`
16. `Issuer`: go to Setup and create a base instrument called USD
17. `Issuer`: go to Setup and create a base instrument called BTC
18. `Issuer`: go to Setup and create an issuance of 2000 USD (give arbitrary ID)
19. `Issuer`: go to Setup and create an issuance of 500 BTC (give arbitrary ID)

## Primary distribution

Auctioning off assets

20. `Issuer`: on Landing, request `Auction` service from the `Bank`
21. `Issuer`: go to Setup and create a new auction
    - **Auctioned Asset** : `BTC`
    - **Quoted Asset** : `USD`
    - **Quantity** : `500`
    - **Floor Price** : `1000`
    - **Auction ID** : `123` (any arbitrary number)
22. Login as `Exchange`
23. `Exchange`: Request `Custody` service from `Bank`
24. `Exchange`: Go to Wallet, create a regular account with `Bank`
25. `Exchange`: Click on newly created account row
26. `Exchange`: Deposit 5000 US Dollars to account
    <!-- 26. `Exchange`: Request Auction service from `Bank`. -->
    <!-- TODO: complete primary distribution flow from UI -->

## Secondary distribution

Setting up tradeable, collateralized markets

30. Login as `Exchange`
31. `Exchange`: Request `Listing` service from `Exchange`
32. `Exchange`: Go to Setup, Create New Listing
    - **Traded Asset** : `BTC`
    - **Traded Asset Precision**: `6`
    - **Quoted Asset** : `USD`
    - **Quoted Asset Precision**: `2`
    - **Minimum Tradable Quantity**: `1`
    - **Maximum Tradable Quantity**: `10000`
    - **Symbol**: `BTCUSD`
    - **Description**: `Bitcoin vs USD`
    - **Cleared by**: `-- Collateralized Market --`
33. Login as `Alice`
34. `Alice`: Request `Custody` service from `Bank`
35. `Alice`: Go to Wallet, create a regular account
36. `Alice`: Go to Wallet, create an allocation account
    - **Nominee** : `Exchange`
37. `Alice`: Request `Trading` service from `Exchange`
38. `Alice`: Go to Wallet, click on row for Alice's account, Deposit 1000 USD
39. `Alice`: Go to BTCUSD Market, place an order
    - **Buy**
    - **Limit**
    - **Time in Force** : `Good Till Cancelled`
    - **Price** : `500`
    - **Quantity** : `1.5`
40. Login as `Bob`
41. `Bob`: Request `Custody` service from `Bank`
42. `Bob`: Go to Wallet, create a regular account
43. `Bob`: Go to Wallet, create an allocation account
    - **Nominee** : `Exchange`
44. `Bob`: Request `Trading` service from `Exchange`
45. `Bob`: Go to Wallet, click on row for Bob's account, Deposit 500 BTC
46. `Bob`: Go to BTCUSD Market, place an order (to partially match `Alice`'s Buy)
    - **Sell**
    - **Limit**
    - **Time in Force** : `Good Till Cancelled`
    - **Price** : `500`
    - **Quantity** : `1.0`

## Central counterparty clearing

Trading mediated through a CCP

47. Login as `Ccp`
48. `Ccp`: Request Custody from `Bank`
