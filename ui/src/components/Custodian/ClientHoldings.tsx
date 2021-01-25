import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

import { useParty, useStreamQueries, useLedger } from '@daml/react'

import { useStreamQueryAsPublic } from '@daml/dabl-react'

import { AddPlusIcon } from '../../icons/Icons'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import {
    RegisteredCustodian,
    RegisteredIssuer,
    RegisteredInvestor,
    RegisteredExchange,
    RegisteredBroker
} from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { Custodian } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'

import { wrapDamlTuple, makeContractInfo } from '../common/damlTypes'

import Page from '../common/Page'
import PageSection from '../common/PageSection'
import StripedTable from '../common/StripedTable';
import { depositSummary } from '../common/utils';
import AddRegisteredPartyModal from '../common/AddRegisteredPartyModal'
import { useOperator } from '../common/common'

import CreateDeposit from './CreateDeposit';
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
    clients: string[];
}

const ClientHoldings: React.FC<Props> = ({ sideNav, onLogout, clients }) => {
    const { investorId } = useParams<{investorId: string}>()
    const [ showAddClientModal, setShowAddClientModal ] = useState(false)

    const operator = useOperator();
    const custodian = useParty();
    const ledger = useLedger();

    const allDeposits = useStreamQueries(AssetDeposit, () => [], [], (e) => {
        console.log("Unexpected close from assetDeposit: ", e);
    }).contracts.map(makeContractInfo);

    const deposits = allDeposits.filter(deposit => deposit.contractData.account.owner === investorId)

    const tableRows = depositSummary(deposits).map(d =>  [d.split(':')[0], d.split(':')[1]]);

    const investor = useStreamQueryAsPublic(RegisteredInvestor)
        .contracts.map(makeContractInfo)
        .find(i => i.contractData.investor == investorId)

    const allRegisteredClients = [
        useStreamQueryAsPublic(RegisteredIssuer).contracts
            .map(rc => ({ party: rc.payload.issuer, name: rc.payload.name, role: MarketRole.IssuerRole })),
        useStreamQueryAsPublic(RegisteredInvestor).contracts
            .map(rc => ({ party: rc.payload.investor, name: rc.payload.name, role: MarketRole.InvestorRole })),
        useStreamQueryAsPublic(RegisteredExchange).contracts
            .map(rc => ({ party: rc.payload.exchange, name: rc.payload.name, role: MarketRole.ExchangeRole })),
        useStreamQueryAsPublic(RegisteredBroker).contracts
            .map(rc => ({ party: rc.payload.broker, name: rc.payload.name, role: MarketRole.BrokerRole })),
        ].flat().filter(client => !clients.includes(client.party))

    const partyOptions = allRegisteredClients.map(d => {
        return {
            text: `${d.name}`,
            value: d.party
        }
    })

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<Header as='h3'>{investor?.contractData.name}</Header>}
            onLogout={onLogout}>
            <PageSection className='clients'>
                <div className='client-list'>
                    <Header as='h3'>Client Holdings</Header>
                    <a>
                        <AddPlusIcon/> Add Client
                    </a>
                    <StripedTable
                        headings={['Asset', 'Amount']}
                        rows={tableRows}/>
                </div>
                <CreateDeposit currentBeneficiary={investor}/>
            </PageSection>
            {showAddClientModal &&
                <AddRegisteredPartyModal
                    onRequestClose={() => setShowAddClientModal(false)}
                    onSubmit={(parties) => submitAddClient(parties)}
                    title='Add Participants'
                    partyOptions={partyOptions}/>}
        </Page>
    )

    async function submitAddClient(selectedParties: string[]) {
        const party = allRegisteredClients.find(p => p.party === selectedParties[0])

        const key = wrapDamlTuple([operator, custodian]);

        if (!party) {
            return
        }

        switch(party.role) {
            case (MarketRole.InvestorRole):
                const investor = party.party
                await ledger.exerciseByKey(Custodian.Custodian_AddInvestor, key, {investor});
                break

            case (MarketRole.IssuerRole):
                const issuer = party.party
                await ledger.exerciseByKey(Custodian.Custodian_AddIssuer, key, {issuer});
                break

            case (MarketRole.ExchangeRole):
                const exchange = party.party
                await ledger.exerciseByKey(Custodian.Custodian_AddExchange, key, {exchange});
                break

            case (MarketRole.BrokerRole):
                const broker = party.party
                await ledger.exerciseByKey(Custodian.Custodian_AddBroker, key, {broker});
                break
        }

        setShowAddClientModal(false)
    }
}

export default ClientHoldings;
