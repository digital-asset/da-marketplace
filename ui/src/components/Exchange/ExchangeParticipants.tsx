import React from 'react'

import { useStreamQueries } from '@daml/react'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'
import { Order } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { UserIcon } from '../../icons/Icons'
import { makeContractInfo } from '../common/damlTypes'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import { depositSummary } from '../common/utils'
import StripedTable from '../common/StripedTable'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const ExchangeParticipants: React.FC<Props> = ({ sideNav, onLogout }) => {
    const allDeposits = useStreamQueries(AssetDeposit, () => [], [], (e) => {
        console.log("Unexpected close from assetDeposit: ", e);
    }).contracts.map(makeContractInfo);
    const exchangeParticipants = useStreamQueries(ExchangeParticipant, () => [], [], (e) => {
        console.log("Unexpected close from exchangeParticipant: ", e);
    }).contracts.map(makeContractInfo);
    const activeOrders = useStreamQueries(Order, () => [], [], (e) => {
        console.log("Unexpected close from Order: ", e);
    }).contracts.map(makeContractInfo);

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
