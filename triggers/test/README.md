Automation Tests
===================

These Daml scripts can be used to test automation in the Marketplace.

These tests work by running actions in a Daml Script and then waiting for the trigger to perform
the desired result using the `waitUntil` and `waitQuery` [functions](#wait-functions). After a
specified time, if the desired result has not occured, the test is considered failed and exits.

## Tests

| Test Module        | Automation                      |
|--------------------|---------------------------------|
| Tests.Matching     | MatchingEngine, exberry_adapter |
| Tests.MatchForever | MatchingEngine, exberry_adapter |

## Running
To run tests:

1. Start a Sandbox with `daml start` in this folder.
2. Start the trigger or automation you are testing (e.g. `make start-matching-engine party=Exchange` from the root directory)
3. Run the test (adjust dar path depending on what directory you run from):

    `daml script --dar .daml/dist/marketplace-matching-test-0.1.0.dar --script-name {Module}:{ScriptName} --ledger-host localhost --ledger-port 6865`

Note: Between each test you will need to reset the sandbox, this can be done by pressing 'r' in Sandbox.
This is also useful if you rewrite a test and want to run the new test.

### Wait Functions
- `waitUntil` takes a (`Script Bool`) function that is run every second  up to the timeout until that function
returns true.

```haskell
waitUntil 10.0 $ do
  (Some (_,aliceStanding)) <- queryContractKey @MemberStanding clearinghouse (clearinghouse, alice.customer)
  return $ not aliceStanding.marginSatisfied
```

- `waitQuery` takes a (`Script (Optional c))` function meant to be used with a script query like
`queryContractKey` that returns an `Optional` contract if found. This lookup is run every second up to
the timeout until that function returns a `Some c`, after which it will return `c`.

```haskell
(listingCid, listing) <- waitQuery 10.0 $ queryContractKey @Listing.Listing exchange (operator, exchange, listingId)
```

