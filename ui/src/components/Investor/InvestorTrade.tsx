import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import _ from 'lodash'
import { Header } from 'semantic-ui-react'

import { useParty } from '@daml/react'
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types/module'
import { CCPCustomer } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterpartyCustomer'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { ClearedOrder, Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

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
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}

type LocationState = {
    isCleared?: boolean;
    defaultCCP?: string;
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

const InvestorTrade: React.FC<Props> = ({ deposits, sideNav, onLogout, showNotificationAlert, handleNotificationAlert }) => {
    const [ bidDeposits, setBidDeposits ] = useState<DepositInfo[]>([]);
    const [ offerDeposits, setOfferDeposits ] = useState<DepositInfo[]>([]);

    const location = useLocation<LocationState>();
    const history = useHistory();
    const investor = useParty();

    const allOrders = useContractQuery(Order);
    const allClearedOrders = useContractQuery(ClearedOrder);
    const ccpCustomerContracts = useContractQuery(CCPCustomer);

    const exchangeData = location.state && location.state.exchange;
    const tokenPair = location.state && location.state.tokenPair;
    const isCleared = location.state && !!location.state.isCleared;
    const defaultCCP = location.state && location.state.defaultCCP;

    const ccpCustomer = ccpCustomerContracts.find(ccp => ccp.contractData.ccpCustomer === investor)

    if (!exchangeData || !tokenPair) {
        history.push('/role/investor');
        throw new Error('No exchange found.');
    }

    const { exchange } = exchangeData;
    const [ base, quote ] = tokenPair.map(t => t.label);

    const tokens = useContractQuery(Token);

    const basePrecision = Number(tokens.find(token => token.contractData.id.label === tokenPair[0].label)?.contractData.quantityPrecision) || 0;
    const quotePrecision = Number(tokens.find(token => token.contractData.id.label === tokenPair[1].label)?.contractData.quantityPrecision) || 0;

    const marketData = isCleared ?
        allClearedOrders
            .filter(order => _.isEqual(unwrapDamlTuple(order.contractData.pair), tokenPair))
            .reduce((map, order) => {
                const { price, qty } = order.contractData;

                const kind = order.contractData.isBid ? OrderKind.BID : OrderKind.OFFER;
                const qtyOrders = map[order.contractId]?.qtyOrders || 0;

                return { ...map, [order.contractId]: { kind, qtyOrders: qtyOrders + +qty, price: +price } };
        }, {} as MarketDataMap)
        :
        allOrders
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
            menuTitle={<><ExchangeIcon color='green' size='24'/>{base}/{quote}</>}
            onLogout={onLogout}
            showNotificationAlert={showNotificationAlert}
            handleNotificationAlert={handleNotificationAlert}
        >
            <PageSection className='investor-trade'>
                <div className='order'>
                    <Header className='dark' as='h3'><CandlestickIcon/>Order</Header>
                    <div className='order-input'>
                        <OrderForm
                            allowedToOrder={!!ccpCustomer}
                            inGoodStanding={!!ccpCustomer?.contractData?.inGoodStanding}
                            assetPrecisions={[basePrecision, quotePrecision]}
                            deposits={[bidDeposits, offerDeposits]}
                            defaultCCP={defaultCCP}
                            exchange={exchange}
                            isCleared={isCleared}
                            tokenPair={tokenPair}/>
                        <OrderLadder orders={marketData}/>
                    </div>
                </div>
            </PageSection>
        </Page>
    )
}

export default InvestorTrade;
