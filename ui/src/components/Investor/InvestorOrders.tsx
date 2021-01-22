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
import { useContractQuery } from '../../websocket/queryStream'


type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const InvestorOrders: React.FC<Props> = ({ sideNav, onLogout }) => {
    const allOrders = useContractQuery(Order);
    const allOrderRequests = useContractQuery(OrderRequest);
    const allExchangeTrades = useContractQuery(SettledTradeSide);
    const allBrokerTrades = useContractQuery(BrokerTrade);

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><OrdersIcon size='24'/>Orders</>}
            onLogout={onLogout}
        >
            <PageSection>
                <div className='investor-orders'>
                    <Header as='h3'>Requested Orders</Header>
                    {allOrderRequests.length > 0 ?
                        allOrderRequests.map(or => <OrderCard key={or.contractId} order={or.contractData.order}/>)
                        :
                        <i>none</i>
                    }

                    <Header as='h3'>Open Orders</Header>
                    {allOrders.length > 0 ?
                        allOrders.map(o => <ExchangeOrderCard key={o.contractId} order={o.contractData}/>)
                        :
                        <i>none</i>
                    }

                    <Header as='h3'>Exchange Trades</Header>
                    {allExchangeTrades.length > 0 ?
                        allExchangeTrades.map(t => <TradeCard key={t.contractId} trade={t.contractData}/>)
                        :
                        <i>none</i>
                    }

                    <Header as='h3'>Broker Trades</Header>
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

export default InvestorOrders;
