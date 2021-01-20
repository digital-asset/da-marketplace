import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom'

import { useLedger, useParty, useStreamQueries, useStreamFetchByKeys } from '@daml/react'
import { Custodian as RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry/Custodian'
import {
    Custodian as CustodianModel,
    CustodianInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { wrapDamlTuple } from '../common/damlTypes'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import { useOperator } from '../common/common'
import CustodianProfile, { Profile, createField } from '../common/Profile'
import InviteAcceptTile from '../common/InviteAcceptTile'
import OnboardingTile from '../common/OnboardingTile'
import LandingPage from '../common/LandingPage'
import RoleSideNav from '../common/RoleSideNav'

import { UserIcon } from '../../icons/Icons'

import { useRelationshipRequestNotifications } from './RelationshipRequestNotifications'
import Clients from './Clients'
import FormErrorHandled from '../common/FormErrorHandled'

type Props = {
    onLogout: () => void;
}

const Custodian: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const custodian = useParty();
    const ledger = useLedger();

    const keys = () => [wrapDamlTuple([operator, custodian])];
    const registeredCustodian = useStreamQueries(RegisteredCustodian, () => [], [], (e) => {
        console.log("Unexpected close from registeredCustodian: ", e);
    });

    const custodianContract = useStreamFetchByKeys(CustodianModel, keys, [operator, custodian]).contracts;
    const investors = custodianContract[0]?.payload.investors || [];

    const notifications = [...useRelationshipRequestNotifications(), ...useDismissibleNotifications()];

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
    // eslint-disable-next-line
    }, [registeredCustodian]);

    const updateProfile = async () => {
        const key = wrapDamlTuple([operator, custodian]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value,
        };
        await ledger.exerciseByKey(RegisteredCustodian.UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

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
                content='Submit'
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>

    const sideNav = <RoleSideNav url={url}
                                 name={registeredCustodian.contracts[0]?.payload.name || custodian}
                                 items={[
                                    {to: `${url}/clients`, label: 'Clients', icon: <UserIcon/>},
                                 ]}/>

    const custodianScreen = <Switch>
        <Route exact path={path}>
            <LandingPage
                notifications={notifications}
                profile={
                    <FormErrorHandled onSubmit={updateProfile}>
                        <CustodianProfile
                            content='Save'
                            defaultProfile={profile}
                            submitProfile={profile => setProfile(profile)}/>
                    </FormErrorHandled>
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
