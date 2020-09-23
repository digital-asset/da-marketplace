import React, { useState } from 'react'
import { InviteAcceptTile, InviteAcceptButton, InviteTextField } from '../common/InviteAcceptTile'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'

import { wrapDamlTuple } from '../common/damlTypes'
import { ErrorMessage } from '../common/errorTypes'
import { InvestorInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Investor'

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
    const [ error, setError ] = useState<ErrorMessage>();
    const [ loading, setLoading ] = useState(false);

    async function submit() {
        setLoading(true);
        const key = wrapDamlTuple([operator, issuer]);
        const args = { name, location, ssn, isPublic: true };
        await ledger.exerciseByKey(InvestorInvitation.InvestorInvitation_Accept, key, args)
            .catch(err => console.error(err));
        setLoading(false);
    }

    return (
        <InviteAcceptTile
            onLogout={onLogout}
            role='Investor'
            error={error}
            setError={setError}>
        
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
            <InviteAcceptButton
                    loading={loading}
                    disabled={!name || !location || !ssn}
                    submit={submit}>
            </InviteAcceptButton>
        </InviteAcceptTile>
    )
}

export default InviteAcceptScreen;
