// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { partyNameFromJwtToken } from '@daml/hub-react';
import { useCallback, useMemo } from 'react';
import { Credentials, isCredentials } from './Credentials';
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

export const isHubDeployment = deploymentMode === DeploymentMode.PROD_DABL;

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

export const getName = (partyOrCreds: string | Credentials): string => {
  if (isCredentials(partyOrCreds)) {
    const creds = partyOrCreds;
    return partyNameFromJwtToken(creds.token) || creds.party;
  } else {
    const party = partyOrCreds;
    const importedParties = retrieveParties();
    const details = importedParties?.find(p => p.party === party);

    return details ? details.partyName : party;
  }
};

export const usePartyLegalName = (party: string) => {
  const { contracts: verifiedIdentities, loading } = useStreamQueries(VerifiedIdentity);

  const getLegalName = useCallback(
    (party: string) => {
      if (!loading) {
        return (
          verifiedIdentities.find(id => id.payload.customer === party)?.payload.legalName || party
        );
      } else {
        return getName(party);
      }
    },
    [verifiedIdentities, loading]
  );

  const legalName = useMemo(() => getLegalName(party), [party, getLegalName]);

  return { legalName, getLegalName };
};

export function getTemplateId(t: string) {
  const parts = t.split(':').slice(1);
  return parts[0] + '.' + parts[1];
}
