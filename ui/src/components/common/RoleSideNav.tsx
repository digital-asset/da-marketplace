import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

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
    return (
        <div>
            <Menu.Menu>
                <Menu.Item
                    as={NavLink}
                    to={url}
                    exact
                    className='home-item'
                >
                    <Header as='h2' className='dark'>@{name}</Header>
                </Menu.Item>
                {items.map(i =>
                    <Menu.Item
                        as={NavLink}
                        to={i.to}
                        className='sidemenu-item-normal'
                        exact
                    >
                        <p className='p2'>{i.icon}{i.label}</p>
                    </Menu.Item>
                )}
            </Menu.Menu>
            {children}
        </div>
    )
}

export default RoleSideNav;
