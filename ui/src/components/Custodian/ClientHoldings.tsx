import React from 'react'
import { useParams } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import { depositSummary } from '../common/utils'
import Page from '../common/Page'
import PageSection from '../common/PageSection'
import StripedTable from '../common/StripedTable'

import CreateDeposit from './CreateDeposit'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
    clients: string[];
}

const ClientHoldings: React.FC<Props> = ({ sideNav, onLogout }) => {
    const { investorId } = useParams<{investorId: string}>()

    const allDeposits = useContractQuery(AssetDeposit);

    const deposits = allDeposits.filter(deposit => deposit.contractData.account.owner === investorId)

    const tableRows = depositSummary(deposits).map(d =>  [d.split(':')[0], d.split(':')[1]]);

    const investor = useContractQuery(RegisteredInvestor, AS_PUBLIC)
        .find(i => i.contractData.investor === investorId)

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<Header as='h3'>{investor?.contractData.name}</Header>}
            onLogout={onLogout}>
            <PageSection className='clients'>
                <div className='client-list'>
                    <Header as='h3'>Client Holdings</Header>
                    <StripedTable
                        headings={['Asset', 'Amount']}
                        rows={tableRows}/>
                </div>
                <CreateDeposit currentBeneficiary={investor}/>
            </PageSection>
        </Page>
    )
}

export default ClientHoldings;
