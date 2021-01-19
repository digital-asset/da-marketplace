import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Header, Table, List, Button } from 'semantic-ui-react'

import { useStreamQueries } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { GlobeIcon, LockIcon, IconChevronDown, IconChevronUp, AddPlusIcon } from '../../icons/Icons'

import { makeContractInfo, damlTupleToString } from '../common/damlTypes'
import Page from '../common/Page'
import PageSection from '../common/PageSection'
import CapTable from '../common/CapTable';
import DonutChart, { getDonutChartColor, IDonutChartData } from '../common/DonutChart'
import { depositSummary } from '../common/utils';
import { useRegistryLookup } from '../common/RegistryLookup'

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

    const investor = useStreamQueryAsPublic(RegisteredInvestor).contracts.find(i => i.payload.investor == investorId)

    const capTableHeaders = ['Asset', 'Amount']

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<Header as='h3'>{investor?.payload.name}</Header>}
            onLogout={onLogout}>
            <PageSection className='issued-token'>
                <Header as='h3'>Client Holdings</Header>
                <div className='position-holdings-data'>
                    <CapTable
                            headings={capTableHeaders}
                            rows={capTableRows}
                            emptyLabel='There are no position holdings for this token'/>
                </div>
            </PageSection>
        </Page>
    )
}

export default ClientHoldings;
