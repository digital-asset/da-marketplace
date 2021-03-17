import React from 'react'
import { Button, Label } from 'semantic-ui-react'

import { useLedger } from '@daml/react'
import { ClearedOrder, Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { wrapDamlTuple } from './damlTypes'
import FormErrorHandled from './FormErrorHandled'
import { OrderCard, OrderProps } from './OrderCard'


const ExchangeOrderCard: React.FC<OrderProps> = ({ order, cleared }) => {
    const ledger = useLedger();

    const handleCancelOrder = async () => {
        const key = wrapDamlTuple([order.exchange, order.orderId])
        if (!!cleared) {
            await ledger.exerciseByKey(ClearedOrder.ClearedOrder_RequestCancel, key, {});
        } else {
            await ledger.exerciseByKey(Order.Order_RequestCancel, key, {});
        }
    }

    return (
        <FormErrorHandled
            className='order-card-container'
            onSubmit={handleCancelOrder}
        >
            <OrderCard cleared={cleared} order={order}>
                <Button
                    content='Cancel'
                    className='ghost'
                />
            </OrderCard>
        </FormErrorHandled>
    )
}

export default ExchangeOrderCard;
