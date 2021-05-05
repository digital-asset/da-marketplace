import {dablHostname, ledgerId} from "./config";
import {getPublicToken} from "./websocket/queryStream";

export const TRIGGER_HASH = process.env.REACT_APP_TRIGGER_HASH;
export const EXBERRY_HASH = process.env.REACT_APP_EXBERRY_HASH;

export enum MarketplaceTrigger {
  ExchangeTrigger = "ExchangeTrigger:handleExchange",
  CCPTrigger = "CCPTrigger:handleCCP",
  CustodianTrigger = "CustodianTrigger:handleCustodian",
  OperatorTrigger = "OperatorTrigger:handleOperator",
  MatchingEngine = "MatchingEngine:handleMatching",
  BrokerTrigger = "BrokerTrigger:handleBroker"
}

export type PublicAutomation = {
  artifactHash: string;
  ledgerId: string;
  automationEntity: {
    tag: string;
    value: {
      packageIds: [string];
      entityName: string;
      metadata: {},
      sdkVersion: string;
      triggerNames: [string];
    }
  }
  deployers: [string];
  createdAt: string;
  owner: string
  apiVersion: string;
}

type PublicAutomationAPIResult = PublicAutomation[] | undefined;

export const getPublicAutomation = async (publicParty?: string): Promise<PublicAutomation[] | undefined> => {
  let automation = undefined;
  if (!publicParty) { return automation }
  await getPublicToken(publicParty)
    .then(token => {
      if (token) {
        const publicHeaders = {
          "Authorization": `Bearer ${token?.toString()}`,
          'Content-Type': 'application/json'
        }
        const url = `https://${ledgerId}.${dablHostname}/.hub/v1/published`;
        const result: Promise<PublicAutomationAPIResult> = fetch(url, { method: 'GET', headers: publicHeaders})
          .then(response => response.json());
        automation = result;
      }
    });
  return automation;
}

export const deployTrigger = async (artifactHash: string, trigger: MarketplaceTrigger, token: string, publicParty?: string) => {
  await getPublicAutomation(publicParty).then(automations => {
    const artifact = automations?.find(a => a.artifactHash === artifactHash);
    if (artifact) {
      const headers = {
        "Authorization": `Bearer ${token?.toString()}`,
        'Content-Type': 'application/json'
      }
      const deployUrl = `https://${ledgerId}.${dablHostname}/.hub/v1/published/deploy`;
      fetch(deployUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          artifactHash: artifact.artifactHash,
          owner: artifact.owner,
          name: trigger
        })}).then(response => response.json());
    }
  });
}

export default deployTrigger
