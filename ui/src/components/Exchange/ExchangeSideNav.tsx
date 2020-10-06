import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { PublicIcon, UserIcon } from '../../icons/Icons'

type Props = {
    url: string;
    name: string;
}

const ExchangeSideNav: React.FC<Props> = ({ url, name }) => {
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
                to={`${url}/market-pairs`}
                className='sidemenu-item-normal'
                exact
            >
                <p><PublicIcon/> Market Pairs</p>
            </Menu.Item>

            <Menu.Item
                as={NavLink}
                to={`${url}/create-pair`}
                className='sidemenu-item-normal'
                exact
            >
                <p><PublicIcon/> Create a Market</p>
            </Menu.Item>

            <Menu.Item
                as={NavLink}
                to={`${url}/participants`}
                className='sidemenu-item-normal'
                exact
            >
                <p><UserIcon/> Investors</p>
            </Menu.Item>

        </Menu.Menu>
    )
}

export default ExchangeSideNav;
