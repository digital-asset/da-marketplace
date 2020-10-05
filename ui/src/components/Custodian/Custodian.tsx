import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom'

import { useLedger, useParty, useStreamQuery, useStreamFetchByKey } from '@daml/react'
import { RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import {
    Custodian as CustodianModel,
    CustodianInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { wrapDamlTuple } from '../common/damlTypes'
import { useOperator } from '../common/common'
import CustodianProfile, { Profile, createField } from '../common/Profile'
import InviteAcceptTile from '../common/InviteAcceptTile'
import OnboardingTile from '../common/OnboardingTile'
import LandingPage from '../common/LandingPage'

import CustodianSideNav from './CustodianSideNav'
import Clients from './Clients'

type Props = {
    onLogout: () => void;
}

const Custodian: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const custodian = useParty();
    const ledger = useLedger();

    const key = () => wrapDamlTuple([operator, custodian]);
    const registeredCustodian = useStreamQuery(RegisteredCustodian);

    const custodianContract = useStreamFetchByKey(CustodianModel, key, [operator, custodian]).contract;
    const investors = custodianContract?.payload.investors || [];

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text')
    });

    useEffect(() => {
        if (registeredCustodian.contracts[0]) {
            const rcData = registeredCustodian.contracts[0].payload;
            setProfile({
                name: { ...profile.name, value: rcData.name },
                location: { ...profile.location, value: rcData.location }
            })
        }
    }, [registeredCustodian]);

    const acceptInvite = async () => {
        const key = wrapDamlTuple([operator, custodian]);
        const args = {
            name: profile.name.value,
            location: profile.location.value
        };
        await ledger.exerciseByKey(CustodianInvitation.CustodianInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.CustodianRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <CustodianProfile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>

    const sideNav = <CustodianSideNav disabled={!custodianContract} url={url}/>

    const custodianScreen = <Switch>
        <Route exact path={path}>
            <LandingPage
                profile={
                    <CustodianProfile
                        disabled
                        defaultProfile={profile}/>
                }
                marketRelationships={(
                    <Link to={`${url}/clients`}>View list of clients</Link>
                )}
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/clients`}>
            <Clients
                clients={investors}
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>
    </Switch>

    return registeredCustodian.loading
        ? loadingScreen
        : registeredCustodian.contracts.length === 0 ? inviteScreen : custodianScreen
}

export default Custodian;
