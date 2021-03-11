// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { encode } from 'jwt-simple'
import { expiredToken, partyNameFromJwtToken } from '@daml/hub-react'

import { DeploymentMode, deploymentMode, ledgerId } from './config'

export const APPLICATION_ID: string = 'da-marketplace';

// NOTE: This is for testing purposes only.
// To handle authentication properly,
// see https://docs.daml.com/app-dev/authentication.html.
export const SECRET_KEY: string = 'secret';

export type Credentials = {
  party: string;
  token: string;
  ledgerId: string;
}

export function isCredentials(credentials: any): credentials is Credentials {
  return typeof credentials.party === 'string' &&
         typeof credentials.token === 'string' &&
         typeof credentials.ledgerId === 'string'
}

const CREDENTIALS_STORAGE_KEY = 'credentials';

export function storeCredentials(credentials?: Credentials): void {
  localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
}

export function clearCredentials(): void {
  localStorage.removeItem(CREDENTIALS_STORAGE_KEY);
}

export function retrieveCredentials(): Credentials | undefined {
  const credentialsJson = localStorage.getItem(CREDENTIALS_STORAGE_KEY);

  if (!credentialsJson) {
    return undefined;
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    if (isCredentials(credentials) && !expiredToken(credentials.token)) {
      return credentials;
    }
  } catch {
    console.error("Could not parse credentials: ", credentialsJson);
  }

  return undefined;
}

function computeToken(party: string): string {
  const payload = {
    "https://daml.com/ledger-api": {
      "ledgerId": ledgerId,
      "applicationId": APPLICATION_ID,
      "actAs": [party]
    }
  };
  return encode(payload, SECRET_KEY, 'HS256');
}

export const computeCredentials = (party: string): Credentials => {
  const token = computeToken(party);
  return {party, token, ledgerId};
}

export default Credentials;
