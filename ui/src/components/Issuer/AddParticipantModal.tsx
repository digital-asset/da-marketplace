import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

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
import { wrapTextMap } from '../common/damlTypes';

interface IProps {
    onRequestClose: () => void;
    show: boolean;
    currentParticipants: string[];
    tokenId?: Id;
}

const ValueEntryModal = (props: IProps) => {
    const ledger = useLedger();
    const party = useParty();
    const history = useHistory()

    const [ selectedObservers, setSelectedObservers ] = useState<string[]>([]);
    const baseUrl = history.location.pathname.substring(0, history.location.pathname.lastIndexOf('/'))

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
        setSelectedObservers(result.value)
    }

    async function submit() {
        if (!props.tokenId) {
            return
        }

        const newObservers = wrapTextMap([...props.currentParticipants, ...selectedObservers])

        await ledger.exerciseByKey(Token.Token_AddObservers, props.tokenId, { party, newObservers })
            .then(resp => history.push(`${baseUrl}/${resp[0]}`))
        
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
                {partyOptions.length == 0 ?
                    <i>All registered parties have been added</i>
                    :
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
                            content='Add'/>
                    </FormErrorHandled>
                }
            </Modal.Content>
        </Modal>
    );
}

export default ValueEntryModal;
