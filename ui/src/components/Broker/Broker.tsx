import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useStreamQuery } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { RegisteredExchange } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import RequestCustodianRelationship from '../common/RequestCustodianRelationship'
import Holdings from '../common/Holdings'
import LandingPage from '../common/LandingPage'
import { damlTupleToString } from '../common/damlTypes'

import BrokerOrders from './BrokerOrders'
import BrokerSideNav from './BrokerSideNav'


type Props = {
    onLogout: () => void;
}

const Broker: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const allDeposits = useStreamQuery(AssetDeposit).contracts
        .map(deposit => ({contractId: deposit.contractId, contractData: deposit.payload}));

    // const exchangeQuery = useStreamQueryAsPublic(Exchange);
    const exchangeContracts = useStreamQueryAsPublic(Exchange);
    const registryContracts = useStreamQueryAsPublic(RegisteredExchange);
    // const allExchanges = undefined; //makeRegisteredInfo(exchangeContracts, registryContracts);
    // console.log(allExchanges);

    // const exchangeMap = useStreamQueryAsPublic(RegisteredExchange).contracts
    //     .reduce((accum, contract) => accum.set(damlTupleToString(contract.key), contract.payload), new Map());

    // const exchangeMap = useStreamQueryAsPublic(RegisteredExchange).contracts
    //     .reduce((accum, contract) => accum.set(damlTupleToString(contract.key), contract.payload), new Map());
    //
    // const allExchanges = useStreamQuery(Exchange).contracts
    //     .map(exchange => ({contractId: exchange.contractId,
    //         contractData: exchange.payload,
    //         registryData: exchangeMap.get(damlTupleToString(exchange.key))}));

    const allExchanges = useStreamQuery(Exchange).contracts
        .map(exchange => ({contractId: exchange.contractId, contractData: exchange.payload}));

    const sideNav = <BrokerSideNav url={url}/>;

    return <Switch>
        <Route exact path={path}>
            <LandingPage
                sideNav={sideNav}
                marketRelationships={<RequestCustodianRelationship role={MarketRole.BrokerRole}/>}
                onLogout={onLogout}/>
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
