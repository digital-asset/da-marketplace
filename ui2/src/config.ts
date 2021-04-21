// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { partyNameFromJwtToken, useWellKnownParties } from '@daml/hub-react';
import { Parties } from '@daml/hub-react/lib/WellKnownParties';
import { useCallback, useMemo } from 'react';
import { retrieveCredentials } from './Credentials';
import { useStreamQueries } from './Main';
import { retrieveParties } from './Parties';

export enum DeploymentMode {
  DEV,
  PROD_DABL,
  PROD_OTHER,
}

export const dablHostname = window.location.hostname.split('.').slice(1).join('.');

export const deploymentMode: DeploymentMode =
  process.env.NODE_ENV === 'development'
    ? DeploymentMode.DEV
    : dablHostname.includes('projectdabl')
    ? DeploymentMode.PROD_DABL
    : DeploymentMode.PROD_OTHER;

// Decide the ledger ID based on the deployment mode first,
// then an environment variable, falling back on the sandbox ledger ID.
export const ledgerId: string =
  deploymentMode === DeploymentMode.PROD_DABL
    ? window.location.hostname.split('.')[0]
    : process.env.REACT_APP_LEDGER_ID ?? 'da-marketplace-sandbox';

export const httpBaseUrl =
  deploymentMode === DeploymentMode.PROD_DABL
    ? `https://api.${dablHostname}/data/${ledgerId}/`
    : undefined;

export const wsBaseUrl = deploymentMode === DeploymentMode.DEV ? 'ws://localhost:7575/' : undefined;

export const publicParty = deploymentMode === DeploymentMode.DEV ? 'Public' : `public-${ledgerId}`;

const inferPartyName = (party: string, wellKnownParties: Parties | null): string | undefined => {
  // Check if we can extract a readable party name from any data we have client-side.
  // Inspect token claims, parties.json, and cross-reference Daml Hub's well-known parties.

  const creds = retrieveCredentials();

  if (party === creds?.party) {
    return partyNameFromJwtToken(creds.token) || undefined;
  }

  if (party === wellKnownParties?.userAdminParty) {
    return 'Operator';
  }

  if (party === wellKnownParties?.publicParty) {
    return 'Public';
  }

  return retrieveParties()?.find(p => p.party === party)?.partyName;
};

export const usePartyName = (party: string) => {
  const { contracts: verifiedIdentities, loading } = useStreamQueries(VerifiedIdentity);
  const { parties: wellKnownParties } = useWellKnownParties();

  const getName = useCallback(
    (party: string): string => {
      const legalName: string | undefined = verifiedIdentities.find(
        id => id.payload.customer === party
      )?.payload.legalName;

      if (legalName) {
        return legalName;
      }

      const inferredName: string | undefined = inferPartyName(party, wellKnownParties);

      if (inferredName) {
        return inferredName;
      }

      // Cannot find an identity contract or infer the party name, so fallback to party ID
      return party;
    },
    [verifiedIdentities, loading]
  );

  const name = useMemo(() => getName(party), [party, getName]);

  return { name, getName };
};

export function getTemplateId(t: string) {
  const parts = t.split(':').slice(1);
  return parts[0] + '.' + parts[1];
}
