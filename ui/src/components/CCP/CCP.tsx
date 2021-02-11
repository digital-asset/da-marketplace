import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import _ from 'lodash'

import { useLedger, useParty } from '@daml/react'

import { CCPCustomer } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterpartyCustomer'
import { RegisteredInvestor, RegisteredCCP, RegisteredBroker } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { CCP as CCPModel } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty'

import { UserIcon } from '../../icons/Icons'

import { useContractQuery, AS_PUBLIC } from '../../websocket/queryStream'

import { useOperator } from '../common/common'
import { unwrapDamlTuple, wrapDamlTuple } from '../common/damlTypes'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import CCPProfile, { Profile, createField } from '../common/Profile'
import InviteAcceptTile from '../common/InviteAcceptTile'
import FormErrorHandled from '../common/FormErrorHandled'
import LandingPage from '../common/LandingPage'
import RoleSideNav from '../common/RoleSideNav'

import { useRelationshipRequestNotifications } from './RelationshipRequestNotifications'
import Clients from './Clients'
import ClientAccounts from './ClientAccounts'
import {CCPInvitation} from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty'

type Props = {
    onLogout: () => void;
}

const CCP: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const ccp = useParty();
    const ledger = useLedger();

    const keys = () => [wrapDamlTuple([operator, ccp])];

    const customers = useContractQuery(CCPCustomer);

    const brokerCustomers = useContractQuery(RegisteredBroker, AS_PUBLIC)
        .filter(broker => customers.find(p => broker.contractData.broker === p.contractData.ccpCustomer))
        .map(broker => {
            const party = broker.contractData.broker;
            const name = broker.contractData.name;
            return {
                party,
                label: `${name} | ${party}`
            }
        })

    const investorCustomers = useContractQuery(RegisteredInvestor, AS_PUBLIC)
        .filter(investor => customers.find(p => investor.contractData.investor === p.contractData.ccpCustomer))
        .map(investor => {
            const party = investor.contractData.investor;
            const name = investor.contractData.name;
            return {
                party,
                label: `${name} | ${party}`
            }
        })

    const allCustomers = [...brokerCustomers, ...investorCustomers]

    const registeredCCP = useContractQuery(RegisteredCCP);
    const invitation = useContractQuery(CCPInvitation);

    const ccpContract = useContractQuery(CCPModel)
        // Find contract by key
        .find(contract => _.isEqual(
            // Convert keys to the same data type for comparison
            unwrapDamlTuple(contract.key),
            [operator, ccp]
        ));

    const investors = customers; // ccpContract?.contractData.investors || [];

    const notifications = [...useRelationshipRequestNotifications(), ...useDismissibleNotifications()];

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text')
    });

    useEffect(() => {
        if (registeredCCP[0]) {
            const rcData = registeredCCP[0].contractData;
            setProfile({
                name: { ...profile.name, value: rcData.name },
                location: { ...profile.location, value: rcData.location }
            })
        }
    // eslint-disable-next-line
    }, [registeredCCP]);

    const updateProfile = async () => {
        const key = wrapDamlTuple([operator, ccp]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value,
        };
        await ledger.exerciseByKey(RegisteredCCP.RegisteredCCP_UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

    const acceptInvite = async () => {
        const key = wrapDamlTuple([operator, ccp]);
        const args = {
            name: profile.name.value,
            location: profile.location.value
        };
        await ledger.exerciseByKey(CCPInvitation.CCPInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.CCPRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <CCPProfile
                content='Submit'
                receivedInvitation={!!invitation[0]}
                role={MarketRole.CCPRole}
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const registeredInvestors = useContractQuery(RegisteredInvestor, AS_PUBLIC);

    const sideNav = <RoleSideNav url={url}
                        name={registeredCCP[0]?.contractData.name || ccp}
                        items={[
                            {to: `${url}/clients`, label: 'Clients', icon: <UserIcon/>},
                        ]}>
                        <Menu.Menu className='sub-menu'>
                            <Menu.Item>
                                <p className='p2'>Client Holdings:</p>
                            </Menu.Item>
                            {allCustomers.map(client =>
                                <Menu.Item
                                    className='sidemenu-item-normal'
                                    as={NavLink}
                                    to={`${url}/client/${client.party}`}
                                    key={client.party}
                                >
                                    <p>{client.label.substring(0, client.label.indexOf('|'))}</p>
                                </Menu.Item>
                            )}
                        </Menu.Menu>
                    </RoleSideNav>

    const ccpScreen =
        <div className='ccp'>
            <Switch>
                <Route exact path={path}>
                    <LandingPage
                        notifications={notifications}
                        profile={
                            <FormErrorHandled onSubmit={updateProfile}>
                                <CCPProfile
                                    content='Save'
                                    profileLinks={[
                                        {to: `${url}/clients`, title: 'Go to Clients list', subtitle: `${investors.length} Active Clients`}
                                    ]}
                                    role={MarketRole.CustodianRole}
                                    defaultProfile={profile}
                                    submitProfile={profile => setProfile(profile)}/>
                            </FormErrorHandled>
                        }
                        sideNav={sideNav}
                        onLogout={onLogout}/>
                </Route>

                <Route path={`${path}/clients`}>
                    <Clients
                        clients={allCustomers}
                        sideNav={sideNav}
                        onLogout={onLogout}/>
                </Route>
                <Route path={`${path}/client/:investorId`}>
                    <ClientAccounts
                        sideNav={sideNav}
                        clients={allCustomers}
                        onLogout={onLogout}/>
                </Route>
            </Switch>
        </div>

    return registeredCCP.length === 0 ? inviteScreen : ccpScreen
}

export default CCP;
