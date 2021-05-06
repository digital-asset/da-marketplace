import React from 'react';
import { NavLink } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { SetupAutomation } from './SetupAutomation';
import { isHubDeployment, publicParty } from '../../config';
import { AutomationProvider } from '../../context/AutomationContext';
import {
  ServiceKind,
  useProviderServices,
  useServiceKindsProvided,
} from '../../context/ServicesContext';
import { useParty } from '@daml/react';
import { useRoleKinds, ServiceKind as RoleServiceKind } from '../../context/RolesContext';
import { MissingService, MissingRole } from '../error/MissingService';

type SetupServiceProps = {
  name: string;
  links: {
    label: string;
    path: string;
  }[];
  serviceRequired?: ServiceKind;
  roleRequired?: RoleServiceKind;
};

const SetupService: React.FC<SetupServiceProps> = ({
  name,
  links,
  children,
  serviceRequired,
  roleRequired,
}) => {
  const party = useParty();
  const serviceKinds = useServiceKindsProvided(party);
  const roleKinds = useRoleKinds();
  const needsService = !!serviceRequired && !serviceKinds.has(serviceRequired);
  const needsRole = !!roleRequired && !roleKinds.has(roleRequired);
  return (
    <div className="setup-service">
      <Header as="h2">{name}</Header>
      <div className="links">
        {links.map(link =>
          !needsService && !needsRole ? (
            <NavLink key={link.path + link.label} to={link.path}>
              {link.label}
            </NavLink>
          ) : (<>
          {(needsRole && !!roleRequired) && <MissingRole role={roleRequired} action={link.label}/>}
          {(needsService && !!serviceRequired) && <MissingService service={serviceRequired} action={link.label}/>}
          </>
          )
        )}
        {children}
      </div>
    </div>
  );
};

const SetUp: React.FC = () => (
  <div className="set-up">
    <SetupService
      name="Custody"
      roleRequired={RoleServiceKind.CUSTODY}
      links={[
        {
          label: 'Offer Custody Service',
          path: '/app/setup/custody/offer',
        },
      ]}
    />

    <SetupService
      name="Clearing"
      roleRequired={RoleServiceKind.CLEARING}
      links={[
        {
          label: 'Offer Clearing Service',
          path: '/app/setup/clearing/offer',
        },
        {
          label: 'Offer Market Clearing Service',
          path: '/app/setup/clearing/market/offer',
        },
      ]}
    />

    <SetupService
      name="Distributions"
      serviceRequired={ServiceKind.AUCTION}
      links={[
        {
          label: 'Create New Auction',
          path: '/app/setup/distribution/new/auction',
        },
      ]}
    />

    <SetupService
      name="Instruments"
      serviceRequired={ServiceKind.ISSUANCE}
      links={[
        {
          label: 'Create Base Instrument',
          path: '/app/setup/instrument/new/base',
        },
        {
          label: 'Create Binary Option',
          path: '/app/setup/instrument/new/binaryoption',
        },
        {
          label: 'Create Convertible Note',
          path: '/app/setup/instrument/new/convertiblenote',
        },
      ]}
    />

    <SetupService
      name="Issuance"
      serviceRequired={ServiceKind.ISSUANCE}
      links={[
        {
          label: 'Create New Issuance',
          path: '/app/setup/issuance/new',
        },
      ]}
    />

    <SetupService
      name="Listings"
      serviceRequired={ServiceKind.LISTING}
      links={[
        {
          label: 'Create New Listing',
          path: '/app/setup/listing/new',
        },
      ]}
    />

    <SetupService
      name="Trading"
      roleRequired={RoleServiceKind.TRADING}
      links={[
        {
          label: 'Offer Trading Service',
          path: '/app/setup/trading/offer',
        },
      ]}
    />

    {isHubDeployment && (
      <AutomationProvider publicParty={publicParty}>
        <SetupService name="Setup Automation" links={[]}>
          <SetupAutomation modalTrigger={<NavLink to="#">Setup Automation</NavLink>} />
        </SetupService>
      </AutomationProvider>
    )}
  </div>
);

export default SetUp;
