import React, { useState, useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Button, Header } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQuery, useStreamFetchByKey } from '@daml/react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import {
    Investor as InvestorTemplate,
    InvestorInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Investor'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'
import FormToggle from '../common/FormToggle'
import FormErrorHandled from '../common/FormErrorHandled'
import { wrapDamlTuple } from '../common/Tuple'
import { getWellKnownParties } from '../../config'

import InvestorWallet from './InvestorWallet'
import InvestorSideNav from './InvestorSideNav'
import InvestorTrade from './InvestorTrade'
import InvestorOrders from './InvestorOrders'

type ContractInfo<T> = {
    contractId: string;
    contractData: T;
}

export type ExchangeInfo = ContractInfo<Exchange>;
export type DepositInfo = ContractInfo<AssetDeposit>;

type Props = {
    onLogout: () => void;
}

const useWellKnown = () => {
    const [ operator, setOperator ] = useState('');
    const [ publicParty, setPublicParty ] = useState('');

    useEffect(() => {
        getWellKnownParties().then(res => {
            setOperator(res.operator);
            setPublicParty(res.public);
        });
    })

    return { operator, publicParty };
}

const Investor: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const { operator } = useWellKnown();
    const user = useParty();

    const key = () => wrapDamlTuple([operator, user]);
    const investorContract = useStreamFetchByKey(InvestorTemplate, key, [operator, user]).contract;
    const investorInvite = useStreamFetchByKey(InvestorInvitation, key, [operator, user]).contract;

    const allExchanges = useStreamQuery(Exchange).contracts
        .map(exchange => ({contractId: exchange.contractId, contractData: exchange.payload}));

    const allDeposits = useStreamQuery(AssetDeposit).contracts
        .map(deposit => ({contractId: deposit.contractId, contractData: deposit.payload}));

    const sideNav = <InvestorSideNav disabled={!investorContract} url={url} exchanges={allExchanges}/>;

    return <Switch>
        <Route exact path={path}>
            <Page sideNav={sideNav} onLogout={onLogout}>
                { investorInvite ? <InvestorSetup/> : <WelcomeHeader/> }
            </Page>
        </Route>

        <Route path={`${path}/wallet`}>
            <InvestorWallet
                sideNav={sideNav}
                onLogout={onLogout}
                deposits={allDeposits}
                exchanges={allExchanges}/>
        </Route>

        <Route path={`${path}/orders`}>
            <InvestorOrders
                sideNav={sideNav}
                onLogout={onLogout}/>
        </Route>

        <Route path={`${path}/trade/:base-:quote`}>
            <InvestorTrade
                sideNav={sideNav}
                onLogout={onLogout}
                deposits={allDeposits}/>
        </Route>
    </Switch>
}

const InvestorSetup: React.FC = () => {
    const [ isPublic, setIsPublic ] = useState(true);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');

    const investor = useParty();
    const ledger = useLedger();

    const handleSetupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { InvestorInvitation_Accept } = InvestorInvitation;
            const { operator } = await getWellKnownParties();
            const key = wrapDamlTuple([operator, investor])
            await ledger.exerciseByKey(InvestorInvitation_Accept, key, { isPublic });
        } catch(err) {
            setError(err);
        }
        setLoading(false);
    }

    return (
        <FormErrorHandled onSubmit={handleSetupSubmit} loading={loading} error={error}>
            <Header as='h2' content='Complete your profile setup'/>
            <FormToggle
                onLabel='Public'
                onInfo='Make your investor profile public to everyone.'
                offLabel='Private'
                offInfo='Make your investor profile private by default.'
                onClick={val => setIsPublic(val)}/>

            <Button content='Finish'/>
        </FormErrorHandled>
    )
}

export default Investor;
