import React, { PropsWithChildren } from "react";
/**
 * @param userAdminParty ID of the UserAdmin party on a ledger.
 * @param publicParty ID of the Public party on a ledger.
 */
export declare type WellKnownParties = {
    userAdminParty: string;
    publicParty: string;
};
declare type WellKnownPartiesProviderProps = {
    defaultWkp?: WellKnownParties;
};
/**
 * A React context within which you can use the [[useWellKnowParties]] hook.
 *
 * @param defaultWkp An optional [[WellKnownParties]] that will be returned if the fetch fails.
 */
export declare function WellKnownPartiesProvider({ defaultWkp, children }: PropsWithChildren<WellKnownPartiesProviderProps>): React.FunctionComponentElement<React.ProviderProps<WellKnownParties | undefined>> | null;
/**
 * React hook the Well Known parties.
 */
export declare function useWellKnownParties(): WellKnownParties;
export {};
