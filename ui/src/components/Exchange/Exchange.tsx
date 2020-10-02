import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useStreamQuery } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'
import { RegisteredExchange, RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { makeContractInfo } from '../common/damlTypes'
import RequestCustodianRelationship from '../common/RequestCustodianRelationship'
import OnboardingTile from '../common/OnboardingTile'
import LandingPage from '../common/LandingPage'

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

    const registeredExchange = useStreamQuery(RegisteredExchange);

    const allRegisteredCustodians = useStreamQueryAsPublic(RegisteredCustodian).contracts.map(makeContractInfo);

    const sideNav = <ExchangeSideNav url={url}/>;
    const inviteScreen = <InviteAcceptScreen onLogout={onLogout}/>
    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>
    const exchangeScreen = <Switch>
        <Route exact path={path}>
            <LandingPage
                sideNav={sideNav}
                marketRelationships={<RequestCustodianRelationship
                                        role={MarketRole.ExchangeRole}
                                        registeredCustodians={allRegisteredCustodians}/>}
                onLogout={onLogout}/>
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
