import React, { useState, useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useLedger, useParty, useStreamQuery } from '@daml/react'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { RegisteredExchange } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { ExchangeInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { wrapDamlTuple, makeContractInfo } from '../common/damlTypes'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import { useOperator } from '../common/common'
import ExchangeProfile, { Profile, createField } from '../common/Profile'
import InviteAcceptTile from '../common/InviteAcceptTile'
import OnboardingTile from '../common/OnboardingTile'
import LandingPage from '../common/LandingPage'
import MarketRelationships from '../common/MarketRelationships'

import ExchangeSideNav from './ExchangeSideNav'
import MarketPairs from './MarketPairs'
import CreateMarket from './CreateMarket'
import ExchangeParticipants from './ExchangeParticipants'

type Props = {
    onLogout: () => void;
}

const Exchange: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const exchange = useParty();
    const ledger = useLedger();

    const registeredExchange = useStreamQuery(RegisteredExchange);
    const allCustodianRelationships = useStreamQuery(CustodianRelationship).contracts.map(makeContractInfo);
    const notifications = useDismissibleNotifications();

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
    }, [registeredExchange]);

    const acceptInvite = async () => {
        const key = wrapDamlTuple([operator, exchange]);
        const args = {
            name: profile.name.value,
            location: profile.location.value
        };
        await ledger.exerciseByKey(ExchangeInvitation.ExchangeInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const sideNav = <ExchangeSideNav url={url} name={registeredExchange.contracts[0]?.payload.name || exchange}/>;

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.ExchangeRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <ExchangeProfile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>
    const exchangeScreen = <Switch>
        <Route exact path={path}>
            <LandingPage
                profile={
                    <ExchangeProfile
                        disabled
                        defaultProfile={profile}/>
                }
                marketRelationships={
                    <MarketRelationships role={MarketRole.ExchangeRole}
                                         custodianRelationships={allCustodianRelationships}/>}
                sideNav={sideNav}
                notifications={notifications}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/market-pairs`}>
            <MarketPairs
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/create-pair`}>
            <CreateMarket
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/participants`}>
            <ExchangeParticipants
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>
    </Switch>

    return registeredExchange.loading
         ? loadingScreen
         : registeredExchange.contracts.length === 0 ? inviteScreen : exchangeScreen
}

export default Exchange;
