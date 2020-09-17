import { PropsWithChildren } from 'react';
import { LedgerContext } from '@daml/react';
declare type PublicProp = {
    ledgerId: string;
    publicParty: string;
    httpBaseUrl?: string;
    wsBaseUrl?: string;
    defaultToken?: string;
};
export declare function PublicLedger({ ledgerId, publicParty, httpBaseUrl, wsBaseUrl, defaultToken, children }: PropsWithChildren<PublicProp>): import("react").FunctionComponentElement<import("@daml/react/createLedgerContext").LedgerProps> | null;
export declare const usePartyAsPublic: () => string;
export declare const useLedgerAsPublic: LedgerContext["useLedger"];
export declare const useQueryAsPublic: LedgerContext["useQuery"];
export declare const useFetchByKeyAsPublic: LedgerContext["useFetchByKey"];
export declare const useStreamQueryAsPublic: LedgerContext["useStreamQuery"];
export declare const useStreamFetchByKeyAsPublic: LedgerContext["useStreamFetchByKey"];
export declare const useReloadAsPublic: () => () => void;
export {};
