import React from 'react'
import { Card } from 'semantic-ui-react'
import { unwrapDamlTuple } from '../common/damlTypes'
import { Settled as SettledTrade } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Trade'
import { ExchangeIcon } from '../../icons/Icons'

import './OrderCard.scss'

export type TradeCardProps = {
    trade: SettledTrade;
}

const TradeCard: React.FC<TradeCardProps> = ({ children, trade }) => {
    const [base, quote] = unwrapDamlTuple(trade.pair).map(t => t.label);
    const label = trade.isBuy ? `Bought ${base}/${quote}` : `Sold ${base}/${quote}`;
    const price = `${trade.price} ${quote}`;
    const amount = trade.isBuy ? `+ ${trade.qty} ${base}` : `- ${trade.qty} ${base}`;
    const time = new Date(0);
    // timestamp is in nanos with microsecond precision
    time.setUTCMilliseconds(parseInt(trade.timestamp.substring(0, trade.timestamp.length - 6)))
    const timeLabel = new Intl.DateTimeFormat('en-US',
        { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(time)

    return (
        <div className='order-card-container'>
            <div className='order-card'>
                <Card fluid className='order-info'>
                    <div><ExchangeIcon/> {label}</div>
                    <div>{ amount }</div>
                    <div>{`@ ${price}`}</div>
                    <div>{`Order ID: ${trade.orderId}`}</div>
                    <div>{`Counter Order ID: ${trade.counterOrderId}`}</div>
                    <div>{timeLabel}</div>
                </Card>

                { children }
            </div>
        </div>
    )
}

export { TradeCard };
