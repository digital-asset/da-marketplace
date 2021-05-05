import React from 'react'
import {NavLink} from 'react-router-dom'
import {Header, Menu} from 'semantic-ui-react'

import {OrdersIcon, WalletIcon} from '../../icons/Icons'

type Props = {
    url: string;
    name: string;
}

const ExchangeSideNav: React.FC<Props> = ({ url, name }) => {
    return (
        <Menu.Menu>
            <Menu.Item
                as={NavLink}
                to={url}
                exact
            >
                <Header as='h2' className='dark'>@{name}</Header>
            </Menu.Item>

            <Menu.Item
                as={NavLink}
                to={`${url}/wallet`}
                className='sidemenu-item-normal'
                exact
            >
                <p><WalletIcon/> Wallet</p>
            </Menu.Item>

            <Menu.Item
                as={NavLink}
                to={`${url}/orders`}
                className='sidemenu-item-normal'
                exact
            >
                <p><OrdersIcon/> Customer Orders</p>
            </Menu.Item>

        </Menu.Menu>
    )
}

export default ExchangeSideNav;
