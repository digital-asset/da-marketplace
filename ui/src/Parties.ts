import {
  convertPartiesJson,
  InvalidPartiesError,
  PartiesInputErrors,
  PartyToken,
} from '@daml/hub-react';
import { cache } from './util';

const { save, remove, load } = cache({ permanent: true });

const PARTIES_STORAGE_KEY = 'imported_parties';

export function storeParties(parties: PartyToken[]): void {
  save(PARTIES_STORAGE_KEY, JSON.stringify(parties));
}

export function getPartiesJSON(): string | undefined {
  return load(PARTIES_STORAGE_KEY) || undefined;
}

export function retrieveParties(
  publicParty?: string,
  validateParties: boolean = true
): PartyToken[] {
  const partiesJson = getPartiesJSON();

  if (!partiesJson || !publicParty) {
    return [];
  }

  try {
    const parties = convertPartiesJson(partiesJson, publicParty, validateParties);
    return parties;
  } catch (error) {
    if (error instanceof InvalidPartiesError) {
      if (error.type === PartiesInputErrors.EmptyPartiesList) {
        console.warn('Parties file was found empty.');
      }
      return [];
    } else {
      if (validateParties) {
        remove(PARTIES_STORAGE_KEY);
      }
      return [];
    }
  }
}

export function retrieveUserParties(publicParty?: string): PartyToken[] {
  const parties = retrieveParties(publicParty);
  const adminParty = parties.find(p => p.partyName === 'UserAdmin');
  return parties.filter(p => p.party !== adminParty?.party && p.party !== publicParty);
}
