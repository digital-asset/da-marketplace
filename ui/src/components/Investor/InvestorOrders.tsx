import React from 'react'
import { Header } from 'semantic-ui-react'

import { useStreamQuery } from '@daml/react'
import { Order, OrderRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { OrdersIcon } from '../../icons/Icons'
import Page from '../common/Page'
import ExchangeOrderCard from '../common/ExchangeOrderCard'
import { OrderCard } from '../common/OrderCard'


type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const InvestorOrders: React.FC<Props> = ({ sideNav, onLogout }) => {
    const allOrders = useStreamQuery(Order).contracts;
    const allOrderRequests = useStreamQuery(OrderRequest).contracts;

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><OrdersIcon/>Orders</>}
            onLogout={onLogout}
        >
            <div className='investor-orders'>
                <Header as='h4'>Requested Orders</Header>
                { allOrderRequests.map(or => <OrderCard key={or.contractId} order={or.payload.order}/>)}

                <Header as='h4'>Open Orders</Header>
                { allOrders.map(o => <ExchangeOrderCard key={o.contractId} order={o.payload}/>)}
            </div>
        </Page>
    )
}

export default InvestorOrders;
