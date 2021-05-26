import { dablHostname, deploymentMode, DeploymentMode, httpBaseUrl, ledgerId } from './config';
import { computeCredentials } from './Credentials';

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

type PublicTokenAPIResult =
  | {
      access_token: string;
    }
  | undefined;

const getPublicToken = async (publicParty: string): Promise<string | undefined> => {
  let publicToken = undefined;

  if (deploymentMode === DeploymentMode.DEV) {
    publicToken = computeCredentials(publicParty).token;
  } else {
    const url = new URL(httpBaseUrl || 'http://localhost:3000');

    const result: PublicTokenAPIResult = await fetch(
      `https://${url.hostname}/api/ledger/${ledgerId}/public/token`,
      { method: 'POST' }
    ).then(response => response.json());

    publicToken = result?.access_token;
  }

  return publicToken;
};

export type PublishedInstance = {
  ledgerId: string;
  entityInfo: {
    apiVersion: string;
    artifactHash: string;
    entity: {
      tag: string;
      value: {
        tag: string;
        value: AutomationValue;
      };
    };
  };
  enabled: boolean;
  deployer: string;
  config: {
    tag: string;
    value: {
      name: string; // the one we want
      runAs: string;
      configMap: {};
    };
  };
  id: string;
  instanceLabel: string;
  createdAt: string;
  owner: string;
};

type PublishedInstanceAPIResult = PublishedInstance[] | undefined;

type AutomationValue = {
  packageIds: [string];
  entityName: string;
  metadata: {};
  sdkVersion: string;
  triggerNames: [string];
};

export type PublicAutomation = {
  artifactHash: string;
  ledgerId: string;
  automationEntity: {
    tag: string;
    value: AutomationValue;
  };
  deployers: [string];
  createdAt: string;
  owner: string;
  apiVersion: string;
};

type PublicAutomationAPIResult = PublicAutomation[] | undefined;

export const getPublicAutomation = async (
  publicParty?: string
): Promise<PublicAutomation[] | undefined> => {
  let automation = undefined;
  if (!publicParty) {
    return automation;
  }
  await getPublicToken(publicParty).then(token => {
    if (token) {
      const publicHeaders = {
        Authorization: `Bearer ${token?.toString()}`,
        'Content-Type': 'application/json',
      };
      const url = `https://${ledgerId}.${dablHostname}/.hub/v1/published`;
      const result: Promise<PublicAutomationAPIResult> = fetch(url, {
        method: 'GET',
        headers: publicHeaders,
      }).then(response => response.json());
      automation = result;
    }
  });
  return automation;
};

export const getAutomationInstances = async (
  token: string
): Promise<PublishedInstance[] | undefined> => {
  const headers = {
    Authorization: `Bearer ${token?.toString()}`,
    'Content-Type': 'application/json',
  };
  const url = `https://${ledgerId}.${dablHostname}/.hub/v1/published/instance`;
  const result: Promise<PublishedInstanceAPIResult> = fetch(url, {
    method: 'GET',
    headers,
  }).then(response => response.json());

  return result;
};

export const deployAutomation = async (
  artifactHash: string,
  trigger: string,
  token: string,
  publicParty?: string
) => {
  await getPublicAutomation(publicParty).then(automations => {
    const artifact = automations?.find(a => a.artifactHash === artifactHash);
    if (artifact) {
      const headers = {
        Authorization: `Bearer ${token?.toString()}`,
        'Content-Type': 'application/json',
      };
      const deployUrl = `https://${ledgerId}.${dablHostname}/.hub/v1/published/deploy`;
      fetch(deployUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          artifactHash: artifact.artifactHash,
          owner: artifact.owner,
          name: trigger,
        }),
      }).then(response => response.json());
    }
  });
};

export const undeployAutomation = async (token: string, instanceId: string, owner: string) => {
  const headers = {
    Authorization: `Bearer ${token?.toString()}`,
    'Content-Type': 'application/json',
  };
  const deployUrl = `https://${ledgerId}.${dablHostname}/.hub/v1/published/instance/delete`;
  await fetch(deployUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      instanceId,
      owner,
    }),
  }).then(response => response.json());
};
