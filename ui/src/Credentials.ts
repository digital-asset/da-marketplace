// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { encode } from 'jwt-simple'
import { PartyToken } from '@daml/hub-react'

import { ledgerId } from './config'

export const APPLICATION_ID: string = 'da-marketplace';

// NOTE: This is for testing purposes only.
// To handle authentication properly,
// see https://docs.daml.com/app-dev/authentication.html.
export const SECRET_KEY: string = 'secret';

export type Credentials = {
  party: string;
  ledgerId: string;
  token: string;
};

function isCredentials(credentials: any): credentials is Credentials {
  return typeof credentials.party === 'string' &&
         typeof credentials.token === 'string' &&
         typeof credentials.ledgerId === 'string'
}

const CREDENTIALS_STORAGE_KEY = 'credentials';

export function storeCredentials(credentials?: PartyToken): void {
  sessionStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
}

export function retrieveCredentials(): PartyToken | undefined {
  const credentialsJson = sessionStorage.getItem(CREDENTIALS_STORAGE_KEY);

  if (!credentialsJson) {
    return undefined;
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    if (isCredentials(credentials)) {
      const at = new PartyToken(credentials.token);
      if (!at.isExpired) {
        return at;
      }
    }
  } catch {
    console.error("Could not parse credentials: ", credentialsJson);
    sessionStorage.removeItem(CREDENTIALS_STORAGE_KEY);
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
