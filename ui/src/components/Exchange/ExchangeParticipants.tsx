import React from 'react'
import { Table } from 'semantic-ui-react'

import { useStreamQueries } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { ExchangeParticipant, ExchangeParticipantInvitation } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { UserIcon } from '../../icons/Icons'
import { ExchangeParticipantInfo, DepositInfo, makeContractInfo } from '../common/damlTypes'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import InviteParticipant from './InviteParticipant'
import { depositSummary } from '../common/utils'
import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const ExchangeParticipants: React.FC<Props> = ({ sideNav, onLogout }) => {
    const allDeposits = useContractQuery(AssetDeposit);
    const registeredInvestors = useContractQuery(RegisteredInvestor, AS_PUBLIC);
    const exchangeParticipants = useContractQuery(ExchangeParticipant);
    const currentInvitations = useContractQuery(ExchangeParticipantInvitation);

    const investorOptions = registeredInvestors.filter(ri =>
        !exchangeParticipants.find(ep => ep.contractData.exchParticipant === ri.contractData.investor) &&
        !currentInvitations.find(invitation => invitation.contractData.exchParticipant === ri.contractData.investor));

    const rows = exchangeParticipants.map(participant =>
        <ExchangeParticipantRow
            key={participant.contractId}
            deposits={allDeposits}
            participant={participant}/>
    );

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon size='24'/>Investors</>}
        >
            <PageSection>
                <div className='exchange-participants'>
                    <InviteParticipant registeredInvestors={investorOptions}/>
                    <StripedTable
                        className='active-participants'
                        header={['Id', 'Active Orders', 'Volume Traded (USD)', 'Amount Committed']}
                        rows={rows}/>
                </div>
            </PageSection>
        </Page>
    )
}

type RowProps = {
    deposits: DepositInfo[];
    participant: ExchangeParticipantInfo;
}

const ExchangeParticipantRow: React.FC<RowProps> = ({ deposits, participant }) => {
    const { exchange, exchParticipant } = participant.contractData;

    const query = () => [({ exchange, exchParticipant })];
    const activeOrders = useStreamQueries(Order, query, [exchange, exchParticipant], (e) => {
        console.log("Unexpected close from Order: ", e);
    }).contracts.length;

    const investorDeposits = deposits.filter(deposit => deposit.contractData.account.owner === exchParticipant);

    return (
        <Table.Row className='active-participants-row'>
            <Table.Cell>{exchParticipant}</Table.Cell>
            <Table.Cell>{activeOrders}</Table.Cell>
            <Table.Cell>-</Table.Cell>
            <Table.Cell>{depositSummary(investorDeposits).join(',') || '-'}</Table.Cell>
        </Table.Row>
    )
}

export default ExchangeParticipants;
