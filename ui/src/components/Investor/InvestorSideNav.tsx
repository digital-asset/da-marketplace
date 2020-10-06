import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { ExchangeIcon, OrdersIcon, WalletIcon } from '../../icons/Icons'
import { ExchangeInfo, unwrapDamlTuple } from '../common/damlTypes'

type Props = {
    url: string;
    exchanges: ExchangeInfo[];
    name: string;
}

const InvestorSideNav: React.FC<Props> = ({ url, exchanges, name }) => {
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
        <><Menu.Menu>
            { HomeMenuItem }
            <Menu.Item
                as={NavLink}
                to={`${url}/wallet`}
                className='sidemenu-item-normal'
            >
                <p><WalletIcon/>Wallet</p>
            </Menu.Item>

            <Menu.Item
                as={NavLink}
                to={`${url}/orders`}
                className='sidemenu-item-normal'
            >
                <p><OrdersIcon/>Orders</p>
            </Menu.Item>
        </Menu.Menu>

        <Menu.Menu className='sub-menu'>
            <Menu.Item>
                <p className='p2'>Marketplace:</p>
            </Menu.Item>

            { exchanges.map(exchange => {
                return exchange.contractData.tokenPairs.map(tokenPair => {
                    const [ base, quote ] = unwrapDamlTuple(tokenPair).map(t => t.label.toLowerCase());

                    return <Menu.Item
                        as={NavLink}
                        to={{
                            pathname: `${url}/trade/${base}-${quote}`,
                            state: {
                                exchange: exchange.contractData,
                                tokenPair: unwrapDamlTuple(tokenPair)
                            }
                        }}
                        className='sidemenu-item-normal'
                        key={exchange.contractId}
                    >
                        <p><ExchangeIcon/>{base.toUpperCase()}/{quote.toUpperCase()}</p>
                    </Menu.Item>
                })
            }).flat()}
        </Menu.Menu></>
    )
}

export default InvestorSideNav
