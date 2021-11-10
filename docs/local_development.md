[← back](../README.md)

# Local Development

## Pre-requisites

Ensure you have installed the dependencies as noted on the main README. Note that the local stack
currently only works on Unix-based operating systems, such as macOS and GNU/Linux.

Windows development is not fully supported yet. It may be possible to follow these steps through
[Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/), though this is largely untested.

## Setup

This project uses [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules),
so use `--recurse-submodules` or equivalent when cloning (see link).

In the root folder, run:

```sh
$ make package
```

This will build the Marketplace Daml DAR file and trigger DARs, automatically generate the
TypeScript bindings, build the UI components, and package a DIT (for Daml Hub).

Whenever the Daml model is changed, you must rebuild the DAR file, and regenerate the TypeScript bindings.

This can be done by rebuilding the project using `make clean && make package`.

Alternatively, to only build the DAR file and regenerate the TypeScript bindings:

```sh
$ daml build
$ daml codegen js .daml/dist/da-marketplace-0.2.0.dar -o daml.js
$ cd ui
$ yarn install --force --frozen-lockfile
```

`yarn` will automatically rebuild components as they are changed while running, or you can build them manually with `yarn build`.

## Running Locally

To run the sample app locally in the background using the Makefile, follow these steps:

### Start the Sandbox

The sandbox is a local, in-memory Daml ledger for development. The configuration of this
ledger is managed in `daml.yaml`, and has some options that may be useful to know about.

The first is `init-script`, which points to a Daml script for bootstrapping the local ledger.
This will run automatically, creating all the contracts and relationships to set up a typical
market configuration.

If you'd like to start with a blank ledger (no contracts), comment out the line entirely.

A useful tool for inspecting the state of the ledger is the Navigator. It is disabled in the
configuration file, but you may enable it by setting `start-navigator: yes` on line 20.

With the sandbox configured, launch the ledger with

```sh
# start the Daml server
$ make start-daml-server
```

This will start a sandbox listening on `localhost:6865` and a Navigator (if enabled) on `localhost:7500`.

A log file is written out to `.dev/sandbox.log` - any errors at the ledger level will show up there.

Stop the sandbox by running `make stop-daml-server`.

You can also start the Navigator with `make start-navigator`, and stop with `make stop-navigator`.

### Start the Triggers

A Daml trigger is a piece of off-ledger automation that runs
as a particular Daml party, and may react to contract events disclosed to that party. See the
[documentation on triggers](https://docs.daml.com/triggers/index.html) to learn more.

In the Daml Marketplace, there are various triggers:

- **Auto Approve Trigger**: attempts to automatically approve or accept any requests that come to the running party
- **Clearing Trigger**: performs clearinghouse-specific actions
- **Matching Engine**: matches orders on an exchange
- **Settlement Trigger**: handles asset settlement of matched trades

```sh
# start the auto approval triggers for all parties in daml.yaml
$ make start-autoapprove-all

# optionally run other triggers as needed, specify party name through variable
$ make start-clearing-trigger party=Ccp
$ make start-matching-engine party=Exchange
$ make start-settlement-trigger party=Bank

# optionally run a single auto approve trigger at a time
$ make start-autoapprove party=AnyPartyName
```

Each trigger also writes to a log file within the `.dev` directory. If an error occurs during trigger
execution, look there.

You may run multiple instances of the same trigger with different parties - each instance will get its own log.

### Stop the Triggers

You may explicitly stop any trigger by calling its symmetric `stop-*` make target on it. For example

```sh
$ make stop-clearing-trigger party=AnyPartyName
$ make stop-matching-engine party=AnyPartyName
$ make stop-settlement-trigger party=AnyPartyName
$ make stop-autoapprove party=AnyPartyName
```

To stop all the running auto approve triggers in one go, run

```sh
$ make stop-autoapprove-all
```

Be aware that stopping a trigger will delete the log file associated with it.

Additionally, the trigger processes will die if the main sandbox process is killed,
which may leave behind lingering files in `.dev`.

### Start the UI

The UI can be run locally through the webpack dev server. Simply

```sh
$ cd ui
$ yarn start
```

This should result in a UI on `localhost:3000`. Locally, files are watched for changes and the server
should reload automatically.

## Exberry Integration

The Exberry integration can be started up locally. There are two components: the adapter, included
in this repository, and the integration itself which is in its own repository.

1. Clone [`daml-dit-integration-exberry`](https://github.com/digital-asset/daml-dit-integration-exberry) in a sibling directory next to `da-marketplace/`
2. Install `ddit` with `pip3 install daml-dit-ddit`
3. Open two terminals, one in the `da-marketplace/` directory, and one in the `daml-dit-integration-exberry/` directory.
4. In `daml-dit-integration-exberry/`, create a file in the repo root named `int_args.yaml`. Fill it with the template below, replaced with your Exberry account details.

```yaml
"metadata":
  "runAs": "Exchange"
  "username": "EXBERRY_USERNAME"
  "password": "EXBERRY_PASSWORD"
  "tradingApiUrl": "EXBERRY_TRADING_API_URL"
  "adminApiUrl": "EXBERRY_ADMIN_API_URL"
  "apiKey": "EXBERRY_API_KEY"
  "secret": "EXBERRY_SECRET"
```

5. In `daml-dit-integration-exberry/`, run `make all`
6. In `da-marketplace/`, run `daml start --sandbox-option ../daml-dit-integration-exberry/dabl-integration-exberry-{VERSION}.dar`
7. In `daml-dit-integration-exberry/`, run `make start`

With the sandbox ledger and integration both running, it is time to connect them via the Exberry adapter.

```sh
$ make start-exberry-adapter
```

By default, the Exberry Adapter runs locally as the `Exchange` party. Run it as any other party by adding `party=AnyPartyName` at the end.

This will start writing a log to `.dev/adapter_AnyPartyName.log`, similar to the sandbox and triggers.

The adapter can be stopped as well.

```sh
# default Exchange party
$ make stop-exberry-adapter

# with a different party
$ make stop-exberry-adapter party=AnyPartyName
```
