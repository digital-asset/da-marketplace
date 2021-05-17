import React from 'react'
import { Button, Label } from 'semantic-ui-react'

import { useLedger } from '@daml/react'
import { ClearedOrderRequest, OrderRequest } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { wrapDamlTuple } from './damlTypes'
import FormErrorHandled from './FormErrorHandled'
import { OrderCard, OrderProps } from './OrderCard'


const ExchangeOrderRequestCard: React.FC<OrderProps> = ({ order, cleared }) => {
    const ledger = useLedger();

    const handleCancelOrderRequest = async () => {
        const key = wrapDamlTuple([order.exchange, order.orderId])
        if (!!cleared) {
            await ledger.exerciseByKey(ClearedOrderRequest.ClearedOrderRequest_Cancel, key, {});
        } else {
            await ledger.exerciseByKey(OrderRequest.OrderRequest_Cancel, key, {});
        }
    }

    return (
        <FormErrorHandled
            className='order-card-container'
            onSubmit={handleCancelOrderRequest}
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

export default ExchangeOrderRequestCard;
