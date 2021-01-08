import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useParty, useLedger, useStreamQueries, useStreamFetchByKeys } from '@daml/react'
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types/module'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { MarketPair, Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { ExchangeIcon } from '../../icons/Icons'
import { DepositInfo, wrapDamlTuple, makeContractInfo, wrapTextMap } from '../common/damlTypes'
import { useOperator } from '../common/common'
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
    const operator = useOperator();
    const investor = useParty();
    const ledger = useLedger();

    const exchangeData = location.state && location.state.exchange;
    const tokenPair = location.state && location.state.tokenPair;

    if (!exchangeData || !tokenPair) {
        throw new Error('No exchange found.');
    }

    const { exchange } = exchangeData;
    const [ base, quote ] = tokenPair.map(t => t.label);

    const marketPairId: Id = {
        signatories: wrapTextMap([exchange]),
        label: `${base}${quote}`,
        version: '0'
    };

    const { contracts: marketPairs2 } = useStreamQueries(MarketPair);
    const { contracts: marketPairs } = useStreamFetchByKeys(MarketPair, () => [marketPairId], [location]);
    const marketPair = marketPairs.find(mp => mp?.payload.id === marketPairId)?.payload;

    console.log("testing testing", marketPairs, marketPairs2);

    // if (!marketPair) {
    //     throw new Error('No market pair for the exchange');
    // }

    const maxQuantity = (marketPair && marketPair.maxQuantity) || '0';
    const minQuantity = (marketPair && marketPair.minQuantity) || '0';
    const quantityLimits: [number, number] = [ +minQuantity, +maxQuantity ];

    const tokens = useStreamQueries(Token).contracts.map(makeContractInfo);

    const basePrecision = Number(tokens.find(token => token.contractData.id.label === tokenPair[0].label)?.contractData.quantityPrecision) || 0;
    const quotePrecision = Number(tokens.find(token => token.contractData.id.label === tokenPair[1].label)?.contractData.quantityPrecision) || 0;

    useEffect(() => {
        const label = `'${investor}'@'${exchange}'`;
        setBidDeposits(filterDepositsForOrder(deposits, label, quote));
        setOfferDeposits(filterDepositsForOrder(deposits, label, base));
    }, [ deposits, base, quote, investor, exchange ]);

    const placeBid = async (depositCid: string, price: string, amount: string) => {
        const key = wrapDamlTuple([exchange, operator, investor]);
        const args = {
            price,
            amount,
            depositCid,
            pair: wrapDamlTuple(tokenPair)
        };

        await ledger.exerciseByKey(ExchangeParticipant.ExchangeParticipant_PlaceBid, key, args);
    }

    const placeOffer = async (depositCid: string, price: string, amount: string) => {
        const key = wrapDamlTuple([exchange, operator, investor]);
        const args = {
            price,
            amount,
            depositCid,
            pair: wrapDamlTuple(tokenPair)
        };

        await ledger.exerciseByKey(ExchangeParticipant.ExchangeParticipant_PlaceOffer, key, args);
    }

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><ExchangeIcon/>{base}/{quote}</>}
            onLogout={onLogout}
        >
            <PageSection border='blue' background='white'>
                <div className='order-forms'>
                    <OrderForm
                        quotePrecision={quotePrecision}
                        kind={OrderKind.BID}
                        placeOrder={placeBid}
                        assetPrecisions={[quotePrecision, basePrecision]}
                        labels={[quote, base]}
                        limits={quantityLimits}
                        deposits={bidDeposits}/>

                    <OrderForm
                        quotePrecision={quotePrecision}
                        kind={OrderKind.OFFER}
                        placeOrder={placeOffer}
                        assetPrecisions={[basePrecision, quotePrecision]}
                        labels={[base, quote]}
                        limits={quantityLimits}
                        deposits={offerDeposits}/>
                </div>
            </PageSection>
        </Page>
    )
}

export default InvestorTrade;
