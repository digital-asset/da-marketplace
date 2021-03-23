import { CreateEvent } from '@daml/ledger'

import { Asset } from '@daml.js/da-marketplace/lib/DA/Finance'
import {
    CentralCounterpartyCustomer,
    Broker,
    BrokerCustomer,
    ExchangeParticipant,
    Exchange,
    Registry,
    Custodian,
    Clearing,
    Investor,
    Issuer,
    Notification,
    Token,
    Derivative
} from '@daml.js/da-marketplace/lib/Marketplace'
import { ContractId, List } from '@daml/types';

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

export function makeContractInfo<T extends object, K = unknown, I extends string = string,>(event: CreateEvent<T,K,I>) : ContractInfo<T, K> {
    return ({
        key: event.key,
        templateId: event.templateId,
        contractId: event.contractId,
        signatories: event.signatories,
        contractData: event.payload
    });
}

export function wrapTextMap(items: string[]) {
    let textMapValue = Object.create(null);

    items.forEach((key: string) => {
        textMapValue[key] = {}
    });

    return { map: textMapValue }
}

export type RelationshipRequestChoice =
    typeof Investor.Investor.Investor_RequestCustodianRelationship |
    typeof Issuer.Issuer.Issuer_RequestCustodianRelationship |
    typeof Broker.Broker.Broker_RequestCustodianRelationship |
    typeof Exchange.Exchange.Exchange_RequestCustodianRelationship;

export type ContractInfo<T, K = unknown> = {
    templateId: string;
    key: K;
    contractId: ContractId<T>;
    signatories: List<string>;
    contractData: T;
}

export type BrokerCustomerInfo = ContractInfo<
    BrokerCustomer.BrokerCustomer,
    BrokerCustomer.BrokerCustomer.Key>;

export type BrokerCustomerInviteInfo = ContractInfo<BrokerCustomer.BrokerCustomerInvitation>;

export type CCPCustomerInfo = ContractInfo<
    CentralCounterpartyCustomer.CCPCustomer,
    CentralCounterpartyCustomer.CCPCustomer.Key>;

export type CCPCustomerInviteInfo = ContractInfo<CentralCounterpartyCustomer.CCPCustomerInvitation>;

export type CustodianInfo = ContractInfo<
    Custodian.Custodian,
    Custodian.Custodian.Key>;

export type CustodianRelationshipInfo = ContractInfo<
    Custodian.CustodianRelationship,
    Custodian.CustodianRelationship.Key>;

export type CustodianRelationshipRequestInfo = ContractInfo<
    Custodian.CustodianRelationshipRequest,
    Custodian.CustodianRelationshipRequest.Key>;

export type DepositInfo = ContractInfo<Asset.AssetDeposit>;

export type DismissibleNotificationInfo = ContractInfo<Notification.DismissibleNotification>;

export type ExchangeInfo = ContractInfo<
    Exchange.Exchange,
    Exchange.Exchange.Key>;

export type MarketPairInfo = ContractInfo<
    Token.MarketPair,
    Token.MarketPair.Key>;

export type ExchangeParticipantInfo = ContractInfo<
    ExchangeParticipant.ExchangeParticipant,
    ExchangeParticipant.ExchangeParticipant.Key>;

export type ExchParticipantInviteInfo = ContractInfo<ExchangeParticipant.ExchangeParticipantInvitation>;

export type RejectedMarginCalculationInfo = ContractInfo<
    Clearing.RejectedMarginCalculation,
    Clearing.RejectedMarginCalculation.Key>;

export type RejectedMarkToMarketCalculationInfo = ContractInfo<
    Clearing.RejectedMarkToMarketCalculation,
    Clearing.RejectedMarkToMarketCalculation.Key>;

export type ManualFairValueCalculationInfo = ContractInfo<Derivative.ManualFairValueCalculation>;

export type RegisteredCustodianInfo = ContractInfo<
    Registry.RegisteredCustodian,
    Registry.RegisteredCustodian.Key>;

export type RegisteredExchangeInfo = ContractInfo<
    Registry.RegisteredExchange,
    Registry.RegisteredExchange.Key>;

export type RegisteredInvestorInfo = ContractInfo<
    Registry.RegisteredInvestor,
    Registry.RegisteredInvestor.Key>;

export type TokenInfo = ContractInfo<
    Token.Token,
    Token.Token.Key>;

export type DerivativeInfo = ContractInfo<
    Derivative.Derivative,
    Derivative.Derivative.Key>;
