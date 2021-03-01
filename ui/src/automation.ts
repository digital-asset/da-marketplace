import { ledgerId, dablHostname } from "./config";
import {useDablParties} from "./components/common/common";
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
//
export const getPublicAutomation = async (token?: string): Promise<PublicAutomation[] | undefined> => {
  let automation = undefined;
  if (token) {
    const publicHeaders = {
      "Authorization": `Bearer ${token?.toString()}`,
      'Content-Type': 'application/json'
    }
    const my_url = `https://${ledgerId}.${dablHostname}/.hub/v1/published`;
    const result: PublicAutomationAPIResult = await fetch(my_url, { method: 'GET', headers: publicHeaders})
      .then(response => response.json());
    automation = result;
  }
  return automation;
}
// }
// export const getPublicAutomation = async (token_no?: string, publicParty?: string): Promise<PublicAutomation[] | undefined> => {
//   let automation = undefined;
//   if (!publicParty) {
//     console.log("public party none")
//     return automation
//   }
//   await getPublicToken(publicParty).then(token => {
//     return token;
//   })
//   .then(token => {
//     if (token) {
//       console.log(`token in getautomations: ${token}`);
//       const publicHeaders = {
//         "Authorization": `Bearer ${token?.toString()}`,
//         'Content-Type': 'application/json'
//       }
//       const my_url = `https://${ledgerId}.${dablHostname}/.hub/v1/published`;
//       const result: Promise<PublicAutomationAPIResult> = fetch(my_url, { method: 'GET', headers: publicHeaders})
//         .then(response => response.json());
//       automation = result;
//     }
//   });
//   return automation;
//
// }

export const deployTrigger = async (artifactHash: string, trigger: MarketplaceTrigger, token: string, automations?: PublicAutomation[], publicParty?: string) => {
  // console.log(`trying with token: ${token}`);
  // getPublicAutomation(token).then(automations => {
    console.log(`found automations`);
    console.log(automations);
    console.log(`using token: ${token}`);
    const artifact = automations?.find(a => a.artifactHash === artifactHash);
    console.log(artifact);

    if (artifact) {
      const publicHeaders = {
        "Authorization": `Bearer ${token?.toString()}`,
        'Content-Type': 'application/json'
      }
      const deployUrl = `https://${ledgerId}.${dablHostname}/.hub/v1/published/deploy`;
      const result = fetch(deployUrl, {
        method: 'POST',
        headers: publicHeaders,
        body: JSON.stringify({
          artifactHash: artifact.artifactHash,
          owner: artifact.owner,
          name: trigger
        })}).then(response => response.json());
      result.then(x => console.log(x));
    }
  // })
}

export default deployTrigger
