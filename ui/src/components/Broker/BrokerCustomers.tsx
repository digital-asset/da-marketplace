import React, { useState } from 'react'

import { Header } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'

import { UserIcon, AddPlusIcon } from '../../icons/Icons'

import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import {
    BrokerCustomerInvitation,
    BrokerCustomer
} from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'


import { wrapDamlTuple } from '../common/damlTypes'
import { useRegistryLookup } from '../common/RegistryLookup'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import StripedTable from '../common/StripedTable'
import { useOperator } from '../common/common'
import AddRegisteredPartyModal from '../common/AddRegisteredPartyModal'

import { useContractQuery, AS_PUBLIC } from '../../websocket/queryStream'

type Props = {
    onLogout: () => void;
    sideNav: React.ReactElement;
}

const BrokerCustomers: React.FC<Props> = ({ onLogout, sideNav }) => {
    const [ showAddCustomerModal, setShowAddCustomerModal ] = useState<boolean>(false)
    const investorMap = useRegistryLookup().investorMap;

    const allRegisteredInvestors = useContractQuery(RegisteredInvestor, AS_PUBLIC);
    const allBrokerCustomers = useContractQuery(BrokerCustomer);

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useOperator();

    const rows = allBrokerCustomers.map(customer => {
        const brokerCustomer = customer.contractData.brokerCustomer;
        const name = investorMap.get(brokerCustomer)?.name || brokerCustomer;
        return [name, 'hi']
    });

    const currentInvitations = useContractQuery(BrokerCustomerInvitation);
    const brokerCustomers = useContractQuery(BrokerCustomer);

    const customerOptions = allRegisteredInvestors.filter(ri =>
        !brokerCustomers.find(bc => bc.contractData.brokerCustomer === ri.contractData.investor) &&
        !currentInvitations.find(bci => bci.contractData.brokerCustomer === ri.contractData.investor))
        .map(c => {
            return {
                text: `${c.contractData.name}`,
                value: c.contractData.investor
            }
        });

    const handleBrokerCustomerInviteSubmit = async (party: string) => {
        const choice = Broker.Broker_InviteCustomer;
        const key = wrapDamlTuple([operator, exchange]);
        const args = { brokerCustomer: party};

        await ledger.exerciseByKey(choice, key, args);
    }

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><UserIcon size='24'/> Customers</>}
            onLogout={onLogout}
        >
            <PageSection>
                <div className='broker-customers'>
                    <div className='title'>
                        <Header as='h2'>Customers</Header>
                        <a className='a2' onClick={() => setShowAddCustomerModal(true)}>
                        <AddPlusIcon/> <a>Add Investor</a>

                        </a>
                    </div>
                        <StripedTable rows={rows} headings={['Name', '']}/>
                        {showAddCustomerModal &&
                        <AddRegisteredPartyModal
                                title='Add Investor'
                                partyOptions={customerOptions}
                                onRequestClose={() => setShowAddCustomerModal(false)}
                                multiple={false}
                                emptyMessage='All registered investors have been added'
                                onSubmit={handleBrokerCustomerInviteSubmit}/>}
                </div>
            </PageSection>
        </Page>
    )
}

export default BrokerCustomers;
