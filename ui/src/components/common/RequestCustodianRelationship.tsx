import React, {useState} from 'react'

import {useLedger, useParty} from '@daml/react'

import {CustodianRelationshipRequest} from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import {RegisteredCustodian} from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import {AS_PUBLIC, useContractQuery} from '../../websocket/queryStream'

import {CustodianRelationshipInfo, RelationshipRequestChoice, wrapDamlTuple} from './damlTypes'
import {useOperator} from './common'

import AddRelationshipTile from '../common/AddRelationshipTile'

import AddRegisteredPartyModal from './AddRegisteredPartyModal'

type Props = {
    relationshipRequestChoice: RelationshipRequestChoice;
    custodianRelationships: CustodianRelationshipInfo[];
}

const RequestCustodianRelationship: React.FC<Props> = ({
    relationshipRequestChoice,
    custodianRelationships
}) => {
    const [ showAddRelationshipModal, setShowAddRelationshipModal ] = useState(false);

    const ledger = useLedger();
    const party = useParty();
    const operator = useOperator();

    const requestCustodians = useContractQuery(CustodianRelationshipRequest).map(cr => cr.contractData.custodian);
    const relationshipCustodians = custodianRelationships.map(cr => cr.contractData.custodian);

    const registeredCustodians = useContractQuery(RegisteredCustodian, AS_PUBLIC)
        .filter(custodian =>
            !requestCustodians.includes(custodian.contractData.custodian) &&
            !relationshipCustodians.includes(custodian.contractData.custodian));

    const requestCustodianRelationship = async (custodianIds: string[]) => {
        const key = wrapDamlTuple([operator, party]);

        await Promise.all(custodianIds.map(custodian =>
            ledger.exerciseByKey(relationshipRequestChoice, key, { custodian })))
    }

    const partyOptions = registeredCustodians.map(d => {
            return {
                text: `${d.contractData.name}`,
                value: d.contractData.custodian
            }
        })

    return (
        <>
           <AddRelationshipTile
                disabled={partyOptions.length === 0}
                disabledMessage='All registered custodians have been added'
                onClick={()=> setShowAddRelationshipModal(true)}
                label='Add Custodian'/>
            {showAddRelationshipModal &&
                <AddRegisteredPartyModal
                    multiple
                    title='Add Custodian'
                    partyOptions={partyOptions}
                    onRequestClose={() => setShowAddRelationshipModal(false)}
                    onSubmit={requestCustodianRelationship}/>
            }
        </>
    )
}

export default RequestCustodianRelationship;
