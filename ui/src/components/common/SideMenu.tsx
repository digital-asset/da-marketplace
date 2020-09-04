import React from 'react'
import { Grid, Header, Menu } from 'semantic-ui-react'

import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Role'

import { useParty, useStreamQuery } from '@daml/react'

import { MarketIcon, ExchangeIcon, OrdersIcon, WalletIcon } from '../../icons/Icons'
import { Mode } from '../MainScreen'
import './SideMenu.css'

type Props = {
    view: Mode;
    setView: (viewMode: Mode) => void;
}

const Sidebar: React.FC<Props> = ({ view, setView }) => {
    const user = useParty();
    const allExchanges = useStreamQuery(Exchange).contracts;

    return (
        <Grid.Column className="page-sidemenu" stackable={false}>
            <Menu secondary vertical>
                <Menu.Menu>
                    <Menu.Item
                        onClick={() => setView(Mode.INVESTOR_VIEW)}
                        active={view === Mode.INVESTOR_VIEW}
                    >
                        <Header as='h3'>@{user}</Header>
                    </Menu.Item>

                    <Menu.Item
                        className='sidemenu-item-normal'
                        onClick={() => setView(Mode.INVESTOR_WALLET_VIEW)}
                        active={view === Mode.INVESTOR_WALLET_VIEW}
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

export default Sidebar;
