import React, { useState, useEffect } from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'
import { Header, Form } from 'semantic-ui-react'

import { useLedger, useParty } from '@daml/react'

import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { Derivative } from '@daml.js/da-marketplace/lib/Marketplace/Derivative'
import { RegisteredExchange, RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import {
    Exchange as ExchangeTemplate,
    ExchangeInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { ExchangeParticipant, ExchangeParticipantInvitation } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { AS_PUBLIC, useContractQuery, usePartyLoading } from '../../websocket/queryStream'

import { PublicIcon, UserIcon } from '../../icons/Icons'

import { retrieveCredentials } from '../../Credentials'
import { deploymentMode, DeploymentMode } from '../../config'
import deployTrigger, { TRIGGER_HASH, MarketplaceTrigger } from '../../automation'

import { useOperator, useDablParties } from '../common/common'
import { wrapDamlTuple } from '../common/damlTypes'
import { getAbbreviation } from '../common/utils';
import { useRegistryLookup } from '../common/RegistryLookup'
import ExchangeProfile, { Profile, createField } from '../common/Profile'
import DerivativeList from '../common/DerivativeList'
import MarketRelationships from '../common/MarketRelationships'
import InviteAcceptTile from '../common/InviteAcceptTile'
import FormErrorHandled from '../common/FormErrorHandled'
import LandingPage from '../common/LandingPage'
import LoadingScreen from '../common/LoadingScreen'
import RoleSideNav from '../common/RoleSideNav'
import NotificationCenter, { useAllNotifications } from '../common/NotificationCenter'

import MarketPairs from './MarketPairs'
import ExchangeParticipants from './ExchangeParticipants'

type Props = {
    onLogout: () => void;
}

const Exchange: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const exchange = useParty();
    const ledger = useLedger();
    const loading = usePartyLoading();
    const investorMap = useRegistryLookup().investorMap;

    const [ deployMatchingEngine, setDeployMatchingEngine ] = useState<boolean>(true);
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

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text')
    });

    const history = useHistory();
    const [allNotifications, setAllNotifications] = useState<object[]>([]);
    const [showNotificationAlert, setShowNotificationAlert] = useState(true);

    const notifications = useAllNotifications();

    useEffect(() => {
        if (registeredExchange[0]) {
            const reData = registeredExchange[0].contractData;
            setProfile({
                name: { ...profile.name, value: reData.name },
                location: { ...profile.location, value: reData.location }
            })
        }
    }, [registeredExchange]);

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
        const key = wrapDamlTuple([operator, exchange]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value,
        };
        await ledger.exerciseByKey(RegisteredExchange.RegisteredExchange_UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

    const token = retrieveCredentials()?.token;
    const publicParty = useDablParties().parties.publicParty;

    const acceptInvite = async () => {
        if (deploymentMode == DeploymentMode.PROD_DABL && TRIGGER_HASH && token) {
            deployTrigger(TRIGGER_HASH, MarketplaceTrigger.ExchangeTrigger, token, publicParty);
            if (deployMatchingEngine) {
                deployTrigger(TRIGGER_HASH, MarketplaceTrigger.MatchingEngine, token, publicParty);
            }
        }
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
                                    {to: `${url}/participants`, label: 'Investors', icon: <UserIcon/>}
                                 ]}/>

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.ExchangeRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <ExchangeProfile
                content='Submit'
                receivedInvitation={!!invitation[0]}
                role={MarketRole.ExchangeRole}
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}>
                { deploymentMode === DeploymentMode.PROD_DABL &&
                    <Form.Checkbox
                        defaultChecked
                        label='Deploy matching engine (uncheck if you plan to use the Exberry Integration)'
                        onChange={event => setDeployMatchingEngine(!deployMatchingEngine)}
                    />
                }
                </ExchangeProfile>
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
                            <MarketRelationships
                                relationshipRequestChoice={ExchangeTemplate.Exchange_RequestCustodianRelationship}
                                custodianRelationships={allCustodianRelationships}/>
                        }
                        sideNav={sideNav}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>

                <Route path={`${path}/market-pairs`}>
                    <MarketPairs
                        sideNav={sideNav}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>

                <Route path={`${path}/participants`}>
                    <ExchangeParticipants
                        sideNav={sideNav}
                        onLogout={onLogout}
                        registeredInvestors={investorOptions}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>

                <Route path={`${path}/derivatives`}>
                    <DerivativeList
                        sideNav={sideNav}
                        onLogout={onLogout}
                        derivatives={derivatives}/>
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

    const shouldLoad = loading || (registeredExchange.length === 0 && invitation.length === 0);
    return shouldLoad ? <LoadingScreen/> : registeredExchange.length !== 0 ? exchangeScreen : inviteScreen
}

export default Exchange;
