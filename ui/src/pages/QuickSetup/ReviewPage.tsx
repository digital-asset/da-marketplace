import React, { useState, useEffect } from 'react';

import DamlLedger from '@daml/react';

import _ from 'lodash';

import { LoadingWheel } from './QuickSetup';

import { PublishedInstance, getAutomationInstances } from '../../automation';
import {
  httpBaseUrl,
  wsBaseUrl,
  useVerifiedParties,
  isHubDeployment,
  publicParty,
} from '../../config';
import QueryStreamProvider from '../../websocket/queryStream';
import Credentials from '../../Credentials';

import { ServicesProvider, useServiceContext } from '../../context/ServicesContext';
import { OffersProvider } from '../../context/OffersContext';
import { retrieveParties } from '../../Parties';
import { RolesProvider, useRolesContext } from '../../context/RolesContext';
import { AutomationProvider } from '../../context/AutomationContext';

import { formatTriggerName } from './SelectRolesPage';
import RequestServicesPage from './RequestServicesPage';
import SelectRolesPage from './SelectRolesPage';

import ReactFlow, {
  FlowElement,
  addEdge,
  removeElements,
  isNode,
  Elements,
  Handle,
  ArrowHeadType,
  Position,
  Controls,
  Background,
  MiniMap,
} from 'react-flow-renderer';
import dagre from 'dagre';

const NODE_WIDTH = 172;
const NODE_HEIGHT = 36;

const ReviewPage = (props: { adminCredentials: Credentials }) => {
  const { adminCredentials } = props;

  return (
    <DamlLedger
      party={adminCredentials.party}
      token={adminCredentials.token}
      httpBaseUrl={httpBaseUrl}
      wsBaseUrl={wsBaseUrl}
    >
      <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
        <AutomationProvider publicParty={publicParty}>
          <ServicesProvider>
            <RolesProvider>
              <OffersProvider>
                <p className="dark info">
                  Use the form on the left to assign roles and request services. Move nodes to
                  organize your network and select nodes to highlight customer relationships.
                </p>
                <div className="review">
                  <div>
                    <SelectRolesPage />
                    <RequestServicesPage adminCredentials={adminCredentials} />
                  </div>
                  <ReviewItems />
                </div>
              </OffersProvider>
            </RolesProvider>
          </ServicesProvider>
        </AutomationProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: 'TB' });

const ReviewItems = () => {
  const { identities, loading: idsLoading } = useVerifiedParties();
  const { services, loading: servicesLoading } = useServiceContext();
  const [elements, setElements] = useState<FlowElement<any>[]>([]);

  type GroupedCustomerServices = {
    provider: string;
    services: string[];
    customer: string;
  }[];

  const groupedServices = services.reduce((acc, service) => {
    const providerDetails = acc.find(
      i =>
        i.provider === service.contract.payload.provider &&
        i.customer === service.contract.payload.customer
    );

    const provider = providerDetails?.provider || service.contract.payload.provider;
    const customer = providerDetails?.customer || service.contract.payload.customer;
    const services = _.concat(_.compact(providerDetails?.services), service.service);

    return [...acc.filter(i => i !== providerDetails), { provider, services, customer }];
  }, [] as GroupedCustomerServices);

  const serviceEdges = groupedServices
    .filter(s => s.provider !== s.customer)
    .map(s => {
      return {
        id: `edge_${s.provider}_to_${s.customer}`,
        source: s.provider,
        target: s.customer,
        className: s.customer === s.provider ? 'self-edge' : undefined,
        label: `${s.services.join(', ')} Services`,
        arrowHeadType: ArrowHeadType.Arrow,
        style: { stroke: 'grey' },
        labelStyle: { fontFamily: 'Open Sans', fontSize: 12 },
        labelBgStyle: { fill: 'transparent', color: '#fff' },
      };
    });

  const identityNodes = [
    ...identities.map(i => {
      return {
        id: i.payload.customer,
        type: 'special',
        data: {
          label: i.payload.legalName,
          partyId: i.payload.customer,
          selfServices: groupedServices
            .filter(s => s.customer === i.payload.customer && s.provider === i.payload.customer)
            .map(s => s.services),
        },
        position: { x: 0, y: 0 },
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
      };
    }),
  ];

  const initialElements: Elements = [...identityNodes, ...serviceEdges];

  initialElements.forEach(el => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  useEffect(() => {
    setElements(
      initialElements.map(el => {
        if (isNode(el)) {
          const nodeWithPosition = dagreGraph.node(el.id);

          el.position = {
            x: nodeWithPosition.x - NODE_WIDTH / 2 + Math.random() / 1000,
            y: nodeWithPosition.y - NODE_HEIGHT / 2,
          };
        }

        return el;
      })
    );
  }, [services, identities]);

  if (idsLoading || servicesLoading) {
    return (
      <div className="review loading">
        <LoadingWheel label={'Loading review data...'} />
      </div>
    );
  }

  const onElementClick = (_: any, element: FlowElement) => {
    const heightlightColor = '#FFCC00';
    const dimmerStyle = { opacity: 0.5, zIndex: 1 };
    const hasCustomers = !!elements.find(e => !isNode(e) && e.source === element.id);

    if (!hasCustomers) {
      return;
    }

    let newElements = elements.map(el => {
      if (isNode(el)) {
        if (el.id === element.id) {
          return {
            ...el,
            style: {
              border: `2px solid ${heightlightColor}`,
              borderRadius: 4,
              opacity: 1,
              zIndex: 2,
            },
          };
        }
        return {
          ...el,
          style: { border: 'unset', ...dimmerStyle },
        };
      } else if (el.source === element.id) {
        return {
          ...el,
          style: { stroke: heightlightColor, strokeWidth: 2 },
          labelStyle: { ...el.labelStyle, display: 'flex' },
          labelBgStyle: { ...el.labelBgStyle, fill: heightlightColor },
        };
      }
      return {
        ...el,
        style: { strokeWidth: 1, stroke: 'grey', ...dimmerStyle },
        labelStyle: { ...el.labelStyle, display: 'none' },
        labelBgStyle: { ...el.labelBgStyle, fill: 'transparent' },
      };
    });
    setElements(newElements);
  };

  const onConnect = (params: any) =>
    setElements(els => addEdge({ ...params, type: 'smoothstep', animated: true }, els));

  const onElementsRemove = (elementsToRemove: Elements<any>) =>
    setElements(els => removeElements(elementsToRemove, els));

  const nodeTypes = {
    special: RoleNode,
  };

  const graphStyles = { width: '100%', height: '100%' };

  return (
    <ReactFlow
      style={graphStyles}
      elements={elements}
      onConnect={onConnect}
      onElementsRemove={onElementsRemove}
      onElementClick={onElementClick}
      nodeTypes={nodeTypes}
      fitView={true}
    >
      <Controls />
      <Background />
      <MiniMap />
    </ReactFlow>
  );
};

const RoleNode = (props: { data: { label: string; partyId: string } }) => {
  const { roles, loading: rolesLoading } = useRolesContext();
  const parties = retrieveParties() || [];

  const [deployedAutomations, setDeployedAutomations] = useState<PublishedInstance[]>([]);

  const { label, partyId } = props.data;

  const roleList = roles.filter(r => r.contract.payload.provider === partyId);
  const token = parties.find(p => p.party === partyId)?.token;

  useEffect(() => {
    if (token && isHubDeployment) {
      const timer = setInterval(() => {
        getAutomationInstances(token).then(pd => {
          setDeployedAutomations(pd || []);
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [token]);

  if (rolesLoading) {
    return null;
  }
  return (
    <div className="role-node">
      <Handle type="target" position={Position.Top} id="a" style={{ background: 'black' }} />
      <h4>{label}</h4>
      <p className="p2">{roleList.map(r => r.roleKind).join(', ')}</p>
      <p className="p2">
        {deployedAutomations.map(da => formatTriggerName(da.config.value.name)).join(', ')}
      </p>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ bottom: -4, top: 'auto', background: '#555' }}
      />
    </div>
  );
};

export default ReviewPage;
