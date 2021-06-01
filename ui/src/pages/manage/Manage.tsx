import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { Form, Menu } from 'semantic-ui-react';

import paths from '../../paths';

const Manage: React.FC = ({ children }) => {
  const history = useHistory();
  const path = useLocation().pathname;

  const menuItems = useMemo(
    () => [
      { text: 'Custody', value: paths.app.manage.custody },
      { text: 'Clearing', value: paths.app.manage.clearing },
      { text: 'Distributions', value: paths.app.manage.distributions },
      { text: 'Instruments', value: paths.app.manage.instruments },
      { text: 'Issuances', value: paths.app.manage.issuance },
      { text: 'Listings', value: paths.app.manage.listings },
      { text: 'Trading', value: paths.app.manage.trading },
    ],
    []
  );

  const [currentMenuItem, setCurrentMenuItem] = useState<{ text: string; value: string }>();

  useEffect(() => {
    const item = menuItems.find(i => path === i.value);
    if (item) {
      setCurrentMenuItem(item);
    }
  }, [path, menuItems]);

  return (
    <div className="manage">
      <Menu className="manage-menu" pointing secondary>
        {menuItems.map(item => (
          <Menu.Item key={item.text} as={NavLink} name={item.text} to={item.value} />
        ))}
      </Menu>
      <Form.Select
        placeholder="Select..."
        options={menuItems}
        value={currentMenuItem?.value}
        onChange={(_, data: any) => history.push(data.value)}
      />
      {children}
    </div>
  );
};

export default Manage;
