// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo } from 'react';
import _ from 'lodash';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import {
  isRunningOnHub,
  damlHubEnvironment,
  useDefaultParties,
  DefaultParties,
  PartyToken,
} from '@daml/hub-react';

import { retrieveCredentials } from './Credentials';
import { useStreamQueries } from './Main';
import { retrieveParties } from './Parties';

export enum DeploymentMode {
  DEV,
  PROD_DAML_HUB,
  PROD_OTHER,
}

const hubEnv = damlHubEnvironment();

export const deploymentMode: DeploymentMode =
  process.env.NODE_ENV === 'development'
    ? DeploymentMode.DEV
    : isRunningOnHub()
    ? DeploymentMode.PROD_DAML_HUB
    : DeploymentMode.PROD_OTHER;

export const isHubDeployment = deploymentMode === DeploymentMode.PROD_DAML_HUB;

// Decide the ledger ID based on the deployment mode first,
// then an environment variable, falling back on the sandbox ledger ID.
export const ledgerId: string =
  deploymentMode === DeploymentMode.PROD_DAML_HUB
    ? hubEnv?.ledgerId || ''
    : process.env.REACT_APP_LEDGER_ID ?? 'da-marketplace-sandbox';

export const wsBaseUrl =
  deploymentMode === DeploymentMode.DEV ? 'ws://localhost:7575/' : hubEnv?.wsURL;

export const httpBaseUrl = hubEnv?.baseURL || undefined;
export const publicParty = deploymentMode === DeploymentMode.DEV ? 'Public' : `public-${ledgerId}`;

const inferPartyName = (party: string, defaultParties: DefaultParties): string | undefined => {
  // Check if we can extract a readable party name from any data we have client-side.
  // Inspect token claims, parties.json, and cross-reference Daml Hub's well-known parties.

  const creds = retrieveCredentials();

  if (isHubDeployment) {
    if (party === creds?.party) {
      return new PartyToken(creds.token).partyName || undefined;
    }

    if (party === defaultParties[0]) {
      return 'Public';
    }

    if (party === defaultParties[1]) {
      return 'Operator';
    }
  } else {
    return retrieveParties()?.find(p => p.party === party)?.partyName;
  }
};

export const usePartyName = (party: string) => {
  const { contracts: verifiedIdentities } = useStreamQueries(VerifiedIdentity);
  const defaultParties = useDefaultParties();

  const getName = useCallback(
    (party: string): string => {
      const legalName = verifiedIdentities.find(id => id.payload.customer === party)?.payload
        .legalName;

      if (legalName) {
        return legalName;
      }

      const inferredName = inferPartyName(party, defaultParties);

      if (inferredName) {
        return inferredName;
      }

      // Cannot find an identity contract or infer the party name, so fallback to party ID
      return party;
    },
    [defaultParties, verifiedIdentities]
  );

  const name = useMemo(() => getName(party), [party, getName]);

  return { name, getName };
};

export const useVerifiedParties = () => {
  const { contracts: identities, loading } = useStreamQueries(VerifiedIdentity);
  const legalNames = _.uniq(identities.map(c => c.payload.legalName)).sort();
  return { identities, legalNames, loading };
};

export function getTemplateId(t: string) {
  const parts = t.split(':').slice(1);
  return parts[0] + '.' + parts[1];
}

export const TRIGGER_HASH = process.env.REACT_APP_TRIGGER_HASH;

// Do we want to keep this?
// ts-prune-ignore-next
export const EXBERRY_HASH = process.env.REACT_APP_EXBERRY_HASH;

export enum MarketplaceTrigger {
  AutoApproveTrigger = 'AutoApproval:autoApprovalTrigger',
  ClearingTrigger = 'ClearingTrigger:handleClearing',
  MatchingEngine = 'MatchingEngine:handleMatching',
  SettlementInstructionTrigger = 'SettlementInstructionTrigger:handleSettlementInstruction',
}
