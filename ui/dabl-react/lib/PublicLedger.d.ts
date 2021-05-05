import {PropsWithChildren} from 'react';
import {Party, Template} from '@daml/types';
import Ledger, {Query} from '@daml/ledger';
import {FetchResult, QueryResult} from '@daml/react';

declare type PublicProp = {
    ledgerId: string;
    publicParty: string;
    httpBaseUrl?: string;
    wsBaseUrl?: string;
    defaultToken?: string;
};
export declare function PublicLedger({ ledgerId, publicParty, httpBaseUrl, wsBaseUrl, defaultToken, children }: PropsWithChildren<PublicProp>): import("react").FunctionComponentElement<import("@daml/react/createLedgerContext").LedgerProps> | null;
export declare const usePartyAsPublic: () => Party;
export declare const useLedgerAsPublic: () => Ledger;
export declare function useQueryAsPublic<T extends object, K, I extends string>(template: Template<T, K, I>, queryFactory: () => Query<T>, queryDeps: readonly unknown[]): QueryResult<T, K, I>;
export declare function useQueryAsPublic<T extends object, K, I extends string>(template: Template<T, K, I>): QueryResult<T, K, I>;
export declare function useFetchByKeyAsPublic<T extends object, K, I extends string>(template: Template<T, K, I>, keyFactory: () => K, keyDeps: readonly unknown[]): FetchResult<T, K, I>;
export declare function useStreamQueryAsPublic<T extends object, K, I extends string>(template: Template<T, K, I>, queryFactory: () => Query<T>, queryDeps: readonly unknown[]): QueryResult<T, K, I>;
export declare function useStreamQueryAsPublic<T extends object, K, I extends string>(template: Template<T, K, I>): QueryResult<T, K, I>;
export declare function useStreamFetchByKeyAsPublic<T extends object, K, I extends string>(template: Template<T, K, I>, keyFactory: () => K, keyDeps: readonly unknown[]): FetchResult<T, K, I>;
export declare const useReloadAsPublic: () => () => void;
export {};
