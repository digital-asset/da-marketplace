import React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Menu } from 'semantic-ui-react'

import { useParty, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'

import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { ExchangeIcon, OrdersIcon, WalletIcon } from '../../icons/Icons'
import { ExchangeInfo, unwrapDamlTuple, wrapDamlTuple } from '../common/damlTypes'

type Props = {
    url: string;
    exchanges: ExchangeInfo[];
}

const InvestorSideNav: React.FC<Props> = ({ url, exchanges }) => {
    const investor = useParty();
    const operator = useWellKnownParties().userAdminParty;
    const key = () => wrapDamlTuple([operator, investor]);
    const registeredInvestor = useStreamFetchByKey(RegisteredInvestor, key, [operator, investor]).contract;

    const HomeMenuItem = (
        <Menu.Item
            as={NavLink}
            to={url}
            exact
        >
            <Header as='h3'>@{registeredInvestor?.payload.name || investor}</Header>
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

        <Menu.Menu>
            <Menu.Item>
                <p>Marketplace:</p>
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
                        <p><ExchangeIcon/>{base.toUpperCase()}</p>
                    </Menu.Item>
                })
            }).flat()}
        </Menu.Menu></>
    )
}

export default InvestorSideNav
