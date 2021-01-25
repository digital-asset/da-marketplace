import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import _ from 'lodash'

import { useParty } from '@daml/react'
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types/module'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { CandlestickIcon, ExchangeIcon } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import { DepositInfo, unwrapDamlTuple } from '../common/damlTypes'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import OrderLadder, { MarketDataMap } from './OrderLadder'
import OrderForm from './OrderForm'

type Props = {
    deposits: DepositInfo[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

type LocationState = {
    exchange?: Exchange;
    tokenPair?: Id[];
}

export enum OrderKind {
    BID = 'bid',
    OFFER = 'offer'
}

const filterDepositsForOrder = (deposits: DepositInfo[], accountLabel: string, symbol: string) => {
    return deposits
        .filter(d => d.contractData.account.id.label === accountLabel)
        .filter(d => d.contractData.asset.id.label === symbol);
}

const InvestorTrade: React.FC<Props> = ({ deposits, sideNav, onLogout }) => {
    const [ bidDeposits, setBidDeposits ] = useState<DepositInfo[]>([]);
    const [ offerDeposits, setOfferDeposits ] = useState<DepositInfo[]>([]);

    const location = useLocation<LocationState>();
    const history = useHistory();
    const investor = useParty();

    const allOrders = useContractQuery(Order);

    const exchangeData = location.state && location.state.exchange;
    const tokenPair = location.state && location.state.tokenPair;

    if (!exchangeData || !tokenPair) {
        history.push('/role/investor');
        throw new Error('No exchange found.');
    }

    const { exchange } = exchangeData;
    const [ base, quote ] = tokenPair.map(t => t.label);

    const tokens = useContractQuery(Token);

    const basePrecision = Number(tokens.find(token => token.contractData.id.label === tokenPair[0].label)?.contractData.quantityPrecision) || 0;
    const quotePrecision = Number(tokens.find(token => token.contractData.id.label === tokenPair[1].label)?.contractData.quantityPrecision) || 0;

    const marketData = allOrders
        .filter(order => _.isEqual(unwrapDamlTuple(order.contractData.pair), tokenPair))
        .reduce((map, order) => {
            const { price, qty } = order.contractData;

            const kind = order.contractData.isBid ? OrderKind.BID : OrderKind.OFFER;
            const qtyOrders = map[order.contractId]?.qtyOrders || 0;

            return { ...map, [order.contractId]: { kind, qtyOrders: qtyOrders + +qty, price: +price } };
    }, {} as MarketDataMap)

    useEffect(() => {
        const label = `'${investor}'@'${exchange}'`;
        setBidDeposits(filterDepositsForOrder(deposits, label, quote));
        setOfferDeposits(filterDepositsForOrder(deposits, label, base));
    }, [ deposits, base, quote, investor, exchange ]);

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><ExchangeIcon size='24'/>{base}/{quote}</>}
            onLogout={onLogout}
        >
            <PageSection className='investor-trade'>
                <div className='order'>
                    <h3><CandlestickIcon/>Order</h3>
                    <div className='order-input'>
                        <OrderForm
                            assetPrecisions={[basePrecision, quotePrecision]}
                            deposits={[bidDeposits, offerDeposits]}
                            exchange={exchange}
                            tokenPair={tokenPair}/>
                        <OrderLadder orders={marketData}/>
                    </div>
                </div>
            </PageSection>
        </Page>
    )
}

export default InvestorTrade;
