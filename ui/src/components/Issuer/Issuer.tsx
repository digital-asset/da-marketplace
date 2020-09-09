import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'

import IssuerSideNav from './IssuerSideNav'
import IssueAsset from './IssueAsset'
import IssuedToken from './IssuedToken'

type Props = {
    onLogout: () => void;
}

// TODO: issued Token page with data overview 
const Issuer: React.FC<Props> = ({ onLogout }) => (
    <Switch>
        <Route path='/role/issuer/issue-asset'>
            <Page sideNav={<IssuerSideNav/>} onLogout={onLogout}>
                <WelcomeHeader/>
                <IssueAsset/>
            </Page>
        </Route>

        {/* <Route path='/role/issuer/issued-token/:tokenId'>
            <Page sideNav={<IssuerSideNav/>} onLogout={onLogout}>
                <IssuedToken/>
            </Page>
        </Route> */}

        <Route path='/'>
            <Page sideNav={<IssuerSideNav/>} onLogout={onLogout}>
                <WelcomeHeader/>
            </Page>
        </Route>
    </Switch>
)

export default Issuer;
