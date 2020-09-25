import React from 'react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'

import RelationshipRequestForm from '../common/RelationshipRequestForm'
import { wrapDamlTuple } from '../common/damlTypes'

const RequestCustodianRelationship: React.FC = () => {
    const ledger = useLedger();
    const investor = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const requestCustodianRelationship = async (custodian: string) => {
        const choice = Investor.Investor_RequestCustodianRelationship;
        const key = wrapDamlTuple([operator, investor]);
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
