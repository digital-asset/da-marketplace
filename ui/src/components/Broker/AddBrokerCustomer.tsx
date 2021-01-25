import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'

import { BrokerCustomerInvitation, BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'

import { AddPlusIcon } from '../../icons/Icons'

import { wrapDamlTuple } from '../common/damlTypes'

import { useOperator } from '../common/common'
import AddRegisteredPartyModal from '../common/AddRegisteredPartyModal'

import { useContractQuery, AS_PUBLIC } from '../../websocket/queryStream'

const AddBrokerCustomer = () => {
    const [ showAddCustomerModal, setShowAddCustomerModal ] = useState<boolean>(false)

    const allRegisteredInvestors = useContractQuery(RegisteredInvestor, AS_PUBLIC);
    const currentInvitations = useContractQuery(BrokerCustomerInvitation);
    const brokerCustomers = useContractQuery(BrokerCustomer);

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useOperator();

    const handleBrokerCustomerInviteSubmit = async (party: string) => {
        const choice = Broker.Broker_InviteCustomer;
        const key = wrapDamlTuple([operator, exchange]);
        const args = { brokerCustomer: party};

        await ledger.exerciseByKey(choice, key, args);
    }

    const customerOptions = allRegisteredInvestors.filter(ri =>
        !brokerCustomers.find(bc => bc.contractData.brokerCustomer === ri.contractData.investor) &&
        !currentInvitations.find(bci => bci.contractData.brokerCustomer === ri.contractData.investor))
        .map(c => {
            return {
                text: `${c.contractData.name}`,
                value: c.contractData.investor
            }
        });
    return (
        <>
            <Button
                disabled={customerOptions.length === 0}
                className='profile-link add-relationship'
                onClick={()=> setShowAddCustomerModal(true)}>
                    <AddPlusIcon/> <a className='bold'>Add Cleint</a>
                    {customerOptions.length === 0 && <i className='disabled'>All registered clients have been added</i>}
            </Button>
            {showAddCustomerModal &&
                <AddRegisteredPartyModal
                    title='Add Investor'
                    partyOptions={customerOptions}
                    onRequestClose={() => setShowAddCustomerModal(false)}
                    multiple={false}
                    emptyMessage='All registered investors have been added'
                    onSubmit={handleBrokerCustomerInviteSubmit}/>}
        </>
    )
}

export default AddBrokerCustomer;
