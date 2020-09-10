import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'

import IssuerSideNav from './IssuerSideNav'
import IssueAsset from './IssueAsset'
import IssuedToken from './IssuedToken'

type Props = {
    onLogout: () => void;
}

const Issuer: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/issue-asset`}>
                <Page sideNav={<IssuerSideNav url={url}/>} onLogout={onLogout}>
                    <WelcomeHeader/>
                    <IssueAsset/>
                </Page>
            </Route>

            <Route path={`${path}/issued-token/:tokenId`}>
                <Page sideNav={<IssuerSideNav url={url}/>} onLogout={onLogout}>
                    <IssuedToken/>
                </Page>
            </Route>

            <Route path='/'>
                <Page sideNav={<IssuerSideNav url={url}/>} onLogout={onLogout}>
                    <WelcomeHeader/>
                </Page>
            </Route>
        </Switch>
    )
}

export default Issuer;
