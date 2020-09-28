import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { parseError, ErrorMessage } from './errorTypes'
import FormErrorHandled from './FormErrorHandled'

type Props = {
    label: string;
    formSubmit: (partyId: string) => Promise<void>;
}

const RelationshipRequestForm: React.FC<Props> = ({ label, formSubmit }) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();
    const [ partyId, setPartyId ] = useState('');

    return (
        <FormErrorHandled
            loading={loading}
            error={error}
            clearError={() => setError(undefined)}
            onSubmit={async () => {
                setLoading(true);
                try {
                    await formSubmit(partyId);
                } catch (err) {
                    setError(parseError(err));
                }
                setLoading(false);
            }}
        >
            <Form.Group className='inline-form-group'>
                <Form.Input
                    label={label}
                    placeholder='Enter ID'
                    onChange={e => setPartyId(e.currentTarget.value)}/>
                <Button basic content='Send Request'/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default RelationshipRequestForm;
