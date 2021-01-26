import React from 'react'
import { useParams } from 'react-router-dom'

import { Header } from 'semantic-ui-react'

import {
    BrokerTrade,
    SettledTradeSide
} from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { UserIcon } from '../../icons/Icons'

import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { BrokerTradeCard } from '../common/BrokerTradeCard'
import { TradeCard } from '../common/TradeCard'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import { useContractQuery } from '../../websocket/queryStream'

import TabViewer from '../common/TabViewer';

type Props = {
    onLogout: () => void;
    sideNav: React.ReactElement;
}

const BrokerCustomers: React.FC<Props> = ({ onLogout, sideNav }) => {
    const { customerId } = useParams<{customerId: string}>()

    const customer = useContractQuery(BrokerCustomer).find(c => c.contractId === customerId);
    const allExchangeTrades = useContractQuery(SettledTradeSide);
    const allBrokerTrades = useContractQuery(BrokerTrade);


    const tabItems = [
        { name: 'Order History', content:<p>hi</p> },
        { name: 'Allocations', content:<p>hi</p> }
    ]

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><UserIcon size='24'/> {customer?.contractData.brokerCustomer}</>}
            onLogout={onLogout}
        >
            <PageSection>
                <TabViewer tabs={tabItems}/>
                <div className='broker-customer-holdings'>
                   
                </div>
            </PageSection>
        </Page>
    )
}

const OrderHistory = () => {
    return (
        <div>
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
</div>
)
}

export default BrokerCustomers;
