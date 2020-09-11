import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useParty, useLedger } from '@daml/react'

import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { ExchangeIcon } from '../../icons/Icons'
import { getWellKnownParties } from '../../config'
import { wrapDamlTuple, unwrapDamlTuple } from '../common/Tuple'
import Page from '../common/Page'

import { DepositInfo } from './Investor'
import OrderForm from './OrderForm'

type Props = {
    deposits: DepositInfo[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const filterDepositsForOrder = (deposits: DepositInfo[], exchange: string, symbol: string) => {
    return deposits
        .filter(d => d.contractData.account.id.label.split("@")[1].replace(/'/g, '') === exchange)
        .filter(d => d.contractData.asset.id.label === symbol);
}

const InvestorTrade: React.FC<Props> = ({ deposits, sideNav, onLogout }) => {
    const [ bidDeposits, setBidDeposits ] = useState<DepositInfo[]>([]);
    const [ offerDeposits, setOfferDeposits ] = useState<DepositInfo[]>([]);

    const location = useLocation<{exchange?: Exchange}>();
    const investor = useParty();
    const ledger = useLedger();

    const exchangeData = location.state.exchange;

    if (!exchangeData) {
        throw new Error('Invalid exchange view.');
    }

    const tokenPair = exchangeData.tokenPairs[0];
    const [ base, quote ] = unwrapDamlTuple(tokenPair).map(t => t.label);

    useEffect(() => {
        const { exchange } = exchangeData;
        setBidDeposits(filterDepositsForOrder(deposits, exchange, quote));
        setOfferDeposits(filterDepositsForOrder(deposits, exchange, base));
    }, [ deposits, base, quote, exchangeData ]);

    const placeBid = async (depositCid: string, price: string) => {
        if (exchangeData?.exchange) {
            const { operator } = await getWellKnownParties();
            const { exchange } = exchangeData;

            const key = wrapDamlTuple([exchange, operator, investor]);
            const args = {
                price,
                depositCid,
                pair: tokenPair
            };

            await ledger.exerciseByKey(ExchangeParticipant.ExchangeParticipant_PlaceBid, key, args);
        } else {
            throw new Error('No exchange found');
        }
    }

    const placeOffer = async (depositCid: string, price: string) => {
        if (exchangeData?.exchange) {
            const { operator } = await getWellKnownParties();
            const { exchange } = exchangeData;

            const key = wrapDamlTuple([exchange, operator, investor]);
            const args = {
                price,
                depositCid,
                pair: tokenPair
            };

            await ledger.exerciseByKey(ExchangeParticipant.ExchangeParticipant_PlaceOffer, key, args);
        } else {
            throw new Error('No exchange found');
        }
    }

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><ExchangeIcon/>{base}/{quote}</>}
            onLogout={onLogout}
        >
            <div className='order-forms'>
                <OrderForm
                    kind='bid'
                    placeOrder={placeBid}
                    deposits={bidDeposits}/>

                <OrderForm
                    kind='offer'
                    placeOrder={placeOffer}
                    deposits={offerDeposits}/>
            </div>
        </Page>
    )
}

export default InvestorTrade;
