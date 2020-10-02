import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useStreamQuery } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { RegisteredInvestor, RegisteredExchange, RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import RequestCustodianRelationship from '../common/RequestCustodianRelationship'
import OnboardingTile from '../common/OnboardingTile'
import LandingPage from '../common/LandingPage'
import Holdings from '../common/Holdings'
import { damlTupleToString, makeContractInfo} from '../common/damlTypes'

import { useExchangeInviteNotifications } from './ExchangeInviteNotifications'
import InviteAcceptScreen from './InviteAcceptScreen'
import InvestorSideNav from './InvestorSideNav'
import InvestorTrade from './InvestorTrade'
import InvestorOrders from './InvestorOrders'


type Props = {
    onLogout: () => void;
}

const Investor: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const notifications = useExchangeInviteNotifications();
    const registeredInvestor = useStreamQuery(RegisteredInvestor);

    const exchangeMap = useStreamQueryAsPublic(RegisteredExchange).contracts
        .reduce((accum, contract) => accum.set(damlTupleToString(contract.key), contract.payload), new Map());

    const allExchanges = useStreamQuery(Exchange).contracts
        .map(exchange => ({contractId: exchange.contractId,
            contractData: exchange.payload,
            registryData: exchangeMap.get(damlTupleToString(exchange.key))}));

    const allDeposits = useStreamQuery(AssetDeposit).contracts.map(makeContractInfo);
    const allCustodianRelationships = useStreamQueryAsPublic(CustodianRelationship).contracts.map(makeContractInfo);

    const allRegisteredCustodians = useStreamQueryAsPublic(RegisteredCustodian).contracts.map(makeContractInfo);
    //     .map(custodian => ({contractId: custodian.contractId, contractData: custodian.payload}));
    // console.log(allRegisteredCustodians);
        // .filter(custodian => allCustodianRelationships.map(cr => cr.contractData.custodian).includes(custodian.payload.custodian))
        // .map(makeContractInfo)

    const sideNav = <InvestorSideNav url={url} exchanges={allExchanges}/>;
    const inviteScreen = <InviteAcceptScreen onLogout={onLogout}/>
    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>
    const investorScreen = <Switch>
        <Route exact path={path}>
            <LandingPage
                sideNav={sideNav}
                notifications={notifications}
                marketRelationships={<RequestCustodianRelationship role={MarketRole.InvestorRole} registeredCustodians = {allRegisteredCustodians}/>}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/wallet`}>
            <Holdings
                sideNav={sideNav}
                onLogout={onLogout}
                deposits={allDeposits}
                role={MarketRole.InvestorRole}
                exchanges={allExchanges}/>
        </Route>

        <Route path={`${path}/orders`}>
            <InvestorOrders
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/trade/:base-:quote`}>
            <InvestorTrade
                deposits={allDeposits}
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>
    </Switch>

    return registeredInvestor.loading
         ? loadingScreen
         : registeredInvestor.contracts.length === 0 ? inviteScreen : investorScreen
}

export default Investor;
