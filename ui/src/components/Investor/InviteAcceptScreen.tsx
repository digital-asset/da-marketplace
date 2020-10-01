import React, { useState } from 'react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { InvestorInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Investor'

import { wrapDamlTuple } from '../common/damlTypes'
import InviteAcceptTile, { InviteAcceptButton, InviteTextField } from '../common/InviteAcceptTile'

type Props = {
    onLogout: () => void;
}

const InviteAcceptScreen: React.FC<Props> = ({ onLogout }) => {
    const ledger = useLedger();
    const investor = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const [ name, setName ] = useState<string>('')
    const [ location, setLocation ] = useState<string>('')
    const [ ssn, setSSN ] = useState<string>('')

    function clearForm() {
        setName('');
        setLocation('');
        setSSN('');
    }

    async function submit() {
        const key = wrapDamlTuple([operator, investor]);
        const args = { name, location, ssn, isPublic: true};
        await ledger.exerciseByKey(InvestorInvitation.InvestorInvitation_Accept, key, args);
        clearForm();
    }

    return (
        <InviteAcceptTile
            role='Investor'
            onSubmit={submit}
            onLogout={onLogout}
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
            <InviteAcceptButton
                disabled={!name || !location || !ssn}/>
        </InviteAcceptTile>
    )
}

export default InviteAcceptScreen;
