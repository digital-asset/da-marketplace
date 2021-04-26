import React from 'react'
import { Button } from 'semantic-ui-react'
import _ from 'lodash'

import { useParty, useLedger } from '@daml/react'
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { ManualFairValueCalculation } from '@daml.js/da-marketplace/lib/Marketplace/Derivative'

import { PublicIcon, ExchangeIcon } from '../../icons/Icons'
import { unwrapDamlTuple, wrapDamlTuple } from '../common/damlTypes'
import { useOperator } from '../common/common'
import CardTable from '../common/CardTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import { useContractQuery } from '../../websocket/queryStream'

import CreateMarket from './CreateMarket';
import ManualFairValue from './ManualFairValue'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}

const MarketPairs: React.FC<Props> = ({ sideNav, onLogout, showNotificationAlert, handleNotificationAlert }) => {
    const ledger = useLedger();
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

    const handleResetMarket = async (baseTokenId: Id, quoteTokenId: Id, cleared: boolean ) => {
        const key = wrapDamlTuple([operator, exchange]);
        const pair = {_1: baseTokenId, _2: quoteTokenId};
        const args = {
            pair,
            clearedMarket: cleared
        }
        await ledger.exerciseByKey(Exchange.Exchange_ResetMarket, key, args);
    }

    const header = ['Pair', 'Current Price', 'Change', 'Volume', 'Fair Value', 'Reset Market']
    const collateralizedRows = exchangeContract?.contractData.tokenPairs.map(pair => {
        // TODO: Show all fair values
        // const fairValues = allFairValues.filter(fv => fv.contractData.instrumentId.label === instrument?.contractData.id.label);
        // const price = fairValues[0] ? fairValues[0].contractData.price : "No FV";
        const [ base, quote ] = unwrapDamlTuple(pair);
        const pairLabel = <>{base.label} / {quote.label}</>;
        const reset = <Button negative size='mini' content='Reset Market' onClick={() => handleResetMarket(base, quote, false)}/>
        return [pairLabel, '-', '-', '-', '-', reset];
    }) || [];

    const clearedRows = exchangeContract?.contractData.clearedMarkets.map(listing => {
        const pair = unwrapDamlTuple(listing)[0];
        if (typeof pair === 'string') {
            throw new Error(`Expected a tuple for cleared market pair, found a string: ${pair}.`)
        }
        const [ base, quote ] = unwrapDamlTuple(pair);
        const pairLabel = <>{base.label} / {quote.label}</>;
        const reset = <Button negative size='mini' content='Reset Market' onClick={() => handleResetMarket(base, quote, true)}/>
        return [pairLabel, '-', '-', '-', '-', reset];
    }) || [];

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><PublicIcon size='24'/>Markets</>}
            showNotificationAlert={showNotificationAlert}
            handleNotificationAlert={handleNotificationAlert}
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
