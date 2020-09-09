import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Role'

import { useParty, useStreamQuery } from '@daml/react'

import { MarketIcon, ExchangeIcon, OrdersIcon, WalletIcon } from '../../icons/Icons'

const InvestorSideNav: React.FC = () => {
    const user = useParty();
    const allExchanges = useStreamQuery(Exchange).contracts;

    return <>
        <Menu.Menu>
            <Menu.Item
                as={NavLink}
                to='/role/investor'
                exact={true}
            >
                <Header as='h3'>@{user}</Header>
            </Menu.Item>

            <Menu.Item
                as={NavLink}
                to='/role/investor/wallet'
                className='sidemenu-item-normal'
            >
                <p><WalletIcon/>Wallet</p>
            </Menu.Item>

            <Menu.Item className='sidemenu-item-normal'>
                <p><OrdersIcon/>Orders</p>
            </Menu.Item>
        </Menu.Menu>

        <Menu.Menu>
            <Menu.Item>
                <Header as="h3"><MarketIcon/> Marketplace</Header>
            </Menu.Item>

            { allExchanges.map(exchanges => (
                <Menu.Item
                    className='sidemenu-item-normal'
                    key={exchanges.contractId}
                >
                    <p>
                        <ExchangeIcon/>
                        {exchanges.payload.tokenPairs[0]._1.label}/
                        {exchanges.payload.tokenPairs[0]._2.label}
                    </p>
                </Menu.Item>
            ))}
        </Menu.Menu>
    </>
}

export default InvestorSideNav
