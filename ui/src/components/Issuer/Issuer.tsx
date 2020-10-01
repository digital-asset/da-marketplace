import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useLedger, useParty, useStreamQuery } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { RegisteredIssuer } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import {
    Issuer as IssuerModel,
    IssuerInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { PublicIcon } from '../../icons/Icons'
import { wrapDamlTuple } from '../common/damlTypes'
import RequestCustodianRelationship from '../common/RequestCustodianRelationship'
import IssuerProfile, { Profile, createField } from '../common/Profile'
import InviteAcceptTile from '../common/InviteAcceptTile'
import OnboardingTile from '../common/OnboardingTile'
import LandingPage from '../common/LandingPage'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import IssuerSideNav from './IssuerSideNav'
import IssueAsset from './IssueAsset'
import IssuedToken from './IssuedToken'

type Props = {
    onLogout: () => void;
}

const Issuer: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useWellKnownParties().userAdminParty;
    const issuer = useParty();
    const ledger = useLedger();

    const registeredIssuer = useStreamQuery(RegisteredIssuer);
    const issuerModel = useStreamQuery(IssuerModel);

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your full legal name', 'text'),
        'title': createField('', 'Title', 'Your professional title', 'text'),
        'issuerID': createField('', 'Issuer ID', 'Your Issuer ID', 'text'),
        'ssn': createField('', 'Social Security Number (private)', 'Your social security number', 'password')
    });

    useEffect(() => {
        if (registeredIssuer.contracts[0]) {
            const riData = registeredIssuer.contracts[0].payload;
            const issuerContract = issuerModel.contracts[0];
            const ssn = issuerContract ? issuerContract.payload.ssn : 'Private';
            setProfile({
                name: { ...profile.name, value: riData.name },
                title: { ...profile.title, value: riData.title },
                issuerID: { ...profile.issuerID, value: riData.issuerID },
                ssn: { ...profile.ssn, value: ssn },
            })
        }
    }, [registeredIssuer, issuerModel]);

    const acceptInvite = async () => {
        const key = wrapDamlTuple([operator, issuer]);
        const args = {
            name: profile.name.value,
            title: profile.title.value,
            issuerID: profile.issuerID.value,
            ssn: profile.ssn.value,
        };
        await ledger.exerciseByKey(IssuerInvitation.IssuerInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.IssuerRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <IssuerProfile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>

    const issuerScreen = (
        <Switch>
            <Route exact path={path}>
                <LandingPage
                    profile={
                        <IssuerProfile
                            disabled
                            defaultProfile={profile}/>
                    }
                    marketRelationships={<RequestCustodianRelationship role={MarketRole.IssuerRole}/>}
                    sideNav={<IssuerSideNav url={url}/>}
                    onLogout={onLogout}/>
            </Route>

            <Route path={`${path}/issue-asset`}>
                <Page
                    menuTitle={<><PublicIcon/> Issue Asset</>}
                    sideNav={<IssuerSideNav url={url}/>}
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
