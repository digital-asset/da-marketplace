import React, { useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useParty, useLedger, useStreamQuery, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import {
    Investor as InvestorTemplate,
    InvestorInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Investor'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'
import { wrapDamlTuple } from '../common/damlTypes'

import InvestorWallet from './InvestorWallet'
import InvestorSideNav from './InvestorSideNav'
import InvestorTrade from './InvestorTrade'
import InvestorOrders from './InvestorOrders'

type Props = {
    onLogout: () => void;
}

const Investor: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useWellKnownParties().userAdminParty;
    const user = useParty();
    const ledger = useLedger();

    const key = () => wrapDamlTuple([operator, user]);
    const investorContract = useStreamFetchByKey(InvestorTemplate, key, [operator, user]).contract;
    const investorInvite = useStreamFetchByKey(InvestorInvitation, key, [operator, user]).contract;

    const allExchanges = useStreamQuery(Exchange).contracts
        .map(exchange => ({contractId: exchange.contractId, contractData: exchange.payload}));

    const allDeposits = useStreamQuery(AssetDeposit).contracts
        .map(deposit => ({contractId: deposit.contractId, contractData: deposit.payload}));

    useEffect(() => {
        if (investorInvite) {
            // accept the invite as soon as it's seen
            const { InvestorInvitation_Accept } = InvestorInvitation;
            const key = wrapDamlTuple([operator, user]);
            ledger.exerciseByKey(InvestorInvitation_Accept, key, { isPublic: true })
                .catch(err => console.error(err))
        }
    }, [investorInvite, ledger, operator, user]);

    const sideNav = <InvestorSideNav disabled={!investorContract} url={url} exchanges={allExchanges}/>;

    return <Switch>
        <Route exact path={path}>
            <Page sideNav={sideNav} onLogout={onLogout}>
                <WelcomeHeader/>
            </Page>
        </Route>

        <Route path={`${path}/wallet`}>
            <InvestorWallet
                sideNav={sideNav}
                onLogout={onLogout}
                deposits={allDeposits}
                exchanges={allExchanges}/>
        </Route>

        <Route path={`${path}/orders`}>
            <InvestorOrders
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/trade/:base-:quote`}>
            <InvestorTrade
                sideNav={sideNav}
                onLogout={onLogout}
                deposits={allDeposits}/>
        </Route>
    </Switch>
}

export default Investor;
