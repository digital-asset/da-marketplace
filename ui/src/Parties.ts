import { convertPartiesJson, PartyToken } from '@daml/hub-react'

const PARTIES_STORAGE_KEY = 'imported_parties';

export function storeParties(parties: PartyToken[]): void {
    localStorage.setItem(PARTIES_STORAGE_KEY, JSON.stringify(parties));
}

export function retrieveParties(publicParty: string, validateParties: boolean = true): PartyToken[] | undefined {
    const partiesJson = localStorage.getItem(PARTIES_STORAGE_KEY);

    if (!partiesJson) {
        return undefined;
    }

    try {
        const parties = convertPartiesJson(partiesJson, publicParty, validateParties);

        return parties;
    } catch (error) {
        console.warn("Tried to load an invalid parties file from cache.", error);

        if (validateParties) {
            localStorage.removeItem(PARTIES_STORAGE_KEY);
            return undefined;
        }
    }
}
