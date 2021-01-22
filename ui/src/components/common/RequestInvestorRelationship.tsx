import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'

import { AddPlusIcon } from '../../icons/Icons'

import { wrapDamlTuple, RegisteredInvestorInfo } from './damlTypes'
import { useOperator } from './common'
import AddRegisteredPartyModal from './AddRegisteredPartyModal'

type Props = {
    registeredInvestors: RegisteredInvestorInfo[];
}

const RequestInvestorRelationship: React.FC<Props> = ({ registeredInvestors }) => {
    const [ exchParticipant, setExchParticipant ] = useState('');
    const [ showAddRelationshipModal, setShowAddRelationshipModal ] = useState(false);

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useOperator();

    const handleExchParticipantInviteSubmit = async () => {
        const choice = Exchange.Exchange_InviteParticipant;
        const key = wrapDamlTuple([operator, exchange]);
        const args = { exchParticipant };

        await ledger.exerciseByKey(choice, key, args);
        setExchParticipant('');
    }

    const partyOptions = registeredInvestors.map(d => {
        return {
            text: `${d.contractData.name}`,
            value: d.contractData.investor
        }
    })

    return (
        <>
            <Button
                disabled={partyOptions.length === 0}
                className='profile-link add-relationship'
                onClick={()=> setShowAddRelationshipModal(true)}>
                    <AddPlusIcon/> <a>Add Investor</a>
                    {partyOptions.length === 0 && <i className='disabled'>All registered investors have been added</i>}
            </Button>
            {showAddRelationshipModal &&
                <AddRegisteredPartyModal
                    title='Add Custodian'
                    partyOptions={partyOptions}
                    onRequestClose={() => setShowAddRelationshipModal(false)}
                    multiple={false}
                    onSubmit={handleExchParticipantInviteSubmit}/>
            }
        </>
    )
}

export default RequestInvestorRelationship;
