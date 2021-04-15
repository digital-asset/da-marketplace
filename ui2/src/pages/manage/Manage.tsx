import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const Manage: React.FC = ({ children }) => {
  return (
    <div className="manage">
      <Menu className="manage-menu" pointing secondary>
        <Menu.Item as={NavLink} name="custody" to="/app/manage/custody" />
        <Menu.Item as={NavLink} name="clearing" to="/app/manage/clearing" />
        <Menu.Item as={NavLink} name="distributions" to="/app/manage/distributions" />
        <Menu.Item as={NavLink} name="instruments" to="/app/manage/instruments" />
        <Menu.Item as={NavLink} name="issuances" to="/app/manage/issuance" />
        <Menu.Item as={NavLink} name="listings" to="/app/manage/listings" />
        <Menu.Item as={NavLink} name="trading" to="/app/manage/trading" />
      </Menu>

      {children}
    </div>
  );
};

export default Manage;
