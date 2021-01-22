import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch, NavLink} from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

import { useLedger, useParty } from '@daml/react'

import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { RegisteredIssuer, RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { IssuerInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'

import { PublicIcon } from '../../icons/Icons'
import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import { useOperator } from '../common/common'
import { useRegistryLookup } from '../common/RegistryLookup'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import { wrapDamlTuple, damlTupleToString} from '../common/damlTypes'
import IssuerProfile, { Profile, createField } from '../common/Profile'
import MarketRelationships from '../common/MarketRelationships'
import FormErrorHandled from '../common/FormErrorHandled'
import InviteAcceptTile from '../common/InviteAcceptTile'
import LandingPage from '../common/LandingPage'
import PageSection from '../common/PageSection'
import RoleSideNav from '../common/RoleSideNav'
import Page from '../common/Page'

import IssueAsset from './IssueAsset'
import IssuedToken from './IssuedToken'

type Props = {
    onLogout: () => void;
}

const Issuer: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const issuer = useParty();
    const ledger = useLedger();

    const { custodianMap, exchangeMap, brokerMap, investorMap } = useRegistryLookup();

    const registeredIssuer = useContractQuery(RegisteredIssuer);
    const allCustodianRelationships = useContractQuery(CustodianRelationship);
    const allTokens = useContractQuery(Token);

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

    const notifications = useDismissibleNotifications();

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
    // eslint-disable-next-line
    }, [registeredIssuer]);

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
                role={MarketRole.IssuerRole}
                inviteAcceptTile
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const sideNav = <RoleSideNav url={url}
                        name={registeredIssuer[0]?.contractData.name || issuer}
                        items={[
                            {to: `${url}/issue-asset`, label: 'Issue Asset', icon: <PublicIcon/>}
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
                                                title: token.payload.id.label,
                                                subtitle: token.payload.description}
                                        })
                                    }
                                    defaultProfile={profile}
                                    submitProfile={profile => setProfile(profile)}/>
                            </FormErrorHandled>
                        }
                        marketRelationships={
                            <MarketRelationships role={MarketRole.IssuerRole}
                                                custodianRelationships={allCustodianRelationships}/>}
                        sideNav={sideNav}
                        notifications={notifications}
                        onLogout={onLogout}/>
                </Route>

                <Route path={`${path}/issue-asset`}>
                    <Page
                        menuTitle={<><PublicIcon size='24'/> Issue Asset</>}
                        sideNav={sideNav}
                        onLogout={onLogout}
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
                        investors={allRegisteredInvestors}/>
                </Route>
            </Switch>
        </div>
    )

    return registeredIssuer.length === 0 ? inviteScreen : issuerScreen
};

export default Issuer;
