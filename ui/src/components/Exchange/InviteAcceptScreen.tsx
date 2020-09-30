import React, { useState } from 'react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { ExchangeInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'

import { wrapDamlTuple } from '../common/damlTypes'
import InviteAcceptTile, { InviteAcceptButton, InviteTextField } from '../common/InviteAcceptTile'

type Props = {
    onLogout: () => void;
}

const InviteAcceptScreen: React.FC<Props> = ({ onLogout }) => {
    const ledger = useLedger();
    const issuer = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const [ name, setName ] = useState<string>('')
    const [ location, setLocation ] = useState<string>('')

    function clearForm() {
        setName('');
        setLocation('');
    }

    async function submit() {
        const key = wrapDamlTuple([operator, issuer]);
        const args = { name, location };
        await ledger.exerciseByKey(ExchangeInvitation.ExchangeInvitation_Accept, key, args);
        clearForm();
    }

    return (
        <InviteAcceptTile
            role='Exchange'
            onLogout={onLogout}
            onSubmit={submit}
        >
            <InviteTextField
                label='Name'
                placeholder='The name of the exchange'
                variable={name}
                setter={setName}
            />
            <InviteTextField
                label='Location'
                placeholder='The location of the exchange'
                variable={location}
                setter={setLocation}
            />
            <InviteAcceptButton disabled={!name || !location}/>
        </InviteAcceptTile>
    )
}

export default InviteAcceptScreen;
