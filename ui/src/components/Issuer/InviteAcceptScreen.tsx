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

import './InviteAcceptScreen.css'

type Props = {
    onLogout: () => void;
}

type TestField = {
    title: string
    getter: string
    setter: React.Dispatch<React.SetStateAction<string>>
}

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

const InviteAcceptScreen: React.FC<Props> = ({ onLogout }) => {
    const history = useHistory();
    const ledger = useLedger();
    const issuer = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const [ name, setName ] = useState<string>('')
    const [ title, setTitle ] = useState<string>('')
    const [ issuerID, setIssuerID ] = useState<string>('')
    const [ ssn, setSSN ] = useState<string>('')
    const [ error, setError ] = useState<ErrorMessage>();
    const [ loading, setLoading ] = useState(false);

    async function submit() {
        setLoading(true);
        const key = wrapDamlTuple([operator, issuer]);
        const args = { name, title, issuerID, ssn };
        await ledger.exerciseByKey(IssuerInvitation.IssuerInvitation_Accept, key, args)
            .catch(err => console.error(err));
        setLoading(false);
    }

    return (
        <>
        <TopMenu onLogout={onLogout}/>
        {/* <Grid className='invite-tile' textAlign='left' verticalAlign='middle'>
            <Grid.Row>
                <Grid.Column width={8} className='invite-tile-content'> */}
        <OnboardingTile subtitle='Please fill in some information about yourself.'>
                <FormErrorHandled
                    size='large'
                    className='invite-accept-form'
                    error={error}
                    clearError={() => setError(undefined)}
                >                        
                    <InfoField
                        label='Name'
                        placeholder='Your professional title'
                        variable={name}
                        setter={setName}
                    />
                    

                    <div className='invite-accept-form-item'>
                        {/* <p>Title</p>
                        <p><i>Your title</i></p> */}
                        <Form.Input
                            label='Title'
                            fluid
                            placeholder='Your professional title'
                            value={title}
                            className='invite-accept-form-field'
                            onChange={e => setTitle(e.currentTarget.value)}
                        />
                    </div>

                    <div className='invite-accept-form-item'>
                        {/* <p>IssuerID</p>
                        <p><i>Your Issuer ID.</i></p> */}
                        <Form.Input
                            label='Issuer ID'
                            fluid
                            placeholder='Your Issuer ID'
                            value={issuerID}
                            className='invite-accept-form-field'
                            onChange={e => setIssuerID(e.currentTarget.value)}
                        />
                    </div>
                    <div className='invite-accept-form-item'>
                        {/* <p>IssuerID</p>
                        <p><i>Your Issuer ID.</i></p> */}
                        <Form.Input
                            label='Social Security Number (private)'
                            fluid
                            placeholder='Your social'
                            value={ssn}
                            className='invite-accept-form-field'
                            onChange={e => setSSN(e.currentTarget.value)}
                        />
                    </div>
                    <div className='invite-accept-submit-button-div'>
                    <Button
                        primary
                        loading={loading}
                        disabled={!name || !title || !issuerID || !ssn}
                        className='invite-accept-submit-button'
                        onClick={submit}>
                            Submit
                    </Button>
                    </div>
                </FormErrorHandled>
        </OnboardingTile>
                {/* </Grid.Column>
            </Grid.Row>
        </Grid> */}
    </>
    )
}

export default InviteAcceptScreen;
