import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'
import BrokerOrders from './BrokerOrders'

import BrokerSideNav from './BrokerSideNav'
// import CreateMarket from './CreateMarket'

type Props = {
    onLogout: () => void;
}

const Exchange: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();

    const sideNav = <BrokerSideNav url={url}/>;

    return <Switch>
        <Route exact path={path}>
            <Page sideNav={sideNav} onLogout={onLogout}>
                <WelcomeHeader/>
            </Page>
        </Route>

        <Route path={`${path}/wallet`}>
            {/* some order component */}
        </Route>

        <Route path={`${path}/orders`}>
            <BrokerOrders
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>
    </Switch>
}

export default Exchange;
