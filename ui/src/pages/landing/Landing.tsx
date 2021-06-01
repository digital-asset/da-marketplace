import React from 'react';
import { Button, Header } from 'semantic-ui-react';

import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';

import { ServiceKind, useProviderServices } from '../../context/ServicesContext';
import Tile from '../../components/Tile/Tile';
import { getAbbreviation } from '../page/utils';
import { usePartyName } from '../../config';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Link, NavLink } from 'react-router-dom';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import {
  Request as RegulatorRequest,
  Service as RegulatorService,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service/';
import { useWellKnownParties } from '@daml/hub-react/lib';
import { formatCurrency } from '../../util';
import paths from '../../paths';
import ServiceRequestMenu from './ServiceRequestMenu';
import RoleRequestMenu from './RoleRequestMenu';
import { useRolesContext } from '../../context/RolesContext';
import { useRoleRequestKinds } from '../../context/RequestsContext';

type DamlHubParty = string;
function isDamlHubParty(party: string): party is DamlHubParty {
  return party.includes('ledger-party-');
}

const RenderDamlHubParty: React.FC<{ party: string }> = ({ party }) => {
  return (
    <p className="daml-hub-party">
      <input readOnly className="id-text" value={party} />
    </p>
  );
};

function hashPartyId(party: string): number {
  // Hash a party to map to values in the range [1, 4], to determine profile pic color
  return (party.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4) + 1;
}

function getProfileAbbr(party: string): string {
  if (isDamlHubParty(party)) {
    // First 3 chars of a Daml Hub ledger party UUID string
    return party.split('-').slice(2).join('').slice(0, 3);
  } else {
    return getAbbreviation(party);
  }
}

interface RelationshipProps {
  provider: string;
  services: ServiceKind[];
}

const Relationship: React.FC<RelationshipProps> = ({ provider, services }) => {
  const { name } = usePartyName(provider);

  return (
    <Tile className="relationship-tile">
      <div className={`child profile-pic bg-color-${hashPartyId(provider)}`}>
        {getProfileAbbr(name)}
      </div>
      <div className="child provider">{name}</div>
      <div className="child">
        {services.map(s => (
          <p className="p2 label" key={s}>
            {s}
          </p>
        ))}
      </div>
    </Tile>
  );
};

const ProfileSection: React.FC<{ name: string }> = ({ name }) => {
  const customer = useParty();
  const ledger = useLedger();
  const { parties, loading: operatorLoading } = useWellKnownParties();
  const provider = parties?.userAdminParty || 'Operator';

  const { contracts: regulatorServices, loading: regulatorLoading } =
    useStreamQueries(RegulatorService);

  const requestContract = useStreamQueries(RegulatorRequest).contracts.find(
    r => r.payload.customer === customer
  );

  const regulatorCustomer = regulatorServices.find(r => r.payload.customer === customer);

  const { contracts: identities, loading: identitiesLoading } = useStreamQueries(VerifiedIdentity);
  const partyIdentity = identities.find(id => id.payload.customer === customer);

  const damlHubParty =
    isDamlHubParty(customer) && name !== customer ? (
      <RenderDamlHubParty party={customer} />
    ) : undefined;

  if (requestContract) {
    return (
      <div>
        {damlHubParty}
        <p>Regulator Request pending...</p>
      </div>
    );
  } else if (!regulatorCustomer && !regulatorLoading && !operatorLoading) {
    return (
      <div className="link">
        {damlHubParty}
        <Button
          className="ghost"
          onClick={() => {
            if (!operatorLoading) {
              ledger.create(RegulatorRequest, { customer, provider });
            }
          }}
        >
          Request Regulator Service
        </Button>
      </div>
    );
  } else if (!partyIdentity && !identitiesLoading && !regulatorLoading) {
    return (
      <div className="link">
        {damlHubParty}
        <Link to={paths.app.setup.identity}>Request Identity Verification</Link>
      </div>
    );
  } else if (partyIdentity) {
    return (
      <>
        {damlHubParty}
        <p>{partyIdentity.payload.location}</p>
      </>
    );
  }

  return <></>;
};

const Landing = () => {
  const party = useParty();
  const { name } = usePartyName(party);
  const providers = useProviderServices(party);
  const roles = useRolesContext()
    .roles.filter(r => r.contract.payload.provider === party)
    .map(r => r.role);

  const roleRequests = useRoleRequestKinds();

  const deposits = useStreamQueries(AssetDeposit).contracts;

  const portfolio = formatCurrency(
    deposits
      .filter(d => d.payload.asset.id.label === 'USD')
      .reduce((sum, deposit) => sum + +deposit.payload.asset.quantity, 0)
  );

  return (
    <div className="landing">
      <div className="col col-1">
        <Tile>
          <div className="profile">
            <div className="profile-name">@{name}</div>
            <ProfileSection name={name} />
          </div>
        </Tile>

        <Tile>
          <div className="role-tile">
            <div>
              <Header as="h2" className="header">
                Services Provided
              </Header>
              <RoleRequestMenu />
            </div>
            <div className="roles">
              {!roles.length && !roleRequests.size ? (
                <p className="p2 label no-roles">None</p>
              ) : (
                <>
                  {Array.from(roleRequests).map(rq => (
                    <p className="p2 label" key={rq}>
                      {rq} (Pending)
                    </p>
                  ))}
                  {roles.map(s => (
                    <p className="p2 label" key={s}>
                      {s}
                    </p>
                  ))}
                </>
              )}
            </div>
          </div>
        </Tile>

        <Tile>
          <div className="link-tile">
            <div>
              <Header as="h2">Portfolio</Header>
              <span className="balance">
                <h3>{portfolio}</h3>&nbsp;<span>USD</span>
              </span>
            </div>
            <div className="link">
              <NavLink to={paths.app.custody.assets}>View Wallet</NavLink>
            </div>
          </div>
        </Tile>
      </div>

      <div className="col col-2">
        <div>
          <Header as="h2" className="header">
            Network
          </Header>
          <ServiceRequestMenu />
        </div>
        <div className="relationships">
          {providers.map(p => (
            <Relationship key={p.provider} provider={p.provider} services={p.services} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
