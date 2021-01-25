import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import {
    BrokerCustomerInvitation,
    BrokerCustomer
} from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'

import { useContractQuery } from '../../websocket/queryStream'

import { wrapDamlTuple, RegisteredInvestorInfo } from '../common/damlTypes'
import { useOperator } from '../common/common'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'

type Props = {
    registeredInvestors: RegisteredInvestorInfo[];
}

const InviteBrokerCustomer: React.FC<Props> = ({ registeredInvestors }) => {
    const [ brokerCustomer, setBrokerCustomer ] = useState('');

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useOperator();

    const currentInvitations = useContractQuery(BrokerCustomerInvitation);
    const brokerCustomers = useContractQuery(BrokerCustomer);

    const customerOptions = registeredInvestors.filter(ri =>
        !brokerCustomers.find(bc => bc.contractData.brokerCustomer === ri.contractData.investor) &&
        !currentInvitations.find(bci => bci.contractData.brokerCustomer === ri.contractData.investor));

    const handleBrokerCustomerInviteSubmit = async () => {
        const choice = Broker.Broker_InviteCustomer;
        const key = wrapDamlTuple([operator, exchange]);
        const args = { brokerCustomer };

        await ledger.exerciseByKey(choice, key, args);
        setBrokerCustomer('');
    }

    return (
        
        <FormErrorHandled onSubmit={handleBrokerCustomerInviteSubmit}>
            <Form.Group>
                <ContractSelect
                    allowAdditions
                    clearable
                    search
                    selection
                    contracts={customerOptions}
                    placeholder='Investor party ID'
                    value={brokerCustomer}
                    getOptionText={ri => ri.contractData.name}
                    setContract={ri => setBrokerCustomer(ri.contractData.investor)}
                    setAddition={privateInvestorId => setBrokerCustomer(privateInvestorId)}/>

                <Button
                    content='Invite'
                    className='invite-investor ghost'
                    disabled={!brokerCustomer}/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default InviteBrokerCustomer;
