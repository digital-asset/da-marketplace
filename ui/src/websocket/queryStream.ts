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
import { computeCredentials, retrieveCredentials } from "../Credentials";
import { DeploymentMode, deploymentMode, httpBaseUrl, ledgerId } from "../config";
import { useDablParties } from "../components/common/common";

export const AS_PUBLIC = true;

type QueryStream<T extends object = any, K = any, I extends string = any> = {
  publicTemplateIds: string[];
  publicContracts: ContractInfo<T>[];

  partyTemplateIds: string[];
  partyContracts: ContractInfo<T>[];
  subscribeTemplate: (templateId: string, isPublic?: boolean) => void;
}

const QueryStreamContext = createContext<QueryStream | undefined>(undefined);

const getPublicToken = async (publicParty: string): Promise<string | undefined> => {
  let publicToken = undefined;

  if (deploymentMode === DeploymentMode.DEV) {
    publicToken = computeCredentials(publicParty).token;
  } else {
    const url = new URL(httpBaseUrl || 'http://localhost:3000');
    const result = await fetch(`${url.hostname}/api/ledger/${ledgerId}/public/token`, { method: 'POST' })
      .then(response => response.json())

      // TO-DO: test on dabl
    console.log("The result is: ", result);
  }

  return publicToken;
}

const QueryStreamProvider = <T extends object, K = unknown, I extends string = string>(props: PropsWithChildren<any>) => {
  const { children } = props;
  const [ publicTemplateIds, setPublicTemplateIds ] = useState<string[]>([]);
  const [ partyTemplateIds, setPartyTemplateIds ] = useState<string[]>([]);

  const [ partyToken, setPartyToken ] = useState<string>();
  const [ publicToken, setPublicToken ] = useState<string>();

  useEffect(() => {
    const token = retrieveCredentials()?.token;
    setPartyToken(token);
  }, []);

  const publicParty = useDablParties().parties.publicParty;
  useEffect(() => {
    getPublicToken(publicParty).then(token => {
      if (token) {
        setPublicToken(token);
      }
    })
  }, [publicParty]);

  const partyContracts = useDamlStreamQuery(partyTemplateIds, partyToken);
  const publicContracts = useDamlStreamQuery(publicTemplateIds, publicToken);

  const subscribeTemplate = (templateId: string, asPublic?: boolean) => {
    if (asPublic) {
      setPublicTemplateIds(templateIds => [...templateIds, templateId]);
    } else {
      setPartyTemplateIds(templateIds => [...templateIds, templateId]);
    }
  }

  const [ queryStream, setQueryStream ] = useState<QueryStream<T,K,I>>({
    publicTemplateIds: [],
    publicContracts: [],

    partyTemplateIds: [],
    partyContracts: [],
    subscribeTemplate,
  });

  useEffect(() => {
    if (!_.isEqual(queryStream.partyContracts, partyContracts)) {
      setQueryStream({
        ...queryStream,
        partyTemplateIds,
        partyContracts
      })
    }
  }, [partyContracts, partyTemplateIds, queryStream.partyContracts]);

  useEffect(() => {
    if (!_.isEqual(queryStream.publicContracts, publicContracts)) {
      setQueryStream({
        ...queryStream,
        publicTemplateIds,
        publicContracts
      })
    }
  }, [publicContracts, publicTemplateIds, queryStream.publicContracts]);

  return React.createElement(QueryStreamContext.Provider, { value: queryStream }, children);
}

// export function useContractQuery
export function useContractQuery<T extends object, K = unknown, I extends string = string>(template: Template<T,K,I>, asPublic?: boolean) {
  const queryStream: QueryStream<T,K,I> | undefined = React.useContext(QueryStreamContext);

  if (queryStream === undefined) {
    throw new Error("useContractQuery must be called within a QueryStreamProvider");
  }

  console.log("Using query: ", template.templateId.slice(65));

  const { templateId } = template;
  const {
    publicTemplateIds,
    publicContracts,
    partyTemplateIds,
    partyContracts,
    subscribeTemplate
  } = queryStream;

  const filtered = useMemo(() => {
    if (!!asPublic) {
      return publicContracts.filter(c => c.templateId === templateId)
    } else {
      return partyContracts.filter(c => c.templateId === templateId)
    }
  }, [publicTemplateIds, publicContracts, partyTemplateIds, partyContracts]);

  useEffect(() => {
    if (asPublic === AS_PUBLIC) {
      if (!publicTemplateIds.find(id => id === templateId)) {
        subscribeTemplate(templateId, AS_PUBLIC);
      }
    }
  }, [templateId, publicTemplateIds, subscribeTemplate]);

  useEffect(() => {
    if (asPublic !== AS_PUBLIC) {
      if (!partyTemplateIds.find(id => id === templateId)) {
        subscribeTemplate(templateId);
      }
    }
  }, [templateId, partyTemplateIds, subscribeTemplate]);

  return filtered;
}

export default QueryStreamProvider;
