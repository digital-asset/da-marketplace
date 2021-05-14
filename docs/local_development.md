[← back](../README.md)

# Local Development

## Requirements

To run the marketplace locally or to build to be deployed on Daml Hub, the following requirements are necessary:

1. Daml Connect (1.12)
2. `make` (3.x)
3. `yq` (3.x)
4. `python` (3.8)
5. `poetry` (1.0.x)
6. `node` (14.x)
7. `yarn` (1.22.x)

## Setup

This project uses [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules), so use `--recurse-submodules` or equivalent when cloning (see link).

In the root folder, run:

```
make package
```

This will build the bots, the Daml dar file, build the UI components, and automatically generate the TypeScript bindings.

Whenever the Daml model is changed, you must rebuild the DAR file and regenerate the TypeScript bindings.

This can be done by rebuilding the project using `make clean && make package`.

Alternatively, to only build the DAR file and regenerate the TypeScript bindings:

```
daml build
daml codegen js .daml/dist/da-marketplace-0.1.8.dar -o daml.js
cd ui
yarn install --force --frozen-lockfile
```

`yarn` will automatically rebuild components as they are changed while running, or you can build them manually with `yarn build`.

## Running Locally

To run the sample app locally in the background using the Makefile, follow these steps:

```
# start the Daml server
make start_daml_server

# wait for the navigator to pop up...

# start all bots
make start_bots

# if you would like to use the included matching engine:
make start_matching_engine

# start the UI
cd ui
yarn start
```

This will spin up the Daml Sandbox, run the automation bots, and run a yarn server for the frontend.

The Daml Sandbox will automatically be bootstrapped with contracts from `daml/Setup.daml`.

If you would like to change which Daml Script file is run when the Daml Sandbox starts, you can modify the `init-script` field in `daml.yaml`.

To access the frontend, point your browser to `http://localhost:3000`. To view the Daml ledger state in the Daml Navigator, point your browser to `http://localhost:7500`.

To stop running background processes:

```
# stop the Daml server
make stop_daml_server

# stop all bots
make stop_bots

# if you are using the included matching engine:
make stop_matching_engine
```

Alternatively to running the Daml server in the background, `daml start` can be run in a separate terminal window.

Running the bots manually can be done with:

```
cd {bot_folder}
(DAML_LEDGER_URL=localhost:6865 poetry run python bot/{bot_name}_bot.py
```
