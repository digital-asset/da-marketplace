Automation Tests
===================

These Daml scripts can be used to test automation in the Marketplace.

| Test Module    | Automation                      |
|----------------|---------------------------------|
| Tests.Matching | MatchingEngine, exberry_adapter |
| Tests.Clearing | ClearingTrigger                 |

To run tests:

1. Start a Sandbox with `daml start` in this folder.
2. Start the trigger or automation you are testing (e.g. `make start-matching-engine party=Exchange` from the root directory)
3. Run the test (adjust dar path depending on what directory you run from):

    `daml script --dar .daml/dist/marketplace-matching-test-0.2.0.dar --script-name {Module}:{ScriptName} --ledger-host localhost --ledger-port 6865`

Note: Between each test you will need to reset the sandbox, this can be done by pressing 'r' in Sandbox.
This is also useful if you rewrite a test and want to run the new test.
