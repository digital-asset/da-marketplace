import React from 'react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'

import RelationshipRequestForm from '../common/RelationshipRequestForm'
import { wrapDamlTuple } from '../common/damlTypes'

const RequestCustodianRelationship: React.FC = () => {
    const ledger = useLedger();
    const exchange = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const requestCustodianRelationship = async (custodian: string) => {
        const choice = Exchange.Exchange_RequestCustodianRelationship;
        const key = wrapDamlTuple([operator, exchange]);
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
