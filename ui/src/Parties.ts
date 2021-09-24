import {
  convertPartiesJson,
  InvalidPartiesError,
  PartiesInputErrors,
  PartyToken,
} from '@daml/hub-react';

import { publicParty } from './config';

const PARTIES_STORAGE_KEY = 'imported_parties';

export function storeParties(parties: PartyToken[]): void {
  sessionStorage.setItem(PARTIES_STORAGE_KEY, JSON.stringify(parties));
}

export function retrieveParties(validateParties: boolean = true): PartyToken[] {
  const partiesJson = sessionStorage.getItem(PARTIES_STORAGE_KEY);

  if (!partiesJson) {
    return [];
  }

  try {
    return convertPartiesJson(partiesJson, publicParty, validateParties);
  } catch (error) {
    if (error instanceof InvalidPartiesError) {
      if (error.type === PartiesInputErrors.EmptyPartiesList) {
        console.warn('Tried to load an invalid parties file from cache.', error);
      }
      return [];
    } else {
      if (validateParties) {
        sessionStorage.removeItem(PARTIES_STORAGE_KEY);
      }
      return [];
    }
  }
}

export function retrieveUserParties(): PartyToken[] {
  const parties = retrieveParties();
  const adminParty = parties.find(p => p.partyName === 'UserAdmin');
  return parties.filter(p => p.party !== adminParty?.party && p.party !== publicParty);
}
