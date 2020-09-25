import React from 'react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'

import RelationshipRequestForm from '../common/RelationshipRequestForm'
import { wrapDamlTuple } from '../common/damlTypes'

const RequestCustodianRelationship: React.FC = () => {
    const ledger = useLedger();
    const issuer = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const requestCustodianRelationship = async (custodian: string) => {
        const choice = Issuer.Issuer_RequestCustodianRelationship;
        const key = wrapDamlTuple([operator, issuer]);
        const args = { custodian };
        await ledger.exerciseByKey(choice, key, args);
    }

    return (
        <RelationshipRequestForm
            label='Custodian'
            formSubmit={requestCustodianRelationship}/>
    )
}

export default RequestCustodianRelationship;
