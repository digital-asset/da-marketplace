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
import {ManualFairValueCalculation, FairValue} from '@daml.js/da-marketplace/lib/Marketplace/Derivative'
import ManualFairValue from './ManualFairValue'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const MarketPairs: React.FC<Props> = ({ sideNav, onLogout }) => {
    const exchange = useParty();
    const operator = useOperator();

    const allManualCalculations = useContractQuery(ManualFairValueCalculation);

    const exchangeContract = useContractQuery(Exchange)
    // Find contract by key
    .find(contract => _.isEqual(
        // Convert keys to the same data type for comparison
        unwrapDamlTuple(contract.key),
        [operator, exchange]
    ));

    // const allFairValues = useContractQuery(FairValue);

    const header = ['Pair', 'Current Price', 'Change', 'Volume', 'Fair Value']
    const collateralizedRows = exchangeContract?.contractData.tokenPairs.map(pair => {
        // const fairValues = allFairValues.filter(fv => fv.contractData.instrumentId.label === instrument?.contractData.id.label);
        // const price = fairValues[0] ? fairValues[0].contractData.price : "No FV";
        const [ base, quote ] = unwrapDamlTuple(pair);
        const pairLabel = <>{base.label} <ExchangeIcon/> {quote.label}</>;
        return [pairLabel, '-', '-', '-', '-'];
    }) || [];

    const clearedRows = exchangeContract?.contractData.clearedMarkets.map(listing => {
        const pair = unwrapDamlTuple(listing)[0];
        if (typeof pair === 'string') {
            throw new Error('blah')
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

            <PageSection>
                { allManualCalculations.map(calc => <ManualFairValue fairValueRequest={calc}/>) }
            </PageSection>
        </Page>
    )
}

export default MarketPairs;
