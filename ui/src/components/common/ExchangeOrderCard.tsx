import React from 'react'
import { Button } from 'semantic-ui-react'

import { useLedger } from '@daml/react'
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { wrapDamlTuple } from './damlTypes'
import FormErrorHandled from './FormErrorHandled'
import { OrderCard, OrderProps } from './OrderCard'


const ExchangeOrderCard: React.FC<OrderProps> = ({ order }) => {
    const ledger = useLedger();

    const handleCancelOrder = async () => {
        const key = wrapDamlTuple([order.exchange, order.orderId])
        await ledger.exerciseByKey(Order.Order_RequestCancel, key, {});
    }

    return (
        <FormErrorHandled
            className='order-card-container'
            onSubmit={handleCancelOrder}
        >
            <OrderCard order={order}>
                <Button
                    content='Cancel'
                className='ghost warning'
                />
            </OrderCard>
        </FormErrorHandled>
    )
}

export default ExchangeOrderCard;
