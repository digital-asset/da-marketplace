import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { RegisteredIssuer } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { IssuerInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import { useStreamQuery } from '@daml/react'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'

import InviteAcceptScreen from './InviteAcceptScreen'

import IssuerSideNav from './IssuerSideNav'
import IssueAsset from './IssueAsset'
import IssuedToken from './IssuedToken'
import IssuerCustodians from './IssuerCustodians';
import OnboardingTitle from '../common/OnboardingTile';
import { load } from 'dotenv/types'

type Props = {
    onLogout: () => void;
}

const Issuer: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    // const issuerInvitation = useStreamQuery(IssuerInvitation);
    const registeredIssuer = useStreamQuery(RegisteredIssuer);
    const inviteScreen = <InviteAcceptScreen onLogout={onLogout}/>;
    const loadingScreen = <OnboardingTitle>Loading...</OnboardingTitle>
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
    
    // if (registeredIssuer.loading) {
    //     return loadingScreen;
    // } else {
    //     return registeredIssuer.contracts.length === 0 ? inviteScreen : issuerScreen;
    // }

    // if (issuerInvitation.loading || registeredIssuer.loading) {
    //     return loadingScreen;
    // } else {
    //     return issuerInvitation.contracts.length !== 0 || registeredIssuer.contracts.length === 0 ? inviteScreen : issuerScreen;
    // }

    return registeredIssuer.loading
        ? loadingScreen
        : registeredIssuer.contracts.length === 0 ? inviteScreen : issuerScreen
    
    // issuerInvitation.length !== 0
    //        ? inviteScreen
    //        : issuerScreen
};

export default Issuer;
