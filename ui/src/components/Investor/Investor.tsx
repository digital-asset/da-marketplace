import React, { useEffect, useState } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useLedger, useParty, useStreamQuery } from '@daml/react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import {
    Investor as InvestorModel,
    InvestorInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { useOperator } from '../common/common'
import { wrapDamlTuple, makeContractInfo } from '../common/damlTypes'
import InvestorProfile, { Profile, createField } from '../common/Profile'
import InviteAcceptTile from '../common/InviteAcceptTile'
import OnboardingTile from '../common/OnboardingTile'
import LandingPage from '../common/LandingPage'
import Holdings from '../common/Holdings'
import MarketRelationships from '../common/MarketRelationships'

import { useExchangeInviteNotifications } from './ExchangeInviteNotifications'
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

    const notifications = useExchangeInviteNotifications();
    const registeredInvestor = useStreamQuery(RegisteredInvestor);
    const investorModel = useStreamQuery(InvestorModel);

    const allExchanges = useStreamQuery(Exchange).contracts.map(makeContractInfo);
    const allDeposits = useStreamQuery(AssetDeposit).contracts.map(makeContractInfo);
    const allCustodianRelationships = useStreamQuery(CustodianRelationship).contracts.map(makeContractInfo);

    const [ profile, setProfile ] = useState<Profile>({
        'name': createField('', 'Name', 'Your full legal name', 'text'),
        'location': createField('', 'Location', 'Your current location', 'text'),
        'ssn': createField('', 'Social Security Number (private)', 'Your social security number', 'password')
    });

    useEffect(() => {
        if (registeredInvestor.contracts[0]) {
            const riData = registeredInvestor.contracts[0].payload;
            const investorContract = investorModel.contracts[0];
            const ssn = investorContract ? investorContract.payload.ssn : 'Private';
            setProfile({
                name: { ...profile.name, value: riData.name },
                location: { ...profile.location, value: riData.location },
                ssn: { ...profile.ssn, value: ssn }
            })
        }
    }, [registeredInvestor, investorModel]);

    const acceptInvite = async () => {
        const key = wrapDamlTuple([operator, investor]);
        const args = {
            name: profile.name.value,
            location: profile.location.value,
            ssn: profile.ssn.value,
            isPublic: true
        };
        await ledger.exerciseByKey(InvestorInvitation.InvestorInvitation_Accept, key, args)
                    .catch(err => console.error(err));
    }

    const sideNav = <InvestorSideNav url={url} exchanges={allExchanges}/>;

    const inviteScreen = (
        <InviteAcceptTile role={MarketRole.InvestorRole} onSubmit={acceptInvite} onLogout={onLogout}>
            <InvestorProfile
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
                    <InvestorProfile
                        disabled
                        defaultProfile={profile}/>
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
                exchanges={allExchanges}
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
