import React, {PropsWithChildren, createContext, useEffect, useState } from "react";
import {
    RegisteredExchange,
    RegisteredCustodian,
    RegisteredBroker,
    RegisteredIssuer,
    RegisteredInvestor
} from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { AS_PUBLIC, useContractQuery } from "../../websocket/queryStream";

export type RegistryLookup = {
    exchangeMap: Map<string, RegisteredExchange>;
    custodianMap: Map<string, RegisteredCustodian>;
    issuerMap: Map<string, RegisteredIssuer>;
    brokerMap: Map<string, RegisteredBroker>;
    investorMap: Map<string, RegisteredInvestor>;
}

const RegistryLookupContext = createContext<RegistryLookup | undefined>(undefined);
type RegistryLookupProps = {};

export function RegistryLookupProvider({children}: PropsWithChildren<RegistryLookupProps>) {
    const [ registryLookup, setRegistryLookup ] = useState<RegistryLookup>({
            exchangeMap: new Map(),
            custodianMap: new Map(),
            issuerMap: new Map(),
            brokerMap: new Map(),
            investorMap: new Map()
    });
    const exchanges = useContractQuery(RegisteredExchange, AS_PUBLIC);
    const custodians = useContractQuery(RegisteredCustodian, AS_PUBLIC);
    const brokers = useContractQuery(RegisteredBroker, AS_PUBLIC);
    const issuers = useContractQuery(RegisteredIssuer, AS_PUBLIC);
    const investors = useContractQuery(RegisteredInvestor, AS_PUBLIC);

    useEffect(() => {
        const exchangeMap = exchanges.reduce((accum, contract) => accum.set(contract.contractData.exchange, contract.contractData), new Map());
        const custodianMap = custodians.reduce((accum, contract) => accum.set(contract.contractData.custodian, contract.contractData), new Map());
        const brokerMap = brokers.reduce((accum, contract) => accum.set(contract.contractData.broker, contract.contractData), new Map());
        const issuerMap = issuers.reduce((accum, contract) => accum.set(contract.contractData.issuer, contract.contractData), new Map());
        const investorMap = investors.reduce((accum, contract) => accum.set(contract.contractData.investor, contract.contractData), new Map());

        setRegistryLookup({
            exchangeMap: exchangeMap,
            custodianMap: custodianMap,
            issuerMap: issuerMap,
            brokerMap: brokerMap,
            investorMap: investorMap
        });
    },[exchanges, custodians, brokers, issuers, investors]);

    return React.createElement(RegistryLookupContext.Provider, {value: registryLookup}, children);
}

export function useRegistryLookup(){
    var registryLookup = React.useContext(RegistryLookupContext);

    if(registryLookup === undefined){
        throw new Error("useRegistryLookup must be within RegistryLookup Provider");
    }
    return registryLookup;
}

export default RegistryLookupProvider;
