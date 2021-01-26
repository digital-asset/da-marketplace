import React from 'react'
import { useParams } from 'react-router-dom'

import { Header } from 'semantic-ui-react'

import {
    BrokerTrade,
    SettledTradeSide
} from '@daml.js/da-marketplace/lib/Marketplace/Trading'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { UserIcon } from '../../icons/Icons'

import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { BrokerTradeCard } from '../common/BrokerTradeCard'
import { TradeCard } from '../common/TradeCard'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import DonutChart, { getDonutChartColor, IDonutChartData } from '../common/DonutChart'
import { depositSummary } from '../common/utils'

import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import TabViewer from '../common/TabViewer';

type Props = {
    onLogout: () => void;
    sideNav: React.ReactElement;
}

const BrokerCustomers: React.FC<Props> = ({ onLogout, sideNav }) => {
    const { customerId } = useParams<{customerId: string}>()
    const allDeposits = useContractQuery(AssetDeposit, AS_PUBLIC);
    console.log(allDeposits)
    const customer = useContractQuery(BrokerCustomer).find(c => c.contractId === customerId);

    if (!customer) {
        return null
    }

    const tabItems = [
        { name: 'Order History', content: <OrderHistory customer={customer.contractData.brokerCustomer}/> },
        { name: 'Allocations', content: <AllocationsChart customer={customer.contractData.brokerCustomer}/>  }
    ]

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><UserIcon size='24'/> {customer?.contractData.brokerCustomer}</>}
            onLogout={onLogout}
        >
            <PageSection>
                <div className='broker-customer-holdings'>
                    <TabViewer tabs={tabItems}/>
                </div>
            </PageSection>
        </Page>
    )
}

const OrderHistory = (props: { customer: string }) => {
    const allExchangeTrades = useContractQuery(SettledTradeSide, AS_PUBLIC).filter(t => t.contractData.exchParticipant === props.customer);
    const allBrokerTrades = useContractQuery(BrokerTrade, AS_PUBLIC).filter(t => t.contractData.brokerCustomer === props.customer);

    return (
        <div className='order-history'>
            <div className='order-section'>
            <Header as='h2' className='dark'>Exchange Trades</Header>
                {allExchangeTrades.length > 0 ?
                    allExchangeTrades.map(t => <TradeCard key={t.contractId} trade={t.contractData}/>)
                    :
                    <i>none</i>
                }
            </div>
            <div className='order-section'>
                <Header as='h2' className='dark'>Broker Trades</Header>
                {allBrokerTrades.length > 0 ?
                    allBrokerTrades.map(t => <BrokerTradeCard key={t.contractId} brokerTrade={t.contractData}/>)
                    :
                    <i>none</i>
                }
            </div>
        </div>
    )
}

const AllocationsChart = (props: { customer: string }) => {
    const allDeposits = useContractQuery(AssetDeposit, AS_PUBLIC);

    const deposits = allDeposits.filter(deposit => deposit.contractData.account.owner === props.customer)

    const tokenDepositSummary =  depositSummary(deposits)

    return (
        <div className='allocations'>
            <DonutChart data={formatDepositSummary(tokenDepositSummary)}/>
        </div>
    )

    function formatDepositSummary(tokens: string[]): IDonutChartData[] {
        return tokens.map(t => {
            return {
                title: t.split(':')[0],
                value: +t.split(':')[1],
                color: getDonutChartColor(tokens.indexOf(t))
            }
        })
    }
}

export default BrokerCustomers;
