import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { SetupAutomation } from './SetupAutomation';
import { isHubDeployment, publicParty } from '../../config';
import { AutomationProvider } from '../../context/AutomationContext';
import paths from '../../paths';

type SetupServiceProps = {
  name: string;
  links: {
    label: string;
    path: string;
  }[];
};

const SetupService: React.FC<SetupServiceProps> = ({ name, links, children }) => (
  <div className="setup-service">
    <Header as="h2">{name}</Header>
    <div className="links">
      {links.map(link => (
        <NavLink key={link.path + link.label} to={link.path}>
          {link.label}
        </NavLink>
      ))}
      {children}
    </div>
  </div>
);

const SetUp: React.FC = () => (
  <div className="set-up">
    <SetupService
      name="Custody"
      links={[
        {
          label: 'Offer Custody Service',
          path: paths.app.setup.custody.offer,
        },
      ]}
    />

    <SetupService
      name="Clearing"
      links={[
        {
          label: 'Offer Clearing Service',
          path: paths.app.setup.clearing.offer,
        },
        {
          label: 'Offer Market Clearing Service',
          path: paths.app.setup.clearing.market.offer,
        },
      ]}
    />

    <SetupService
      name="Distributions"
      links={[
        {
          label: 'New Auction',
          path: paths.app.setup.distribution.new.auction,
        },
      ]}
    />

    <SetupService
      name="Instruments"
      links={[
        {
          label: 'Create Base Instrument',
          path: paths.app.setup.instrument.new.base,
        },
        {
          label: 'Create Binary Option',
          path: paths.app.setup.instrument.new.binaryoption,
        },
        {
          label: 'Create Convertible Note',
          path: paths.app.setup.instrument.new.convertiblenote,
        },
      ]}
    />

    <SetupService
      name="Issuance"
      links={[
        {
          label: 'New Issuance',
          path: paths.app.setup.issuance.new,
        },
      ]}
    />

    <SetupService
      name="Listings"
      links={[
        {
          label: 'New Listing',
          path: paths.app.setup.listing.new,
        },
      ]}
    />

    <SetupService
      name="Trading"
      links={[
        {
          label: 'Offer Trading Service',
          path: paths.app.setup.trading.offer,
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

export default SetUp;
