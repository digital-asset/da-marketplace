import React, {PropsWithChildren, createContext, useEffect, useState, useMemo, useCallback } from "react";
import { CreateEvent, Event } from '@daml/ledger'
import { Template } from '@daml/types';
import _ from 'lodash';

import { useStreamQueryAsPublic } from '@daml/dabl-react'
import {
    RegisteredExchange,
    RegisteredCustodian,
    RegisteredBroker,
    RegisteredIssuer,
    RegisteredInvestor
} from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import useDamlStreamQuery from "./websocket";

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'


type QueryStream<T extends object = any, K = any, I extends string = any> = {
  contracts: any[];
  getContractsByTemplate: (template: Template<T,K,I>) => any[];
}

const QueryStreamContext = createContext<QueryStream | undefined>(undefined);

const QueryStreamProvider = <T extends object, K = unknown, I extends string = string>(props: PropsWithChildren<any>) => {
  const { children } = props;
  const [ templates, setTemplates ] = useState<Template<T,K,I>[]>([]);

  // const contracts = [] as any[];
  console.log("what's going on? ");
  const contracts = useDamlStreamQuery([Token]);

  const getContractsByTemplate = useCallback((template: Template<T,K,I>): any[] => {
    const { templateId } = template;
    if (!templates.find(t => t.templateId === templateId)) {
      setTemplates([...templates, template]);
    }
    return contracts.filter(c => c.templateId === templateId);
  }, [ contracts, templates ]);

  const [ queryStream, setQueryStream ] = useState<QueryStream<T,K,I>>({
    contracts: [],
    getContractsByTemplate
  });

  useEffect(() => {
    if (!_.isEqual(queryStream.contracts, contracts)) {
      setQueryStream({
        contracts,
        getContractsByTemplate
      })
    }
  }, [contracts, queryStream.contracts, getContractsByTemplate]);

  return React.createElement(QueryStreamContext.Provider, { value: queryStream }, children);
}

export function useContractQuery<T extends object, K = unknown, I extends string = string>(template: Template<T,K,I>) {
  const queryStream = React.useContext(QueryStreamContext);

  if (queryStream === undefined) {
    throw new Error("useContractQuery must be called within a QueryStreamProvider");
  }

  return queryStream.getContractsByTemplate(template);
}

// export function useRegistryLookup(){
//     var registryLookup = React.useContext(RegistryLookupContext);

//     if(registryLookup === undefined){
//         throw new Error("useRegistryLookup must be within RegistryLookup Provider");
//     }
//     return registryLookup;
// }

export default QueryStreamProvider;
