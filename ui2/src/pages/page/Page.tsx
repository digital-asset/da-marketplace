import React from 'react'
import { Grid, Header, Menu } from 'semantic-ui-react'
import classNames from 'classnames'

import TopMenu, { ITopMenuButtonInfo } from './TopMenu'
import { NavLink } from 'react-router-dom'
import { useParty } from '@daml/react'

type Props = {
  className?: string;
  menuTitle?: React.ReactElement;
  activeMenuTitle?: boolean;
  notifications?: React.ReactElement[];
  topMenuButtons?: ITopMenuButtonInfo[];
  landingPage?: boolean;
}

const Page: React.FC<Props> = ({
  children,
  className,
  menuTitle,
  notifications,
  topMenuButtons,
  activeMenuTitle,
  landingPage
}) => {
  const user = useParty();

  return (
    <Grid className={classNames('page-content', className)}>
      <Grid.Column className="page-sidemenu">
          <Menu secondary vertical>
            <Menu.Menu>
              <Menu.Item
                  as={NavLink}
                  to='/apps/'
                  exact
                  className='home-item'
              >
                <Header as='h1' className='dark'>@{user}</Header>
                </Menu.Item>
            </Menu.Menu>
          </Menu>
      </Grid.Column>
      <Grid.Column className='page-body'>
          <TopMenu
              title={menuTitle}
              notifications={notifications}
              topMenuButtons={topMenuButtons}
              activeMenuTitle={activeMenuTitle}
              landingPage={landingPage}/>
          { children }
      </Grid.Column>
    </Grid>
  )
}

export default Page
