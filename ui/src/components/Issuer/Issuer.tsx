import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { RegisteredIssuer } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { useStreamQuery } from '@daml/react'

import { PublicIcon } from '../../icons/Icons'
import OnboardingTile from '../common/OnboardingTile'
import LandingPage from '../common/LandingPage'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import RequestCustodianRelationship from './RequestCustodianRelationship'
import InviteAcceptScreen from './InviteAcceptScreen'
import IssuerSideNav from './IssuerSideNav'
import IssueAsset from './IssueAsset'
import IssuedToken from './IssuedToken'

type Props = {
    onLogout: () => void;
}

const Issuer: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const registeredIssuer = useStreamQuery(RegisteredIssuer);
    const inviteScreen = <InviteAcceptScreen onLogout={onLogout}/>;
    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>
    const issuerScreen = (
        <Switch>
            <Route exact path={path}>
                <LandingPage
                    marketRelationships={<RequestCustodianRelationship/>}
                    sideNav={<IssuerSideNav url={url}/>}
                    onLogout={onLogout}/>
            </Route>

            <Route path={`${path}/issue-asset`}>
                <Page
                    sideNav={<IssuerSideNav url={url}/>}
                    menuTitle={<><PublicIcon/> Issue Asset</>}
                    onLogout={onLogout}
                >
                    <PageSection border='blue' background='white'>
                        <IssueAsset/>
                    </PageSection>
                </Page>
            </Route>

            <Route path={`${path}/issued-token/:tokenId`}>
                <IssuedToken sideNav={<IssuerSideNav url={url}/>} onLogout={onLogout}/>
            </Route>
        </Switch>
    )

    return registeredIssuer.loading
        ? loadingScreen
        : registeredIssuer.contracts.length === 0 ? inviteScreen : issuerScreen
};

export default Issuer;
