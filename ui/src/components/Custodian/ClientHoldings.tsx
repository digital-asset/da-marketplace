import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Table, List, Button, Icon } from 'semantic-ui-react'

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

    const capTableRows = depositSummary(deposits).map(d =>  [d.split(':')[0], d.split(':')[1]]);

    const investor = useStreamQueryAsPublic(RegisteredInvestor).contracts.map(makeContractInfo).find(i => i.contractData.investor == investorId)

    const capTableHeaders = ['Asset', 'Amount']

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<Header as='h3'>{investor?.contractData.name}</Header>}
            onLogout={onLogout}>
            <PageSection className='clients'>
                <div className='client-list'>
                    <Header as='h3'>Client Holdings</Header>
                    <CapTable
                        headings={capTableHeaders}
                        rows={capTableRows}
                        emptyLabel='There are no position holdings for this token'/>
                </div>
                <CreateDeposit currentBeneficiary={investor}/>
            </PageSection>
        </Page>
    )
}

export default ClientHoldings;
