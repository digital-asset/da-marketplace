import React, { useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useParty, useLedger, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import {
    Exchange as ExchangeTemplate,
    ExchangeInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Exchange'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'
import { wrapDamlTuple } from '../common/damlTypes'

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
    const ledger = useLedger();

    const key = () => wrapDamlTuple([operator, user]);
    const exchangeContract = useStreamFetchByKey(ExchangeTemplate, key, [operator, user]).contract;
    const exchangeInvite = useStreamFetchByKey(ExchangeInvitation, key, [operator, user]).contract;

    useEffect(() => {
        if (exchangeInvite) {
            // accept the invite as soon as it's seen
            const { ExchangeInvitation_Accept } = ExchangeInvitation;
            const key = wrapDamlTuple([operator, user]);
            ledger.exerciseByKey(ExchangeInvitation_Accept, key, {})
            .catch(err => console.error(err))
        }
    }, [exchangeInvite, ledger, operator, user]);

    const sideNav = <ExchangeSideNav disabled={!exchangeContract} url={url}/>;

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

        <Route path={`${path}/participants`}>
            <ExchangeParticipants
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>
    </Switch>
}

export default Exchange;
