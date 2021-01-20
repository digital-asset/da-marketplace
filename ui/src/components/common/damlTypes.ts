import { CreateEvent } from '@daml/ledger'

import { Asset } from '@daml.js/da-marketplace/lib/DA/Finance'
import {
    BrokerCustomer,
    ExchangeParticipant,
    Exchange,
    Registry,
    Custodian,
    Notification,
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

export function makeContractInfo<T extends object, K = unknown, I extends string = string,>(event: CreateEvent<T,K,I>) : ContractInfo<T> {
    return ({contractId: event.contractId, contractData: event.payload});
}

export function wrapTextMap(items: string[]) {
    let textMapValue = Object.create(null);

    items.forEach((key: string) => {
        textMapValue[key] = {}
    });

    return { textMap: textMapValue }
}

export type ContractInfo<T> = {
    contractId: string;
    contractData: T;
}

export type DepositInfo = ContractInfo<Asset.AssetDeposit>;
export type TokenInfo = ContractInfo<Token.Token>;
export type BrokerCustomerInviteInfo = ContractInfo<BrokerCustomer.Invitation>;
export type BrokerCustomerInfo = ContractInfo<BrokerCustomer.BrokerCustomer>;
export type ExchangeInfo = ContractInfo<Exchange.Exchange>;
export type ExchangeParticipantInfo = ContractInfo<ExchangeParticipant.ExchangeParticipant>;
export type ExchParticipantInviteInfo = ContractInfo<ExchangeParticipant.ExchangeParticipantInvitation>;
export type CustodianInfo = ContractInfo<Custodian.Custodian>;
export type CustodianRelationshipInfo = ContractInfo<Custodian.CustodianRelationship>;
export type CustodianRelationshipRequestInfo = ContractInfo<Custodian.CustodianRelationshipRequest>;
export type RegisteredCustodianInfo = ContractInfo<Registry.RegisteredCustodian>;
export type RegisteredExchangeInfo = ContractInfo<Registry.RegisteredExchange>;
export type RegisteredInvestorInfo = ContractInfo<Registry.RegisteredInvestor>;
export type DismissibleNotificationInfo = ContractInfo<Notification.Dismissible>;
