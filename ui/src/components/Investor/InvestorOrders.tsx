import React, { useState } from 'react'
import { Button, Card, Header } from 'semantic-ui-react'

import { useLedger, useStreamQuery } from '@daml/react'
import { Order, OrderRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { ExchangeIcon, OrdersIcon } from '../../icons/Icons'
import { unwrapDamlTuple, wrapDamlTuple } from '../common/Tuple'
import FormErrorHandled from '../common/FormErrorHandled'
import Page from '../common/Page'

import './InvestorOrders.css'

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
                { allOrders.map(o => <OpenOrderCard key={o.contractId} order={o.payload}/>)}
            </div>
        </Page>
    )
}

type OrderProps = {
    order: Order;
}

const OrderCard: React.FC<OrderProps> = ({ children, order }) => {
    const base = unwrapDamlTuple(order.pair)[0].label;
    const label = order.isBid ? `Buy ${base}` : `Sell ${base}`;
    const amount = order.isBid ? `+ ${order.qty} ${base}` : `- ${order.qty} ${base}`;

    return (
        <div className='order-card-container'>
            <div className='order-card'>
                <Card fluid className='order-info'>
                    <div><ExchangeIcon/> {label}</div>
                    <div>{ amount }</div>
                </Card>

                { children }
            </div>
        </div>
    )
}

const OpenOrderCard: React.FC<OrderProps> = ({ order }) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');
    const ledger = useLedger();

    const handleCancelOrder = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            const key = wrapDamlTuple([order.exchange, order.orderId])
            await ledger.exerciseByKey(Order.Order_RequestCancel, key, {});
            setError('');
        } catch (err) {
            setError(err.errors.join('\n'));
        }
        setLoading(false);
    }

    return (
        <FormErrorHandled className='order-card-container' error={error}>
            <OrderCard order={order}>
                <Button
                    basic
                    color='black'
                    content='Cancel'
                    className='basic-button-fill'
                    loading={loading}
                    onClick={handleCancelOrder}/>
            </OrderCard>
        </FormErrorHandled>
    )
}

export default InvestorOrders;
