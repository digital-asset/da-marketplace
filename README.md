
# Sample code

**This repo contains sample code to help you get started with DAML. Please bear
in mind that it is provided for illustrative purposes only, and as such may not
be production quality and/or may not fit your use-cases. You may use the
contents of this repo in parts or in whole according to the BSD0 license:**

> Copyright © 2020 Digital Asset (Switzerland) GmbH and/or its affiliates
>
> Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.
>
> THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

# Marketplace

This is an initial example of how to setup a marketplace where digital tokens
can be issued and exchanged.

# Requirements
To run the marketplace locally or to build to be deployed on DABL, the following requirements are necessary:
1. DAML SDK (1.6)
2. `yarn` (1.22.x)
3. `poetry` (1.0.x)
4. `make` (3.x)
5. `yq` (3.x)

# Setup

In the root folder, run:
```
make package
```

This will build the bots, the DAML dar file, build the UI components, and automatically generate the TypeScript bindings.

Whenever the DAML model is changed, you must rebuild the DAR file and regenerate the TypeScript bindings.

This can be done by rebuilding the project using `make clean && make package`.

Alternatively, to only build the DAR file and regenerate the TypeScript bindings:
```
daml build
daml codegen js .daml/dist/da-marketplace-0.0.2.dar -o daml.js
cd ui
yarn install --force --frozen-lockfile
```

`yarn` will automatically rebuild components as they are changed while running, or you can build them manually with `yarn build`.

# Running

To run the sample app locally using the Makefile in the background, follow these steps:

```
# start the DAML server
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

This will spin up the DAML Sandbox, run the automation bots, and run a yarn server for the frontend.

The DAML Sandbox will automatically be bootstrapped with contracts from `daml/Setup.daml`.

If you would like to change which DAML Script file is run when the DAML Sandbox starts, you can modify the `init-script` field in `daml.yaml`.

To access the frontend, point your browser to `http://localhost:3000`. To view the DAML ledger state in the DAML Navigator, point your browser to `http://localhost:7500`.

To stop running background processes:
```
# stop the DAML server
make stop_daml_server

# stop all bots
make stop_bots

# if you are using the included matching engine:
make stop_matching_engine
```

Alternatively to running the DAML server in the background, `daml start` can be run in a separate terminal window.

Running the bots manually can be done with:
```
cd {bot_folder}
(DAML_LEDGER_URL=localhost:6865 poetry run python bot/{bot_name}_bot.py

