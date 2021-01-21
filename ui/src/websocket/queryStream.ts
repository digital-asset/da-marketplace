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
import { ContractInfo } from "../components/common/damlTypes";


type QueryStream<T extends object = any, K = any, I extends string = any> = {
  templateIds: string[];
  contracts: ContractInfo<T>[];
  subscribeTemplate: (templateId: string) => void;
  getContractsByTemplate: (template: Template<T,K,I>) => ContractInfo<T>[];
}

const QueryStreamContext = createContext<QueryStream | undefined>(undefined);

const QueryStreamProvider = <T extends object, K = unknown, I extends string = string>(props: PropsWithChildren<any>) => {
  const { children } = props;
  const [ templateIds, setTemplateIds ] = useState<string[]>([]);

  const contracts = useDamlStreamQuery(templateIds);
  console.log("what's going on? ", contracts);

  const subscribeTemplate = (templateId: string) => {
    setTemplateIds(templateIds => [...templateIds, templateId]);
  }

  const getContractsByTemplate = useCallback(
    <A extends object, B = unknown, C extends string = string>(template: Template<A,B,C>): ContractInfo<A>[] => {
      const { templateId } = template;

      const contractForTemplate = contracts.filter(c => c.templateId === templateId) as ContractInfo<A>[]
      console.log("Let's examine: ", contractForTemplate, contracts);
      return contractForTemplate;
  }, [ contracts, templateIds, setTemplateIds ]);

  const [ queryStream, setQueryStream ] = useState<QueryStream<T,K,I>>({
    templateIds: [],
    contracts: [],
    subscribeTemplate,
    getContractsByTemplate
  });

  useEffect(() => {
    if (!_.isEqual(queryStream.contracts, contracts)) {
      setQueryStream({
        templateIds,
        contracts,
        subscribeTemplate,
        getContractsByTemplate
      })
    }
  }, [contracts, templateIds, queryStream.contracts, getContractsByTemplate, subscribeTemplate]);

  return React.createElement(QueryStreamContext.Provider, { value: queryStream }, children);
}

export function useContractQuery<T extends object, K = unknown, I extends string = string>(template: Template<T,K,I>) {
  const queryStream: QueryStream<T,K,I> | undefined = React.useContext(QueryStreamContext);

  if (queryStream === undefined) {
    throw new Error("useContractQuery must be called within a QueryStreamProvider");
  }

  useEffect(() => {
    const { templateId } = template;
    const { templateIds, subscribeTemplate } = queryStream;

    if (!templateIds.find(id => id === templateId)) {
      subscribeTemplate(templateId);
    }
  }, [template, queryStream]);

  return queryStream.getContractsByTemplate(template);
}

export default QueryStreamProvider;
