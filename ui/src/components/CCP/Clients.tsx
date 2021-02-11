import React from 'react'
import { Header } from 'semantic-ui-react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { UserIcon } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import { depositSummary } from '../common/utils'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import MarginCall from './MarginCall'
import {CCPCustomer} from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterpartyCustomer'
import {CCPCustomerInfo} from '../common/damlTypes'

type Props = {
    clients: {
        party: any;
        label: string;
    }[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Clients: React.FC<Props> = ({ clients, sideNav, onLogout }) => {
    const allDeposits = useContractQuery(AssetDeposit);

    const tableHeadings = ['Name', 'In Good Standing', 'Clearing Account', 'Margin Account']
    const ccpCustomers = useContractQuery(CCPCustomer);

    const tableRows = clients.map(client => {
        const currentCCPCustomers = ccpCustomers.filter(ccpCustomer => ccpCustomer.contractData.ccpCustomer === client.party)
        const marginDepositCids = currentCCPCustomers
            .flatMap(ccpCustomer => {
                return ccpCustomer.contractData.marginDepositCids
            });
        const customerName = client.label
        const allCustomerDeposits = allDeposits.filter(deposit => deposit.contractData.account.owner === client.party)
        const marginDeposits = allCustomerDeposits.
                filter(deposit => marginDepositCids.includes(deposit.contractId));
        const clearingDeposits = allCustomerDeposits.filter(cd => !marginDepositCids.includes(cd.contractId));
        const inGoodStanding = currentCCPCustomers[0].contractData.inGoodStanding ? "Yes" : "No";
        return [customerName, inGoodStanding, depositSummary(clearingDeposits).join(','), depositSummary(marginDeposits).join(',')]
    });

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon size='24'/> Clients</>}
        >
            <PageSection>
                <div className='clients'>
                    <div className='client-list'>
                        <Header as='h2'>Clients</Header>
                        <StripedTable
                            headings={tableHeadings}
                            rows={tableRows}
                            emptyLabel='There are no customers.'/>
                    </div>
                    <MarginCall/>
                </div>
            </PageSection>
        </Page>
    )
}

export default Clients;
