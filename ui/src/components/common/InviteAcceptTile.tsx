import React from 'react'
import { Form, Button } from 'semantic-ui-react'

import TopMenu from './TopMenu'
import { ErrorMessage } from './errorTypes'
import FormErrorHandled from './FormErrorHandled'
import OnboardingTile from './OnboardingTile'

import './InviteAcceptTile.css'

type InviteAcceptButtonProps = {
    loading: boolean
    disabled: boolean
    submit: () => Promise<void>
}

const InviteAcceptButton: React.FC<InviteAcceptButtonProps> = ({ loading, disabled, submit }) => (
    <div className='invite-accept-submit-button-div'>
        <Button
            primary
            loading={loading}
            disabled={disabled}
            className='invite-accept-submit-button'
            onClick={submit}>
                Submit
        </Button>
    </div>
)

type InviteTextFieldProps = {
    label: string
    placeholder: string
    variable: string
    setter: React.Dispatch<React.SetStateAction<string>>
}

const InviteTextField: React.FC<InviteTextFieldProps> = ({ label, variable, placeholder, setter }) => (
    <div className='invite-accept-form-item'>
        <Form.Input
            label={label}
            fluid
            placeholder={placeholder}
            value={variable}
            className='invite-accept-form-field'
            onChange={e => setter(e.currentTarget.value)}
        />
    </div>
)

type Props = {
    onLogout: () => void;
    role: string;
    error?: ErrorMessage;
    setError: React.Dispatch<React.SetStateAction<ErrorMessage | undefined>>
}

const InviteAcceptTile: React.FC<Props> = ({ children, onLogout, role, error, setError}) => {
    return (
        <>
        <TopMenu onLogout={onLogout}/>
        <OnboardingTile subtitle={'Please fill in some information about yourself as ' + role}>
                <FormErrorHandled
                    size='large'
                    className='invite-accept-form'
                    error={error}
                    clearError={() => setError(undefined)}
                >
                    {children}
                </FormErrorHandled>
        </OnboardingTile>
        </>
    )
}

export { InviteAcceptTile, InviteTextField, InviteAcceptButton };
export default InviteAcceptTile;
