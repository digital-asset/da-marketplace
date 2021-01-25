import React from 'react'
import { Header } from 'semantic-ui-react'

import { useStreamQueries } from '@daml/react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { UserIcon } from '../../icons/Icons'
import { makeContractInfo } from '../common/damlTypes'
import { depositSummary } from '../common/utils'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import StripedTable from '../common/StripedTable';

import CreateDeposit from './CreateDeposit'

type Props = {
    clients: {
        party: any;
        label: string;
    }[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Clients: React.FC<Props> = ({ clients, sideNav, onLogout }) => {
    const allDeposits = useStreamQueries(AssetDeposit, () => [], [], (e) => {
        console.log("Unexpected close from assetDeposit: ", e);
    }).contracts.map(makeContractInfo);

    const tableHeadings = ['Name', 'Holdings']

    const tableRows = clients.map(client => {
            const clientName = client.label
            const deposits = allDeposits.filter(deposit => deposit.contractData.account.owner === client.party)
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
                        <StripedTable
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
