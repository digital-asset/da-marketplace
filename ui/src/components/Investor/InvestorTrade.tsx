import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types/module'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { ExchangeIcon } from '../../icons/Icons'
import { wrapDamlTuple } from '../common/Tuple'
import Page from '../common/Page'

import { DepositInfo } from './Investor'
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
    const operator = useWellKnownParties().userAdminParty;
    const investor = useParty();
    const ledger = useLedger();

    const exchangeData = location.state.exchange;
    const tokenPair = location.state.tokenPair;

    if (!exchangeData || !tokenPair) {
        throw new Error('No exchange found.');
    }

    const { exchange } = exchangeData;
    const [ base, quote ] = tokenPair.map(t => t.label);

    useEffect(() => {
        const label = `'${investor}'@'${exchange}'`;
        setBidDeposits(filterDepositsForOrder(deposits, label, quote));
        setOfferDeposits(filterDepositsForOrder(deposits, label, base));
    }, [ deposits, base, quote, investor, exchange ]);

    const placeBid = async (depositCid: string, price: string) => {
        const key = wrapDamlTuple([exchange, operator, investor]);
        const args = {
            price,
            depositCid,
            pair: wrapDamlTuple(tokenPair)
        };

        await ledger.exerciseByKey(ExchangeParticipant.ExchangeParticipant_PlaceBid, key, args);
    }

    const placeOffer = async (depositCid: string, price: string) => {
        const key = wrapDamlTuple([exchange, operator, investor]);
        const args = {
            price,
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
            <div className='order-forms'>
                <OrderForm
                    kind={OrderKind.BID}
                    placeOrder={placeBid}
                    deposits={bidDeposits}/>

                <OrderForm
                    kind={OrderKind.OFFER}
                    placeOrder={placeOffer}
                    deposits={offerDeposits}/>
            </div>
        </Page>
    )
}

export default InvestorTrade;
