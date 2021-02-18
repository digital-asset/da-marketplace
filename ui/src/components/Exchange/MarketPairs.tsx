import React from 'react'
import _ from 'lodash'

import { useParty } from '@daml/react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'

import { PublicIcon, ExchangeIcon } from '../../icons/Icons'
import { unwrapDamlTuple } from '../common/damlTypes'
import { useOperator } from '../common/common'
import CardTable from '../common/CardTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import { useContractQuery } from '../../websocket/queryStream'

import CreateMarket from './CreateMarket';

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const MarketPairs: React.FC<Props> = ({ sideNav, onLogout }) => {
    const exchange = useParty();
    const operator = useOperator();

    const exchangeContract = useContractQuery(Exchange)
    // Find contract by key
    .find(contract => _.isEqual(
        // Convert keys to the same data type for comparison
        unwrapDamlTuple(contract.key),
        [operator, exchange]
    ));

    const header = ['Pair', 'Current Price', 'Change', 'Volume']
    const collateralizedRows = exchangeContract?.contractData.tokenPairs.map(pair => {
        const [ base, quote ] = unwrapDamlTuple(pair);
        const pairLabel = <>{base.label} <ExchangeIcon/> {quote.label}</>;
        return [pairLabel, '-', '-', '-'];
    }) || [];

    const clearedRows = exchangeContract?.contractData.clearedMarkets.map(listing => {
        const pair = unwrapDamlTuple(listing)[0];
        if (typeof pair === 'string') {
            throw new Error(`Expected a tuple for cleared market pair, found a string: ${pair}.`)
        }
        const [ base, quote ] = unwrapDamlTuple(pair);
        const pairLabel = <>{base.label} <ExchangeIcon/> {quote.label}</>;
        return [pairLabel, '-', '-', '-'];
    }) || [];

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><PublicIcon size='24'/>Markets</>}
        >
            <PageSection>
                <CreateMarket/>
                <CardTable
                    className='market-pairs'
                    header={header}
                    rows={collateralizedRows}/>

                <CardTable
                    className='market-pairs'
                    title='Cleared Markets'
                    header={header}
                    rows={clearedRows}/>
            </PageSection>
        </Page>
    )
}

export default MarketPairs;
