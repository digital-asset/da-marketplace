import React from 'react'
import { Card } from 'semantic-ui-react'
import { unwrapDamlTuple } from '../common/damlTypes'
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'
import { ExchangeIcon } from '../../icons/Icons'

import './OrderCard.css'

export type OrderProps = {
    order: Order;
}

const OrderCard: React.FC<OrderProps> = ({ children, order }) => {
    const pair = unwrapDamlTuple(order.pair)
    const base = pair[0].label;
    const quote = pair[1].label;
    const label = order.isBid ? `Buy ${base}/${quote}` : `Sell ${base}/${quote}`;
    const price = `${order.price} ${quote}`;
    const amount = order.isBid ? `+ ${order.qty} ${base}` : `- ${order.qty} ${base}`;

    return (
        <div className='order-card-container'>
            <div className='order-card'>
                <Card fluid className='order-info'>
                    <div><ExchangeIcon/> {label}</div>
                    <div>{ amount }</div>
                    <div>{`@ ${price}`}</div>
                </Card>

                { children }
            </div>
        </div>
    )
}

export { OrderCard };
