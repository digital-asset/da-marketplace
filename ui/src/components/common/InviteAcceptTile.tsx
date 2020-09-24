import React from 'react'
import { Form, Button } from 'semantic-ui-react'

import TopMenu from './TopMenu'
import { ErrorMessage } from './errorTypes'
import FormErrorHandled from './FormErrorHandled'
import OnboardingTile from './OnboardingTile'

import './InviteAcceptTile.css'

type InviteAcceptButtonProps = {
    disabled?: boolean
}

export const InviteAcceptButton: React.FC<InviteAcceptButtonProps> = ({ disabled }) => (
    <div className='invite-accept-submit-button-div'>
        <Button
            primary
            className='invite-accept-submit-button'
            content='Submit'
            disabled={disabled}
            type='submit'/>
    </div>
)

type InviteTextFieldProps = {
    label: string
    placeholder: string
    variable: string
    setter: React.Dispatch<React.SetStateAction<string>>
}

export const InviteTextField: React.FC<InviteTextFieldProps> = ({ label, variable, placeholder, setter }) => (
    <div className='invite-accept-form-item'>
        <Form.Input
            fluid
            className='invite-accept-form-field'
            label={label}
            placeholder={placeholder}
            value={variable}
            onChange={e => setter(e.currentTarget.value)}
        />
    </div>
)

type Props = {
    error?: ErrorMessage;
    role: string;
    onLogout: () => void;
    onSubmit: () => Promise<void>;
}

const InviteAcceptTile: React.FC<Props> = ({ children, role, onLogout, onSubmit }) => {
    return (
        <>
        <TopMenu onLogout={onLogout}/>
        <OnboardingTile subtitle={`Please fill in some information about yourself as ${role}`}>
                <FormErrorHandled
                    className='invite-accept-form'
                    size='large'
                    onSubmit={onSubmit}
                >
                    { children }
                </FormErrorHandled>
        </OnboardingTile>
        </>
    )
}

export default InviteAcceptTile;
