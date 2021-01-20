import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQueries } from '@daml/react'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { BrokerCustomerInvitation, BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'

import { wrapDamlTuple, RegisteredInvestorInfo, makeContractInfo } from '../common/damlTypes'
import { useOperator } from '../common/common'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'

type Props = {
    registeredInvestors: RegisteredInvestorInfo[];
}

const InviteBrokerCustomer: React.FC<Props> = ({ registeredInvestors }) => {
    const [ customer, setBrokerCustomer ] = useState('');

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useOperator();

    const currentInvitations = useStreamQueries(BrokerCustomerInvitation, () => [], [], (e) => {
        console.log("Unexpected close from brokerCustomerInvitation: ", e);
    }).contracts.map(makeContractInfo);
    const customers = useStreamQueries(BrokerCustomer, () => [], [], (e) => {
        console.log("Unexpected close from customer: ", e);
    }).contracts.map(makeContractInfo);

    const customerOptions = registeredInvestors.filter(ri =>
        !customers.find(bc => bc.contractData.customer === ri.contractData.investor) &&
        !currentInvitations.find(bci => bci.contractData.customer === ri.contractData.investor));

    const handleBrokerCustomerInviteSubmit = async () => {
        const choice = Broker.InviteCustomer;
        const key = wrapDamlTuple([operator, exchange]);
        const args = { customer };

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
                    value={customer}
                    getOptionText={ri => ri.contractData.name}
                    setContract={ri => setBrokerCustomer(ri.contractData.investor)}
                    setAddition={privateInvestorId => setBrokerCustomer(privateInvestorId)}/>

                <Button
                    content='Invite'
                    className='invite-investor ghost'
                    disabled={!customer}/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default InviteBrokerCustomer;
