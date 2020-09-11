import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { useParty } from '@daml/react'

import { MarketIcon, ExchangeIcon, OrdersIcon, WalletIcon } from '../../icons/Icons'
import { unwrapDamlTuple } from '../common/Tuple'

import { ExchangeInfo } from './Investor'

type Props = {
    url: string;
    exchanges: ExchangeInfo[];
}

const InvestorSideNav: React.FC<Props> = ({ url, exchanges }) => {
    const investor = useParty();

    return <>
        <Menu.Menu>
            <Menu.Item
                as={NavLink}
                to={url}
                exact
            >
                <Header as='h3'>@{investor}</Header>
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
                        <p><ExchangeIcon/>{base}</p>
                    </Menu.Item>
                })
            }).flat()}
        </Menu.Menu>
    </>
}

export default InvestorSideNav
