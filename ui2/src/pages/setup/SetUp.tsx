import React from 'react';
import { NavLink } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { SetupAutomation } from './Automation';
import { isHubDeployment } from '../../config';

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
      name="Custody"
      links={[
        {
          label: 'Offer Custody Service',
          path: '/app/setup/custody/offer',
        },
      ]}
    />

    <SetupService
      name="Distributions"
      links={[
        {
          label: 'Create New Auction',
          path: '/app/setup/distribution/new/auction',
        },
      ]}
    />

    <SetupService
      name="Instruments"
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
      links={[
        {
          label: 'Create New Issuance',
          path: '/app/setup/issuance/new',
        },
      ]}
    />

    <SetupService
      name="Listings"
      links={[
        {
          label: 'Create New Listing',
          path: '/app/setup/listing/new',
        },
      ]}
    />

    <SetupService
      name="Trading"
      links={[
        {
          label: 'Offer Trading Service',
          path: '/app/setup/trading/offer',
        },
      ]}
    />

    {isHubDeployment && <SetupAutomation />}
  </div>
);

export default SetUp;
