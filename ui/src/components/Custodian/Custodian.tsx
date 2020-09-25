import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useParty, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import {
    Custodian as CustodianTemplate
} from '@daml.js/da-marketplace/lib/Marketplace/Custodian'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'
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
                <Page sideNav={sideNav} onLogout={onLogout}>
                    <WelcomeHeader/>
                </Page>
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
