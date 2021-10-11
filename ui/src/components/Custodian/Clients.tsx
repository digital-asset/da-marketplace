import React from 'react'
import { Header } from 'semantic-ui-react'

import { UserIcon } from '../../icons/Icons'

import { depositSummary, useAvailableDeposits } from '../common/utils'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import CreateDeposit from './CreateDeposit'

type Props = {
    clients: {
        party: any;
        label: string;
    }[];
    sideNav: React.ReactElement;
    onLogout: () => void;
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}

const Clients: React.FC<Props> = ({ clients, sideNav, onLogout, showNotificationAlert, handleNotificationAlert }) => {
    const allDeposits = useAvailableDeposits();

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
            showNotificationAlert={showNotificationAlert}
            handleNotificationAlert={handleNotificationAlert}
        >
            <PageSection>
                <div className='clients'>
                    <div className='client-list'>
                        <Header as='h2'>Clients</Header>
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
