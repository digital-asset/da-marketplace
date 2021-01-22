import React from 'react'
import { Header } from 'semantic-ui-react'

import { useStreamQueries } from '@daml/react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { useStreamQueryAsPublic } from '@daml/dabl-react'

import { UserIcon } from '../../icons/Icons'
import { makeContractInfo } from '../common/damlTypes'
import { depositSummary } from '../common/utils'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import CapTable from '../common/CapTable';

import CreateDeposit from './CreateDeposit'
import { useContractQuery } from '../../websocket/queryStream'

type Props = {
    clients: string[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Clients: React.FC<Props> = ({ clients, sideNav, onLogout }) => {
    const investors = useStreamQueryAsPublic(RegisteredInvestor).contracts.filter(c => clients.includes(c.payload.investor))

    const allDeposits = useContractQuery(AssetDeposit);

    const tableHeadings = ['Name', 'Holdings']

    const tableRows = clients.map(client => {
            const clientName = investors.find(i => i.payload.investor === client)?.payload.name || client
            const deposits = allDeposits.filter(deposit => deposit.contractData.account.owner === client)
            return [clientName, depositSummary(deposits).join(',')]
        }
    );

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon size='24'/> Clients</>}
        >
            <PageSection>
                <div className='clients'>
                    <div className='client-list'>
                        <Header as='h3'>Clients</Header>
                        <CapTable
                            headings={tableHeadings}
                            rows={tableRows}
                            emptyLabel='There are no client relationships.'/>
                    </div>
                    <CreateDeposit/>
                </div>
            </PageSection>
        </Page>
    )
}

export default Clients;
