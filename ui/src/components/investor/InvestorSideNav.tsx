import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'

import { useParty, useStreamQuery } from '@daml/react'

import { MarketIcon, ExchangeIcon, OrdersIcon, WalletIcon } from '../../icons/Icons'
import { unwrapDamlTuple } from '../common/Tuple'

type Props = {
    url: string;
}

const InvestorSideNav: React.FC<Props> = ({ url }) => {
    const user = useParty();
    const allExchanges = useStreamQuery(Exchange).contracts;

    return <>
        <Menu.Menu>
            <Menu.Item
                as={NavLink}
                to={url}
                exact
            >
                <Header as='h3'>@{user}</Header>
            </Menu.Item>

            <Menu.Item
                as={NavLink}
                to={`${url}/wallet`}
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

            { allExchanges.map(exchange => {
                const [ baseToken, quoteToken ] =
                    unwrapDamlTuple(exchange.payload.tokenPairs[0]).map(t => t.label);

                return <Menu.Item
                    as={NavLink}
                    to={{
                        pathname: `${url}/trade/${baseToken}-${quoteToken}`,
                        state: { exchange: exchange.payload }
                    }}
                    className='sidemenu-item-normal'
                    key={exchange.contractId}
                >
                    <p><ExchangeIcon/>{baseToken}</p>
                </Menu.Item>
            })}
        </Menu.Menu>
    </>
}

export default InvestorSideNav
