import React from 'react'
import { Table } from 'semantic-ui-react'

import { useStreamQuery } from '@daml/react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { UserIcon } from '../../icons/Icons'
import { DepositInfo, makeContractInfo } from '../common/damlTypes'
import { depositSummary } from '../common/utils'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import CreateDeposit from './CreateDeposit'

type Props = {
    clients: string[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Clients: React.FC<Props> = ({ clients, sideNav, onLogout }) => {
    const allDeposits = useStreamQuery(AssetDeposit).contracts.map(makeContractInfo);

    const tableRows = clients.map(client => (
        <InvestorRow
            key={client}
            deposits={allDeposits.filter(deposit => deposit.contractData.account.owner === client)}
            investor={client}/>
    ));

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon/> Clients</>}
        >
            <PageSection border='blue' background='white'>
                <div className='custodian-clients'>
                    <CreateDeposit/>
                    <StripedTable
                        header={['Id', 'Holdings']}
                        rows={tableRows}/>
                </div>
            </PageSection>
        </Page>
    )
}

type RowProps = {
    investor: string;
    deposits: DepositInfo[];
}

const InvestorRow: React.FC<RowProps> = ({ deposits, investor }) => (
    <Table.Row>
        <Table.Cell>{investor}</Table.Cell>
        <Table.Cell>{depositSummary(deposits)}</Table.Cell>
    </Table.Row>
)


export default Clients;
