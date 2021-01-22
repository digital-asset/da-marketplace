import React from 'react'
import { Header } from 'semantic-ui-react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { UserIcon } from '../../icons/Icons'
import { useContractQuery, AS_PUBLIC } from '../../websocket/queryStream'

import { depositSummary } from '../common/utils'
import CapTable from '../common/CapTable'
import Page from '../common/Page'
import PageSection from '../common/PageSection'

import CreateDeposit from './CreateDeposit'

type Props = {
    clients: string[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Clients: React.FC<Props> = ({ clients, sideNav, onLogout }) => {
    const investors = useContractQuery(RegisteredInvestor, AS_PUBLIC)
        .filter(c => clients.includes(c.contractData.investor))

    const allDeposits = useContractQuery(AssetDeposit);

    const tableHeadings = ['Name', 'Holdings']

    const tableRows = clients.map(client => {
            const clientName = investors
                .find(i => i.contractData.investor === client)?.contractData.name || client

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
