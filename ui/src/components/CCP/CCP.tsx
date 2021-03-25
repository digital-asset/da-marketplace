import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, NavLink, useHistory } from 'react-router-dom'
import { Menu, Form } from 'semantic-ui-react'

import { useLedger, useParty } from '@daml/react'

import { CCPCustomer } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterpartyCustomer'
import { CCPInvitation } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty'
import { CCPExchangeRelationship } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty'
import {
    RegisteredInvestor,
    RegisteredCCP,
    RegisteredBroker,
    RegisteredExchange,
    RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { MarketPair } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { Derivative } from '@daml.js/da-marketplace/lib/Marketplace/Derivative'

import { UserIcon, PublicIcon } from '../../icons/Icons'

import { useContractQuery, AS_PUBLIC, usePartyLoading } from '../../websocket/queryStream'

import { retrieveCredentials } from '../../Credentials'
import { deploymentMode, DeploymentMode } from '../../config'
import deployTrigger, { TRIGGER_HASH, MarketplaceTrigger } from '../../automation'

import { useOperator, useDablParties } from '../common/common'
import { wrapDamlTuple } from '../common/damlTypes'
import CCPProfile, { Profile, createField } from '../common/Profile'
import InviteAcceptTile from '../common/InviteAcceptTile'
import FormErrorHandled from '../common/FormErrorHandled'
import LandingPage from '../common/LandingPage'
import LoadingScreen from '../common/LoadingScreen'
import RoleSideNav from '../common/RoleSideNav'

import DerivativeList from '../common/DerivativeList'
import InstrumentList from '../common/InstrumentList'

import IssuedDerivative from '../Issuer/IssuedDerivative'
import { useRelationshipRequestNotifications } from '../common/RelationshipRequestNotifications'
import Members from './Members'
import MemberAccounts from './MemberAccounts'
import ExchangeRelationships from './ExchangeRelationships'
import NotificationCenter, { useAllNotifications } from '../common/NotificationCenter'

type Props = {
    onLogout: () => void;
}

const CCP: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const ccp = useParty();
    const ledger = useLedger();
    const loading = usePartyLoading();

    const customers = useContractQuery(CCPCustomer);
    const exchanges = useContractQuery(CCPExchangeRelationship);

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

    const allExchanges = useContractQuery(RegisteredExchange, AS_PUBLIC)
        .filter(exchange => exchanges.find(p => exchange.contractData.exchange === p.contractData.exchange))
        .map(exchange => {
            const party = exchange.contractData.exchange;
            const name = exchange.contractData.name;
            return {
                party,
                label: `${name} | ${party}`
            }
        })

    const relNotifications = useRelationshipRequestNotifications();
    const derivatives = useContractQuery(Derivative, AS_PUBLIC);
    const instruments = useContractQuery(MarketPair);

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text')
    });

    const history = useHistory();
    const [allNotifications, setAllNotifications] = useState<object[]>([]);
    const [showNotificationAlert, setShowNotificationAlert] = useState(true);

    const notifications = useAllNotifications();

    useEffect(() => {
        if (registeredCCP[0]) {
            const rcData = registeredCCP[0].contractData;
            setProfile({
                name: { ...profile.name, value: rcData.name },
                location: { ...profile.location, value: rcData.location }
            })
        }
    }, [registeredCCP]);

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
        const key = wrapDamlTuple([operator, ccp]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value,
        };
        await ledger.exerciseByKey(RegisteredCCP.RegisteredCCP_UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

    const token = retrieveCredentials()?.token;
    const publicParty = useDablParties().parties.publicParty;

    const acceptInvite = async () => {
        if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && token) {
            deployTrigger(TRIGGER_HASH, MarketplaceTrigger.CCPTrigger, token, publicParty);
        }
        if (inviteCustodian === '') {
            throw new Error('You must select a default custodian!');
        }
        const key = wrapDamlTuple([operator, ccp]);
        const args = {
            name: profile.name.value,
            location: profile.location.value,
            custodian: inviteCustodian
        };
        await ledger.exerciseByKey(CCPInvitation.CCPInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const [ inviteCustodian, setInviteCustodian ] = useState('');
    const handleSelectInviteCustodian = (_: React.SyntheticEvent, result: any) => {
        setInviteCustodian(result.value);
    }

    const custodianOptions = useContractQuery(RegisteredCustodian, AS_PUBLIC).map(d => {
            return {
                text: `${d.contractData.name}`,
                value: d.contractData.custodian
            }
        })

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.CCPRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <CCPProfile
                content='Submit'
                receivedInvitation={!!invitation[0]}
                role={MarketRole.CCPRole}
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}>
                    <Form.Select
                        label={<p className='p2 dark'>Margin/Clearing Account Custodian</p>}
                        multiple={false}
                        className='profile-form-field'
                        disabled={custodianOptions.length === 0}
                        placeholder='Select...'
                        options={custodianOptions}
                        onChange={handleSelectInviteCustodian}/>
                </CCPProfile>
        </InviteAcceptTile>
    );

    const sideNav = <RoleSideNav url={url}
                        name={registeredCCP[0]?.contractData.name || ccp}
                        items={[
                            {to: `${url}/exchanges`, label: "Exchanges", icon: <UserIcon/>},
                            {to: `${url}/members`, label: 'Members', icon: <UserIcon/>},
                            {to: `${url}/instruments`, label: 'Instruments', icon: <PublicIcon/>}
                        ]}>
                        <Menu.Menu className='sub-menu'>
                            <Menu.Item>
                                <p className='p2'>Member Holdings:</p>
                            </Menu.Item>
                            {allCustomers.map(customer =>
                                <Menu.Item
                                    className='sidemenu-item-normal'
                                    as={NavLink}
                                    to={`${url}/member/${customer.party}`}
                                    key={customer.party}
                                >
                                    <p>{customer.label.substring(0, customer.label.indexOf('|'))}</p>
                                </Menu.Item>
                            )}
                        </Menu.Menu>
                    </RoleSideNav>

    const ccpScreen =
        <div className='ccp'>
            <Switch>
                <Route exact path={path}>
                    <LandingPage
                        notifications={relNotifications}
                        profile={
                            <FormErrorHandled onSubmit={updateProfile}>
                                <CCPProfile
                                    content='Save'
                                    profileLinks={[
                                        {to: `${url}/members`, title: 'Go to Members list', subtitle: `${customers.length} Active Members`}
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
                <Route path={`${path}/exchanges`}>
                    <ExchangeRelationships
                        exchanges={allExchanges}
                        sideNav={sideNav}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>

                <Route path={`${path}/members`}>
                    <Members
                        members={allCustomers}
                        sideNav={sideNav}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>
                <Route path={`${path}/member/:investorId`}>
                    <MemberAccounts
                        sideNav={sideNav}
                        members={allCustomers}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>
                <Route path={`${path}/instruments`}>
                    <InstrumentList
                        exchanges={allExchanges}
                        sideNav={sideNav}
                        instruments={instruments}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>
                <Route path={`${path}/derivatives`}>
                    <DerivativeList
                        sideNav={sideNav}
                        derivatives={derivatives}
                        onLogout={onLogout}/>
                </Route>
                <Route path={`${path}/issued-derivative/:derivativeId`}>
                    <IssuedDerivative
                        sideNav={sideNav}
                        onLogout={onLogout}/>
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

    const shouldLoad = loading || (registeredCCP.length === 0 && invitation.length === 0);
    return shouldLoad ? <LoadingScreen/> : registeredCCP.length !== 0 ? ccpScreen : inviteScreen
}

export default CCP;
