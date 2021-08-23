import React, { useState, useEffect } from 'react';
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
import { Loader } from 'semantic-ui-react';
import classNames from 'classnames';
import dagre from 'dagre';
import _ from 'lodash';

import DamlLedger from '@daml/react';
import { PartyToken, useAdminParty } from '@daml/hub-react';

import { PublishedInstance, getAutomationInstances } from '../../automation';
import {
  httpBaseUrl,
  wsBaseUrl,
  useVerifiedParties,
  isHubDeployment,
  publicParty,
} from '../../config';
import QueryStreamProvider from '../../websocket/queryStream';

import { ServicesProvider, useServiceContext } from '../../context/ServicesContext';
import { OffersProvider } from '../../context/OffersContext';
import { retrieveParties } from '../../Parties';
import { IconChevronDown, IconChevronUp } from '../../icons/icons';
import { RolesProvider, useRolesContext } from '../../context/RolesContext';
import { AutomationProvider } from '../../context/AutomationContext';

import { formatTriggerName } from './SelectRolesPage';
import RequestServicesPage from './RequestServicesPage';
import SelectRolesPage from './SelectRolesPage';
import AddAccountPage from './AddAccountPage';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 130;

enum ReviewForms {
  ASSIGN_ROLES = 'Assign Roles',
  REQUEST_SERVICES = 'Request Services',
  NEW_ACCOUNT = 'New Account',
}

const ReviewPage = (props: { adminCredentials: PartyToken }) => {
  const { adminCredentials } = props;
  const [openForm, setOpenForm] = useState<ReviewForms>();

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
                  <div className="side-bar">
                    <SideBarItem
                      reviewFormType={ReviewForms.ASSIGN_ROLES}
                      isOpen={openForm === ReviewForms.ASSIGN_ROLES}
                      setIsOpen={setOpenForm}
                    >
                      <SelectRolesPage />
                    </SideBarItem>
                    <SideBarItem
                      reviewFormType={ReviewForms.REQUEST_SERVICES}
                      isOpen={openForm === ReviewForms.REQUEST_SERVICES}
                      setIsOpen={setOpenForm}
                    >
                      <RequestServicesPage />
                    </SideBarItem>
                    <SideBarItem
                      reviewFormType={ReviewForms.NEW_ACCOUNT}
                      isOpen={openForm === ReviewForms.NEW_ACCOUNT}
                      setIsOpen={setOpenForm}
                    >
                      <AddAccountPage />
                    </SideBarItem>
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

type TilePageProps = {
  reviewFormType: ReviewForms;
  isOpen: boolean;
  setIsOpen: (form?: ReviewForms) => void;
};

const SideBarItem: React.FC<TilePageProps> = ({ reviewFormType, isOpen, children, setIsOpen }) => {
  return (
    <>
      <div
        className={classNames('side-bar-item', {
          'is-open': isOpen,
        })}
        onClick={() => setIsOpen(isOpen ? undefined : reviewFormType)}
      >
        <h4>
          {reviewFormType} {isOpen ? <IconChevronUp /> : <IconChevronDown />}
        </h4>
      </div>
      {isOpen && children}
    </>
  );
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: 'TB' });

const ReviewItems = () => {
  const { identities, loading: idsLoading } = useVerifiedParties();
  const { services, loading: servicesLoading } = useServiceContext();

  const [loading, setLoading] = useState(true);

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

  const operator = useAdminParty() || 'Operator';

  const serviceEdges = groupedServices
    .filter(s => s.provider !== s.customer && s.provider !== operator)
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
        style: { border: 'unset', opacity: 1 },
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
    const timer = setInterval(() => {
      setLoading(false);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  if (idsLoading || servicesLoading || loading) {
    return (
      <div className="react-flow">
        <Loader active size="large">
          <p>Loading...</p>
        </Loader>
      </div>
    );
  }

  return <Network passedElements={initialElements} />;
};

const Network = (props: { passedElements: any[] }) => {
  const [elements, setElements] = useState<FlowElement<any>[]>(props.passedElements);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    setElements(
      props.passedElements.map(el => {
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
  }, [props.passedElements]);

  const onElementClick = (_: any, element: FlowElement) => {
    const heightlightColor = '#FFCC00';
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
          style: { border: 'unset', opacity: 0.5 },
        };
      } else if (el.source === element.id) {
        return {
          ...el,
          style: { stroke: heightlightColor, strokeWidth: 2, opacity: 1 },
          labelStyle: { ...el.labelStyle, display: 'flex' },
          labelBgStyle: { ...el.labelBgStyle, fill: heightlightColor },
        };
      }
      return {
        ...el,
        style: { stroke: 'lightgrey', strokeWidth: 1, opacity: 0.5 },
        labelStyle: { ...el.labelStyle, display: 'none' },
        labelBgStyle: { ...el.labelBgStyle, fill: 'none' },
      };
    });
    setElements(newElements);
  };
  const graphStyles = { width: '100%', height: '100%' };
  const onConnect = (params: any) =>
    setElements(els => addEdge({ ...params, type: 'smoothstep', animated: true }, els));

  const onElementsRemove = (elementsToRemove: Elements<any>) =>
    setElements(els => removeElements(elementsToRemove, els));

  const nodeTypes = {
    special: RoleNode,
  };

  return (
    <ReactFlow
      style={graphStyles}
      elements={elements}
      onConnect={onConnect}
      onElementsRemove={onElementsRemove}
      onElementClick={onElementClick}
      nodeTypes={nodeTypes}
      zoomOnScroll={false}
      zoomOnPinch={false}
    >
      <div onClick={() => setShowTip(false)}>
        <Controls>
          {showTip && <div className="tool-tip">Click here to fit to screen</div>}
        </Controls>
      </div>
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
