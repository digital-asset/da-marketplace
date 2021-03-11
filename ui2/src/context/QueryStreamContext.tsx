import React, {PropsWithChildren, createContext, useEffect, useState, useMemo } from "react"
import _ from 'lodash'

import { Template } from '@daml/types'

// import { ContractInfo } from '../components/common/damlTypes'
// import { useDablParties } from '../components/common/common'
import { computeCredentials, retrieveCredentials } from '../Credentials'
import { DeploymentMode, deploymentMode, httpBaseUrl, ledgerId, dablHostname } from '../config'

import useDamlStreamQuery, { StreamErrors } from '../websocket'
import { CreateEvent } from "@daml/ledger"

export const AS_PUBLIC = true;

export type QueryStream<T extends object = any, K = unknown> = {
  publicTemplateIds: string[];
  publicContracts: CreateEvent<T,K>[];
  partyTemplateIds: string[];
  partyContracts: CreateEvent<T,K>[];
  streamErrors: any[] | undefined;
  publicLoading: boolean;
  partyLoading: boolean;
  publicToken?: string;
  subscribeTemplate: (templateId: string, isPublic?: boolean) => void;
}

export const QueryStreamContext = createContext<QueryStream | undefined>(undefined);

type PublicTokenAPIResult = {
  access_token: string
} | undefined;

export const getPublicToken = async (publicParty: string): Promise<string | undefined> => {
  let publicToken = undefined;

  if (deploymentMode === DeploymentMode.DEV) {
    publicToken = computeCredentials(publicParty).token;
  } else {
    const url = new URL(httpBaseUrl || 'http://localhost:3000');

    const result: PublicTokenAPIResult = await fetch(`https://${url.hostname}/api/ledger/${ledgerId}/public/token`, { method: 'POST' })
      .then(response => response.json())

    publicToken = result?.access_token;
  }

  return publicToken;
}


const QueryStreamProvider = <T extends object>(props: PropsWithChildren<any>) => {
  const { children } = props;
  const [ publicTemplateIds, setPublicTemplateIds ] = useState<string[]>([]);
  const [ partyTemplateIds, setPartyTemplateIds ] = useState<string[]>([]);

  const [ partyToken, setPartyToken ] = useState<string>();
  const [ publicToken, setPublicToken ] = useState<string>();

  const [ streamErrors, setStreamErrors ] = useState<StreamErrors[]>();

  useEffect(() => {
    const token = retrieveCredentials()?.token;
    setPartyToken(token);
  }, []);

  // const publicParty = useDablParties().parties.publicParty;
  const publicParty = "Public";
  useEffect(() => {
    getPublicToken(publicParty).then(token => {
      if (token) {
        setPublicToken(token);
        setQueryStream(queryStream => ({
          ...queryStream,
          publicToken: token
        }));
      }
    })
  }, [publicParty]);


  const { contracts: partyContracts, errors: partyStreamErrors, loading: partyLoading } = useDamlStreamQuery(partyTemplateIds, partyToken);
  const { contracts: publicContracts, errors: publicStreamErrors, loading: publicLoading } = useDamlStreamQuery(publicTemplateIds, publicToken);

  useEffect(() => {
    if (partyStreamErrors) {
      setStreamErrors(errors => errors?.concat([partyStreamErrors]) || [partyStreamErrors]);
    }

    if (publicStreamErrors) {
      setStreamErrors(errors => errors?.concat([publicStreamErrors]) || [publicStreamErrors])
    }
  }, [partyStreamErrors, publicStreamErrors]);

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
    streamErrors: [],
    subscribeTemplate,
    publicLoading,
    partyLoading,
    publicToken
  });

  useEffect(() => {
      setQueryStream(queryStream => ({
        ...queryStream,
        partyLoading,
        publicLoading
      }))
  }, [partyLoading, publicLoading]);

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

  useEffect(() => {
    if (!_.isEqual(queryStream.streamErrors, streamErrors)) {
      setQueryStream(queryStream => ({
        ...queryStream,
        streamErrors,
      }))
    }
  }, [streamErrors, queryStream.streamErrors]);

  return React.createElement(QueryStreamContext.Provider, { value: queryStream }, children);
}

export function usePublicToken() {
  const queryStream: QueryStream<any> | undefined = React.useContext(QueryStreamContext);
  return queryStream?.publicToken;
}

export function usePublicLoading() {
  const queryStream: QueryStream<any> | undefined = React.useContext(QueryStreamContext);
  return queryStream?.publicLoading;
}

export function usePartyLoading() {
  const queryStream: QueryStream<any> | undefined = React.useContext(QueryStreamContext);
  return queryStream?.partyLoading;
}

export function useLoading() {
  const queryStream: QueryStream<any> | undefined = React.useContext(QueryStreamContext);
  return queryStream?.publicLoading || queryStream?.partyLoading
}


export function useContractQuery<T extends object, K = unknown, I extends string = string>(template: Template<T,K,I>, asPublic?: boolean) {
  const queryStream: QueryStream<T> | undefined = React.useContext(QueryStreamContext);

  if (queryStream === undefined) {
    throw new Error("useContractQuery must be called within a QueryStreamProvider");
  }

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
      return publicContracts.filter(c => c.templateId === templateId) as CreateEvent<T,K>[]
    } else {
      return partyContracts.filter(c => c.templateId === templateId) as CreateEvent<T,K>[]
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
