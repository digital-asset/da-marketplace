// import { CreateEvent } from '@daml/react'
//
import { useEffect, useState } from 'react'

import { CreateEvent} from '@daml/ledger'
import { QueryResult } from '@daml/react'
import { useStreamQuery } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'
// import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
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

export type ContractInfo<T> = {
    contractId: string;
    contractData: T;
}

type RegisteredInfo<T,R> = {
    contractId: string;
    contractData: T;
    registryData?: R;
}

// export function makeRegisteredInfo<T,R>(contracts: [any], registeredContracts: [R]) : RegisteredInfo<T,R> {
export function makeRegisteredInfo<T extends Object,R extends Object>(contracts: readonly CreateEvent<T, DamlTuple<unknown>, string>[],
     registeredContracts: readonly CreateEvent<R, DamlTuple<unknown>, string>[]) : RegisteredInfo<T,R>[] {
    const map = registeredContracts.reduce((accum, contract) => accum.set(damlTupleToString(contract.key), contract.payload), new Map<string, R>());
    const allRegistered = contracts.map(contract => ({contractId: contract.contractId, contractData: contract.payload, registryData: map.get(damlTupleToString(contract.key))}));
    console.log(contracts);

    return allRegistered;

    // return contracts.map(contract => ({contractId: contract.contractId,
    //         contractData: contract.payload,
    //         registryData: map.get(damlTupleToString(contract.key))}));

}
//
// export function makeRegisteredInfoTwo<T extends Object,R extends Object>(contracts: QueryResult<T, DamlTuple<unknown>, string>,
//     registeredContracts: QueryResult<R, DamlTuple<unknown>, string>) : RegisteredInfo<T, R>[] | undefined {
//     const [allReg, setAllReg] = useState<RegisteredInfo<T, R>[]>();
//     useEffect(() => {
//         const map = registeredContracts.contracts.reduce((accum, contract) => accum.set(damlTupleToString(contract.key), contract.payload), new Map<string, R>());
//         const allRegistered = contracts.contracts.map(contract => ({contractId: contract.contractId, contractData: contract.payload, registryData: map.get(damlTupleToString(contract.key))}));
//         setAllReg(allRegistered);
//     }, [contracts, registeredContracts]);
//     return allReg;
// }


// export function useRegisteredInfo<T, R>(

type ContractInfoName<T> = {
    contractId: string;
    contractData: T;
    name: string;
}

export type ExchangeInfoRegistered = RegisteredInfo<Exchange.Exchange, Registry.RegisteredExchange>; // ContractInfoName<Exchange.Exchange>;

export type RegistryExchangeInfo = RegisteredInfo<Exchange.Exchange, Registry.RegisteredExchange>;
export type ExchangeInfo = ContractInfo<Exchange.Exchange>; // ContractInfoName<Exchange.Exchange>;
export type DepositInfo = ContractInfo<Asset.AssetDeposit>;
export type TokenInfo = ContractInfo<Token.Token>;
export type ExchangeParticipantInfo = ContractInfo<ExchangeParticipant.ExchangeParticipant>;
export type ExchParticipantInviteInfo = ContractInfo<ExchangeParticipant.ExchangeParticipantInvitation>;
export type CustodianInfo = ContractInfo<Custodian.Custodian>;
export type RegisteredInvestorInfo = ContractInfo<Registry.RegisteredInvestor>;
