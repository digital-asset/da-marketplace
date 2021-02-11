import React from 'react'
import { Header, Divider } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { useContractQuery } from '../../websocket/queryStream'

import { depositSummary } from '../common/utils'
import Page from '../common/Page'
import PageSection from '../common/PageSection'
import StripedTable from '../common/StripedTable'

import MarginCall from './MarginCall'
import {CCPCustomer} from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterpartyCustomer'
import {useCCPCustomerNotifications} from './CCPCustomerNotifications'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
    clients: {
        party: string;
        label: string;
    }[];
}

const ClientAccounts: React.FC<Props> = ({ sideNav, onLogout, clients }) => {
    const { investorId } = useParams<{investorId: string}>()

    const notifications = useCCPCustomerNotifications();

    const ccpCustomers = useContractQuery(CCPCustomer);
    const allDeposits = useContractQuery(AssetDeposit);

    const currentCCPCustomers = ccpCustomers.filter(ccpCustomer => ccpCustomer.contractData.ccpCustomer === investorId)
    const marginDepositCids = currentCCPCustomers
        .flatMap(ccpCustomer => {
            return ccpCustomer.contractData.marginDepositCids
        });

    const allCustomerDeposits = allDeposits.filter(deposit => deposit.contractData.account.owner === investorId)
    const marginDeposits = allCustomerDeposits.
            filter(deposit => marginDepositCids.includes(deposit.contractId));
    const clearingDeposits = allCustomerDeposits.filter(cd => !marginDepositCids.includes(cd.contractId));

    const clearingRows = depositSummary(clearingDeposits).map(d =>  [d.split(':')[0], d.split(':')[1]]);
    const marginRows = depositSummary(marginDeposits).map(d =>  [d.split(':')[0], d.split(':')[1]]);

    const client = clients.find(i => i.party == investorId)

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<Header as='h1'>{client?.label.substring(0, client.label.lastIndexOf('|'))}</Header>}
            onLogout={onLogout}>
            <PageSection className='clients'>
                <div className='client-list'>
                    {notifications.length > 0 && <Header as='h2'>Notifications</Header>}
                    {notifications}
                    <Header as='h2'>Clearing Accounts</Header>
                    <StripedTable
                        headings={['Asset', 'Amount']}
                        rows={clearingRows}/>
                    <Divider/>
                    <Header as='h3'>Margin Accounts</Header>
                    <StripedTable
                        headings={['Asset', 'Amount']}
                        rows={marginRows}/>
                </div>
                <MarginCall/>
            </PageSection>
        </Page>
    )
}

export default ClientAccounts;
