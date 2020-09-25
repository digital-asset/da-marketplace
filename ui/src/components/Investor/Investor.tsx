import React, { useState } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Button, Card, Header } from 'semantic-ui-react'

import { useLedger, useStreamQuery, } from '@daml/react'
import { useStreamQueryAsPublic  } from '@daml/dabl-react'
import { ContractId } from '@daml/types'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { ExchangeParticipantInvitation } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { RegisteredInvestor, RegisteredExchange } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'
import OnboardingTitle from '../common/OnboardingTile'
import FormErrorHandled from '../common/FormErrorHandled'
import { ExchParticipantInviteInfo, damlTupleToString } from '../common/damlTypes'
import { parseError, ErrorMessage } from '../common/errorTypes'

import InviteAcceptScreen from './InviteAcceptScreen'
import InvestorWallet from './InvestorWallet'
import InvestorSideNav from './InvestorSideNav'
import InvestorTrade from './InvestorTrade'
import InvestorOrders from './InvestorOrders'

type Props = {
    onLogout: () => void;
}

const Investor: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const ledger = useLedger();

    const registeredInvestor = useStreamQuery(RegisteredInvestor);

    const allRegisteredExchanges = useStreamQueryAsPublic(RegisteredExchange).contracts;
    const exchangeMap = allRegisteredExchanges.reduce((accum, contract) => accum.set(damlTupleToString(contract.key), contract.payload.name), new Map());
    console.log(exchangeMap);

    const allExchanges = useStreamQuery(Exchange).contracts
        .map(exchange => {
            console.log(exchangeMap.get(exchange.key));
            return ({contractId: exchange.contractId, contractData: exchange.payload, name: exchangeMap.get(damlTupleToString(exchange.key))})
        });


    const allDeposits = useStreamQuery(AssetDeposit).contracts
        .map(deposit => ({contractId: deposit.contractId, contractData: deposit.payload}));

    const allExchangeInvites = useStreamQuery(ExchangeParticipantInvitation).contracts;
    const sideNav = <InvestorSideNav url={url} exchanges={allExchanges}/>;

    const acceptExchParticipantInvite = async (cid: ContractId<ExchangeParticipantInvitation>) => {
        const choice = ExchangeParticipantInvitation.ExchangeParticipantInvitation_Accept;
        await ledger.exercise(choice, cid, {});
    }

    const inviteScreen = <InviteAcceptScreen onLogout={onLogout}/>
    const loadingScreen = <OnboardingTitle>Loading...</OnboardingTitle>
    const investorScreen = <Switch>
        <Route exact path={path}>
            <Page sideNav={sideNav} onLogout={onLogout}>
                <WelcomeHeader/>
                { allExchangeInvites && <Header as='h3' content='Exchange Participant Invitations'/> }
                { allExchangeInvites.map(
                    invite => <ExchangeParticipantInvite
                                invite={{ contractId: invite.contractId, contractData: invite.payload }}
                                invitationAccept={() => acceptExchParticipantInvite(invite.contractId)}/>
                )}
            </Page>
        </Route>

        <Route path={`${path}/wallet`}>
            <InvestorWallet
                sideNav={sideNav}
                onLogout={onLogout}
                deposits={allDeposits}
                exchanges={allExchanges}
                exchangeMap={exchangeMap}/>
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

    return registeredInvestor.loading
         ? loadingScreen
         : registeredInvestor.contracts.length === 0 ? inviteScreen : investorScreen
}

type ExchParticipantInviteProps = {
    invite: ExchParticipantInviteInfo;
    invitationAccept: () => void;
}

const ExchangeParticipantInvite: React.FC<ExchParticipantInviteProps> = ({ invite, invitationAccept }) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();

    const acceptExchParticipantInvite = async () => {
        setLoading(true);
        try {
            await invitationAccept();
        } catch(err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    return (
        <Card>
            <h4>Exchange: {invite.contractData.exchange} is inviting you to trade.</h4>
            <FormErrorHandled loading={loading} error={error} clearError={() => setError(undefined)}>
                <Button onClick={() => acceptExchParticipantInvite()}>Accept</Button>
            </FormErrorHandled>
        </Card>
    )
}

export default Investor;
