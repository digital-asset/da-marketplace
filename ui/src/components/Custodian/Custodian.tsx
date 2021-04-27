import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, NavLink, useHistory } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import _ from 'lodash'

import { useLedger, useParty } from '@daml/react'

import { RegisteredCustodian, RegisteredInvestor, RegisteredBroker } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import {
    Custodian as CustodianModel,
    CustodianInvitation,
    CustodianRelationship
} from '@daml.js/da-marketplace/lib/Marketplace/Custodian'

import { UserIcon } from '../../icons/Icons'

import { useContractQuery, AS_PUBLIC, usePartyLoading } from '../../websocket/queryStream'

import { retrieveCredentials } from '../../Credentials'
import { deploymentMode, DeploymentMode } from '../../config'
import deployTrigger, { TRIGGER_HASH, MarketplaceTrigger } from '../../automation'

import { useOperator, useDablParties } from '../common/common'
import { unwrapDamlTuple, wrapDamlTuple } from '../common/damlTypes'
import CustodianProfile, { Profile, createField } from '../common/Profile'
import InviteAcceptTile from '../common/InviteAcceptTile'
import FormErrorHandled from '../common/FormErrorHandled'
import LandingPage from '../common/LandingPage'
import LoadingScreen from '../common/LoadingScreen'
import RoleSideNav from '../common/RoleSideNav'
import NotificationCenter, { useAllNotifications } from '../common/NotificationCenter'

import { useRelationshipRequestNotifications } from '../common/RelationshipRequestNotifications'
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
    const loading = usePartyLoading();

    const relationshipParties = useContractQuery(CustodianRelationship)
        .map(relationship => relationship.contractData.party)

    const brokerBeneficiaries = useContractQuery(RegisteredBroker, AS_PUBLIC)
        .filter(broker => relationshipParties.find(p => broker.contractData.broker === p))
        .map(broker => {
            const party = broker.contractData.broker;
            const name = broker.contractData.name;
            return {
                party,
                label: `${name} | ${party}`
            }
        })

    const investorBeneficiaries = useContractQuery(RegisteredInvestor, AS_PUBLIC)
        .filter(investor => relationshipParties.find(p => investor.contractData.investor === p))
        .map(investor => {
            const party = investor.contractData.investor;
            const name = investor.contractData.name;
            return {
                party,
                label: `${name} | ${party}`
            }
        })

    const allBeneficiaries = [...brokerBeneficiaries, ...investorBeneficiaries]

    const registeredCustodian = useContractQuery(RegisteredCustodian);
    const invitation = useContractQuery(CustodianInvitation);

    const custodianContract = useContractQuery(CustodianModel)
        // Find contract by key
        .find(contract => _.isEqual(
            // Convert keys to the same data type for comparison
            unwrapDamlTuple(contract.key),
            [operator, custodian]
        ));

    const investors = custodianContract?.contractData.investors || [];

    const relNotifications = useRelationshipRequestNotifications();

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text')
    });

    const history = useHistory();
    const [allNotifications, setAllNotifications] = useState<object[]>([]);
    const [showNotificationAlert, setShowNotificationAlert] = useState(true);

    const notifications = useAllNotifications();

    useEffect(() => {
        if (registeredCustodian[0]) {
            const rcData = registeredCustodian[0].contractData;
            setProfile({
                name: { ...profile.name, value: rcData.name },
                location: { ...profile.location, value: rcData.location }
            })
        }
    }, [registeredCustodian]);

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
        const key = wrapDamlTuple([operator, custodian]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value,
        };
        await ledger.exerciseByKey(RegisteredCustodian.RegisteredCustodian_UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

    const token = retrieveCredentials()?.token;
    const publicParty = useDablParties().parties.publicParty;

    const acceptInvite = async () => {
        if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && token) {
            deployTrigger(TRIGGER_HASH, MarketplaceTrigger.CustodianTrigger, token, publicParty);
        }
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
                receivedInvitation={!!invitation[0]}
                role={MarketRole.CustodianRole}
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const sideNav = <RoleSideNav url={url}
                        name={registeredCustodian[0]?.contractData.name || custodian}
                        items={[
                            {to: `${url}/clients`, label: 'Clients', icon: <UserIcon/>},
                        ]}>
                        <Menu.Menu className='sub-menu'>
                            <Menu.Item>
                                <p className='p2'>Client Holdings:</p>
                            </Menu.Item>
                            {allBeneficiaries.map(client =>
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

    const custodianScreen =
        <div className='custodian'>
            <Switch>
                <Route exact path={path}>
                    <LandingPage
                        notifications={relNotifications}
                        profile={
                            <FormErrorHandled onSubmit={updateProfile}>
                                <CustodianProfile
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
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>

                <Route path={`${path}/clients`}>
                    <Clients
                        clients={allBeneficiaries}
                        sideNav={sideNav}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>
                <Route path={`${path}/client/:investorId`}>
                    <ClientHoldings
                        sideNav={sideNav}
                        clients={allBeneficiaries}
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

    const shouldLoad = loading || (registeredCustodian.length === 0 && invitation.length === 0);
    return shouldLoad ? <LoadingScreen/> : registeredCustodian.length !== 0 ? custodianScreen : inviteScreen
}

export default Custodian;
