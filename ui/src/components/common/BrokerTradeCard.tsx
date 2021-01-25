import React from 'react'
import { Card } from 'semantic-ui-react'
import { unwrapDamlTuple } from '../common/damlTypes'
import { BrokerTrade } from '@daml.js/da-marketplace/lib/Marketplace/Trading'
import { ExchangeIcon } from '../../icons/Icons'

export type BrokerTradeCardProps = {
    brokerTrade: BrokerTrade;
}

const BrokerTradeCard: React.FC<BrokerTradeCardProps> = ({ children, brokerTrade }) => {
    const [base, quote] = unwrapDamlTuple(brokerTrade.pair).map(t => t.label);
    const label = brokerTrade.isBuy ? `Bought ${base}/${quote}` : `Sold ${base}/${quote}`;
    const price = `${brokerTrade.price} ${quote}`;
    const amount = brokerTrade.isBuy ? `+ ${brokerTrade.qty} ${base}` : `- ${brokerTrade.qty} ${base}`;

    return (
        <div className='order-card-container'>
            <Card fluid className='order-card'>
                <div className='order-info'>
                    <div><ExchangeIcon/> {label}</div>
                    <div>{ amount }</div>
                    <div>{`@ ${price}`}</div>
                    <div>{`Broker Order ID: ${brokerTrade.brokerOrderId}`}</div>
                </div>
                <div className='actions'>
                    { children }
                </div>
            </Card>
        </div>
    )
}

export { BrokerTradeCard };
