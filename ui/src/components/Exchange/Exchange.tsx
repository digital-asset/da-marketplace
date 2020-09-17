import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useStreamQuery } from '@daml/react'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'

import ExchangeSideNav from './ExchangeSideNav'
import MarketPairs from './MarketPairs'
import CreateMarket from './CreateMarket'

type Props = {
    onLogout: () => void;
}

type ContractInfo<T> = {
    contractId: string;
    contractData: T;
}

export type TokenInfo = ContractInfo<Token>;

const Exchange: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();

    const sideNav = <ExchangeSideNav url={url}/>;

    return <Switch>
        <Route exact path={path}>
            <Page sideNav={sideNav} onLogout={onLogout}>
                <WelcomeHeader/>
            </Page>
        </Route>

        <Route path={`${path}/market-pairs`}>
            <MarketPairs
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/create-pair`}>
            <CreateMarket
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>
    </Switch>
}

export default Exchange;
