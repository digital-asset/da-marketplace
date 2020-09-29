import React, { useState } from 'react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { BrokerInvitation } from '@daml.js/da-marketplace/lib/Marketplace/Broker'

import { wrapDamlTuple } from '../common/damlTypes'
import { ErrorMessage } from '../common/errorTypes'
import { InviteAcceptTile, InviteAcceptButton, InviteTextField } from '../common/InviteAcceptTile'

type Props = {
    onLogout: () => void;
}

const InviteAcceptScreen: React.FC<Props> = ({ onLogout }) => {
    const ledger = useLedger();
    const issuer = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const [ name, setName ] = useState<string>('')
    const [ location, setLocation ] = useState<string>('')
    const [ error, setError ] = useState<ErrorMessage>();
    const [ loading, setLoading ] = useState(false);

    async function submit() {
        setLoading(true);
        const key = wrapDamlTuple([operator, issuer]);
        const args = { name, location };
        await ledger.exerciseByKey(BrokerInvitation.BrokerInvitation_Accept, key, args)
            .catch(err => console.error(err));
        setLoading(false);
    }

    return (
        <InviteAcceptTile
            onLogout={onLogout}
            role='Broker'
            error={error}
            setError={setError}
        >
            <InviteTextField
                label='Name'
                placeholder='The name of the Broker'
                variable={name}
                setter={setName}
            />
            <InviteTextField
                label='Location'
                placeholder='The location of the Broker'
                variable={location}
                setter={setLocation}
            />
            <InviteAcceptButton
                loading={loading}
                disabled={!name || !location}
                submit={submit}
            />
        </InviteAcceptTile>
    )
}

export default InviteAcceptScreen;
