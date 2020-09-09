import React from 'react'
import { NavLink } from 'react-router-dom'
import { Grid, Header, Menu } from 'semantic-ui-react'

import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Role'

import { useParty, useStreamQuery } from '@daml/react'

import { MarketIcon, ExchangeIcon, OrdersIcon, WalletIcon } from '../../icons/Icons'
import './SideMenu.css'

const SideMenu: React.FC = () => {
    const user = useParty();
    const allExchanges = useStreamQuery(Exchange).contracts;

    return (
        <Grid.Column className="page-sidemenu">
            <Menu secondary vertical>
                <Menu.Menu>
                    <Menu.Item
                        as={NavLink}
                        to='/'
                        exact={true}
                    >
                        <Header as='h3'>@{user}</Header>
                    </Menu.Item>

                    <Menu.Item
                        as={NavLink}
                        to='/wallet'
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
            </Menu>
        </Grid.Column>
    )
}

export default SideMenu;
