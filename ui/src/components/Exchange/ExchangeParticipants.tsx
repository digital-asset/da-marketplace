import React, { useState } from 'react'
import { Button, Form, Table } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQuery } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { UserIcon } from '../../icons/Icons'
import { ExchangeParticipantInfo, wrapDamlTuple } from '../common/damlTypes'
import { parseError, ErrorMessage } from '../common/errorTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import Page from '../common/Page'

import "./ExchangeParticipants.css"

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const ExchangeParticipants: React.FC<Props> = ({ sideNav, onLogout }) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();
    const [ exchParticipant, setExchParticipant ] = useState('');

    const allExchParticipants: ExchangeParticipantInfo[] = useStreamQuery(ExchangeParticipant).contracts
        .map(tc => ({ contractId: tc.contractId, contractData: tc.payload }));

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const clearForm = () => {
        setLoading(false);
        setExchParticipant('');
    }

    const handleExchParticipantInviteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            const key = wrapDamlTuple([operator, exchange]);
            const args = {
                exchParticipant
            };

            await ledger.exerciseByKey(Exchange.Exchange_InviteParticipant, key, args);
            clearForm();
        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon/>Investors</>}
        >
            <div className='exchange-participants'>
                <FormErrorHandled
                    loading={loading}
                    error={error}
                    clearError={() => setError(undefined)}
                    onSubmit={handleExchParticipantInviteSubmit}
                >
                    <Form.Group>
                        <Form.Input
                            placeholder='Investor party ID'
                            onChange={e => setExchParticipant(e.currentTarget.value)}/>
                        <Button
                            basic
                            content='Invite'
                            className='invite-investor'/>
                    </Form.Group>
                </FormErrorHandled>

                <Table fixed className='active-participants'>
                    <Table.Header className='active-participants-header'>
                        <Table.Row>
                            <Table.HeaderCell>Id</Table.HeaderCell>
                            <Table.HeaderCell>Active Orders</Table.HeaderCell>
                            <Table.HeaderCell>Volume Traded (USD)</Table.HeaderCell>
                            <Table.HeaderCell>Amount Commited (USD)</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body className='active-participants-body'>
                        { allExchParticipants.map(exchp => <ExchangeParticipantRow key={exchp.contractId} exchp={exchp}/>)}
                    </Table.Body>
                </Table>
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
            <Table.Cell className='active-participants-cell'>{exchParticipant}</Table.Cell>
            <Table.Cell className='active-participants-cell'>{activeOrders}</Table.Cell>
            <Table.Cell className='active-participants-cell'>-</Table.Cell>
            <Table.Cell className='active-participants-cell'>-</Table.Cell>
        </Table.Row>
    )
}

export default ExchangeParticipants;
