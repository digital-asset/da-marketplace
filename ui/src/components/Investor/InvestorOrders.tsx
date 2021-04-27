import React from 'react'
import { Header } from 'semantic-ui-react'

import {
    BrokerTrade,
    ClearedOrder,
    ClearedOrderRequest,
    ClearedTradeSide,
    Order,
    OrderRequest,
    SettledTradeSide
} from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { OrdersIcon } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import { BrokerTradeCard } from '../common/BrokerTradeCard'
import { OrderCard } from '../common/OrderCard'
import { TradeCard } from '../common/TradeCard'
import Page from '../common/Page'
import PageSection from '../common/PageSection'
import ExchangeOrderCard from '../common/ExchangeOrderCard'


type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}

const InvestorOrders: React.FC<Props> = ({ sideNav, onLogout, showNotificationAlert, handleNotificationAlert }) => {
    const allOrders = useContractQuery(Order);
    const allOrderRequests = useContractQuery(OrderRequest);
    const allClearedOrders = useContractQuery(ClearedOrder);
    const allClearedOrderRequests = useContractQuery(ClearedOrderRequest);
    const allClearedOrderTrades = useContractQuery(ClearedTradeSide);
    const allExchangeTrades = useContractQuery(SettledTradeSide);
    const allBrokerTrades = useContractQuery(BrokerTrade);

    const orderRequests = [
        ...allOrderRequests.map(or => <OrderCard key={or.contractId} order={or.contractData.order}/>),
        ...allClearedOrderRequests.map(or => <OrderCard key={or.contractId} order={or.contractData.order}/>)
    ];

    const openOrders = [
        ...allOrders.map(o => <ExchangeOrderCard key={o.contractId} order={o.contractData}/>),
        ...allClearedOrders.map(o => <ExchangeOrderCard cleared key={o.contractId} order={o.contractData}/>)
    ]

    const trades = [
        ...allExchangeTrades.map(t => <TradeCard key={t.contractId} trade={t.contractData}/>),
        ...allClearedOrderTrades.map(t => <TradeCard key={t.contractId} trade={t.contractData}/>)
    ]

    const brokerTrades = allBrokerTrades.map(t => <BrokerTradeCard key={t.contractId} brokerTrade={t.contractData}/>);

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><OrdersIcon size='24'/>Orders</>}
            onLogout={onLogout}
            showNotificationAlert={showNotificationAlert}
            handleNotificationAlert={handleNotificationAlert}
        >
            <PageSection>
                <div className='investor-orders'>
                    <div className='order-section'>
                        <Header as='h2'>Requested Orders</Header>
                        { orderRequests.length > 0 ? orderRequests : <i>none</i> }
                    </div>

                    <div className='order-section'>
                        <Header as='h2'>Open Orders</Header>
                        { openOrders.length > 0 ? openOrders : <i>none</i> }
                    </div>

                    <div className='order-section'>
                        <Header as='h2'>Exchange Trades</Header>
                        { trades.length > 0 ? trades : <i>none</i> }
                    </div>

                    <div className='order-section'>
                        <Header as='h2'>Broker Trades</Header>
                        { brokerTrades.length > 0 ? brokerTrades : <i>none</i> }
                    </div>
                </div>
            </PageSection>
        </Page>
    )
}

export default InvestorOrders;
