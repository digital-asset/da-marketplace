import React from 'react'
import { Card } from 'semantic-ui-react'

import { useParty, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'

import { PublicIcon, ExchangeIcon } from '../../icons/Icons'
import { unwrapDamlTuple, wrapDamlTuple } from '../common/Tuple'
import Page from '../common/Page'

import "./MarketPairs.css"

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const MarketPairs: React.FC<Props> = ({ sideNav, onLogout }) => {
    const exchange = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const key = () => wrapDamlTuple([operator, exchange]);
    const exchangeContract = useStreamFetchByKey(Exchange, key, [operator, exchange]).contract;

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><PublicIcon/>Market Pairs</>}
        >
            <div className='market-pairs'>
                <Card fluid className='market-pair-row card-table-header'>
                    <div className='market-pair-column'>Pair</div>
                    <div className='market-pair-column'>Current Price</div>
                    <div className='market-pair-column'>Change</div>
                    <div className='market-pair-column'>Volume</div>
                </Card>

                { exchangeContract?.payload.tokenPairs.map(pair => {
                    const [ base, quote ] = unwrapDamlTuple(pair);
                    return (
                        <Card fluid className='market-pair-row card-table-item'>
                            <div className='market-pair-column'>{base.label} <ExchangeIcon/> {quote.label}</div>
                            <div className='market-pair-column'>-</div>
                            <div className='market-pair-column'>-</div>
                            <div className='market-pair-column'>-</div>
                        </Card >
                    )
                })}
            </div>
        </Page>
    )
}

export default MarketPairs;
