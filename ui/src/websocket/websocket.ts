import { useState, useEffect, useReducer, useMemo, useCallback } from 'react'

import { CreateEvent, Event } from '@daml/ledger'

import { deploymentMode, DeploymentMode, httpBaseUrl } from '../config'
import { retrieveCredentials } from '../Credentials'
import { Template } from '@daml/types'

import { ContractInfo, makeContractInfo } from '../components/common/damlTypes'

// A custom code to indicate that the websocket should not be reopened.
// 4001 was picked arbitrarily from the range 4000-4999, which are codes that the official
//     WebSocket spec defines as unreserved, and available for use by the application.
const KEEP_CLOSED = 4001;

type QueryStream<T> = {
    contracts: ContractInfo<T>[];
    offset: string;
}

const newDamlWebsocket = (token: string): WebSocket => {
  const url = new URL(httpBaseUrl || 'http://localhost:3000');

  const subprotocols = [`jwt.token.${token}`, "daml.ws.auth"];
  console.log("hmmmmmmmmm", DeploymentMode.DEV)
  const protocol = deploymentMode == DeploymentMode.DEV ? 'ws://' : 'wss://';

  return new WebSocket(`${protocol}${url.host}/v1/stream/query`, subprotocols);
}

function isCreateEvent<T extends object, K = unknown, I extends string = string>(event: object): event is { created: CreateEvent<T,K,I>} {
  return 'created' in event;
}

function isEvent<T extends object, K = unknown, I extends string = string>(event: object): event is Event<T,K,I> {
  return 'created' in event;
}

function useDamlStreamQuery<T extends object, K = unknown, I extends string = string>(templates: Template<T,K,I>[]) {
    const [ websocket, setWebsocket ] = useState<WebSocket | null>(null);
    const [ contracts, setContracts ] = useState<ContractInfo<T>[]>([]);
    const [ streamOffset, setStreamOffset ] = useState("");
    const token = useMemo(() => retrieveCredentials()?.token, []);

    const templateIds = templates.map(t => t.templateId);

    // const [ queryStream, queryDispatch ] = useReducer(queryReducer, {});
    // const offset = getOffset(queryStream, party);

    const messageHandlerScoped = useCallback(() => {
        return (message: { data: string }) => {
            const data: { events: any[]; offset: string } = JSON.parse(message.data);
            const { events, offset } = data;

            console.log("Got events!!!: ", events);

            if (offset) {
                // queryDispatch({ type: 'offset', party, offset });
                setStreamOffset(offset);
            }

            if (events && events.length > 0) {
              events.forEach(e => {
                console.log("event is: ", isCreateEvent<T,K,I>(e), e)
                if (isCreateEvent<T,K,I>(e)) {
                  const contract = makeContractInfo(e.created);
                  setContracts([...contracts, contract]);
                }
              })
            }
        }
    }, [contracts, streamOffset]);

    const openWebsocket = useCallback(async (token: string, offset: string) => {
        // const templates = (await dalGetTemplates(ledgerId, party)).templates;
        const ws = newDamlWebsocket(token);

        ws.onopen = () => {
            if (offset !== "") {
                ws.send(JSON.stringify({offset}))
            }
            ws.send(JSON.stringify({templateIds}));
        }

        ws.onclose = (event: CloseEvent) => {
            // if this connection was closed unintentionally, reopen it
            if (event.code !== KEEP_CLOSED) {
                openWebsocket(token, offset);
            }
        };

        return ws;
    }, []);

    useEffect(() => {
        // initialize websocket
        if (!websocket && token) {
            openWebsocket(token, streamOffset).then(ws => {
                setWebsocket(ws);
            });
        }

        return () => {
            if (websocket) {
                websocket.close(KEEP_CLOSED);
                setWebsocket(null);
            }
        }
    }, [websocket, openWebsocket, token, streamOffset])

    useEffect(() => {
        if (websocket && token) {
            websocket.onmessage = messageHandlerScoped();
        }
    }, [websocket, messageHandlerScoped])

    console.log("ok ok ok ", contracts);
    return contracts;
}

export default useDamlStreamQuery;
