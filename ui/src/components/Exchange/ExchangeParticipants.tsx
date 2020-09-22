import React from 'react'
import { Table } from 'semantic-ui-react'

import { useStreamQuery } from '@daml/react'
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { UserIcon } from '../../icons/Icons'
import { ExchangeParticipantInfo } from '../common/damlTypes'
import StripedTable from '../common/StripedTable'
import Page from '../common/Page'

import InviteParticipant from './InviteParticipant'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const ExchangeParticipants: React.FC<Props> = ({ sideNav, onLogout }) => {
    const tableRows = useStreamQuery(ExchangeParticipant).contracts
        .map(tc => ({ contractId: tc.contractId, contractData: tc.payload }))
        .map(exchp => <ExchangeParticipantRow key={exchp.contractId} exchp={exchp}/>);

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon/>Investors</>}
        >
            <div className='exchange-participants'>
                <InviteParticipant/>
                <StripedTable
                    className='active-participants'
                    header={['Id', 'Active Orders', 'Volume Traded (USD)', 'Amount Commited (USD)']}
                    rows={tableRows}/>
            </div>
        </Page>
    )
}

type RowProps = {
    exchp: ExchangeParticipantInfo
}

const ExchangeParticipantRow: React.FC<RowProps> = ({ exchp }) => {
    const { exchange, exchParticipant } = exchp.contractData;

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
