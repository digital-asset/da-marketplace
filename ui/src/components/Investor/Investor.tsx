import React, { useState, useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Button, Card, Header } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQuery, useStreamFetchByKey } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { ContractId } from '@daml/types'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { ExchangeParticipantInvitation } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import {
    Investor as InvestorTemplate,
    InvestorInvitation
} from '@daml.js/da-marketplace/lib/Marketplace/Investor'

import Page from '../common/Page'
import WelcomeHeader from '../common/WelcomeHeader'
import FormErrorHandled from '../common/FormErrorHandled'
import { wrapDamlTuple, ExchParticipantInviteInfo } from '../common/damlTypes'
import { parseError, ErrorMessage } from '../common/errorTypes'

import InviteAcceptScreen from './InviteAcceptScreen'
import InvestorWallet from './InvestorWallet'
import InvestorSideNav from './InvestorSideNav'
import InvestorTrade from './InvestorTrade'
import InvestorOrders from './InvestorOrders'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

type Props = {
    onLogout: () => void;
}

const Investor: React.FC<Props> = ({ onLogout }) => {
    const { path, url } = useRouteMatch();
    const operator = useWellKnownParties().userAdminParty;
    const user = useParty();
    const ledger = useLedger();

    const key = () => wrapDamlTuple([operator, user]);
    const investorContract = useStreamFetchByKey(InvestorTemplate, key, [operator, user]).contract;
    const registeredInvestor = useStreamFetchByKey(RegisteredInvestor, key, [operator, user]).contract;
    console.log(registeredInvestor);

    const allExchanges = useStreamQuery(Exchange).contracts
        .map(exchange => ({contractId: exchange.contractId, contractData: exchange.payload}));

    const allDeposits = useStreamQuery(AssetDeposit).contracts
        .map(deposit => ({contractId: deposit.contractId, contractData: deposit.payload}));

    const allExchangeInvites = useStreamQuery(ExchangeParticipantInvitation).contracts;
    const sideNav = <InvestorSideNav disabled={!investorContract} url={url} exchanges={allExchanges}/>;

    const acceptExchParticipantInvite = async (cid: ContractId<ExchangeParticipantInvitation>) => {
        const choice = ExchangeParticipantInvitation.ExchangeParticipantInvitation_Accept;
        await ledger.exercise(choice, cid, {});
    }

    const inviteScreen = <InviteAcceptScreen onLogout={onLogout}/>
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
    // return investorScreen;

    return registeredInvestor
         ? investorScreen
         : inviteScreen
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
