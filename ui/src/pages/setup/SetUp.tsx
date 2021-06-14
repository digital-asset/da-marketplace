import React from 'react';

import { useParty } from '@daml/react';

import { NavLink, Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { SetupAutomation } from './SetupAutomation';
import RoleRequestMenu from '../landing/RoleRequestMenu';

import { isHubDeployment, publicParty } from '../../config';
import { useStreamQueries } from '../../Main';
import { Role as TradingRole } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Role as CustodyRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { AutomationProvider } from '../../context/AutomationContext';
import { useRolesContext } from '../../context/RolesContext';
import { useRoleRequestKinds } from '../../context/RequestsContext';
import { InformationIcon } from '../../icons/icons';
import paths from '../../paths';

type SetupServiceProps = {
  name: string;
  links: {
    label: string;
    path: string;
    isDisabled: boolean;
  }[];
  noneToOffer?: boolean;
};

const SetupService: React.FC<SetupServiceProps> = ({ name, links, noneToOffer, children }) => {
  return (
    <div className="setup-service">
      <Header as="h2">{name}</Header>
      {noneToOffer && (
        <p className="">
          <InformationIcon />
          There are no services to offer given this party's current set of roles.
        </p>
      )}
      <div className="links">
        {links.map(link =>
          link.isDisabled ? null : (
            <NavLink key={link.path + link.label} to={link.path}>
              {link.label}
            </NavLink>
          )
        )}
        {children}
      </div>
    </div>
  );
};

const SetUp: React.FC = () => {
  const party = useParty();

  const roles = useRolesContext()
    .roles.filter(r => r.contract.payload.provider === party)
    .map(r => r.roleKind);

  const roleRequests = useRoleRequestKinds();

  const tradingRole = useStreamQueries(TradingRole).contracts.find(
    r => r.payload.provider === party
  );

  const clearingRole = useStreamQueries(ClearingRole).contracts.find(
    r => r.payload.provider === party
  );

  const custodyRole = useStreamQueries(CustodyRole).contracts.find(
    r => r.payload.provider === party
  );

  return (
    <div className="set-up">
      <div className="setup-service">
        <Header as="h2">Roles</Header>
        <div className="roles">
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
          <RoleRequestMenu />
        </div>
      </div>
      <SetupService
        name="Offer Services"
        noneToOffer={!custodyRole && !clearingRole && !tradingRole}
        links={[
          {
            label: 'Offer Custody Service',
            path: paths.app.custody.offer,
            isDisabled: !custodyRole,
          },
          {
            label: 'Offer Clearing Service',
            path: paths.app.clearingServices.offer,
            isDisabled: !clearingRole,
          },
          {
            label: 'Offer Market Clearing Service',
            path: paths.app.clearingServices.market.offer,
            isDisabled: !clearingRole,
          },
          {
            label: 'Offer Trading Service',
            path: paths.app.markets.offer,
            isDisabled: !tradingRole,
          },
        ]}
      />

      {isHubDeployment && (
        <AutomationProvider publicParty={publicParty}>
          <SetupService name="Setup Automation" links={[]}>
            <SetupAutomation modalTrigger={<Link to="#">Setup Automation</Link>} />
          </SetupService>
        </AutomationProvider>
      )}
    </div>
  );
};

export default SetUp;
