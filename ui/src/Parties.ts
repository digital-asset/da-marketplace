import { convertPartiesJson, PartyToken, InvalidPartiesError, PartiesInputErrors } from '@daml/hub-react'

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
        return convertPartiesJson(partiesJson, publicParty, validateParties);
    } catch (error) {
        console.log(typeof error, (error as any)?.message, (error as any)?.name);
        if (error instanceof InvalidPartiesError) {
            if (error.type === PartiesInputErrors.EmptyPartiesList) {
                console.warn("Tried to load an invalid parties file from cache.", error);
            }
        }
        else {
            console.warn("OTHER ERROR FOUND: ", error);
            if (validateParties) {
                console.warn("REMOVING PARTIES STORAGE!");
                localStorage.removeItem(PARTIES_STORAGE_KEY);
                return undefined;
            }
        }
    }
}
