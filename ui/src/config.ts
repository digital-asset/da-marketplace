// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
//
import * as jwt from 'jsonwebtoken'

export enum DeploymentMode {
  DEV,
  PROD_DABL,
  PROD_OTHER,
}

export const deploymentMode: DeploymentMode =
  process.env.NODE_ENV === 'development'
  ? DeploymentMode.DEV
  : window.location.hostname.endsWith('.projectdabl.com')
  ? DeploymentMode.PROD_DABL
  : DeploymentMode.PROD_OTHER;

// Decide the ledger ID based on the deployment mode first,
// then an environment variable, falling back on the sandbox ledger ID.
export const ledgerId: string =
  deploymentMode === DeploymentMode.PROD_DABL
  ? window.location.hostname.split('.')[0]
  : process.env.REACT_APP_LEDGER_ID
  ?? 'da-marketplace-sandbox';

export const httpBaseUrl =
  deploymentMode === DeploymentMode.PROD_DABL
  ? `https://api.projectdabl.com/data/${ledgerId}/`
  : undefined;

const applicationId = "da-marketplace";

const isLocalDev = deploymentMode === DeploymentMode.DEV
export const defaultPublicToken = isLocalDev ? createToken('Public') : undefined;
export const wsBaseUrl : string | undefined = isLocalDev ? 'ws://localhost:7575/' : undefined;

export function createToken(party : string) {
  return jwt.sign({ "https://daml.com/ledger-api": { ledgerId, applicationId, admin: true, actAs: [party], readAs: [party] } }, "secret");
}
