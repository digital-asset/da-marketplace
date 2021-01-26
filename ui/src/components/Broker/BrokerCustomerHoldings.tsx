import React from 'react'
import { useParams } from 'react-router-dom'

import { Header } from 'semantic-ui-react'

import {
    BrokerTrade,
    Order,
    OrderRequest,
    SettledTradeSide
} from '@daml.js/da-marketplace/lib/Marketplace/Trading'
import { UserIcon } from '../../icons/Icons'

import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { BrokerTradeCard } from '../common/BrokerTradeCard'
import { TradeCard } from '../common/TradeCard'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import { useContractQuery, AS_PUBLIC } from '../../websocket/queryStream'

type Props = {
    onLogout: () => void;
    sideNav: React.ReactElement;
}

const BrokerCustomers: React.FC<Props> = ({ onLogout, sideNav }) => {
    const { customerId } = useParams<{customerId: string}>()

    const customer = useContractQuery(BrokerCustomer).find(c => c.contractId === customerId);
    const allExchangeTrades = useContractQuery(SettledTradeSide);
    const allBrokerTrades = useContractQuery(BrokerTrade);
    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><UserIcon size='24'/> {customer?.contractData.brokerCustomer}</>}
            onLogout={onLogout}
        >
            <PageSection>
                <div className='broker-customer-holdings'>
                    <div className='title'>
                        <Header as='h2'>{customer?.contractData.brokerCustomer}</Header>
                    </div>
                </div>

                <div className='order-section'>
                    <Header as='h2'>Exchange Trades</Header>
                    {allExchangeTrades.length > 0 ?
                        allExchangeTrades.map(t => <TradeCard key={t.contractId} trade={t.contractData}/>)
                        :
                        <i>none</i>
                    }
                </div>
                <div className='order-section'>
                    <Header as='h2'>Broker Trades</Header>
                    {allBrokerTrades.length > 0 ?
                        allBrokerTrades.map(t => <BrokerTradeCard key={t.contractId} brokerTrade={t.contractData}/>)
                        :
                        <i>none</i>
                    }
                </div>

            </PageSection>
        </Page>
    )
}

export default BrokerCustomers;
