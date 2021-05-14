# Daml Open Marketplace

This is an open-source example of an application written in [Daml](https://daml.com/), that allows for the setup of a configurable market-in-a-box. The application covers workflows for issuing assets, conducting auctions, listing market pairs, trading, and settlement.

A UI written in React and Typescript is also provided.

Run the application without requiring any technical experience, via [Daml Hub](https://hub.daml.com).

- Create a free Daml Hub account
- Deploy `DA Marketplace` from the Sample Apps list after logging in
- Click on the ledger after it's created
- Finally, follow the [user guide](./docs/user_guide.md) to walk through the available features.

## v0.2.0

The newest version of the app contains a rewrite of the Daml models. They are now more flexible and featureful than the ones from the `v0.1.x` series, and it is recommended to upgrade.

If you've cloned this repository in the past, there are some changes to the branches. First, the default branch has changed from `master` to `main`. `main` now contains the 0.2.x series of code, and the old 0.1.x series HEAD now lives on the branch `TBD`.

To get up to date, run the following:

```shell
$ TBD
```

## Build &amp; Deployment

See the instructions on [building and deploying from source to Daml Hub](./docs/damlhub_deployment.md).

## Development

See the instructions on configuring a [local development environment](./docs/local_development.md).

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
