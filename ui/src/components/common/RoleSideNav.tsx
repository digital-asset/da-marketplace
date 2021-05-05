import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu, Loader } from 'semantic-ui-react'
import {useConnectionActive} from '../../websocket/queryStream'

type Props = {
    url: string;
    name: string;
    items: ISideNavItem[];
}

type ISideNavItem = {
    to: string,
    label: string,
    icon?: JSX.Element
}

const RoleSideNav: React.FC<Props> = ({ url, name, items, children }) => {
    const active = useConnectionActive();
    return (
        <div>
            <Menu.Menu>
                <Menu.Item
                    as={NavLink}
                    to={url}
                    exact
                    className='home-item'
                >
                  <Header as='h1' className='dark'>
                      @{name}
                  </Header>
                  { !active && <Loader inverted active inline size='small'>Connecting...</Loader>}
                </Menu.Item>
                {items.map(i =>
                    <Menu.Item
                        as={NavLink}
                        to={i.to}
                        className='sidemenu-item-normal'
                        exact
                    >
                        <p>{i.icon}{i.label}</p>
                    </Menu.Item>
                )}
            </Menu.Menu>
            {children}
        </div>
    )
}

export default RoleSideNav;
