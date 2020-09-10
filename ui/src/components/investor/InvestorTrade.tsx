import React from 'react'
import { useParams, useLocation } from 'react-router-dom'

import { useParty, useLedger } from '@daml/react'

import { Investor, Exchange, ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/Role'

import { ExchangeIcon } from '../../icons/Icons'
import { getWellKnownParties } from '../../config'
import Page from '../common/Page'
import { wrapDamlTuple } from '../common/Tuple'

import { ContractInfo } from './Investor'
import OrderForm from './OrderForm'

type Props = {
    deposits: ContractInfo[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

function filterDepositsForOrder(deposits: ContractInfo[], exchange: string, symbol: string) {
    return deposits
        .filter(d => d.contractData.account.id.label.split("@")[1] !== exchange)
        .filter(d => d.contractData.asset.id.label === symbol);
}

const InvestorTrade: React.FC<Props> = ({ deposits, sideNav, onLogout }) => {
    const { base, quote } = useParams();
    const location = useLocation<{exchange?: Exchange}>();
    const investor = useParty();
    const ledger = useLedger();

    const exchangeData = location.state.exchange;
    const tokenPair = exchangeData?.tokenPairs[0];

    const allocateToExchange = async (depositCid: string, exchange: string) => {
        const { operator } = await getWellKnownParties();

        const key = wrapDamlTuple([operator, investor]);
        const args = { depositCid, exchange };

        return ledger.exerciseByKey(Investor.Investor_AllocateToExchange, key, args);
    }

    const placeBid = async (unallocatedDepositCid: string, price: string) => {
        if (exchangeData?.exchange) {
            const { operator } = await getWellKnownParties();
            const { exchange } = exchangeData;

            const allocatedDeposit = await allocateToExchange(unallocatedDepositCid, exchange);

            const key = wrapDamlTuple([exchange, operator, investor]);
            const args = {
                price,
                depositCid: allocatedDeposit[0],
                pair: tokenPair
            };

            await ledger.exerciseByKey(ExchangeParticipant.ExchangeParticipant_PlaceBid, key, args);
        } else {
            throw new Error('No exchange found');
        }
    }

    const placeOffer = async (unallocatedDepositCid: string, price: string) => {
        if (exchangeData?.exchange) {
            const { operator } = await getWellKnownParties();
            const { exchange } = exchangeData;

            const allocatedDeposit = await allocateToExchange(unallocatedDepositCid, exchange);

            const key = wrapDamlTuple([exchange, operator, investor]);
            const args = {
                price,
                depositCid: allocatedDeposit[0],
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
                    deposits={filterDepositsForOrder(deposits, exchangeData?.exchange || "", quote)}/>

                <OrderForm
                    kind='offer'
                    placeOrder={placeOffer}
                    deposits={filterDepositsForOrder(deposits, exchangeData?.exchange || "", base)}/>
            </div>
        </Page>
    )
}

export default InvestorTrade;
