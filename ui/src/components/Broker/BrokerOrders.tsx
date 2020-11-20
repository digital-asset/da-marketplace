import React, { useState } from 'react'
import { Button, Card, Form, Header } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQueries } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'
import { Order, BrokerOrderRequest, BrokerOrder } from '@daml.js/da-marketplace/lib/Marketplace/Trading'
import { BrokerCustomer } from '@daml.js/da-marketplace/lib/Marketplace/BrokerCustomer'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { ContractId } from '@daml/types'

import { ExchangeIcon, OrdersIcon } from '../../icons/Icons'
import { DepositInfo, unwrapDamlTuple, wrapDamlTuple, makeContractInfo } from '../common/damlTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import ExchangeOrderCard from '../common/ExchangeOrderCard'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

import BrokerCustomers from './BrokerCustomers'

import './BrokerOrders.css'


type Props = {
    sideNav: React.ReactElement;
    deposits: DepositInfo[];
    onLogout: () => void;
};


const BrokerOrders: React.FC<Props> = ({ sideNav, deposits, onLogout }) => {
    const allExchangeOrders = useStreamQueries(Order, () => [], [], (e) => {
        console.log("Unexpected close from order: ", e);
    }).contracts;
    const allBrokerOrderRequests = useStreamQueries(BrokerOrderRequest, () => [], [], (e) => {
        console.log("Unexpected close from brokerOrderRequest: ", e);
    }).contracts;
    const allBrokerOrders = useStreamQueries(BrokerOrder, () => [], [], (e) => {
        console.log("Unexpected close from brokerOrder: ", e);
    }).contracts;

    const allBrokerCustomers = useStreamQueries(BrokerCustomer, () => [], [], (e) => {
        console.log("Unexpected close from brokerCustomer: ", e);
    }).contracts.map(makeContractInfo);
    const allRegisteredInvestors = useStreamQueryAsPublic(RegisteredInvestor).contracts.map(makeContractInfo);

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><OrdersIcon/>Orders</>}
            onLogout={onLogout}
        >
            <PageSection border='blue' background='white'>
                <div className='customers'>
                    <BrokerCustomers brokerCustomers={allBrokerCustomers}
                                     registeredInvestors={allRegisteredInvestors}/>
                </div>
                <Header as='h4'>Orders</Header>
                <div className='customer-orders'>
                    <p>Requested Customer Orders</p>
                    { allBrokerOrderRequests.map(or => <BrokerOrderRequestCard key={or.contractId} cid={or.contractId} cdata={or.payload}/>)}

                    <p>Open Customer Orders</p>
                    { allBrokerOrders.map(o => <BrokerOrderCard key={o.contractId} cdata={o.payload} deposits={deposits}/>)}

                    <p>Exchange Orders</p>
                    { allExchangeOrders.map(o => <ExchangeOrderCard key={o.contractId} order={o.payload}/>)}
                </div>
            </PageSection>
        </Page>
    )
};


// Broker Order Request
type BrokerOrderRequestCardProps = {
    cid: ContractId<BrokerOrderRequest>;
    cdata: BrokerOrderRequest;
};


const BrokerOrderRequestCard: React.FC<BrokerOrderRequestCardProps> = ({children, ...props}) => {
    const [ brokerOrderId, setBrokerOrderId ] = useState<string>('');
    const ledger = useLedger();

    const [ base, quote ] = unwrapDamlTuple(props.cdata.pair).map(t => t.label);
    const label = props.cdata.isBid ? `Buy ${base}/${quote}` : `Sell ${base}/${quote}`;
    const amount = props.cdata.isBid ? `+ ${props.cdata.qty} ${base}` : `- ${props.cdata.qty} ${base}`;
    const customer = props.cdata.brokerCustomer;
    const depositCid = props.cdata.depositCid;
    const price = `${props.cdata.price} ${quote}`;

    const handleAcceptBrokerOrderRequest = async () => {
        const args = { brokerOrderId };
        await ledger.exercise(BrokerOrderRequest.BrokerOrderRequest_Accept, props.cid, args);

        setBrokerOrderId('');
    }

    return (
        <FormErrorHandled
            className='order-card-container'
            onSubmit={handleAcceptBrokerOrderRequest}
        >
            <div className='order-card-container'>
                <div className='order-card'>
                    <Card fluid className='order-info'>
                        <div><ExchangeIcon/> {label}</div>
                        <div>{ amount }</div>
                        <div>{`@ ${price}`}</div>
                        <div>{`customer: ${customer}`}</div>
                        <div>{`deposit: ${depositCid.substr(depositCid.length - 8)}`}</div>
                    </Card>

                    <Form.Group>
                        <Form.Input
                            className='orderid-input'
                            placeholder='id'
                            value={brokerOrderId}
                            onChange={e => setBrokerOrderId(e.currentTarget.value)}
                        />
                        <Button
                            basic
                            color='black'
                            content='Accept Order'
                        />
                    </Form.Group>
                </div>
            </div>
        </FormErrorHandled>
    )
};


// Broker Order
type BrokerOrderCardProps = {
    cdata: BrokerOrder;
    deposits: DepositInfo[];
};


const BrokerOrderCard: React.FC<BrokerOrderCardProps> = (props) => {
    const [ depositCid, setDepositCid ] = useState<string>('');
    const broker = useParty();
    const ledger = useLedger();

    const [ base, quote ] = unwrapDamlTuple(props.cdata.pair).map(t => t.label);
    const label = props.cdata.isBid ? `Buy ${base}/${quote}` : `Sell ${base}/${quote}`;
    const amount = props.cdata.isBid ? `+ ${props.cdata.qty} ${base}` : `- ${props.cdata.qty} ${base}`;
    const price = `${props.cdata.price} ${quote}`;

    const customer = props.cdata.brokerCustomer;

    const options = props.deposits
    .filter(deposit => deposit.contractData.account.owner === broker)
    .map(deposit => ({
        key: deposit.contractId,
        value: deposit.contractId,
        text: `${deposit.contractData.asset.quantity} ${deposit.contractData.asset.id.label} | ${deposit.contractData.account.id.label}`
    }))

    const handleAcceptBrokerOrderFill = async () => {
        const key = wrapDamlTuple([props.cdata.broker, props.cdata.brokerOrderId])
        const args = { depositCid }
        await ledger.exerciseByKey(BrokerOrder.BrokerOrder_Fill, key, args);
        setDepositCid('');
    }

    const handleDepositChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setDepositCid(result.value);
        }
    }

    return (
        <FormErrorHandled
            className='order-card-container'
            onSubmit={handleAcceptBrokerOrderFill}
        >
            <div className='order-card-container'>
                <div className='order-card'>
                    <Card fluid className='order-info'>
                        <div><ExchangeIcon/> {label}</div>
                        <div>{ amount }</div>
                        <div>{`@ ${price}`}</div>
                        <div>{`customer: ${customer}`}</div>
                        <div>{`id: ${props.cdata.brokerOrderId}`}</div>
                        <div>{`deposit: ${depositCid.substr(depositCid.length - 8) || ''}`}</div>
                    </Card>

                    <Form.Group>
                        <Form.Select
                            required
                            label='Deposit'
                            options={options}
                            onChange={handleDepositChange}
                            value={depositCid}
                        />
                        <Button
                            basic
                            color='black'
                            content='Fill Order'
                        />
                    </Form.Group>
                </div>
            </div>
        </FormErrorHandled>
    )
};

export default BrokerOrders;
