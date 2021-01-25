import React, { useState } from 'react';

import { Button, Modal, Form } from 'semantic-ui-react'

import { IconClose } from '../../icons/Icons';

import FormErrorHandled from './FormErrorHandled'

interface IProps {
    onRequestClose: () => void;
    title: string;
    multiple?: boolean;
    emptyMessage?: string;
    onSubmit: (selectedParties: any) => void;
    partyOptions: {
        text: string;
        value: string;
    }[]
}

const AddRegisteredPartyModal = (props: IProps) => {
    const { onSubmit, partyOptions, title, onRequestClose, emptyMessage, multiple } = props

    const [ selectedParties, setSelectedParties ] = useState<string[]>([]);
    const [ showSuccessMessage, setShowSuccessMessage ] = useState<boolean>(false);
    const handleSelectNewParticipants = (event: React.SyntheticEvent, result: any) => {
        setSelectedParties(result.value)
    }

    const handleSubmit = async () => {
        onSubmit(selectedParties)
        setShowSuccessMessage(true)
    }

    return (
        <Modal
            open={true}
            dimmer={'inverted'}
            size={'small'}
            onClose={onRequestClose}>
            <Modal.Header as='h3'>{title}</Modal.Header>
            <Modal.Content>
                {partyOptions.length === 0 ?
                    <p><i>{emptyMessage ? emptyMessage : 'All registered parties have been added'}</i></p>
                    :
                    <FormErrorHandled onSubmit={handleSubmit}>
                        <Form.Select
                            multiple={multiple}
                            className='issue-asset-form-field select-observer'
                            disabled={partyOptions.length === 0}
                            placeholder='Select...'
                            options={partyOptions}
                            onChange={handleSelectNewParticipants}/>
                        <Button
                            className='ghost'
                            content='Add'/>
                    </FormErrorHandled>
                }
            </Modal.Content>
        </Modal>
    );
}

export default AddRegisteredPartyModal;
