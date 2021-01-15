import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, NavLink} from 'react-router-dom'

import { Menu } from 'semantic-ui-react'

import { useLedger, useParty, useStreamQueries } from '@daml/react'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { RegisteredIssuer } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { IssuerInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { PublicIcon } from '../../icons/Icons'
import { wrapDamlTuple, makeContractInfo } from '../common/damlTypes'
import { useOperator } from '../common/common'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import IssuerProfile, { Profile, createField } from '../common/Profile'
import InviteAcceptTile from '../common/InviteAcceptTile'
import OnboardingTile from '../common/OnboardingTile'
import LandingPage from '../common/LandingPage'
import MarketRelationships from '../common/MarketRelationships'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import RoleSideNav from '../common/RoleSideNav';

import IssueAsset from './IssueAsset'
import IssuedToken from './IssuedToken'
import FormErrorHandled from '../common/FormErrorHandled'

type Props = {
    onLogout: () => void;
}

const Issuer: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const issuer = useParty();
    const ledger = useLedger();

    const registeredIssuer = useStreamQueries(RegisteredIssuer, () => [], [], (e) => {
        console.log("Unexpected close from registeredIssuer: ", e);
    });
    const allCustodianRelationships = useStreamQueries(CustodianRelationship, () => [], [], (e) => {
        console.log("Unexpected close from custodianRelationship: ", e);
    }).contracts.map(makeContractInfo);
    const allTokens = useStreamQueries(Token, () => [], [], (e) => {
        console.log("Unexpected close from Token: ", e);
    }).contracts
    const notifications = useDismissibleNotifications();

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your full legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text'),
        'title': createField('', 'Title', 'Your professional title', 'text'),
        'issuerID': createField('', 'Issuer ID', 'Your Issuer ID', 'text'),
    });

    useEffect(() => {
        if (registeredIssuer.contracts[0]) {
            const riData = registeredIssuer.contracts[0].payload;
            setProfile({
                name: { ...profile.name, value: riData.name },
                location: { ...profile.location, value: riData.location },
                title: { ...profile.title, value: riData.title },
                issuerID: { ...profile.issuerID, value: riData.issuerID }
            })
        }
    // eslint-disable-next-line
    }, [registeredIssuer]);

    const updateProfile = async () => {
        const key = wrapDamlTuple([operator, issuer]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value,
            newTitle: profile.title.value,
            newIssuerID: profile.issuerID.value
        };
        await ledger.exerciseByKey(RegisteredIssuer.RegisteredIssuer_UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

    const acceptInvite = async () => {
        const key = wrapDamlTuple([operator, issuer]);
        const args = {
            name: profile.name.value,
            location: profile.location.value,
            title: profile.title.value,
            issuerID: profile.issuerID.value
        };
        await ledger.exerciseByKey(IssuerInvitation.IssuerInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.IssuerRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <IssuerProfile
                content='Submit'
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>

    const sideNav = <RoleSideNav url={url}
                        name={registeredIssuer.contracts[0]?.payload.name || issuer}
                        items={[
                            {to: `${url}/issue-asset`, label: 'Issue Asset', icon: <PublicIcon/>}
                        ]}>
                        <Menu.Menu className='sub-menu'>
                            <Menu.Item>
                                <p className='p2'>Issued Tokens:</p>
                            </Menu.Item>
                            {allTokens.map(token => (
                                <Menu.Item
                                    className='sidemenu-item-normal'
                                    as={NavLink}
                                    to={`${url}/issued-token/${encodeURIComponent(token.contractId)}`}
                                    key={token.contractId}
                                >
                                    <p>{token.payload.id.label}</p>
                                </Menu.Item>
                            ))}
                        </Menu.Menu>
                </RoleSideNav>

    const issuerScreen = (
        <div className='issuer'>
            <Switch>
                <Route exact path={path}>
                    <LandingPage
                        profile={
                            <FormErrorHandled onSubmit={updateProfile}>
                                <IssuerProfile
                                    content='Save'
                                    defaultProfile={profile}
                                    submitProfile={profile => setProfile(profile)}/>
                            </FormErrorHandled>
                        }
                        marketRelationships={
                            <MarketRelationships role={MarketRole.IssuerRole}
                                                custodianRelationships={allCustodianRelationships}/>}
                        sideNav={sideNav}
                        notifications={notifications}
                        onLogout={onLogout}/>
                </Route>

                <Route path={`${path}/issue-asset`}>
                    <Page
                        menuTitle={<><PublicIcon size='24'/> Issue Asset</>}
                        sideNav={sideNav}
                        onLogout={onLogout}
                    >
                        <PageSection>
                            <IssueAsset/>
                        </PageSection>
                    </Page>
                </Route>

                <Route path={`${path}/issued-token/:tokenId`}>
                    <IssuedToken sideNav={sideNav} onLogout={onLogout}/>
                </Route>
            </Switch>
        </div>
    )

    return registeredIssuer.loading
        ? loadingScreen
        : registeredIssuer.contracts.length === 0 ? inviteScreen : issuerScreen
};

export default Issuer;
