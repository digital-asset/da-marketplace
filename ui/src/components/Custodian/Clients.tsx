import React from 'react'
import { Header } from 'semantic-ui-react'

import { useStreamQueries } from '@daml/react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { UserIcon } from '../../icons/Icons'
import { DepositInfo, makeContractInfo } from '../common/damlTypes'
import { depositSummary } from '../common/utils'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import CapTable from '../common/CapTable';

import CreateDeposit from './CreateDeposit'

type Props = {
    clients: string[];
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Clients: React.FC<Props> = ({ clients, sideNav, onLogout }) => {
    const allDeposits = useStreamQueries(AssetDeposit, () => [], [], (e) => {
        console.log("Unexpected close from assetDeposit: ", e);
    }).contracts.map(makeContractInfo);

    const tableHeadings = ['Name', 'Holdings']

    const tableRows = clients.map(client => {
            const deposits = allDeposits.filter(deposit => deposit.contractData.account.owner === client)
            const depositSummaryList = depositSummary(deposits).join(',')
            return [client, depositSummaryList]
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
                    <div className='client-holdings'>
                        <div className='heading'>
                            <Header as='h3'>Client Holdings</Header>
                        </div>
                        <CapTable
                            headings={tableHeadings}
                            rows={tableRows}
                            emptyLabel='none'/>
                    </div>
                    <CreateDeposit/>

                </div>
            </PageSection>
        </Page>
    )
}

type RowProps = {
    investor: string;
    deposits: DepositInfo[];
}


export default Clients;
