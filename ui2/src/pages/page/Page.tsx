import React from 'react'
import { Grid, Header, Menu } from 'semantic-ui-react'
import classNames from 'classnames'

import TopMenu, { ITopMenuButtonInfo } from './TopMenu'
import { NavLink } from 'react-router-dom'
import { useParty } from '@daml/react'
import PageSection from './PageSection'
import WelcomeHeader from './WelcomeHeader'
import { SidebarEntry } from '../../components/Sidebar/SidebarEntry'

type Props = {
  className?: string;
  menuTitle?: React.ReactElement;
  activeMenuTitle?: boolean;
  sideBarItems?: SidebarEntry[];
  topMenuButtons?: ITopMenuButtonInfo[];
}

const Page: React.FC<Props> = ({
  children,
  className,
  menuTitle,
  topMenuButtons,
  activeMenuTitle,
  sideBarItems,
}) => {
  const user = useParty();

  return (
    <Grid className={classNames('page', className)}>
      <Grid.Column className="page-sidemenu">
          <Menu secondary vertical>
            <Menu.Menu>
              <Menu.Item
                  as={NavLink}
                  to='/app/'
                  exact
                  className='home-item'
              >
                <Header as='h1' className='dark'>@{user}</Header>
              </Menu.Item>
            </Menu.Menu>

            <Menu.Menu>
              { sideBarItems?.map(item => (
                <Menu.Item exact as={NavLink} to={item.path}>
                  <p className='sidemenu-item-normal'>{item.label}</p>
                </Menu.Item>
              )) }
            </Menu.Menu>
          </Menu>
      </Grid.Column>
      <Grid.Column className='page-body'>
        <TopMenu
          title={!!menuTitle ? menuTitle : <WelcomeHeader/>}
          buttons={topMenuButtons}
          activeMenuTitle={activeMenuTitle}/>

        <PageSection className={className}>
          { children }
        </PageSection>
      </Grid.Column>
    </Grid>
  )
}

export default Page
