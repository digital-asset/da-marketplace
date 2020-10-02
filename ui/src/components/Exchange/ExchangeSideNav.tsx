import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { useParty, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { RegisteredExchange } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { PublicIcon, UserIcon } from '../../icons/Icons'
import {  wrapDamlTuple } from '../common/damlTypes'
import { useOperator } from '../common/common'

type Props = {
    url: string;
}

const ExchangeSideNav: React.FC<Props> = ({ url }) => {
    const exchange = useParty();
    const operator = useOperator();
    const key = () => wrapDamlTuple([operator, exchange]);
    const registeredExchange = useStreamFetchByKey(RegisteredExchange, key, [operator, exchange]).contract;

    const HomeMenuItem = (
        <Menu.Item
            as={NavLink}
            to={url}
            exact
        >
            <Header as='h3'>@{registeredExchange?.payload.name || exchange}</Header>
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
