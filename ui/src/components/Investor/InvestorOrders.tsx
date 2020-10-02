import React from 'react'

import { useStreamQuery } from '@daml/react'
import { Order, OrderRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { OrdersIcon } from '../../icons/Icons'
import { OrderCard } from '../common/OrderCard'
import ExchangeOrderCard from '../common/ExchangeOrderCard'
import PageSection from '../common/PageSection'
import Page from '../common/Page'


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
            <PageSection border='blue' background='white'>
                <div className='investor-orders'>
                    <p>Requested Orders</p>
                    { allOrderRequests.map(or => <OrderCard key={or.contractId} order={or.payload.order}/>)}

                    <p>Open Orders</p>
                    { allOrders.map(o => <ExchangeOrderCard key={o.contractId} order={o.payload}/>)}
                </div>
            </PageSection>
        </Page>
    )
}

export default InvestorOrders;
