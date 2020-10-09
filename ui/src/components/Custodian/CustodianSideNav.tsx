import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { UserIcon } from '../../icons/Icons'

type Props = {
    url: string;
    name: string;
}

const CustodianSideNav: React.FC<Props> = ({ url, name }) => {
    const HomeMenuItem = (
        <Menu.Item
            as={NavLink}
            to={url}
            exact
        >
            <Header as='h3'>@{name}</Header>
        </Menu.Item>
    )

    return (
        <Menu.Menu>
            { HomeMenuItem }

            <Menu.Item
                as={NavLink}
                to={`${url}/clients`}
                className='sidemenu-item-normal'
                exact
            >
                <p><UserIcon/> Clients</p>
            </Menu.Item>
        </Menu.Menu>
    )
}

export default CustodianSideNav;
