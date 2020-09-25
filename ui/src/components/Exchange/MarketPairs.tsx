import React from 'react'

import { useParty, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'

import { PublicIcon, ExchangeIcon } from '../../icons/Icons'
import { unwrapDamlTuple, wrapDamlTuple } from '../common/damlTypes'
import CardTable from '../common/CardTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const MarketPairs: React.FC<Props> = ({ sideNav, onLogout }) => {
    const exchange = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const key = () => wrapDamlTuple([operator, exchange]);
    const exchangeContract = useStreamFetchByKey(Exchange, key, [operator, exchange]).contract;

    const header = ['Pair', 'Current Price', 'Change', 'Volume']
    const rows = exchangeContract?.payload.tokenPairs.map(pair => {
        const [ base, quote ] = unwrapDamlTuple(pair);
        const pairLabel = <>{base.label} <ExchangeIcon/> {quote.label}</>;
        return [pairLabel, '-', '-', '-'];
    }) || [];

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><PublicIcon/>Market Pairs</>}
        >
            <PageSection border='blue' background='white'>
                <CardTable
                    className='market-pairs'
                    header={header}
                    rows={rows}/>
            </PageSection>
        </Page>
    )
}

export default MarketPairs;
