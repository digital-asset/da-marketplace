import React from 'react'
import { Table } from 'semantic-ui-react'

import { useStreamQuery } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { UserIcon } from '../../icons/Icons'
import { ExchangeParticipantInfo, makeContractInfo } from '../common/damlTypes'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import InviteParticipant from './InviteParticipant'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const ExchangeParticipants: React.FC<Props> = ({ sideNav, onLogout }) => {
    const registeredInvestors = useStreamQueryAsPublic(RegisteredInvestor).contracts.map(makeContractInfo);
    const exchangeParticipants = useStreamQuery(ExchangeParticipant).contracts.map(makeContractInfo);

    const investorOptions = registeredInvestors.filter(ri => {
        return !exchangeParticipants.find(ep => {
            return ep.contractData.exchParticipant === ri.contractData.investor
        })
    });

    const rows = exchangeParticipants.map(participant =>
        <ExchangeParticipantRow key={participant.contractId} participant={participant}/>
    );

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon/>Investors</>}
        >
            <PageSection border='blue' background='white'>
                <div className='exchange-participants'>
                    <InviteParticipant registeredInvestors={investorOptions}/>
                    <StripedTable
                        className='active-participants'
                        header={['Id', 'Active Orders', 'Volume Traded (USD)', 'Amount Commited (USD)']}
                        rows={rows}/>
                </div>
            </PageSection>
        </Page>
    )
}

type RowProps = {
    participant: ExchangeParticipantInfo
}

const ExchangeParticipantRow: React.FC<RowProps> = ({ participant }) => {
    const { exchange, exchParticipant } = participant.contractData;

    const query = () => ({ exchange, exchParticipant });
    const deps = [exchange, exchParticipant];
    const activeOrders = useStreamQuery(Order, query, deps).contracts.length;

    return (
        <Table.Row className='active-participants-row'>
            <Table.Cell>{exchParticipant}</Table.Cell>
            <Table.Cell>{activeOrders}</Table.Cell>
            <Table.Cell>-</Table.Cell>
            <Table.Cell>-</Table.Cell>
        </Table.Row>
    )
}

export default ExchangeParticipants;
