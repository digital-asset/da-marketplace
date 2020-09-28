import React from 'react'
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom'

import { useParty, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import {
    Custodian as CustodianTemplate
} from '@daml.js/da-marketplace/lib/Marketplace/Custodian'

import LandingPage from '../common/LandingPage'
import { wrapDamlTuple } from '../common/damlTypes'

import CustodianSideNav from './CustodianSideNav'
import Clients from './Clients'

type Props = {
    onLogout: () => void;
}

const Custodian: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useWellKnownParties().userAdminParty;
    const user = useParty();

    const key = () => wrapDamlTuple([operator, user]);
    const custodianContract = useStreamFetchByKey(CustodianTemplate, key, [operator, user]).contract;
    const investors = custodianContract?.payload.investors || [];

    const sideNav = <CustodianSideNav disabled={!custodianContract} url={url}/>;

    return (
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
    )
}

export default Custodian;
