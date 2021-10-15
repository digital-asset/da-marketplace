import React from 'react'
import { Header } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { useContractQuery } from '../../websocket/queryStream'

import { depositSummary } from '../common/utils'
import Page from '../common/Page'
import PageSection from '../common/PageSection'
import StripedTable from '../common/StripedTable'

import CreateDeposit from './CreateDeposit'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
    clients: {
        party: string;
        label: string;
    }[];
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}

const ClientHoldings: React.FC<Props> = ({ sideNav, onLogout, clients, showNotificationAlert, handleNotificationAlert }) => {
    const { investorId } = useParams<{investorId: string}>()

    const allDeposits = useContractQuery(AssetDeposit);

    const deposits = allDeposits.filter(deposit => deposit.contractData.account.owner === investorId)

    const tableRows = depositSummary(deposits).map(d =>  [d.split(':')[0], d.split(':')[1]]);

    const client = clients.find(i => i.party === investorId)

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<Header as='h1'>{client?.label.substring(0, client.label.lastIndexOf('|'))}</Header>}
            onLogout={onLogout}
            showNotificationAlert={showNotificationAlert}
            handleNotificationAlert={handleNotificationAlert}
        >
            <PageSection className='clients'>
                <div className='client-list'>
                    <Header as='h2'>Client Holdings</Header>
                    <StripedTable
                        headings={['Asset', 'Amount']}
                        rows={tableRows}/>
                </div>
                <CreateDeposit/>
            </PageSection>
        </Page>
    )
}

export default ClientHoldings;
