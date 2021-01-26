import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, NavLink } from 'react-router-dom'

import { useLedger, useParty } from '@daml/react'
import { Menu } from 'semantic-ui-react'


import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { RegisteredBroker } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { BrokerInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'

import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { WalletIcon, OrdersIcon, UserIcon } from '../../icons/Icons'
import { useContractQuery, AS_PUBLIC } from '../../websocket/queryStream'

import { useOperator } from '../common/common'
import { wrapDamlTuple } from '../common/damlTypes'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import BrokerProfile, { Profile, createField } from '../common/Profile'

import MarketRelationships from '../common/MarketRelationships'
import FormErrorHandled from '../common/FormErrorHandled'
import InviteAcceptTile from '../common/InviteAcceptTile'
import RoleSideNav from '../common/RoleSideNav'
import LandingPage from '../common/LandingPage'
import Wallet from '../common/Wallet'

import BrokerOrders from './BrokerOrders'
import BrokerCustomerHoldings from './BrokerCustomerHoldings'
import AddBrokerCustomer from './AddBrokerCustomer'

type Props = {
    onLogout: () => void;
}

const Broker: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const broker = useParty();
    const ledger = useLedger();

    const registeredBroker = useContractQuery(RegisteredBroker);
    const allCustodianRelationships = useContractQuery(CustodianRelationship);
    const brokerCustomers = useContractQuery(BrokerCustomer);
    const allDeposits = useContractQuery(AssetDeposit);
    const notifications = useDismissibleNotifications();

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text')
    });

    useEffect(() => {
        if (registeredBroker[0]) {
            const rbData = registeredBroker[0].contractData;
            setProfile({
                name: { ...profile.name, value: rbData.name },
                location: { ...profile.location, value: rbData.location }
            })
        }
    // eslint-disable-next-line
    }, [registeredBroker]);

    const updateProfile = async () => {
        const key = wrapDamlTuple([operator, broker]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value,
        };
        await ledger.exerciseByKey(RegisteredBroker.RegisteredBroker_UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

    const acceptInvite = async () => {
        const key = wrapDamlTuple([operator, broker]);
        const args = {
            name: profile.name.value,
            location: profile.location.value
        };
        await ledger.exerciseByKey(BrokerInvitation.BrokerInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.BrokerRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <BrokerProfile
                content='Submit'
                role={MarketRole.BrokerRole}
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const sideNav = <RoleSideNav url={url}
                                 name={registeredBroker[0]?.contractData.name || broker}
                                 items={[
                                    {to: `${url}/wallet`, label: 'Wallet', icon: <WalletIcon/>},
                                    {to: `${url}/orders`, label: 'Orders', icon: <OrdersIcon/>}
                                 ]}>
                        <Menu.Menu className='sub-menu'>
                            <Menu.Item>
                                <p className='p2'>Clients:</p>
                            </Menu.Item>
                            {brokerCustomers.map(customer => (
                                <Menu.Item
                                    className='sidemenu-item-normal'
                                    as={NavLink}
                                    to={`${url}/customer/${customer.contractId}`}
                                    key={customer.contractId}
                                >
                                    <p>{customer.contractData.brokerCustomer}</p>
                                </Menu.Item>
                            ))}
                        </Menu.Menu>
                    </RoleSideNav>

    const brokerScreen =
        <div className='broker'>
            <Switch>
                <Route exact path={path}>
                    <LandingPage
                        profile={
                            <FormErrorHandled onSubmit={updateProfile}>
                                <BrokerProfile
                                    content='Save'
                                    role={MarketRole.BrokerRole}
                                    defaultProfile={profile}
                                    profileLinks={[
                                        {to: `${url}/wallet`, title: 'Go to Wallet', subtitle: 'Add or Withdraw Funds'},
                                        {to: `${url}/orders`, title: 'View Open Orders', subtitle: 'Manage your Orders'}
                                    ]}
                                    submitProfile={profile => setProfile(profile)}/>
                            </FormErrorHandled>
                        }
                        marketRelationships={
                                <>
                                <MarketRelationships role={MarketRole.BrokerRole}
                                                    custodianRelationships={allCustodianRelationships}/>
                                <AddBrokerCustomer/>
                            </>}
                        sideNav={sideNav}
                        notifications={notifications}
                        onLogout={onLogout}/>
                </Route>

                <Route path={`${path}/wallet`}>
                    <Wallet
                        role={MarketRole.BrokerRole}
                        sideNav={sideNav}
                        onLogout={onLogout}/>
                </Route>

                <Route path={`${path}/orders`}>
                    <BrokerOrders
                        sideNav={sideNav}
                        deposits={allDeposits}
                        onLogout={onLogout}/>
                </Route>

                <Route path={`${path}/customer/:customerId`}>
                    <BrokerCustomerHoldings
                        sideNav={sideNav}
                        deposits={allDeposits}
                        onLogout={onLogout}/>
                </Route>
            </Switch>
        </div>


    return registeredBroker.length === 0 ? inviteScreen : brokerScreen
}

export default Broker;
