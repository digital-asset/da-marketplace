import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, NavLink, useHistory } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

import { useLedger, useParty } from '@daml/react'

import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { Derivative } from '@daml.js/da-marketplace/lib/Marketplace/Derivative'
import { RegisteredIssuer, RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import {
    Issuer as IssuerTemplate,
    IssuerInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'

import { PublicIcon } from '../../icons/Icons'
import { AS_PUBLIC, useContractQuery, usePartyLoading } from '../../websocket/queryStream'

import { useOperator } from '../common/common'
import { useRegistryLookup } from '../common/RegistryLookup'
import { wrapDamlTuple, damlTupleToString} from '../common/damlTypes'
import IssuerProfile, { Profile, createField } from '../common/Profile'
import MarketRelationships from '../common/MarketRelationships'
import FormErrorHandled from '../common/FormErrorHandled'
import InviteAcceptTile from '../common/InviteAcceptTile'
import LandingPage from '../common/LandingPage'
import LoadingScreen from '../common/LoadingScreen'
import PageSection from '../common/PageSection'
import RoleSideNav from '../common/RoleSideNav'
import Page from '../common/Page'
import NotificationCenter, { useAllNotifications } from '../common/NotificationCenter'

import IssueAsset from './IssueAsset'
import IssueDerivative from './IssueDerivative'
import IssuedDerivative from './IssuedDerivative'
import IssuedToken from './IssuedToken'

type Props = {
    onLogout: () => void;
}

const Issuer: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const issuer = useParty();
    const ledger = useLedger();
    const loading = usePartyLoading();

    const { custodianMap, exchangeMap, brokerMap, investorMap } = useRegistryLookup();

    const registeredIssuer = useContractQuery(RegisteredIssuer);
    const invitation = useContractQuery(IssuerInvitation);
    const allCustodianRelationships = useContractQuery(CustodianRelationship);
    const allTokens = useContractQuery(Token).filter(t => t.signatories.includes(issuer));
    const allDerivatives = useContractQuery(Derivative).filter(d => d.signatories.includes(issuer));

    const history = useHistory();
    const [allNotifications, setAllNotifications] = useState<object[]>([]);
    const [showNotificationAlert, setShowNotificationAlert] = useState(true);

    const notifications = useAllNotifications();

    const allRegisteredInvestors = useContractQuery(RegisteredInvestor, AS_PUBLIC)
        .map(investor => {
            const party = investor.contractData.investor;
            const name = investorMap.get(damlTupleToString(investor.key))?.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Investor`
            }
        })

    const brokerProviders = useContractQuery(BrokerCustomer)
        .map(broker => {
            const party = broker.contractData.broker;
            const name = brokerMap.get(damlTupleToString(broker.key))?.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Broker`
            }
        })

    const exchangeProviders = useContractQuery(ExchangeParticipant)
        .map(exchParticipant => {
            const party = exchParticipant.contractData.exchange;
            const name = exchangeMap.get(party)?.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Exchange`
            }
        });

    const allProviders = [
        ...allCustodianRelationships.map(relationship => {
            const party = relationship.contractData.custodian;
            const name = custodianMap.get(party)?.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Custodian`
            }
        }),
        ...exchangeProviders,
        ...brokerProviders,
    ];

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your full legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text'),
        'title': createField('', 'Title', 'Your professional title', 'text'),
        'issuerID': createField('', 'Issuer ID', 'Your Issuer ID', 'text'),
    });

    useEffect(() => {
        if (registeredIssuer[0]) {
            const riData = registeredIssuer[0].contractData;
            setProfile({
                name: { ...profile.name, value: riData.name },
                location: { ...profile.location, value: riData.location },
                title: { ...profile.title, value: riData.title },
                issuerID: { ...profile.issuerID, value: riData.issuerID }
            })
        }
    }, [registeredIssuer]);

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
        const key = wrapDamlTuple([operator, issuer]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value,
            newTitle: profile.title.value,
            newIssuerID: profile.issuerID.value
        };
        await ledger.exerciseByKey(RegisteredIssuer.RegisteredIssuer_UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

    const acceptInvite = async () => {
        const key = wrapDamlTuple([operator, issuer]);
        const args = {
            name: profile.name.value,
            location: profile.location.value,
            title: profile.title.value,
            issuerID: profile.issuerID.value
        };
        await ledger.exerciseByKey(IssuerInvitation.IssuerInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.IssuerRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <IssuerProfile
                content='Submit'
                receivedInvitation={!!invitation[0]}
                role={MarketRole.IssuerRole}
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const sideNav = <RoleSideNav url={url}
                        name={registeredIssuer[0]?.contractData.name || issuer}
                        items={[
                            {to: `${url}/issue-asset`, label: 'Issue Asset', icon: <PublicIcon/>},
                            {to: `${url}/issue-derivative`, label: 'Issue Derivative', icon: <PublicIcon/>}
                        ]}>
                        <Menu.Menu className='sub-menu'>
                            <Menu.Item>
                                <p className='p2'>Issued Tokens:</p>
                            </Menu.Item>
                            {allTokens.map(token => (
                                <Menu.Item
                                    className='sidemenu-item-normal'
                                    as={NavLink}
                                    to={`${url}/issued-token/${encodeURIComponent(token.contractId)}`}
                                    key={token.contractId}
                                >
                                    <p>{token.contractData.id.label}</p>
                                </Menu.Item>
                            ))}
                            <Menu.Item>
                                <p className='p2'>Issued Derivatives:</p>
                            </Menu.Item>
                            {allDerivatives.map(derivative => (
                                <Menu.Item
                                    className='sidemenu-item-normal'
                                    as={NavLink}
                                    to={`${url}/issued-derivative/${encodeURIComponent(derivative.contractId)}`}
                                    key={derivative.contractId}
                                >
                                    <p>{derivative.contractData.id.label}</p>
                                </Menu.Item>
                            ))}
                        </Menu.Menu>
                </RoleSideNav>

    const issuerScreen = (
        <div className='issuer'>
            <Switch>
                <Route exact path={path}>
                    <LandingPage
                        profile={
                            <FormErrorHandled onSubmit={updateProfile}>
                                <IssuerProfile
                                    content='Save'
                                    role={MarketRole.IssuerRole}
                                    profileLinks= {
                                        allTokens.map(token => {
                                            return {
                                                to: `${url}/issued-token/${encodeURIComponent(token.contractId)}`,
                                                title: token.contractData.id.label,
                                                subtitle: token.contractData.description}
                                        })
                                    }
                                    defaultProfile={profile}
                                    submitProfile={profile => setProfile(profile)}/>
                            </FormErrorHandled>
                        }
                        marketRelationships={
                            <MarketRelationships
                                relationshipRequestChoice={IssuerTemplate.Issuer_RequestCustodianRelationship}
                                custodianRelationships={allCustodianRelationships}/>}
                        sideNav={sideNav}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>

                <Route path={`${path}/issue-asset`}>
                    <Page
                        menuTitle={<><PublicIcon size='24'/> Issue Asset</>}
                        sideNav={sideNav}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}
                    >
                        <PageSection>
                            <IssueAsset/>
                        </PageSection>
                    </Page>
                </Route>

                <Route path={`${path}/issued-token/:tokenId`}>
                    <IssuedToken
                        sideNav={sideNav}
                        onLogout={onLogout}
                        providers={allProviders}
                        investors={allRegisteredInvestors}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}/>
                </Route>

                <Route path={`${path}/issue-derivative`}>
                    <Page
                        menuTitle={<><PublicIcon size='24'/> Issue Derivative</>}
                        sideNav={sideNav}
                        onLogout={onLogout}
                        showNotificationAlert={showNotificationAlert}
                        handleNotificationAlert={handleNotificationAlert}
                    >
                        <PageSection>
                            <IssueDerivative/>
                        </PageSection>
                    </Page>
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
    )

    const shouldLoad = loading || (registeredIssuer.length === 0 && invitation.length === 0);
    return shouldLoad ? <LoadingScreen/> : registeredIssuer.length !== 0 ? issuerScreen : inviteScreen
};

export default Issuer;
