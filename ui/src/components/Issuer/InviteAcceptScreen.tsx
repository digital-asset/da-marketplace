import React, { useState } from 'react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { IssuerInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'

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
    const [ title, setTitle ] = useState<string>('')
    const [ issuerID, setIssuerID ] = useState<string>('')
    const [ ssn, setSSN ] = useState<string>('')

    async function submit() {
        const key = wrapDamlTuple([operator, issuer]);
        const args = { name, title, issuerID, ssn };
        await ledger.exerciseByKey(IssuerInvitation.IssuerInvitation_Accept, key, args)
            .catch(err => console.error(err));
    }

    return (
        <InviteAcceptTile
            role='Issuer'
            onLogout={onLogout}
            onSubmit={submit}
        >
            <InviteTextField
                label='Name'
                placeholder='Your Legal Name'
                variable={name}
                setter={setName}
            />
            <InviteTextField
                label='Title'
                placeholder='Your professional title'
                variable={title}
                setter={setTitle}
            />
            <InviteTextField
                label='Issuer ID'
                placeholder='Your Issuer ID'
                variable={issuerID}
                setter={setIssuerID}
            />
            <InviteTextField
                label='Social Security Number (private)'
                placeholder='Your social security number'
                variable={ssn}
                setter={setSSN}
            />
            <InviteAcceptButton disabled={!name || !title || !issuerID || !ssn}/>
        </InviteAcceptTile>
    )
}

export default InviteAcceptScreen;
