import React, { useState, useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useLedger, useParty } from '@daml/react'

import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { RegisteredExchange, RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { ExchangeInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { ExchangeParticipant, ExchangeParticipantInvitation} from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { PublicIcon, UserIcon } from '../../icons/Icons'
import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import { useOperator } from '../common/common'
import { wrapDamlTuple } from '../common/damlTypes'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import ExchangeProfile, { Profile, createField } from '../common/Profile'
import MarketRelationships from '../common/MarketRelationships'
import InviteAcceptTile from '../common/InviteAcceptTile'
import FormErrorHandled from '../common/FormErrorHandled'
import LandingPage from '../common/LandingPage'
import RoleSideNav from '../common/RoleSideNav'

import MarketPairs from './MarketPairs'
import ExchangeParticipants from './ExchangeParticipants'

type Props = {
    onLogout: () => void;
}

const Exchange: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const exchange = useParty();
    const ledger = useLedger();

    const registeredExchange = useContractQuery(RegisteredExchange);
    const allCustodianRelationships = useContractQuery(CustodianRelationship);
    const exchangeParticipants = useContractQuery(ExchangeParticipant);
    const registeredInvestors = useContractQuery(RegisteredInvestor, AS_PUBLIC);
    const currentInvitations = useContractQuery(ExchangeParticipantInvitation);

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
        if (registeredExchange[0]) {
            const reData = registeredExchange[0].contractData;
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
                                 name={registeredExchange[0]?.contractData.name || exchange}
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
                            <MarketRelationships
                                role={MarketRole.ExchangeRole}
                                custodianRelationships={allCustodianRelationships}
                                investorOptions={investorOptions}
                                />
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

    return registeredExchange.length === 0 ? inviteScreen : exchangeScreen
}

export default Exchange;
