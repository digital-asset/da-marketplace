import React from 'react'

import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { UserIcon } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import { depositSummary } from '../common/utils'
import StripedTable from '../common/StripedTable'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const ExchangeParticipants: React.FC<Props> = ({ sideNav, onLogout }) => {
    const allDeposits = useContractQuery(AssetDeposit);
    const exchangeParticipants = useContractQuery(ExchangeParticipant);
    const activeOrders = useContractQuery(Order);

    const rows = exchangeParticipants.map(participant => {
        const { exchange, exchParticipant } = participant.contractData;

        const activeOrderCount = activeOrders.filter(o => o.contractData.exchange === exchange && o.contractData.exchParticipant === exchParticipant).length

        const investorDeposits = allDeposits.filter(deposit => deposit.contractData.account.owner === exchParticipant);

        return [exchParticipant, activeOrderCount.toString(), '-', depositSummary(investorDeposits).join(',') || '-']
    });

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><UserIcon size='24'/>Investors</>}
        >
            <PageSection>
                <div className='exchange-participants'>
                    <StripedTable
                        headings={['Id', 'Active Orders', 'Volume Traded (USD)', 'Amount Committed']}
                        rows={rows}/>
                </div>
            </PageSection>
        </Page>
    )
}

export default ExchangeParticipants;
