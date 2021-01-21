import { useState, useEffect, useReducer, useMemo, useCallback } from 'react'

import { CreateEvent, Event } from '@daml/ledger'

import { deploymentMode, DeploymentMode, httpBaseUrl } from '../config'
import { retrieveCredentials } from '../Credentials'
import { Template } from '@daml/types'

import { ContractInfo, ContractInfoUnion, makeContractInfo } from '../components/common/damlTypes'

// A custom code to indicate that the websocket should not be reopened.
// 4001 was picked arbitrarily from the range 4000-4999, which are codes that the official
//     WebSocket spec defines as unreserved, and available for use by the application.
const KEEP_CLOSED = 4001;

const newDamlWebsocket = (token: string): WebSocket => {
  const url = new URL(httpBaseUrl || 'http://localhost:3000');

  const subprotocols = [`jwt.token.${token}`, "daml.ws.auth"];
  const protocol = deploymentMode == DeploymentMode.DEV ? 'ws://' : 'wss://';

  console.log("Creating new websocket");
  return new WebSocket(`${protocol}${url.host}/v1/stream/query`, subprotocols);
}

function isCreateEvent<T extends object, K = unknown, I extends string = string>(event: object): event is { created: CreateEvent<T,K,I>} {
  return 'created' in event;
}

function useDamlStreamQuery(templateIds: string[]) {
    const [ websocket, setWebsocket ] = useState<WebSocket | null>(null);
    const [ contracts, setContracts ] = useState<ContractInfo<any>[]>([]);

    const [ streamOffset, setStreamOffset ] = useState("");

    const token = useMemo(() => retrieveCredentials()?.token, []);

    const messageHandlerScoped = useCallback(() => {
        return (message: { data: string }) => {
            const data: { events: any[]; offset: string } = JSON.parse(message.data);
            const { events, offset } = data;

            if (offset) {
                setStreamOffset(offset);
            }

            if (events && events.length > 0) {
              events.forEach(e => {
                console.log("event is: ", isCreateEvent(e), e)
                if (isCreateEvent(e)) {
                    const x = e;
                  const contract = makeContractInfo(e.created);
                  setContracts(contracts => [...contracts, contract]);
                }
              })
            }
        }
    }, [contracts, streamOffset]);

    const openWebsocket = useCallback(async (token: string, offset: string, templateIds: string[]) => {
        const ws = newDamlWebsocket(token);

        ws.onopen = () => {
            if (offset !== "") {
                ws.send(JSON.stringify({offset}))
            }
            ws.send(JSON.stringify({templateIds}));
        }

        ws.onclose = (event: CloseEvent) => {
            // if this connection was closed unintentionally, reopen it
            console.log("Event was closed", event);
            if (event.code !== KEEP_CLOSED) {
                openWebsocket(token, offset, templateIds);
            }
        };

        return ws;
    }, []);

    useEffect(() => {
        // initialize websocket
        if (!websocket && token && templateIds.length > 0) {
            openWebsocket(token, streamOffset, templateIds).then(ws => {
                setWebsocket(ws);
            });
        }

        return () => {
            console.log("We are closing a websocket: ", websocket);
            if (websocket) {
                websocket.close(KEEP_CLOSED);
                setWebsocket(null);
            }
        }
    }, [templateIds, websocket, openWebsocket])

    useEffect(() => {
        if (websocket && token) {
            websocket.onmessage = messageHandlerScoped();
        }
    }, [websocket, messageHandlerScoped])

    return contracts;
}

export default useDamlStreamQuery;
