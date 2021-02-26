import * as jwt from "jsonwebtoken";
import { parties } from "./parties";
import { names } from "./names";
import { tokens } from "./tokens";

export const isLocalDev = process.env.NODE_ENV === 'development';

const host = window.location.host.split('.');
const ledgerId = isLocalDev ? "da-marketplace-sandbox" : host[0];
const apiUrl = host.slice(1);
apiUrl.unshift('api');

export const httpBaseUrl = isLocalDev ? undefined : ('https://' + apiUrl.join('.') + (window.location.port ? ':' + window.location.port : '') + '/data/' + ledgerId + '/');
export const wsBaseUrl = isLocalDev ? 'ws://localhost:7575/' : undefined;

const applicationId = "se2life";
const createToken = (party : string) => jwt.sign({ "https://daml.com/ledger-api": { ledgerId, applicationId, admin: true, actAs: [party], readAs: [party, "Public"] } }, "secret");

let loginUrl = host.slice(1)
loginUrl.unshift('login')
export const dablLoginUrl = loginUrl.join('.') + (window.location.port ? ':' + window.location.port : '') + '/auth/login?ledgerId=' + ledgerId;

export function getParty(name : string) {
  return isLocalDev ? name : (parties.get(name) || "");
}

export function getName(party : string) {
  return isLocalDev ? party : (names.get(party) || "");
}

export function getToken(party : string) {
  return isLocalDev ? createToken(party) : (tokens.get(party) || "");
}

export function getTemplateId(t : string) {
  const parts = t.split(":").slice(1)
  return parts[0] + "." + parts[1];
}
