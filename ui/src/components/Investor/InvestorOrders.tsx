import React from 'react'

import { useStreamQueries } from '@daml/react'
import { BrokerTrade, Order, OrderRequest, SettledTradeSide } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

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
                    <p>Requested Orders</p>
                    {allOrderRequests.map(or => <OrderCard key={or.contractId} order={or.payload.order}/>)}

                    <p>Open Orders</p>
                    {allOrders.map(o => <ExchangeOrderCard key={o.contractId} order={o.payload}/>)}

                    <p>Exchange Trades</p>
                    {allExchangeTrades.map(t => <TradeCard key={t.contractId} trade={t.payload}/>)}

                    <p>Broker Trades</p>
                    {allBrokerTrades.map(t => <BrokerTradeCard key={t.contractId} brokerTrade={t.payload}/>)}
                </div>
            </PageSection>
        </Page>
    )
}

export default InvestorOrders;
