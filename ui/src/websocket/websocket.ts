import { useCallback, useEffect, useState } from 'react';

import { ArchiveEvent, CreateEvent } from '@daml/ledger';
import * as jtv from '@mojotech/json-type-validation';

import { deploymentMode, DeploymentMode, httpBaseUrl, ledgerId } from '../config';
import { Template, ContractId, List, Text, Party } from '@daml/types';

// A custom code to indicate that the websocket should not be reopened.
// 4001 was picked arbitrarily from the range 4000-4999, which are codes that the official
//     WebSocket spec defines as unreserved, and available for use by the application.
const KEEP_CLOSED = 4001;

// Number of retries allowed before waiting
const RETRIES_ALLOWED = 2;

// Time between retries
const RETRY_TIME_INTERVAL = 5000;

// Time between messages until websocket is considered inactive
const TIME_UNTIL_INACTIVE = 10000;

const newDamlWebsocket = (token: string): WebSocket => {
  const url = new URL(httpBaseUrl || 'http://localhost:7575');

  const subprotocols = [`jwt.token.${token}`, 'daml.ws.auth'];
  const apiUrl =
    deploymentMode === DeploymentMode.DEV
      ? `ws://${url.host}/v1/stream/query`
      : `wss://${url.host}/data/${ledgerId}/v1/stream/query`;

  return new WebSocket(apiUrl, subprotocols);
};

function isCreateEvent<T extends object, K, I extends string = string>(
  event: object
): event is { created: CreateEvent<T, K, I> } {
  return 'created' in event;
}

function isArchiveEvent<T extends object, I extends string = string>(
  event: object
): event is { archived: ArchiveEvent<T, I> } {
  return 'archived' in event;
}

function isWarningMessage(event: object): event is { warnings: object } {
  return 'warnings' in event;
}

export type StreamErrors = {
  errors: string[];
};

function isErrorMessage(event: object): event is StreamErrors {
  return 'errors' in event;
}

// Decoder for a CreateEvent, copied from @daml/types
const decodeCreateEvent = <T extends object, K, I extends string>(
  template: Template<T, K, I>
): jtv.Decoder<CreateEvent<T, K, I>> =>
  jtv.object({
    templateId: jtv.constant(template.templateId),
    contractId: ContractId(template).decoder,
    signatories: List(Party).decoder,
    observers: List(Party).decoder,
    agreementText: Text.decoder,
    key: template.keyDecoder,
    payload: template.decoder,
  });

function useDamlStreamQuery<T extends object, K, I extends string>(
  templateIds: string[],
  templateMap: Map<string, Template<T, K, I>>,
  token?: string
) {
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [contracts, setContracts] = useState<CreateEvent<T, K, I>[]>([]);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<StreamErrors>();
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>(
    setInterval(() => {
      clearInterval(timer);
    }, 1000)
  );
  const [retries, setRetries] = useState(0);

  const messageHandlerScoped = useCallback(
    (templateMap: Map<string, Template<T, K, I>>) => {
      return (message: { data: string }) => {
        if (timer !== null) {
          clearInterval(timer);
          setTimer(
            setInterval(() => {
              setActive(false);
              clearInterval(timer);
            }, TIME_UNTIL_INACTIVE)
          );
        }
        setActive(true);
        setLoading(false);

        const data: { events: any[]; offset: string | undefined } = JSON.parse(message.data);

        if (isWarningMessage(data)) {
          console.warn('Warning emitted from Daml websocket: ', data.warnings);
        }

        if (isErrorMessage(data)) {
          console.error(
            `Errors emitted from Daml websocket: ${data.errors}. Shutting down stream.`
          );
          setErrors(data);
        }

        const { events } = data;

        if (events && events.length > 0) {
          events.forEach(e => {
            if (isCreateEvent(e)) {
              const template = templateMap.get(e.created.templateId);
              if (!template) {
                console.log(`could not find ${e.created.templateId}`);
                return;
              }
              const contract = decodeCreateEvent(template).runWithException(e.created);
              if (!contracts.find(c => c.contractId === contract.contractId)) {
                setContracts(contracts => [...contracts, contract]);
              }
            }

            if (isArchiveEvent(e)) {
              const contractId = e.archived.contractId;
              if (contracts.find(c => c.contractId === contractId)) {
                setContracts(contracts => [...contracts.filter(c => c.contractId !== contractId)]);
              }
            }
          });
        }
      };
    },
    [contracts, timer]
  );

  const openWebsocket = useCallback(async (token: string, templateIds: string[]) => {
    const ws = newDamlWebsocket(token);

    ws.onopen = () => {
      ws.send(JSON.stringify({ templateIds }));
    };

    return ws;
  }, []);

  const closeWebsocket = useCallback(() => {
    return (event: CloseEvent) => {
      // If this connection was closed unintentionally, set it to `null` to mark for the
      // initialization effect hook to restart it.
      if (event.code !== KEEP_CLOSED) {
        setActive(false);
        if (retries <= RETRIES_ALLOWED) {
          setRetries(retries + 1);
          setWebsocket(null);
        } else {
          setTimeout(() => {
            setRetries(0);
            setWebsocket(null);
          }, RETRY_TIME_INTERVAL);
        }
      }
    };
  }, [retries]);

  useEffect(() => {
    // initialize websocket
    if (!websocket && !errors && token && templateIds.length > 0) {
      openWebsocket(token, templateIds).then(ws => {
        setWebsocket(ws);
      });
    }

    return () => {
      if (websocket) {
        websocket.close(KEEP_CLOSED);
        setWebsocket(null);
      }
    };
  }, [errors, token, templateIds, templateMap, websocket, setWebsocket, openWebsocket]);

  useEffect(() => {
    if (websocket === null) {
      clearInterval(timer);
    }
  }, [websocket, timer]);

  useEffect(() => {
    if (websocket && token) {
      websocket.onclose = closeWebsocket();
    }
  }, [templateIds, token, websocket, closeWebsocket]);

  useEffect(() => {
    if (websocket && token) {
      websocket.onmessage = messageHandlerScoped(templateMap);
    }
  }, [token, websocket, templateMap, messageHandlerScoped]);

  return { contracts, errors, loading, active };
}

export default useDamlStreamQuery;
