import React, { useState } from 'react'
import { Header } from 'semantic-ui-react'
import { useParty, useStreamQueries, useLedger } from '@daml/react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import {
    RegisteredIssuer,
    RegisteredInvestor,
    RegisteredExchange,
    RegisteredBroker
} from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { Custodian } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'

import { useStreamQueryAsPublic } from '@daml/dabl-react'

import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { UserIcon, AddPlusIcon } from '../../icons/Icons'

import { wrapDamlTuple, makeContractInfo } from '../common/damlTypes'
import { depositSummary } from '../common/utils'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import StripedTable from '../common/StripedTable';
import AddRegisteredPartyModal from '../common/AddRegisteredPartyModal'
import { useOperator } from '../common/common'

import CreateDeposit from './CreateDeposit'

type Props = {
    clients: string[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Clients: React.FC<Props> = ({ clients, sideNav, onLogout }) => {
    const [ showAddClientModal, setShowAddClientModal ] = useState(false)

    const operator = useOperator();
    const custodian = useParty();
    const ledger = useLedger();

    const investors = useStreamQueryAsPublic(RegisteredInvestor).contracts.filter(c => clients.includes(c.payload.investor))

    const allDeposits = useStreamQueries(AssetDeposit, () => [], [], (e) => {
        console.log("Unexpected close from assetDeposit: ", e);
    }).contracts.map(makeContractInfo);

    const tableHeadings = ['Name', 'Holdings']

    const tableRows = clients.map(client => {
            const clientName = investors.find(i => i.payload.investor === client)?.payload.name || client
            const deposits = allDeposits.filter(deposit => deposit.contractData.account.owner === client)
            return [clientName, depositSummary(deposits).join(',')]
        }
    );

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
            onLogout={onLogout}
            menuTitle={<><UserIcon size='24'/> Clients</>}
        >
            <PageSection>
                <div className='clients'>
                    <div className='client-list'>
                        <div className='title'>
                            <Header as='h3'>Clients</Header>
                            <a onClick={()=> setShowAddClientModal(true)}>
                                <AddPlusIcon/> Add Client
                            </a>
                        </div>

                        <StripedTable
                            headings={tableHeadings}
                            rows={tableRows}
                            emptyLabel='There are no client relationships.'/>
                    </div>
                    <CreateDeposit/>
                </div>
                {showAddClientModal &&
                    <AddRegisteredPartyModal
                        onRequestClose={() => setShowAddClientModal(false)}
                        onSubmit={submitAddClient}
                        title='Add Participants'
                        partyOptions={partyOptions}/>}
            </PageSection>
        </Page>
    )

    async function submitAddClient(selectedParty: string) {
        const party = allRegisteredClients.find(p => p.party === selectedParty)
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

export default Clients;
