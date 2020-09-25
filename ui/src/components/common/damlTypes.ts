import { Asset } from '@daml.js/da-marketplace/lib/DA/Finance'
import {
    ExchangeParticipant,
    Exchange,
    Custodian,
    Registry,
    Token
} from '@daml.js/da-marketplace/lib/Marketplace'

type DamlTuple<T> = {
    [key: string]: T;
}

function cmpUnderscoredKeys(keyA: string, keyB: string): number {
    const numA = Number(keyA.slice(1));
    const numB = Number(keyB.slice(1));

    if (numA > numB) {
        return 1;
    }
    if (numA < numB) {
        return -1;
    }
    return 0;
}

export function wrapDamlTuple<T>(items: T[]): DamlTuple<T> {
    let tuple: DamlTuple<T> = {};
    items.forEach((item, index) => tuple[`_${index+1}`] = item);

    return tuple;
}

export function unwrapDamlTuple<T>(tuple: DamlTuple<T>): T[] {
    // Make sure we don't run into sorting weirdness if there's a tuple with `_1` and `_10` or similar
    const sortedKeys = Object.keys(tuple).sort(cmpUnderscoredKeys);
    return sortedKeys.map(key => tuple[key]);
}

export function getAccountProvider(accountLabel: string): string | undefined {
    return accountLabel.split('@')[1].replace(/'/g, '');
}

export type ContractInfo<T> = {
    contractId: string;
    contractData: T;
}

export type ExchangeInfo = ContractInfo<Exchange.Exchange>;
export type DepositInfo = ContractInfo<Asset.AssetDeposit>;
export type TokenInfo = ContractInfo<Token.Token>;
export type ExchangeParticipantInfo = ContractInfo<ExchangeParticipant.ExchangeParticipant>;
export type ExchParticipantInviteInfo = ContractInfo<ExchangeParticipant.ExchangeParticipantInvitation>;
export type CustodianInfo = ContractInfo<Custodian.Custodian>;
export type RegisteredInvestorInfo = ContractInfo<Registry.RegisteredInvestor>;
