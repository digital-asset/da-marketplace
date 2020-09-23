import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { RegisteredIssuer } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { useParty, useStreamQuery, useLedger } from '@daml/react'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'

import InviteAcceptScreen from './InviteAcceptScreen'

import IssuerSideNav from './IssuerSideNav'
import IssueAsset from './IssueAsset'
import IssuedToken from './IssuedToken'
import IssuerCustodians from './IssuerCustodians';

type Props = {
    onLogout: () => void;
}

const Issuer: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const registeredIssuer = useStreamQuery(RegisteredIssuer).contracts;
    const inviteScreen = <InviteAcceptScreen onLogout={onLogout}/>;
    const issuerScreen = (
        <Switch>
            <Route path={`${path}/issue-asset`}>
                <Page sideNav={<IssuerSideNav url={url}/>} onLogout={onLogout}>
                    <WelcomeHeader/>
                    <IssueAsset/>
                </Page>
            </Route>
            <Route path={`${path}/custodians`}>
                <Page sideNav={<IssuerSideNav url={url}/>} onLogout={onLogout}>
                    <WelcomeHeader/>
                    <IssuerCustodians/>
                </Page>
            </Route>
            <Route path={`${path}/issued-token/:tokenId`}>
                <Page sideNav={<IssuerSideNav url={url}/>} onLogout={onLogout}>
                    <IssuedToken/>
                </Page>
            </Route>

            <Route path={path}>
                <Page sideNav={<IssuerSideNav url={url}/>} onLogout={onLogout}>
                    <WelcomeHeader/>
                </Page>
            </Route>
        </Switch>
    )

    return registeredIssuer.length !== 0
           ? issuerScreen
           : inviteScreen
};

export default Issuer;
