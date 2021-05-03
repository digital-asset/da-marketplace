import React from 'react';
import { Grid, Header, Menu } from 'semantic-ui-react';
import classNames from 'classnames';
import TopMenu, { ITopMenuButtonInfo } from './TopMenu';
import { NavLink, useHistory } from 'react-router-dom';
import { useParty } from '@daml/react';
import PageSection from './PageSection';
import WelcomeHeader from './WelcomeHeader';
import { SidebarEntry } from '../../components/Sidebar/SidebarEntry';
import _ from 'lodash';
import { CogIcon } from '../../icons/icons';
import { usePartyName } from '../../config';

type Props = {
  className?: string;
  menuTitle?: React.ReactElement;
  activeMenuTitle?: boolean;
  showNotificationAlert?: boolean;
  sideBarItems?: SidebarEntry[];
  topMenuButtons?: ITopMenuButtonInfo[];
};

const Page: React.FC<Props> = ({
  children,
  className,
  menuTitle,
  topMenuButtons,
  activeMenuTitle,
  showNotificationAlert,
  sideBarItems,
}) => {
  const user = useParty();
  const { name } = usePartyName(user);
  const history = useHistory();

  const groupSideBarItems = Array.from(
    sideBarItems?.reduce(
      (acc, cur) => acc.set(cur.groupBy, [..._.compact(acc.get(cur.groupBy)), cur]),
      new Map<string | undefined, SidebarEntry[]>()
    ) || []
  );

  const constructMenu = (sideBarItem: SidebarEntry, level: number): React.ReactElement => {
    const childMenu = sideBarItem.children.map(child => constructMenu(child, level + 1));
    const margin = level * 25;

    return (
      <React.Fragment key={sideBarItem.label + sideBarItem.path}>
        <Menu.Item
          exact
          active={
            sideBarItem.activeSubroutes
              ? history.location.pathname.includes(sideBarItem.path)
              : undefined
          }
          key={sideBarItem.label + sideBarItem.path}
          as={NavLink}
          to={sideBarItem.path}
          className="sidemenu-item-normal"
        >
          <p style={{ marginLeft: margin }}>
            {sideBarItem.icon}
            {sideBarItem.label}
          </p>
        </Menu.Item>
        {childMenu.length > 0 && <Menu.Menu>{childMenu}</Menu.Menu>}
      </React.Fragment>
    );
  };

  return (
    <Grid className={classNames('page', className)}>
      <Grid.Column className="page-sidemenu">
        <Menu secondary vertical>
          <Menu.Menu>
            <Menu.Item as={NavLink} to="/app/" exact className="home-item">
              <Header as="h1" className="dark">
                @{name}
              </Header>
              <CogIcon />
            </Menu.Item>
          </Menu.Menu>

          <Menu.Menu>
            {groupSideBarItems.map(([key, items]) =>
              key ? (
                <Menu.Menu key={key} className="sub-menu">
                  <Header as="h3">{key}</Header>
                  {items.map(item => constructMenu(item, 0))}
                </Menu.Menu>
              ) : (
                items.map(item => constructMenu(item, 0))
              )
            )}
          </Menu.Menu>
        </Menu>
      </Grid.Column>
      <Grid.Column className="page-body">
        <TopMenu
          title={!!menuTitle ? menuTitle : <WelcomeHeader />}
          buttons={topMenuButtons}
          activeMenuTitle={activeMenuTitle}
          showNotificationAlert={showNotificationAlert}
        />

        <PageSection className={className}>{children}</PageSection>
      </Grid.Column>
    </Grid>
  );
};

export default Page;
