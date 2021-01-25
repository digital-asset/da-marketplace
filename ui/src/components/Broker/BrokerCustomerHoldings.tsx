import React from 'react'
import { useParams } from 'react-router-dom'

import { Header } from 'semantic-ui-react'


import { UserIcon } from '../../icons/Icons'

import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'

import PageSection from '../common/PageSection'
import Page from '../common/Page'

import { useContractQuery, AS_PUBLIC } from '../../websocket/queryStream'

type Props = {
    onLogout: () => void;
    sideNav: React.ReactElement;
}

const BrokerCustomers: React.FC<Props> = ({ onLogout, sideNav }) => {
    const { customerId } = useParams<{customerId: string}>()

    const customer = useContractQuery(BrokerCustomer).find(c => c.contractId === customerId);

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><UserIcon size='24'/> {customer?.contractData.brokerCustomer}</>}
            onLogout={onLogout}
        >
            <PageSection>
                <div className='broker-customer-holdings'>
                    <div className='title'>
                        <Header as='h2'>{customer?.contractData.brokerCustomer}</Header>
                        {/* <a className='a2' onClick={() => setShowAddCustomerModal(true)}>
                            <AddPlusIcon/> <a>Add Customer</a>
                        </a> */}
                    </div>
                        {/* <StripedTable rows={rows} headings={['Name', 'Holdings']}/> */}
                        {/* {showAddCustomerModal &&
                            <AddRegisteredPartyModal
                                    title='Add Investor'
                                    partyOptions={customerOptions}
                                    onRequestClose={() => setShowAddCustomerModal(false)}
                                    multiple={false}
                                    emptyMessage='All registered investors have been added'
                                    onSubmit={handleBrokerCustomerInviteSubmit}/>} */}
                </div>
            </PageSection>
        </Page>
    )
}

export default BrokerCustomers;
