import React, {PropsWithChildren, createContext, useEffect, useState, useMemo } from "react"
import _ from 'lodash'

import { Template } from '@daml/types'

import { ContractInfo } from '../components/common/damlTypes'
import { useDablParties } from '../components/common/common'
import { computeCredentials, retrieveCredentials } from '../Credentials'
import { DeploymentMode, deploymentMode, httpBaseUrl, ledgerId } from '../config'

import useDamlStreamQuery from './websocket'

export const AS_PUBLIC = true;

type QueryStream<T extends object = any> = {
  publicTemplateIds: string[];
  publicContracts: ContractInfo<T>[];

  partyTemplateIds: string[];
  partyContracts: ContractInfo<T>[];
  subscribeTemplate: (templateId: string, isPublic?: boolean) => void;
}

const QueryStreamContext = createContext<QueryStream | undefined>(undefined);

type PublicTokenAPIResult = {
  access_token: string
} | undefined;

const getPublicToken = async (publicParty: string): Promise<string | undefined> => {
  let publicToken = undefined;

  if (deploymentMode === DeploymentMode.DEV) {
    publicToken = computeCredentials(publicParty).token;
  } else {
    const url = new URL(httpBaseUrl || 'http://localhost:3000');

    console.log("What's the URL? ", httpBaseUrl, url);

    const result: PublicTokenAPIResult = await fetch(`https://${url.hostname}/api/ledger/${ledgerId}/public/token`, { method: 'POST' })
      .then(response => response.json())

    publicToken = result?.access_token;

      // TO-DO: test on dabl
    console.log("The result is: ", result);
  }

  return publicToken;
}

const QueryStreamProvider = <T extends object>(props: PropsWithChildren<any>) => {
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

  const [ queryStream, setQueryStream ] = useState<QueryStream<T>>({
    publicTemplateIds: [],
    publicContracts: [],

    partyTemplateIds: [],
    partyContracts: [],
    subscribeTemplate,
  });

  useEffect(() => {
    if (!_.isEqual(queryStream.partyContracts, partyContracts)) {
      setQueryStream(queryStream => ({
        ...queryStream,
        partyTemplateIds,
        partyContracts
      }))
    }
  }, [partyContracts, partyTemplateIds, queryStream.partyContracts]);

  useEffect(() => {
    if (!_.isEqual(queryStream.publicContracts, publicContracts)) {
      setQueryStream(queryStream => ({
        ...queryStream,
        publicTemplateIds,
        publicContracts
      }))
    }
  }, [publicContracts, publicTemplateIds, queryStream.publicContracts]);

  return React.createElement(QueryStreamContext.Provider, { value: queryStream }, children);
}

// export function useContractQuery
export function useContractQuery<T extends object, K = unknown, I extends string = string>(template: Template<T,K,I>, asPublic?: boolean) {
  const queryStream: QueryStream<T> | undefined = React.useContext(QueryStreamContext);

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
  }, [asPublic, templateId, publicContracts, partyContracts]);

  useEffect(() => {
    if (asPublic === AS_PUBLIC) {
      if (!publicTemplateIds.find(id => id === templateId)) {
        subscribeTemplate(templateId, AS_PUBLIC);
      }
    }
  }, [asPublic, templateId, publicTemplateIds, subscribeTemplate]);

  useEffect(() => {
    if (asPublic !== AS_PUBLIC) {
      if (!partyTemplateIds.find(id => id === templateId)) {
        subscribeTemplate(templateId);
      }
    }
  }, [asPublic, templateId, partyTemplateIds, subscribeTemplate]);

  return filtered;
}

export default QueryStreamProvider;
