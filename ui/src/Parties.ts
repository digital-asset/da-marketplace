import { expiredToken } from '@daml/dabl-react'

import { ledgerId } from './config'
import { InvalidPartiesJSONError } from './components/common/errorTypes'

type PartyDetails = {
    ledgerId: string,
    owner: string,
    party: string,
    partyName: string,
    token: string,
}

function isPartyDetails(partyDetails: any): partyDetails is PartyDetails {
    return  typeof partyDetails.ledgerId === 'string' &&
            typeof partyDetails.owner === 'string' &&
            typeof partyDetails.party === 'string' &&
            typeof partyDetails.partyName === 'string' &&
            typeof partyDetails.token === 'string'
}

export type Parties = PartyDetails[];

function isParties(parties: any): parties is Parties {
    if (parties instanceof Array) {
        // True if any element of the array is not a PartyDetails
        const invalidPartyDetail = parties.reduce(
            (invalid, party) => invalid || !isPartyDetails(party),
            false
        );
        return !invalidPartyDetail;
    } else {
        return false;
    }
}

const PARTIES_STORAGE_KEY = 'imported_parties';

function validateParties(parties: Parties): void {
    // True if any ledgerIds do not match the app's deployed ledger Id
    const invalidLedger = parties.reduce((valid, party) => valid || (party.ledgerId !== ledgerId), false);

    // True if any token is expired
    const invalidTokens = parties.reduce((valid, party) => valid || expiredToken(party.token), false);

    if (invalidLedger) {
        throw new InvalidPartiesJSONError(`Your parties.json file is for a different ledger! File uses ledger ${parties.find(p => p.ledgerId !== ledgerId)?.ledgerId} but app is running on ledger ${ledgerId}`)
    }

    if (invalidTokens) {
        throw new InvalidPartiesJSONError("Your parties.json file contains expired tokens!")
    }
}

export function storeParties(parties: Parties): void {
    if (isParties(parties)) {
        validateParties(parties);
        localStorage.setItem(PARTIES_STORAGE_KEY, JSON.stringify(parties));
    } else {
        console.error("Did not find valid parties file; aborting store:", parties);
        throw new InvalidPartiesJSONError("Did you select the correct parties.json file?");
    }
}

export function retrieveParties(): Parties | undefined {
    const partiesRaw = localStorage.getItem(PARTIES_STORAGE_KEY);

    if (!partiesRaw) {
        return undefined;
    }

    try {
        const parties = JSON.parse(partiesRaw);
        if (isParties(parties)) {
            validateParties(parties);

            return parties;
        } else {
            throw new Error('Not a parties file');
        }
    } catch(err) {
        console.error("Could not parse parties: ", err);
    }
}
