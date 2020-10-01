import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { useParty, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { RegisteredBroker } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { wrapDamlTuple } from '../common/damlTypes'

import { WalletIcon, OrdersIcon } from '../../icons/Icons'

type Props = {
    url: string;
}

const ExchangeSideNav: React.FC<Props> = ({ url }) => {
    const broker = useParty();
    const operator = useWellKnownParties().userAdminParty;
    const key = () => wrapDamlTuple([operator, broker]);
    const registeredBroker = useStreamFetchByKey(RegisteredBroker, key, [operator, broker]).contract;

    return (
        <Menu.Menu>
            <Menu.Item
                as={NavLink}
                to={url}
                exact
            >
                <Header as='h3'>@{registeredBroker?.payload.name || broker}</Header>
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
