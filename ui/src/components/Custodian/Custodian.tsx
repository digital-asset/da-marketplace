import React from 'react'
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom'

import { useParty, useStreamQuery, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import {
    Custodian as CustodianTemplate
} from '@daml.js/da-marketplace/lib/Marketplace/Custodian'

import LandingPage from '../common/LandingPage'
import OnboardingTile from '../common/OnboardingTile'
import { wrapDamlTuple } from '../common/damlTypes'

import InviteAcceptScreen from './InviteAcceptScreen'
import CustodianSideNav from './CustodianSideNav'
import Clients from './Clients'

type Props = {
    onLogout: () => void;
}

const Custodian: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useWellKnownParties().userAdminParty;
    const user = useParty();
    const registeredCustodian = useStreamQuery(RegisteredCustodian);

    const inviteScreen = <InviteAcceptScreen onLogout={onLogout}/>
    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>

    const key = () => wrapDamlTuple([operator, user]);
    const custodianContract = useStreamFetchByKey(CustodianTemplate, key, [operator, user]).contract;
    const investors = custodianContract?.payload.investors || [];

    const sideNav = <CustodianSideNav disabled={!custodianContract} url={url}/>;

    const custodianScreen =  (
        <Switch>
            <Route exact path={path}>
                <LandingPage
                    sideNav={sideNav}
                    marketRelationships={(
                        <Link to={`${url}/clients`}>View list of clients</Link>
                    )}
                    onLogout={onLogout}/>
            </Route>

            <Route path={`${path}/clients`}>
                <Clients
                    sideNav={sideNav}
                    onLogout={onLogout}
                    clients={investors}/>
            </Route>
        </Switch>
    );

    return registeredCustodian.loading
        ? loadingScreen
        : registeredCustodian.contracts.length === 0 ? inviteScreen : custodianScreen
}

export default Custodian;
