// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { encode } from 'jwt-simple';
import { PartyToken } from '@daml/hub-react';

import { isHubDeployment } from './config';
import { cache } from './pages/common';

const APPLICATION_ID: string = 'da-marketplace';

// NOTE: This is for testing purposes only.
// To handle authentication properly,
// see https://docs.daml.com/app-dev/authentication.html.
const SECRET_KEY: string = 'secret';

export type Credentials = {
  party: string;
  token: string;
};

function isCredentials(credentials: any): credentials is Credentials {
  return typeof credentials.party === 'string' && typeof credentials.token === 'string';
}

const CREDENTIALS_STORAGE_KEY = 'credentials';

function checkExpired(credentials: Credentials): boolean {
  return isHubDeployment && new PartyToken(credentials.token).isExpired;
}

const { save, remove, load } = cache();

export function storeCredentials(credentials?: PartyToken | Credentials): void {
  save(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
}

export function clearCredentials(): void {
  remove(CREDENTIALS_STORAGE_KEY);
}

export function retrieveCredentials(): Credentials | undefined {
  const credentialsJson = load(CREDENTIALS_STORAGE_KEY);

  if (!credentialsJson) {
    return undefined;
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    if (isCredentials(credentials) && !checkExpired(credentials)) {
      return credentials;
    }
  } catch {
    console.error('Could not parse credentials: ', credentialsJson);
  }

  return undefined;
}

export function computeToken(party: string): string {
  const payload = {
    exp: new Date().getTime() / 1000 + 1000000,
    'https://daml.com/ledger-api': {
      ledgerId: 'da-marketplace-sandbox',
      applicationId: APPLICATION_ID,
      actAs: [party],
      readAs: [party, 'Public'],
    },
    party,
    ledgerId: 'da-marketplace-sandbox',
    partyName: party,
  };
  return encode(payload, SECRET_KEY, 'HS256');
}

export const computeCredentials = (party: string): Credentials => {
  const token = computeToken(party);
  return { token, party };
};

export default Credentials;
