import React from 'react';
import { NavLink } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

type SetupServiceProps = {
  name: string;
  links: {
    label: string;
    path: string;
  }[];
};

const SetupService: React.FC<SetupServiceProps> = ({ name, links }) => (
  <div className="setup-service">
    <Header as="h2">{name}</Header>
    <div className="links">
      {links.map(link => (
        <NavLink key={link.path + link.label} to={link.path}>
          {link.label}
        </NavLink>
      ))}
    </div>
  </div>
);

const SetUp: React.FC = () => (
  <div className="set-up">
    <SetupService
      name="Distributions"
      links={[
        { label: 'Create New Asset', path: '' },
        { label: 'Create New Auction', path: '' },
      ]}
    />

    <SetupService
      name="Issuance"
      links={[{ label: 'Create New Issuance', path: '/app/setup/issuance/new' }]}
    />

    <SetupService
      name="Listings"
      links={[{ label: 'Create New Listing', path: '/app/setup/listings/new' }]}
    />

    <SetupService
      name="Originations"
      links={[
        { label: 'Create Base Instrument', path: '/app/setup/instruments/new/base' },
        { label: 'Create Binary Option', path: '/app/setup/instruments/new/binaryoption' },
        {
          label: 'Create Convertible Note',
          path: '/app/setup/instruments/new/convertiblenote',
        },
      ]}
    />

    <SetupService name="Trading" links={[{ label: 'Offer Trading Service', path: '' }]} />
  </div>
);

export default SetUp;
