import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { useParty, useStreamQueries } from '@daml/react'
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types/module'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { CandlestickIcon, ExchangeIcon } from '../../icons/Icons'

import { DepositInfo, makeContractInfo } from '../common/damlTypes'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

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

    const exchangeData = location.state && location.state.exchange;
    const tokenPair = location.state && location.state.tokenPair;

    if (!exchangeData || !tokenPair) {
        history.push('/role/investor');
        throw new Error('No exchange found.');
    }

    const { exchange } = exchangeData;
    const [ base, quote ] = tokenPair.map(t => t.label);

    const tokens = useStreamQueries(Token).contracts.map(makeContractInfo);

    const basePrecision = Number(tokens.find(token => token.contractData.id.label === tokenPair[0].label)?.contractData.quantityPrecision) || 0;
    const quotePrecision = Number(tokens.find(token => token.contractData.id.label === tokenPair[1].label)?.contractData.quantityPrecision) || 0;

    useEffect(() => {
        const label = `'${investor}'@'${exchange}'`;
        setBidDeposits(filterDepositsForOrder(deposits, label, quote));
        setOfferDeposits(filterDepositsForOrder(deposits, label, base));
    }, [ deposits, base, quote, investor, exchange ]);

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><ExchangeIcon/>{base}/{quote}</>}
            onLogout={onLogout}
        >
            <PageSection border='blue' background='white'>
                <div className='investor-trade'>
                    <div className='order'>
                        <h3><CandlestickIcon/>Order</h3>
                        <div className='order-form'>
                            <OrderForm
                                assetPrecisions={[basePrecision, quotePrecision]}
                                deposits={[bidDeposits, offerDeposits]}
                                exchange={exchange}
                                tokenPair={tokenPair}/>
                        </div>
                    </div>
                </div>
            </PageSection>
        </Page>
    )
}

export default InvestorTrade;
