import React, { useState } from 'react'
import { InviteAcceptTile, InviteAcceptButton, InviteTextField } from '../common/InviteAcceptTile'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'

import { wrapDamlTuple } from '../common/damlTypes'
import { ErrorMessage } from '../common/errorTypes'
import { InvestorInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Investor'

import FormToggle from '../common/FormToggle'

type Props = {
    onLogout: () => void;
}

const InviteAcceptScreen: React.FC<Props> = ({ onLogout }) => {
    const ledger = useLedger();
    const issuer = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const [ name, setName ] = useState<string>('')
    const [ location, setLocation ] = useState<string>('')
    const [ ssn, setSSN ] = useState<string>('')
    const [ isPublic, setIsPublic ] = useState<boolean>(true)
    const [ error, setError ] = useState<ErrorMessage>();
    const [ loading, setLoading ] = useState(false);

    async function submit() {
        setLoading(true);
        const key = wrapDamlTuple([operator, issuer]);
        const args = { name, location, ssn, isPublic };
        await ledger.exerciseByKey(InvestorInvitation.InvestorInvitation_Accept, key, args)
            .catch(err => console.error(err));
        setLoading(false);
    }

    return (
        <InviteAcceptTile
            onLogout={onLogout}
            role='Investor'
            error={error}
            setError={setError}
        >
            <InviteTextField
                label='Name'
                placeholder='Your full legal name'
                variable={name}
                setter={setName}
            />
            <InviteTextField
                label='Location'
                placeholder='Your current location'
                variable={location}
                setter={setLocation}
            />
            <InviteTextField
                label='Social Security Number (private)'
                placeholder='Your social security number'
                variable={ssn}
                setter={setSSN}
            />
            <div className='invite-accept-is-public'>
                <FormToggle
                    defaultChecked
                    className='invite-accept-form-item'
                    onLabel='Public'
                    onInfo='All parties will be aware of this investor.'
                    offLabel='Private'
                    offInfo='Only a set of parties will be aware of this investor.'
                    onClick={val => setIsPublic(val)}/>
            </div>
            <InviteAcceptButton
                loading={loading}
                disabled={!name || !location || !ssn}
                submit={submit}>
            </InviteAcceptButton>
        </InviteAcceptTile>
    )
}

export default InviteAcceptScreen;
