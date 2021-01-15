import React from 'react'

import { Header } from 'semantic-ui-react'

import { BrokerCustomerInfo, RegisteredInvestorInfo } from '../common/damlTypes'
import { useRegistryLookup } from '../common/RegistryLookup'
import InviteBrokerCustomer from './InviteBrokerCustomer'

type Props = {
    brokerCustomers: BrokerCustomerInfo[];
    registeredInvestors: RegisteredInvestorInfo[];
}

const BrokerCustomers: React.FC<Props> = ({ brokerCustomers, registeredInvestors }) => {
    const investorMap = useRegistryLookup().investorMap;
    const rows = brokerCustomers.map(customer => {
        const brokerCustomer = customer.contractData.brokerCustomer;
        const name = investorMap.get(brokerCustomer)?.name || brokerCustomer;
        return <p key={brokerCustomer}>{name}</p>
    });
    return (
        <>
            <Header as='h3'>Customers</Header>
            {rows}
            <InviteBrokerCustomer registeredInvestors={registeredInvestors}/>
        </>
    )
}

export default BrokerCustomers;
