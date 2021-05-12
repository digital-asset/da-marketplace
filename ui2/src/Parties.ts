import { convertPartiesJson, PartyDetails } from '@daml/hub-react';

import { ledgerId, publicParty } from './config';

const PARTIES_STORAGE_KEY = 'imported_parties';

export function storeParties(parties: PartyDetails[]): void {
  localStorage.setItem(PARTIES_STORAGE_KEY, JSON.stringify(parties));
}

export function retrieveParties(validateParties: boolean = true): PartyDetails[] | undefined {
  const partiesJson = localStorage.getItem(PARTIES_STORAGE_KEY);

  if (!partiesJson) {
    return undefined;
  }

  const [parties, error] = convertPartiesJson(partiesJson, ledgerId, validateParties);

  if (error) {
    console.warn('Tried to load an invalid parties file from cache.', error);

    if (validateParties) {
      localStorage.removeItem(PARTIES_STORAGE_KEY);
      return undefined;
    }
  }

  return parties;
}

function filterDefaultParties(partyList: PartyDetails[]) {
  const adminParty = partyList.find(p => p.partyName === 'UserAdmin');
  return partyList.filter(p => p.party != adminParty?.party && p.party != publicParty);
}

export function retrieveUserParties() {
  const parties = retrieveParties() || [];
  return filterDefaultParties(parties);
}
