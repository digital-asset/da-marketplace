import { ledgerId } from "./config";
import {PublicAutomation} from "./websocket/queryStream";

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

export const deployTrigger = (artifactHash: string, trigger: MarketplaceTrigger, token?: string, automations?: PublicAutomation[]) => {
  const artifact = automations?.find(a => a.artifactHash === artifactHash);
  console.log(`artifact: ${artifact}`);

  if (artifact && token) {
    const publicHeaders = {
      "Authorization": `Bearer ${token?.toString()}`,
      'Content-Type': 'application/json'
    }
    const deployUrl = `https://${ledgerId}.projectdabl.com/.hub/v1/published/deploy`;
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
}

export default deployTrigger
