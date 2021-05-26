import React, { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

import { Template } from '@daml/types';

import { computeCredentials, retrieveCredentials } from '../Credentials';
import { DeploymentMode, deploymentMode, httpBaseUrl, ledgerId } from '../config';

import useDamlStreamQuery, { StreamErrors } from './websocket';
import { CreateEvent } from '@daml/ledger';
import { useWellKnownParties } from '@daml/hub-react/lib';

const AS_PUBLIC = true;

type QueryStream = {
  templateMap: Map<string, Template<any, any, any>>;
  publicTemplateIds: string[];
  publicContracts: CreateEvent<any, any, any>[];
  partyTemplateIds: string[];
  partyContracts: CreateEvent<any, any, any>[];
  streamErrors: any[] | undefined;
  publicLoading: boolean;
  partyLoading: boolean;
  publicToken?: string;
  subscribeTemplate: (
    templateId: string,
    template: Template<any, any, any>,
    isPublic?: boolean
  ) => void;
  connectionActive: boolean;
};

const QueryStreamContext = createContext<QueryStream | undefined>(undefined);

type PublicTokenAPIResult =
  | {
      access_token: string;
    }
  | undefined;

const getPublicToken = async (publicParty: string): Promise<string | undefined> => {
  let publicToken = undefined;

  if (deploymentMode === DeploymentMode.DEV) {
    publicToken = computeCredentials(publicParty).token;
  } else {
    const url = new URL(httpBaseUrl || 'http://localhost:3000');

    const result: PublicTokenAPIResult = await fetch(
      `https://${url.hostname}/api/ledger/${ledgerId}/public/token`,
      { method: 'POST' }
    ).then(response => response.json());

    publicToken = result?.access_token;
  }

  return publicToken;
};

const QueryStreamProvider = (props: PropsWithChildren<any> & { defaultPartyToken?: string }) => {
  const { children, defaultPartyToken } = props;
  const [templateMap, setTemplateMap] = useState<Map<string, Template<any, any, any>>>(new Map());
  const [publicTemplateIds, setPublicTemplateIds] = useState<string[]>([]);
  const [partyTemplateIds, setPartyTemplateIds] = useState<string[]>([]);

  const [partyToken, setPartyToken] = useState<string>();
  const [publicToken, setPublicToken] = useState<string>();

  const [streamErrors, setStreamErrors] = useState<StreamErrors[]>();

  useEffect(() => {
    if (defaultPartyToken) {
      setPartyToken(defaultPartyToken);
    } else {
      const token = retrieveCredentials()?.token;
      if (token) {
        setPartyToken(token);
      }
    }
  }, []);

  const publicParty = useWellKnownParties()?.parties?.publicParty || 'Public';

  useEffect(() => {
    getPublicToken(publicParty).then(token => {
      if (token) {
        setPublicToken(token);
        setQueryStream(queryStream => ({
          ...queryStream,
          publicToken: token,
        }));
      }
    });
  }, [publicParty]);

  const {
    contracts: partyContracts,
    errors: partyStreamErrors,
    loading: partyLoading,
    active: connectionActive,
  } = useDamlStreamQuery(partyTemplateIds, templateMap, partyToken);

  const {
    contracts: publicContracts,
    errors: publicStreamErrors,
    loading: publicLoading,
  } = useDamlStreamQuery(publicTemplateIds, templateMap, publicToken);

  useEffect(() => {
    if (partyStreamErrors) {
      setStreamErrors(errors => errors?.concat([partyStreamErrors]) || [partyStreamErrors]);
    }

    if (publicStreamErrors) {
      setStreamErrors(errors => errors?.concat([publicStreamErrors]) || [publicStreamErrors]);
    }
  }, [partyStreamErrors, publicStreamErrors]);

  const subscribeTemplate = (
    templateId: string,
    template: Template<any, any, any>,
    asPublic?: boolean
  ) => {
    if (asPublic) {
      setTemplateMap(prev => new Map(prev).set(templateId, template));
      setPublicTemplateIds(templateIds => [...templateIds, templateId]);
    } else {
      setTemplateMap(prev => new Map(prev).set(templateId, template));
      setPartyTemplateIds(templateIds => [...templateIds, templateId]);
    }
  };

  const [queryStream, setQueryStream] = useState<QueryStream>({
    publicTemplateIds: [],
    publicContracts: [],
    partyTemplateIds: [],
    partyContracts: [],
    streamErrors: [],
    subscribeTemplate,
    publicLoading,
    partyLoading,
    publicToken,
    connectionActive,
    templateMap,
  });

  useEffect(() => {
    setQueryStream(queryStream => ({
      ...queryStream,
      partyLoading,
      publicLoading,
    }));
  }, [partyLoading, publicLoading]);

  useEffect(() => {
    setQueryStream(queryStream => ({
      ...queryStream,
      connectionActive,
    }));
  }, [connectionActive]);

  useEffect(() => {
    if (!_.isEqual(queryStream.partyContracts, partyContracts)) {
      setQueryStream(queryStream => ({
        ...queryStream,
        partyTemplateIds,
        partyContracts,
      }));
    }
  }, [partyContracts, partyTemplateIds, queryStream.partyContracts]);

  useEffect(() => {
    if (!_.isEqual(queryStream.publicContracts, publicContracts)) {
      setQueryStream(queryStream => ({
        ...queryStream,
        publicTemplateIds,
        publicContracts,
      }));
    }
  }, [publicContracts, publicTemplateIds, queryStream.publicContracts]);

  useEffect(() => {
    if (!_.isEqual(queryStream.streamErrors, streamErrors)) {
      setQueryStream(queryStream => ({
        ...queryStream,
        streamErrors,
      }));
    }
  }, [streamErrors, queryStream.streamErrors]);

  return React.createElement(QueryStreamContext.Provider, { value: queryStream }, children);
};

export function useContractQuery<T extends object, K, I extends string = string>(
  template: Template<T, K, I>,
  asPublic?: boolean
) {
  const queryStream: QueryStream | undefined = React.useContext(QueryStreamContext);

  if (queryStream === undefined) {
    throw new Error('useContractQuery must be called within a QueryStreamProvider');
  }

  const { templateId } = template;
  const {
    publicTemplateIds,
    publicContracts,
    partyTemplateIds,
    partyContracts,
    partyLoading,
    publicLoading,
    subscribeTemplate,
  } = queryStream;

  const filtered = useMemo(() => {
    if (!!asPublic) {
      return {
        contracts: publicContracts.filter(c => c.templateId === templateId),
        loading: publicLoading,
      };
    } else {
      return {
        contracts: partyContracts.filter(c => c.templateId === templateId),
        loading: partyLoading,
      };
    }
  }, [asPublic, templateId, publicLoading, partyLoading, publicContracts, partyContracts]);

  useEffect(() => {
    if (asPublic === AS_PUBLIC) {
      if (!publicTemplateIds.find(id => id === templateId)) {
        subscribeTemplate(templateId, template, AS_PUBLIC);
      }
    }
  }, [asPublic, templateId, publicTemplateIds, subscribeTemplate]);

  useEffect(() => {
    if (asPublic !== AS_PUBLIC) {
      if (!partyTemplateIds.find(id => id === templateId)) {
        subscribeTemplate(templateId, template);
      }
    }
  }, [asPublic, templateId, partyTemplateIds, subscribeTemplate]);

  return filtered;
}

export default QueryStreamProvider;
