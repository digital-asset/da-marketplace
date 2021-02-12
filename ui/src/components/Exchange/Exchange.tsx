import React, { useState, useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useLedger, useParty } from '@daml/react'

import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { Derivative } from '@daml.js/da-marketplace/lib/Marketplace/Derivative'
import { RegisteredExchange, RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { ExchangeInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { ExchangeParticipant, ExchangeParticipantInvitation } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { getAbbreviation } from '../common/utils';

import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import { PublicIcon, UserIcon } from '../../icons/Icons'

import { useOperator } from '../common/common'
import { wrapDamlTuple } from '../common/damlTypes'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import ExchangeProfile, { Profile, createField } from '../common/Profile'
import ExchangeParticipants from './ExchangeParticipants'
import DerivativeList from './DerivativeList'
import MarketRelationships from '../common/MarketRelationships'
import InviteAcceptTile from '../common/InviteAcceptTile'
import FormErrorHandled from '../common/FormErrorHandled'
import LandingPage from '../common/LandingPage'
import RoleSideNav from '../common/RoleSideNav'

import { useRegistryLookup } from '../common/RegistryLookup'
import { Header } from 'semantic-ui-react'

import MarketPairs from './MarketPairs'

type Props = {
    onLogout: () => void;
}

const Exchange: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const exchange = useParty();
    const ledger = useLedger();
    const investorMap = useRegistryLookup().investorMap;

    const registeredExchange = useContractQuery(RegisteredExchange);
    const invitation = useContractQuery(ExchangeInvitation);
    const allCustodianRelationships = useContractQuery(CustodianRelationship);
    const exchangeParticipants = useContractQuery(ExchangeParticipant);
    const registeredInvestors = useContractQuery(RegisteredInvestor, AS_PUBLIC);
    const currentInvitations = useContractQuery(ExchangeParticipantInvitation);
    const investorCount = exchangeParticipants.length;
    const derivatives = useContractQuery(Derivative, AS_PUBLIC);

    const investorOptions = registeredInvestors.filter(ri =>
        !exchangeParticipants.find(ep => ep.contractData.exchParticipant === ri.contractData.investor) &&
        !currentInvitations.find(invitation => invitation.contractData.exchParticipant === ri.contractData.investor));

    const notifications = useDismissibleNotifications();

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
                                    {to: `${url}/market-pairs`, label: 'Market Pairs', icon: <PublicIcon/>},
                                    {to: `${url}/participants`, label: 'Investors', icon: <UserIcon/>},
                                    {to: `${url}/derivatives`, label: 'Derivatives', icon: <PublicIcon/>},
                                 ]}/>
    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.ExchangeRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <ExchangeProfile
                content='Submit'
                receivedInvitation={!!invitation[0]}
                role={MarketRole.ExchangeRole}
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const rows = exchangeParticipants.map(relationship => {
        const custodian = investorMap.get(relationship.contractData.exchParticipant);

        if (!custodian) {
            return null
        }

        return (
            <div className='relationship-row' key={relationship.contractId}>
                <div className='default-profile-icon'>
                    {getAbbreviation(custodian.name)}
                </div>
                <div className='relationship-info'>
                    <Header className='name' as='h4'>{custodian.name}</Header>
                    <p className='p2'>{custodian?.investor}</p>
                </div>
            </div>
        )
    });

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
                            <MarketRelationships role={MarketRole.ExchangeRole}
                                custodianRelationships={allCustodianRelationships}/>
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
                        onLogout={onLogout}
                        registeredInvestors={investorOptions}/>
                </Route>

                <Route path={`${path}/derivatives`}>
                    <DerivativeList
                        sideNav={sideNav}
                        onLogout={onLogout}
                        derivatives={derivatives}/>
                </Route>
            </Switch>
        </div>

    return registeredExchange.length === 0 ? inviteScreen : exchangeScreen
}

export default Exchange;
