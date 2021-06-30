import React, { useState, useEffect } from 'react';

import DamlLedger from '@daml/react';

import { LoadingWheel } from './QuickSetup';

import { PublishedInstance, getAutomationInstances } from '../../automation';
import { httpBaseUrl, wsBaseUrl, useVerifiedParties, isHubDeployment } from '../../config';
import QueryStreamProvider from '../../websocket/queryStream';
import Credentials from '../../Credentials';

import { ServicesProvider, useServiceContext } from '../../context/ServicesContext';
import { OffersProvider } from '../../context/OffersContext';
import { retrieveParties } from '../../Parties';
import { RolesProvider, useRolesContext } from '../../context/RolesContext';

import { formatTriggerName } from './SelectRolesPage';

import ReactFlow, {
  FlowElement,
  addEdge,
  removeElements,
  isNode,
  Elements,
  Handle,
  ArrowHeadType,
} from 'react-flow-renderer';
import dagre from 'dagre';
import { useWellKnownParties } from '@daml/hub-react/lib';

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
        <ServicesProvider>
          <RolesProvider>
            <OffersProvider>
              <ReviewItems />
            </OffersProvider>
          </RolesProvider>
        </ServicesProvider>
      </QueryStreamProvider>
    </DamlLedger>
  );
};

const ReviewItems = () => {
  const { identities, loading: idsLoading } = useVerifiedParties();

  const { roles, loading: rolesLoading } = useRolesContext();
  const { services, loading: servicesLoading } = useServiceContext();

  const { parties, loading: operatorLoading } = useWellKnownParties();
  const operator = parties?.userAdminParty || 'Operator';

  const [creatingNetwork, setCreatingNetwork] = useState(false);
  const [layoutedElements, setLayoutedElements] = useState<FlowElement<any>[]>([]);

  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' });

  useEffect(() => {
    if (idsLoading || rolesLoading || servicesLoading || operatorLoading) {
      return;
    }

    setCreatingNetwork(true);

    const position = { x: 0, y: 0 };
    const identityNodes = [
      ...identities.map(i => {
        return {
          id: i.payload.customer,
          type: 'special',
          data: { label: i.payload.legalName, partyId: i.payload.customer },
          position,
        };
      }),
      {
        id: operator,
        type: 'special',
        data: { label: 'Operator', partyId: operator },
        position,
      },
    ];

    const serviceEdges = services.map(s => {
      return {
        id: `edge_${s.contract.contractId}`,
        source: s.contract.payload.provider,
        target: s.contract.payload.customer,
        label: `${s.service} Service`,
        arrowHeadType: ArrowHeadType.Arrow,
        className: s.contract.contractId,
      };
    });

    const initialElements: Elements = [...identityNodes, ...serviceEdges];

    initialElements.forEach(el => {
      if (isNode(el)) {
        dagreGraph.setNode(el.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
      } else {
        dagreGraph.setEdge(el.source, el.target);
      }
    });

    dagre.layout(dagreGraph);

    const elements = initialElements.map(el => {
      if (isNode(el)) {
        const nodeWithPosition = dagreGraph.node(el.id);

        el.position = {
          x: nodeWithPosition.x - NODE_WIDTH / 2 + Math.random() / 1000,
          y: nodeWithPosition.y - NODE_HEIGHT / 2,
        };
      }

      return el;
    });

    setLayoutedElements(elements);
  }, [
    identities,
    roles,
    idsLoading,
    rolesLoading,
    services,
    servicesLoading,
    operator,
    operatorLoading,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCreatingNetwork(false);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  if (idsLoading || rolesLoading || creatingNetwork) {
    return (
      <div className="review loading">
        <LoadingWheel
          inverted={true}
          label={creatingNetwork ? 'Loading Network...' : 'Loading review data...'}
        />
      </div>
    );
  }

  return (
    <div className="review">
      <Flow layoutedElements={layoutedElements} />
    </div>
  );
};

const RoleNode = (props: { data: { label: string; partyId: string } }) => {
  const { roles, loading: rolesLoading } = useRolesContext();
  const { parties: wkparties, loading: operatorLoading } = useWellKnownParties();
  const parties = retrieveParties() || [];

  const [deployedAutomations, setDeployedAutomations] = useState<PublishedInstance[]>([]);

  const { label, partyId } = props.data;

  const operator = wkparties?.userAdminParty || 'Operator';
  const roleList = roles.filter(r => r.contract.payload.provider === partyId).map(r => r.roleKind);
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

  if (rolesLoading || operatorLoading) {
    return null;
  }

  return (
    <div className="role-node">
      <h4>{label}</h4>
      <p className="p2">{roleList.join(', ')}</p>
      <p className="p2">
        {deployedAutomations.map(da => formatTriggerName(da.config.value.name)).join(', ')}
      </p>
      <Handle
        type="source"
        position={partyId === operator ? 'bottom' : 'top'}
        id="b"
        style={{ background: 'transparent' }}
      />
    </div>
  );
};

const Flow = (props: { layoutedElements: FlowElement<any>[] }) => {
  const { layoutedElements } = props;
  const [elements, setElements] = useState(layoutedElements);
  const onConnect = (params: any) =>
    setElements(els => addEdge({ ...params, type: 'smoothstep', animated: true }, els));

  const onElementsRemove = (elementsToRemove: Elements<any>) =>
    setElements(els => removeElements(elementsToRemove, els));

  const nodeTypes = {
    special: RoleNode,
  };

  return (
    <ReactFlow
      elements={elements}
      onConnect={onConnect}
      onElementsRemove={onElementsRemove}
      connectionLineType="smoothstep"
      nodeTypes={nodeTypes}
    />
  );
};

export default ReviewPage;
