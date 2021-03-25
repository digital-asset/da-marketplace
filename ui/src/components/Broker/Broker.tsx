import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'

import { useLedger, useParty } from '@daml/react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { RegisteredBroker } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import {
    Broker as BrokerTemplate,
    BrokerInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { retrieveCredentials } from '../../Credentials'
import { deploymentMode, DeploymentMode } from '../../config'
import deployTrigger, { TRIGGER_HASH, MarketplaceTrigger } from '../../automation'

import { WalletIcon, OrdersIcon } from '../../icons/Icons'
import { useContractQuery, usePartyLoading } from '../../websocket/queryStream'

import { useOperator, useDablParties } from '../common/common'
import { wrapDamlTuple } from '../common/damlTypes'
import BrokerProfile, { Profile, createField } from '../common/Profile'

import MarketRelationships from '../common/MarketRelationships'
import FormErrorHandled from '../common/FormErrorHandled'
import InviteAcceptTile from '../common/InviteAcceptTile'
import RoleSideNav from '../common/RoleSideNav'
import LandingPage from '../common/LandingPage'
import LoadingScreen from '../common/LoadingScreen'
import Wallet from '../common/Wallet'
import NotificationCenter, { useAllNotifications } from '../common/NotificationCenter'

import BrokerOrders from './BrokerOrders'

type Props = {
    onLogout: () => void;
}

const Broker: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const broker = useParty();
    const ledger = useLedger();
    const loading = usePartyLoading();

    const registeredBroker = useContractQuery(RegisteredBroker);
    const invitation = useContractQuery(BrokerInvitation);
    const allCustodianRelationships = useContractQuery(CustodianRelationship);
    const allDeposits = useContractQuery(AssetDeposit);

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text')
    });

    const history = useHistory();
    const [allNotifications, setAllNotifications] = useState<object[]>([]);
    const [showNotificationAlert, setShowNotificationAlert] = useState(true);

    const notifications = useAllNotifications();

    useEffect(() => {
        if (registeredBroker[0]) {
            const rbData = registeredBroker[0].contractData;
            setProfile({
                name: { ...profile.name, value: rbData.name },
                location: { ...profile.location, value: rbData.location }
            })
        }
    }, [registeredBroker]);

    useEffect(() => {
        if (allNotifications.length < notifications.length) {
            setAllNotifications(notifications);
            setShowNotificationAlert(true);
        } else if (allNotifications.length > notifications.length) {
            setAllNotifications(notifications);
        }
        if (notifications.length === 0) setShowNotificationAlert(false);
    }, [notifications]);

    const handleNotificationAlert = () => {
        const currentLocation = history.location.pathname;
        history.push({ pathname: `${path}/notifications`, state: currentLocation });
        setShowNotificationAlert(false);
    }

    const updateProfile = async () => {
        const key = wrapDamlTuple([operator, broker]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value,
        };
        await ledger.exerciseByKey(RegisteredBroker.RegisteredBroker_UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

    const token = retrieveCredentials()?.token;
    const publicParty = useDablParties().parties.publicParty;

    const acceptInvite = async () => {
        if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && token) {
            deployTrigger(TRIGGER_HASH, MarketplaceTrigger.BrokerTrigger, token, publicParty);
        }
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
                receivedInvitation={!!invitation[0]}
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
                                 ]}/>

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
                            <MarketRelationships
                                relationshipRequestChoice={BrokerTemplate.Broker_RequestCustodianRelationship}
                                custodianRelationships={allCustodianRelationships}/>}
                        sideNav={sideNav}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>

                <Route path={`${path}/wallet`}>
                    <Wallet
                        role={MarketRole.BrokerRole}
                        sideNav={sideNav}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>

                <Route path={`${path}/orders`}>
                    <BrokerOrders
                        sideNav={sideNav}
                        deposits={allDeposits}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>

                <Route path={`${path}/notifications`}>
                    <NotificationCenter
                        sideNav={sideNav}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>

            </Switch>
        </div>


    const shouldLoad = loading || (registeredBroker.length === 0 && invitation.length === 0);
    return shouldLoad ? <LoadingScreen/> : registeredBroker.length !== 0 ? brokerScreen : inviteScreen
}

export default Broker;
