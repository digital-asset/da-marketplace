import React, { useState } from 'react'
import { Button, Form, Grid } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import TopMenu from '../common/TopMenu'
import OnboardingTile from '../common/OnboardingTile'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { IssuerInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'

import { wrapDamlTuple } from '../common/damlTypes'
import { parseError, ErrorMessage } from '../common/errorTypes'
import FormErrorHandled from '../common/FormErrorHandled'
// import FormToggle from './common/FormToggle'

import './InviteAcceptTile.css'

type InfoFieldProps = {
    label: string
    placeholder: string
    variable: string
    setter: React.Dispatch<React.SetStateAction<string>>
}

const InfoField: React.FC<InfoFieldProps> = ({ label, variable, placeholder, setter }) => ( 
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
    error: ErrorMessage | undefined;
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
export default {InviteAcceptTile, InfoField};
