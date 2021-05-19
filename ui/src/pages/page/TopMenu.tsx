import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Header, Menu } from 'semantic-ui-react';

import { LogoutIcon, NotificationIcon } from '../../icons/icons';

import OverflowMenu, { OverflowMenuEntry } from './OverflowMenu';

import classNames from 'classnames';
import { signOut, useUserDispatch } from '../../context/UserContext';

export type ITopMenuButtonInfo = {
  disabled?: boolean;
  label: string;
  onClick: () => void;
};

type Props = {
  title?: React.ReactElement;
  activeMenuTitle?: boolean;
  showNotificationAlert?: boolean;
  buttons?: ITopMenuButtonInfo[];
};

const TopMenu: React.FC<Props> = ({ title, buttons, activeMenuTitle, showNotificationAlert }) => {
  const history = useHistory();
  const userDispatch = useUserDispatch();

  return (
    <div className="top-section">
      <Menu className="top-menu">
        <Menu.Menu position="left">
          <Menu.Item
            as={!activeMenuTitle ? 'div' : undefined}
            disabled={!activeMenuTitle}
            onClick={history.goBack}
          >
            <Header as="h1">
              <Header.Content>{title}</Header.Content>
            </Header>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          {buttons?.map(b => (
            <Menu.Item className="menu-button">
              <Button className="ghost" onClick={b.onClick} disabled={b.disabled}>
                <Header as="h3">{b.label}</Header>
              </Button>
            </Menu.Item>
          ))}
          {buttons && (
            <Menu.Item className="overflow-menu-item">
              <OverflowMenu>
                {buttons?.map(b => (
                  <OverflowMenuEntry key={b.label} label={b.label} onClick={b.onClick} />
                ))}
              </OverflowMenu>
            </Menu.Item>
          )}
          <Menu.Item className="notification-button">
            <Link className="ghost smaller" to="/app/notifications">
              <div>
                <NotificationIcon />
              </div>
              <div className={classNames({ 'notifications-active': showNotificationAlert })}></div>
            </Link>
          </Menu.Item>
          <Menu.Item className="log-out-button">
            <Button className="ghost smaller" onClick={() => signOut(userDispatch, history)}>
              <div className="log-out">
                <p>Log out</p>
                <LogoutIcon />
              </div>
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      {/* <div className='notifications'>
                { notifications }
            </div> */}
    </div>
  );
};

export default TopMenu;
