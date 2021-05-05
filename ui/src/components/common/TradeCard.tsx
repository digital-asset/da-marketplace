import React from 'react'
import {Card, Label} from 'semantic-ui-react'

import {ClearedTradeSide, SettledTradeSide} from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import {ExchangeIcon} from '../../icons/Icons'
import {unwrapDamlTuple} from '../common/damlTypes'

export type TradeCardProps = {
    trade: SettledTradeSide | ClearedTradeSide;
}

const isClearedTrade = (trade: any): trade is ClearedTradeSide => {
    return !!trade.ccp
}

const timestringToInt = (timestring: string) => {
    return parseInt(timestring.substring(0, timestring.length - 6));
}

const TradeCard: React.FC<TradeCardProps> = ({ children, trade }) => {
    const [base, quote] = unwrapDamlTuple(trade.pair).map(t => t.label);
    const label = trade.isBuy ? `Bought ${base}/${quote}` : `Sold ${base}/${quote}`;
    const price = `${trade.price} ${quote}`;
    const amount = trade.isBuy ? `+ ${trade.qty} ${base}` : `- ${trade.qty} ${base}`;
    const time = new Date(0);
    // timestamp is in nanos with microsecond precision
    time.setUTCMilliseconds(timestringToInt(trade.timeMatched))

    const timeLabel = new Intl.DateTimeFormat('en-US',
        { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(time)

    return (
        <div className='order-card-container'>
            <Card fluid className='order-card'>
                <div className='order-info'>
                    <div className='order-icon'>
                        <ExchangeIcon/>
                        { isClearedTrade(trade) && <Label>Cleared</Label> }
                        { label }
                    </div>
                    <div>{ amount }</div>
                    <div>{`@ ${price}`}</div>
                    <div>{`Order ID: ${trade.orderId}`}</div>
                    <div>{`Counter Order ID: ${trade.counterOrderId}`}</div>
                </div>
                <div className='actions'>
                    { timeLabel }
                    { children }
                </div>
            </Card>
        </div>
    )
}

export { TradeCard };
