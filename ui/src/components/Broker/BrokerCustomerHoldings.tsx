import React from 'react'
import { useParams } from 'react-router-dom'

import { Header, Table } from 'semantic-ui-react'

import {
    BrokerTrade,
    SettledTradeSide
} from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { UserIcon } from '../../icons/Icons'

import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { BrokerTradeCard } from '../common/BrokerTradeCard'
import { TradeCard } from '../common/TradeCard'
import PageSection from '../common/PageSection'
import Page from '../common/Page'
import DonutChart, { getDonutChartColor, IDonutChartData } from '../common/DonutChart'
import { depositSummary } from '../common/utils'
import { DepositInfo, unwrapDamlTuple, wrapDamlTuple } from '../common/damlTypes'

import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import TabViewer from '../common/TabViewer';

type Props = {
    onLogout: () => void;
    sideNav: React.ReactElement;
    deposits: DepositInfo[];
}

const BrokerCustomers: React.FC<Props> = ({ onLogout, sideNav, deposits }) => {
    const { customerId } = useParams<{customerId: string}>()
    const customer = useContractQuery(BrokerCustomer).find(c => c.contractId === customerId);

    if (!customer) {
        return null
    }

    const customerDeposits = deposits.filter(d => d.contractData.account.owner === customer.contractData.brokerCustomer)

    const tabItems = [
        { name: 'Order History', content: <OrderHistory customer={customer.contractData.brokerCustomer}/> },
        { name: 'Allocations', content: <AllocationsChart deposits={customerDeposits}/>  }
    ]

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><UserIcon size='24'/> {customer?.contractData.brokerCustomer}</>}
            onLogout={onLogout}
        >
            <PageSection className='broker-customer-holdings'>
                <TabViewer tabs={tabItems}/>
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

const AllocationsChart = (props: { deposits: DepositInfo[] }) => {
    const tokenDepositSummary = depositSummary(props.deposits)

    return (
        <div className='allocations'>
            <DonutChart data={formatDepositSummary(tokenDepositSummary)}/>
            <Table className='allocation-table'>
                <Table.Body>
                    {tokenDepositSummary.map(d =>
                        <Table.Row>
                            <Table.Cell textAlign='left'>
                                <Header as='h3'>{d.split(':')[0]}</Header>
                            </Table.Cell>
                            <Table.Cell textAlign='right'>
                                <Header as='h3' className='bold'>{d.split(':')[1]}</Header>
                            </Table.Cell>
                        </Table.Row>)}
                </Table.Body>
            </Table>
        </div>
    )

    function formatDepositSummary(deposits: string[]): IDonutChartData[] {
        return deposits.map(d => {
            return {
                title: d.split(':')[0],
                value: +d.split(':')[1],
                color: getDonutChartColor(deposits.indexOf(d))
            }
        })
    }
}

export default BrokerCustomers;
