import React from 'react'

import { useStreamQueries } from '@daml/react'
import { BrokerTrade, Order, OrderRequest, SettledTradeSide } from '@daml.js/da-marketplace/lib/Marketplace/Trading'
import { Header } from 'semantic-ui-react'

import { OrdersIcon } from '../../icons/Icons'
import { BrokerTradeCard } from '../common/BrokerTradeCard'
import ExchangeOrderCard from '../common/ExchangeOrderCard'
import { OrderCard } from '../common/OrderCard'
import Page from '../common/Page'
import PageSection from '../common/PageSection'
import { TradeCard } from '../common/TradeCard'


type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const InvestorOrders: React.FC<Props> = ({ sideNav, onLogout }) => {
    const allOrders = useStreamQueries(Order, () => [], [], (e) => {
        console.log("Unexpected close from Order: ", e);
    }).contracts;
    const allOrderRequests = useStreamQueries(OrderRequest, () => [], [], (e) => {
        console.log("Unexpected close from OrderRequest: ", e);
    }).contracts;
    const allExchangeTrades = useStreamQueries(SettledTradeSide, () => [], [], (e) => {
        console.log("Unexpected close from settledTradeSide: ", e);
    }).contracts;
    const allBrokerTrades = useStreamQueries(BrokerTrade, () => [], [], (e) => {
        console.log("Unexpected close from brokerTrade: ", e);
    }).contracts;

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><OrdersIcon/>Orders</>}
            onLogout={onLogout}
        >
            <PageSection border='blue' background='white'>
                <div className='investor-orders'>
                    <Header as='h3'>Requested Orders</Header>
                    {allOrderRequests.length > 0 ? 
                        allOrderRequests.map(or => <OrderCard key={or.contractId} order={or.payload.order}/>)
                        :
                        '-'
                    }

                    <Header as='h3'>Open Orders</Header>
                    {allOrders.length > 0 ?
                        allOrders.map(o => <ExchangeOrderCard key={o.contractId} order={o.payload}/>)
                        :
                        '-'
                    }

                    <Header as='h3'>Exchange Trades</Header>
                    {allExchangeTrades.length > 0 ?
                        allExchangeTrades.map(t => <TradeCard key={t.contractId} trade={t.payload}/>)
                        :
                        '-'
                    }

                    <Header as='h3'>Broker Trades</Header>
                    {allBrokerTrades.length > 0 ?
                        allBrokerTrades.map(t => <BrokerTradeCard key={t.contractId} brokerTrade={t.payload}/>)
                        :
                        '-'
                    }

                </div>
            </PageSection>
        </Page>
    )
}

export default InvestorOrders;
