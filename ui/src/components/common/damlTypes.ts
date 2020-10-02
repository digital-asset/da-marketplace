import { CreateEvent } from '@daml/ledger'
import { QueryResult } from '@daml/react'

import { Asset } from '@daml.js/da-marketplace/lib/DA/Finance'
import {
    ExchangeParticipant,
    Exchange,
    Registry,
    Custodian,
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

export function damlTupleToString<T>(tuple: DamlTuple<T>): string {
    const sortedKeys = Object.keys(tuple).sort(cmpUnderscoredKeys);
    return sortedKeys.reduce((accum, key) => accum + tuple[key], "");
}

export function getAccountProvider(accountLabel: string): string | undefined {
    return accountLabel.split('@')[1].replace(/'/g, '');
}

export function makeAllRegisteredInfo<T extends object, R extends object, I extends string = string>
                    (events: QueryResult<T,DamlTuple<unknown>,I>,
                     registeredEvents: QueryResult<R,DamlTuple<unknown>,I>) : RegisteredInfo<T,R>[] {

    const registeredMap = registeredEvents.contracts.reduce((accum, contract) =>
        accum.set(damlTupleToString(contract.key), contract.payload), new Map());

    return events.contracts.map(contract => ({contractId: contract.contractId,
            contractData: contract.payload,
            registryData: registeredMap.get(damlTupleToString(contract.key))}));
}

// export function makeAllRegisteredInfo<T extends object, R extends object, I extends string = string>
//                     (events: readonly CreateEvent<T,DamlTuple<unknown>,I>[],
//                      registeredEvents: readonly CreateEvent<R,DamlTuple<unknown>,I>[]) : RegisteredInfo<T,R>[] {
//
//     const registeredMap = registeredEvents.reduce((accum, contract) =>
//         accum.set(damlTupleToString(contract.key), contract.payload), new Map());
//
//     return events.map(contract => ({contractId: contract.contractId,
//             contractData: contract.payload,
//             registryData: registeredMap.get(damlTupleToString(contract.key))}));
// }

export function makeContractInfo<T extends object, K = unknown, I extends string = string,>(event: CreateEvent<T,K,I>) : ContractInfo<T> {
    return ({contractId: event.contractId, contractData: event.payload});
}


export type ContractInfo<T> = {
    contractId: string;
    contractData: T;
}

type RegisteredInfo<T,R> = {
    contractId: string;
    contractData: T;
    registryData?: R;
}

export type ExchangeInfoRegistered = RegisteredInfo<Exchange.Exchange, Registry.RegisteredExchange>;
export type ExchangeInfo = ContractInfo<Exchange.Exchange>;
export type RegisteredExchangeInfo = ContractInfo<Registry.RegisteredExchange>;
export type DepositInfo = ContractInfo<Asset.AssetDeposit>;
export type TokenInfo = ContractInfo<Token.Token>;
export type ExchangeParticipantInfo = ContractInfo<ExchangeParticipant.ExchangeParticipant>;
export type ExchParticipantInviteInfo = ContractInfo<ExchangeParticipant.ExchangeParticipantInvitation>;
export type CustodianInfo = ContractInfo<Custodian.Custodian>;
export type CustodianRelationshipInfo = ContractInfo<Custodian.CustodianRelationship>;
export type RegisteredInvestorInfo = ContractInfo<Registry.RegisteredInvestor>;
export type RegisteredCustodianInfo = ContractInfo<Registry.RegisteredCustodian>;
