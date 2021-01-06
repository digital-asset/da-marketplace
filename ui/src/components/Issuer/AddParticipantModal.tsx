import React, { useState } from 'react';
import { Button, Modal, Form } from 'semantic-ui-react'

import { useStreamQueryAsPublic } from '@daml/dabl-react'
import { useParty, useLedger } from '@daml/react'

import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types/module'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import {
    RegisteredCustodian,
    RegisteredIssuer,
    RegisteredInvestor,
    RegisteredExchange,
    RegisteredBroker
} from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import FormErrorHandled from '../common/FormErrorHandled'
export type ITextMap<T> = { [key: string]: T };

interface IProps {
    onRequestClose: () => void;
    show: boolean;
    currentParticipants: Set<string>;
    tokenId?: Id;
}

const ValueEntryModal = (props: IProps) => {
    const ledger = useLedger();
    const party = useParty();

    const [ newParticipants, setNewParticipants ] = useState<Set<string>>();

    const allRegisteredParties = [
        useStreamQueryAsPublic(RegisteredCustodian).contracts
            .map(rc => ({ contractId: rc.contractId, contractData: rc.payload.custodian })),
        useStreamQueryAsPublic(RegisteredIssuer).contracts
            .map(ri => ({ contractId: ri.contractId, contractData: ri.payload.issuer })),
        useStreamQueryAsPublic(RegisteredInvestor).contracts
            .map(ri => ({ contractId: ri.contractId, contractData: ri.payload.investor })),
        useStreamQueryAsPublic(RegisteredExchange).contracts
            .map(re => ({ contractId: re.contractId, contractData: re.payload.exchange })),
        useStreamQueryAsPublic(RegisteredBroker).contracts
            .map(rb => ({ contractId: rb.contractId, contractData: rb.payload.broker }))
        ].flat()

    const partyOptions = allRegisteredParties.filter(d => !Array.from(props.currentParticipants).includes(d.contractData))
        .map(d => {
            return {
                key: d.contractId,
                text: `${d.contractData}`,
                value: d.contractData
            }
        })

    const handleSelectNewParticipants = (event: React.SyntheticEvent, result: any) => {
        setNewParticipants(result.value)
    }

    async function submit() {
        if (!newParticipants || !props.tokenId) {
            return
        }
    
        const newObservers: ITextMap<string> = {};

        // [...Array.from(props.currentParticipants), ...Array.from(newParticipants)].forEach(f => newObservers[f] = '');
    
        const args = { party, };

        await ledger.exerciseByKey(Token.Token_AddObservers, props.tokenId, args);
        props.onRequestClose()
    }   

    return (
        <Modal
            closeIcon
            open={props.show}
            dimmer={'inverted'}
            size={'small'}
            onClose={() => props.onRequestClose()}>
            <Modal.Header>Add participants</Modal.Header>
            <Modal.Content>
                {partyOptions.length == 0 && <i>All registered parties have been added</i>}
                <FormErrorHandled onSubmit={submit}>
                    <Form.Select
                        multiple
                        className='issue-asset-form-field select-observer'
                        disabled={partyOptions.length == 0}
                        placeholder='Select...'
                        options={partyOptions}
                        onChange={handleSelectNewParticipants}/>
                    <Button
                        secondary
                        content='Add'
                        disabled={!newParticipants}/>
                </FormErrorHandled>
            </Modal.Content>
            </Modal>
    );
}

export default ValueEntryModal;
