import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useLedger, useParty, useStreamQueries } from '@daml/react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { InvestorInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { useOperator } from '../common/common'
import { useRegistryLookup } from '../common/RegistryLookup'
import { wrapDamlTuple, damlTupleToString, makeContractInfo } from '../common/damlTypes'
import { useDismissibleNotifications } from '../common/DismissibleNotifications'
import InvestorProfile, { Profile, createField } from '../common/Profile'
import MarketRelationships from '../common/MarketRelationships'
import InviteAcceptTile from '../common/InviteAcceptTile'
import FormErrorHandled from '../common/FormErrorHandled'
import OnboardingTile from '../common/OnboardingTile'
import LandingPage from '../common/LandingPage'
import Holdings from '../common/Holdings'

import { useExchangeInviteNotifications } from './ExchangeInviteNotifications'
import { useBrokerCustomerInviteNotifications } from './BrokerCustomerInviteNotifications'
import InvestorSideNav from './InvestorSideNav'
import InvestorTrade from './InvestorTrade'
import InvestorOrders from './InvestorOrders'


type Props = {
    onLogout: () => void;
}

const Investor: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useOperator();
    const investor = useParty();
    const ledger = useLedger();

    const notifications = [
        ...useExchangeInviteNotifications(),
        ...useBrokerCustomerInviteNotifications(),
        ...useDismissibleNotifications(),
    ];
    const registeredInvestor = useStreamQueries(RegisteredInvestor, () => [], [], (e) => {
        console.log("Unexpected close from registeredInvestor: ", e);
    });

    const allExchanges = useStreamQueries(Exchange, () => [], [], (e) => {
        console.log("Unexpected close from exchange: ", e);
    }).contracts.map(makeContractInfo);
    const allDeposits = useStreamQueries(AssetDeposit, () => [], [], (e) => {
        console.log("Unexpected close from assetDeposit: ", e);
    }).contracts.map(makeContractInfo);
    const allCustodianRelationships = useStreamQueries(CustodianRelationship, () => [], [], (e) => {
        console.log("Unexpected close from custodianRelationship: ", e);
    }).contracts.map(makeContractInfo);

    const { brokerMap, custodianMap, exchangeMap } = useRegistryLookup();

    const brokerProviders = useStreamQueries(BrokerCustomer, () => [], [], (e) => {
        console.log("Unexpected close from brokerCustomer: ", e);
    }).contracts
        .map(broker => {
            const party = broker.payload.broker;
            const name = brokerMap.get(damlTupleToString(broker.key))?.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Broker`
            }
        })

    const exchangeProviders = useStreamQueries(ExchangeParticipant, () => [], [], (e) => {
        console.log("Unexpected close from exchangeParticipant: ", e);
    }).contracts
        .map(exchParticipant => {
            const party = exchParticipant.payload.exchange;
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
        'location': createField('', 'Location', 'Your current location', 'text')
    });

    useEffect(() => {
        if (registeredInvestor.contracts[0]) {
            const riData = registeredInvestor.contracts[0].payload;
            setProfile({
                name: { ...profile.name, value: riData.name },
                location: { ...profile.location, value: riData.location }
            })
        }
    }, [registeredInvestor]);

    const updateProfile = async () => {
        const key = wrapDamlTuple([operator, investor]);
        const args = {
            newName: profile.name.value,
            newLocation: profile.location.value
        };
        await ledger.exerciseByKey(RegisteredInvestor.RegisteredInvestor_UpdateProfile, key, args)
                    .catch(err => console.error(err));
    }

    const acceptInvite = async () => {
        const key = wrapDamlTuple([operator, investor]);
        const args = {
            name: profile.name.value,
            location: profile.location.value,
            isPublic: true
        };
        await ledger.exerciseByKey(InvestorInvitation.InvestorInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const sideNav = <InvestorSideNav url={url}
                                     exchanges={allExchanges}
                                     name={registeredInvestor.contracts[0]?.payload.name || investor}/>

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.InvestorRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <InvestorProfile
                content='Submit'
                defaultProfile={profile}
                submitProfile={profile => setProfile(profile)}/>
        </InviteAcceptTile>
    );

    const loadingScreen = <OnboardingTile>Loading...</OnboardingTile>

    const investorScreen = <Switch>
        <Route exact path={path}>
            <LandingPage
                notifications={notifications}
                profile={
                    <FormErrorHandled onSubmit={updateProfile}>
                        <InvestorProfile
                            content='Save'
                            defaultProfile={profile}
                            submitProfile={profile => setProfile(profile)}/>
                    </FormErrorHandled>
                }
                sideNav={sideNav}
                marketRelationships={
                    <MarketRelationships role={MarketRole.InvestorRole}
                                         custodianRelationships={allCustodianRelationships}/>}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/wallet`}>
            <Holdings
                deposits={allDeposits}
                providers={allProviders}
                role={MarketRole.InvestorRole}
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/orders`}>
            <InvestorOrders
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/trade/:base-:quote`}>
            <InvestorTrade
                deposits={allDeposits}
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>
    </Switch>

    return registeredInvestor.loading
         ? loadingScreen
         : registeredInvestor.contracts.length === 0 ? inviteScreen : investorScreen
}

export default Investor;
