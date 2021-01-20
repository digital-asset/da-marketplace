import React from 'react'
import { useParams } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

import { useStreamQueries } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { makeContractInfo } from '../common/damlTypes'
import Page from '../common/Page'
import PageSection from '../common/PageSection'
import CapTable from '../common/CapTable';
import { depositSummary } from '../common/utils';

import CreateDeposit from './CreateDeposit';

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
    clients: string[];
}

const ClientHoldings: React.FC<Props> = ({ sideNav, onLogout }) => {
    const { investorId } = useParams<{investorId: string}>()

    const allDeposits = useStreamQueries(AssetDeposit, () => [], [], (e) => {
        console.log("Unexpected close from assetDeposit: ", e);
    }).contracts.map(makeContractInfo);

    const deposits = allDeposits.filter(deposit => deposit.contractData.account.owner === investorId)

    const tableRows = depositSummary(deposits).map(d =>  [d.split(':')[0], d.split(':')[1]]);

    const investor = useStreamQueryAsPublic(RegisteredInvestor)
        .contracts.map(makeContractInfo)
        .find(i => i.contractData.investor == investorId)

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<Header as='h3'>{investor?.contractData.name}</Header>}
            onLogout={onLogout}>
            <PageSection className='clients'>
                <div className='client-list'>
                    <Header as='h3'>Client Holdings</Header>
                    <CapTable
                        headings={['Asset', 'Amount']}
                        rows={tableRows}/>
                </div>
                <CreateDeposit currentBeneficiary={investor}/>
            </PageSection>
        </Page>
    )
}

export default ClientHoldings;
