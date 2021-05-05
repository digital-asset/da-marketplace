import React from 'react'
import {Card, Label} from 'semantic-ui-react'

import {ClearedOrder, Order} from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import {unwrapDamlTuple} from '../common/damlTypes'
import {ExchangeIcon} from '../../icons/Icons'

export type OrderProps = {
    order: Order | ClearedOrder;
    cleared?: boolean;
}

const OrderCard: React.FC<OrderProps> = ({ children, cleared, order }) => {
    const [base, quote] = unwrapDamlTuple(order.pair).map(t => t.label);
    const label = order.isBid ? `Buy ${base}/${quote}` : `Sell ${base}/${quote}`;
    const price = `${order.price} ${quote}`;
    const amount = order.isBid ? `+ ${order.qty} ${base}` : `- ${order.qty} ${base}`;

    return (
        <div className='order-card-container'>
            <Card fluid className='order-card'>
                <div className='order-info'>
                    <p className='order-icon'><ExchangeIcon/>
                        { cleared && <Label>Cleared</Label> }
                        { label }
                    </p>
                    <p>{ amount }</p>
                    <p>{`@ ${price}`}</p>
                </div>
                <div className='actions'>
                    { children }
                </div>
            </Card>
        </div>
    )
}

export { OrderCard };
