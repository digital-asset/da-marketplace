import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'

import { useLedger } from '@daml/react'
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { parseError, ErrorMessage } from './errorTypes'
import { wrapDamlTuple } from './damlTypes'
import FormErrorHandled from './FormErrorHandled'
import { OrderCard, OrderProps } from './OrderCard'


const ExchangeOrderCard: React.FC<OrderProps> = ({ order }) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();
    const ledger = useLedger();

    const handleCancelOrder = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            const key = wrapDamlTuple([order.exchange, order.orderId])
            await ledger.exerciseByKey(Order.Order_RequestCancel, key, {});
        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    return (
        <FormErrorHandled
            className='order-card-container'
            error={error}
            clearError={() => setError(undefined)}
        >
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

export default ExchangeOrderCard;
