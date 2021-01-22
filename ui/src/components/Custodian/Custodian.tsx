import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, Link, NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

import { useLedger, useParty, useStreamFetchByKeys } from '@daml/react'

import { RegisteredCustodian, RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import {
    Custodian as CustodianModel,
    CustodianInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Custodian'

import { UserIcon } from '../../icons/Icons'
import { useContractQuery, AS_PUBLIC } from '../../websocket/queryStream'

import { useOperator } from '../common/common'
import { wrapDamlTuple } from '../common/damlTypes'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import CustodianProfile, { Profile, createField } from '../common/Profile'
import InviteAcceptTile from '../common/InviteAcceptTile'
import FormErrorHandled from '../common/FormErrorHandled'
import LandingPage from '../common/LandingPage'
import RoleSideNav from '../common/RoleSideNav'

import { useRelationshipRequestNotifications } from './RelationshipRequestNotifications'
import Clients from './Clients'
import ClientHoldings from './ClientHoldings'

type Props = {
    onLogout: () => void;
}

const Custodian: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const custodian = useParty();
    const ledger = useLedger();

    const keys = () => [wrapDamlTuple([operator, custodian])];
    const registeredCustodian = useContractQuery(RegisteredCustodian);

    const custodianContract = useStreamFetchByKeys(CustodianModel, keys, [operator, custodian]).contracts;
    const investors = custodianContract[0]?.payload.investors || [];

    const notifications = [...useRelationshipRequestNotifications(), ...useDismissibleNotifications()];

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text')
    });

    useEffect(() => {
        if (registeredCustodian[0]) {
            const rcData = registeredCustodian[0].contractData;
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
        await ledger.exerciseByKey(RegisteredCustodian.RegisteredCustodian_UpdateProfile, key, args)
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

    const registeredInvestors = useContractQuery(RegisteredInvestor, AS_PUBLIC);

    const sideNav = <RoleSideNav url={url}
                        name={registeredCustodian[0]?.contractData.name || custodian}
                        items={[
                            {to: `${url}/clients`, label: 'Clients', icon: <UserIcon/>},
                        ]}>
                        <Menu.Menu className='sub-menu'>
                            <Menu.Item>
                                <p className='p2'>Client Holdings:</p>
                            </Menu.Item>
                            {investors.map(investor =>
                                <Menu.Item
                                    className='sidemenu-item-normal'
                                    as={NavLink}
                                    to={`${url}/client/${investor}`}
                                    key={investor}
                                >
                                    <p>{registeredInvestors.find(i => i.contractData.investor === investor)?.contractData.name || investor}</p>
                                </Menu.Item>
                            )}
                        </Menu.Menu>
                    </RoleSideNav>

    const custodianScreen =
        <div className='custodian'>
            <Switch>
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
                <Route path={`${path}/client/:investorId`}>
                    <ClientHoldings
                        sideNav={sideNav}
                        clients={investors}
                        onLogout={onLogout}/>
                </Route>
            </Switch>
        </div>

    return registeredCustodian.length === 0 ? inviteScreen : custodianScreen
}

export default Custodian;
