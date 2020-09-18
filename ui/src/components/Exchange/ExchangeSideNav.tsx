import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { useParty } from '@daml/react'

import { PublicIcon } from '../../icons/Icons'

type Props = {
    url: string;
}

const ExchangeSideNav: React.FC<Props> = ({ url }) => {
    const exchange = useParty();

    return (
        <Menu.Menu>
            <Menu.Item
                as={NavLink}
                to={url}
                exact
            >
                <Header as='h3'>@{exchange}</Header>
            </Menu.Item>

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

        </Menu.Menu>
    )
}

export default ExchangeSideNav;
