import React, { useState, useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useLedger, useParty, useStreamQueries } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'

import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { RegisteredExchange, RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { ExchangeInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { ExchangeParticipant, ExchangeParticipantInvitation} from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { wrapDamlTuple, makeContractInfo } from '../common/damlTypes'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import { useOperator } from '../common/common'
import ExchangeProfile, { Profile, createField } from '../common/Profile'
import InviteAcceptTile from '../common/InviteAcceptTile'
import OnboardingTile from '../common/OnboardingTile'
import LandingPage from '../common/LandingPage'
import MarketRelationships from '../common/MarketRelationships'
import RoleSideNav from '../common/RoleSideNav';

import { PublicIcon, UserIcon } from '../../icons/Icons'
import { Header } from 'semantic-ui-react'

import MarketPairs from './MarketPairs'
import RequestInvestorRelationship from '../common/RequestInvestorRelationship'
import ExchangeParticipants from './ExchangeParticipants'
import FormErrorHandled from '../common/FormErrorHandled'

type Props = {
    onLogout: () => void;
}

const Exchange: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const exchange = useParty();
    const ledger = useLedger();

    const registeredExchange = useStreamQueries(RegisteredExchange, () => [], [], (e) => {
        console.log("Unexpected close from registeredExchange: ", e);
    });
    const allCustodianRelationships = useStreamQueries(CustodianRelationship, () => [], [], (e) => {
        console.log("Unexpected close from custodianRelationship: ", e);
    }).contracts.map(makeContractInfo);
    const exchangeParticipants = useStreamQueries(ExchangeParticipant, () => [], [], (e) => {
        console.log("Unexpected close from exchangeParticipant: ", e);
    }).contracts.map(makeContractInfo);

    const registeredInvestors = useStreamQueryAsPublic(RegisteredInvestor).contracts.map(makeContractInfo);

    const currentInvitations = useStreamQueries(ExchangeParticipantInvitation, () => [], [], (e) => {
        console.log("Unexpected close from exchangeParticipantInvitation: ", e);
    }).contracts.map(makeContractInfo);
    const investorOptions = registeredInvestors.filter(ri =>
        !exchangeParticipants.find(ep => ep.contractData.exchParticipant === ri.contractData.investor) &&
        !currentInvitations.find(invitation => invitation.contractData.exchParticipant === ri.contractData.investor));

    const notifications = useDismissibleNotifications();

    const investorCount = exchangeParticipants.length

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text')
    });

    useEffect(() => {
        if (registeredExchange.contracts[0]) {
            const reData = registeredExchange.contracts[0].payload;
            setProfile({
                name: { ...profile.name, value: reData.name },
                location: { ...profile.location, value: reData.location }
            })
        }
    // eslint-disable-next-line
    }, [registeredExchange]);

    const updateProfile = async () => {
        const key = wrapDamlTuple([operator, exchange]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value,
        };
        await ledger.exerciseByKey(RegisteredExchange.RegisteredExchange_UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

    const acceptInvite = async () => {
        const key = wrapDamlTuple([operator, exchange]);
        const args = {
            name: profile.name.value,
            location: profile.location.value
        };
        await ledger.exerciseByKey(ExchangeInvitation.ExchangeInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const sideNav = <RoleSideNav url={url}
                                 name={registeredExchange.contracts[0]?.payload.name || exchange}
                                 items={[
                                    {to: `${url}/market-pairs`, label: 'Markets', icon: <PublicIcon/>},
                                    {to: `${url}/participants`, label: 'Investors', icon: <UserIcon/>}
                                 ]}/>
    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.ExchangeRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <ExchangeProfile
                content='Submit'
                role={MarketRole.ExchangeRole}
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>
    const exchangeScreen =
        <div className='exchange'>
            <Switch>
                <Route exact path={path}>
                    <LandingPage
                        profile={
                            <FormErrorHandled onSubmit={updateProfile}>
                                <ExchangeProfile
                                    content='Save'
                                    profileLinks={[
                                        {to: `${url}/market-pairs`, title: 'Markets', subtitle: 'View and track active markets'},
                                        {to: `${url}/participants`, title: 'Investors', subtitle: `${investorCount} Active Investor${investorCount > 1 ? 's':''}`}
                                    ]}
                                    role={MarketRole.ExchangeRole}
                                    defaultProfile={profile}
                                    submitProfile={profile => setProfile(profile)}/>
                            </FormErrorHandled>
                        }
                        marketRelationships={
                            <>
                                <MarketRelationships role={MarketRole.ExchangeRole}
                                    custodianRelationships={allCustodianRelationships}/>
                                <RequestInvestorRelationship registeredInvestors={investorOptions}/>
                            </>
                        }
                        sideNav={sideNav}
                        notifications={notifications}
                        onLogout={onLogout}/>
                </Route>

                <Route path={`${path}/market-pairs`}>
                    <MarketPairs
                        sideNav={sideNav}
                        onLogout={onLogout}/>
                </Route>

                <Route path={`${path}/participants`}>
                    <ExchangeParticipants
                        sideNav={sideNav}
                        onLogout={onLogout}/>
                </Route>
            </Switch>
        </div>

    return registeredExchange.loading
         ? loadingScreen
         : registeredExchange.contracts.length === 0 ? inviteScreen : exchangeScreen
}

export default Exchange;
