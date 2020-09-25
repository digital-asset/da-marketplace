import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useStreamQuery } from '@daml/react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'
import BrokerOrders from './BrokerOrders'
import BrokerSideNav from './BrokerSideNav'
import Holdings from '../common/Holdings'


type Props = {
    onLogout: () => void;
}

const Broker: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const allDeposits = useStreamQuery(AssetDeposit).contracts
        .map(deposit => ({contractId: deposit.contractId, contractData: deposit.payload}));
    const allExchanges = useStreamQuery(Exchange).contracts
        .map(exchange => ({contractId: exchange.contractId, contractData: exchange.payload}));

    const sideNav = <BrokerSideNav url={url}/>;

    return <Switch>
        <Route exact path={path}>
            <Page sideNav={sideNav} onLogout={onLogout}>
                <WelcomeHeader/>
            </Page>
        </Route>

        <Route path={`${path}/wallet`}>
            <Holdings
                deposits={allDeposits}
                exchanges={allExchanges}
                role={MarketRole.BrokerRole}
                sideNav={sideNav}
                onLogout={onLogout} />
        </Route>

        <Route path={`${path}/orders`}>
            <BrokerOrders
                sideNav={sideNav}
                deposits={allDeposits}
                onLogout={onLogout}/>
        </Route>
    </Switch>
}

export default Broker;
