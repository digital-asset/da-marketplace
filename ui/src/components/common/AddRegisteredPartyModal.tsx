import React, {useState} from 'react'

import {Button, DropdownProps, Form, Modal} from 'semantic-ui-react'

import FormErrorHandled from './FormErrorHandled'

interface IProps {
    onSubmit: (selectedParties: string[]) => void;
    onRequestClose: () => void;
    title: string;
    multiple?: boolean;
    emptyMessage?: string;
    partyOptions: {
        text: string;
        value: string;
    }[]
}

function isStringArray(strArr: any): strArr is string[] {
    if (Array.isArray(strArr)) {
        return strArr.reduce((acc, elem) => {
            return acc && typeof elem === 'string'
        }, true);
    } else {
        return false
    }
}

const AddRegisteredPartyModal = (props: IProps) => {
    const { onSubmit, partyOptions, title, onRequestClose, emptyMessage, multiple } = props

    const [ selectedParties, setSelectedParties ] = useState<string[]>([]);

    const handleSelectNewParticipants = (event: React.SyntheticEvent, result: DropdownProps) => {
        if (typeof result.value === 'string') {
            setSelectedParties([...selectedParties, result.value])
        } else if (isStringArray(result.value)) {
            setSelectedParties(result.value);
        }
    }

    const handleSubmit = async () => {
        onSubmit(selectedParties)
        onRequestClose()
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
                            className='issue-asset-form-field select-observer'
                            placeholder='Select...'
                            multiple={multiple}
                            disabled={partyOptions.length === 0}
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
