import React, { useEffect, useState } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { Menu, Form } from 'semantic-ui-react';

const Manage: React.FC = ({ children }) => {
  const history = useHistory();

  let path = useLocation().pathname;

  const menuItems = [
    { text: 'Custody', value: '/app/manage/custody' },
    { text: 'Distributions', value: '/app/manage/distributions' },
    { text: 'Instruments', value: '/app/manage/instruments' },
    { text: 'Issuances', value: '/app/manage/issuance' },
    { text: 'Listings', value: '/app/manage/listings' },
    { text: 'Trading', value: '/app/manage/trading' },
  ];

  const [currentMenuItem, setCurrentMenuItem] = useState<{ text: string; value: string }>();
  useEffect(() => {
    const item = menuItems.find(i => path === i.value);
    if (item) {
      console.log(item);

      setCurrentMenuItem(item);
    }
  }, [path]);

  console.log(currentMenuItem?.text);

  return (
    <div className="manage">
      <Menu className="manage-menu" pointing secondary>
        {menuItems.map(item => (
          <Menu.Item as={NavLink} name={item.text} to={item.value} />
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
