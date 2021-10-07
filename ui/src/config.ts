// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
import _ from 'lodash';
import { useCallback, useMemo, useState, useEffect } from 'react';

import {
  isRunningOnHub,
  damlHubEnvironment,
  useDefaultParties,
  DefaultParties,
  PartyToken,
} from '@daml/hub-react';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

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

export const wsBaseUrl =
  deploymentMode === DeploymentMode.DEV ? 'ws://localhost:7575/' : hubEnv?.wsURL;

export const httpBaseUrl = hubEnv?.baseURL || undefined;

const inferPartyName = (party: string, defaultParties: DefaultParties): string | undefined => {
  // Check if we can extract a readable party name from any data we have client-side.
  // Inspect token claims, parties.json, and cross-reference Daml Hub's well-known parties.

  const creds = retrieveCredentials();

  if (isHubDeployment) {
    const publicParty = defaultParties[0];

    if (party === creds?.party) {
      return new PartyToken(creds.token).partyName || undefined;
    }

    if (party === publicParty) {
      return 'Public';
    }

    if (party === defaultParties[1]) {
      return 'Operator';
    }

    return publicParty && retrieveParties(publicParty).find(p => p.party === party)?.partyName;
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

export const useAccountName = (
  label: string,
  party1: string,
  party2: string
): string | undefined => {
  const [accountName, setAccountName] = useState<string>();
  const { name: p1Name, getName } = usePartyName(party1);
  const p2Name = getName(party2);

  useEffect(() => {
    const name = `${p1Name}-${p2Name}-${label}`;

    if (isHubDeployment) {
      if (p1Name !== party1 && p2Name !== party2) {
        setAccountName(name);
      }
    } else {
      setAccountName(name);
    }
  }, [label, party1, party2, p1Name, p2Name]);

  return accountName;
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
