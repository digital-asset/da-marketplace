import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useParty, useStreamQuery, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import {
    Exchange as ExchangeTemplate
} from '@daml.js/da-marketplace/lib/Marketplace/Exchange'

import { RegisteredExchange } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'
import { wrapDamlTuple } from '../common/damlTypes'

import OnboardingTile from '../common/OnboardingTile'
import InviteAcceptScreen from './InviteAcceptScreen'
import ExchangeSideNav from './ExchangeSideNav'
import MarketPairs from './MarketPairs'
import CreateMarket from './CreateMarket'
import ExchangeParticipants from './ExchangeParticipants'

type Props = {
    onLogout: () => void;
}

const Exchange: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useWellKnownParties().userAdminParty;
    const user = useParty();

    const key = () => wrapDamlTuple([operator, user]);
    const exchangeContract = useStreamFetchByKey(ExchangeTemplate, key, [operator, user]).contract;
    const registeredExchange = useStreamQuery(RegisteredExchange);

    const sideNav = <ExchangeSideNav disabled={!exchangeContract} url={url}/>;

    const inviteScreen = <InviteAcceptScreen onLogout={onLogout}/>
    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>
    const exchangeScreen = <Switch>
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

        <Route path={`${path}/participants`}>
            <ExchangeParticipants
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>
    </Switch>

    return registeredExchange.loading
         ? loadingScreen
         : registeredExchange.contracts.length === 0 ? inviteScreen : exchangeScreen
}

export default Exchange;
