import React, { useState } from 'react'
import { Button, Card, Form, Header } from 'semantic-ui-react'

import { useLedger, useStreamQuery } from '@daml/react'
import { Order, BrokerOrderRequest, BrokerOrder } from '@daml.js/da-marketplace/lib/Marketplace/Trading'

import { ExchangeIcon, OrdersIcon } from '../../icons/Icons'
import { unwrapDamlTuple, wrapDamlTuple } from '../common/damlTypes'
import { parseError, ErrorMessage } from '../common/errorTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import Page from '../common/Page'
import { ContractId } from '@daml/types'

import './BrokerOrders.css'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const BrokerOrders: React.FC<Props> = ({ sideNav, onLogout }) => {
    const allExchangeOrders = useStreamQuery(Order).contracts;
    const allBrokerOrderRequests = useStreamQuery(BrokerOrderRequest).contracts;
    const allBrokerOrders = useStreamQuery(BrokerOrder).contracts;

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><OrdersIcon/>Orders</>}
            onLogout={onLogout}
        >
            <div className='customer-orders'>
                <Header as='h4'>Requested Customer Orders</Header>
                { allBrokerOrderRequests.map(or => <BrokerOrderRequestCard key={or.contractId} cid={or.contractId} cdata={or.payload}/>)}

                <Header as='h4'>Open Customer Orders</Header>
                { allBrokerOrders.map(o => <BrokerOrderCard key={o.contractId} cdata={o.payload}/>)}

                <Header as='h4'>Exchange Orders</Header>
                { allExchangeOrders.map(o => <OpenOrderCard key={o.contractId} order={o.payload}/>)}

            </div>
        </Page>
    )
}

type BrokerOrderCardProps = {
    cdata: BrokerOrder;
};

const BrokerOrderCard: React.FC<BrokerOrderCardProps> = (props) => {
    const [ loading, setLoading ] = useState(false);
    const base = unwrapDamlTuple(props.cdata.pair)[0].label;
    const quote = unwrapDamlTuple(props.cdata.pair)[1].label;
    const label = props.cdata.isBid ? `Buy ${base}/${quote}` : `Sell ${base}/${quote}`;
    const amount = props.cdata.isBid ? `+ ${props.cdata.qty} ${base}` : `- ${props.cdata.qty} ${base}`;
    const price = `${props.cdata.price} ${quote}`;

    const customer = props.cdata.brokerCustomer;

    const [ depositCid, setDepositCid ] = useState<string>('');
    const [ error, setError ] = useState<ErrorMessage>();
    const ledger = useLedger();

    const handleAcceptBrokerOrderFill = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            const key = wrapDamlTuple([props.cdata.broker, props.cdata.brokerOrderId])
            const args = {
                depositCid
            }
            await ledger.exerciseByKey(BrokerOrder.BrokerOrder_Fill, key, args);
        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    return (
        <FormErrorHandled
            className='order-card-container'
            error={error}
            clearError={() => setError(undefined)}
        >
        <div className='order-card-container'>
            <div className='order-card'>
                <Card fluid className='order-info'>
                    <div><ExchangeIcon/> {label}</div>
                    <div>{ amount }</div>
                    <div>{`@ ${price}`}</div>
                    <div>{`customer: ${customer}`}</div>
                    <div>{`id: ${props.cdata.brokerOrderId}`}</div>
                </Card>

                <Form.Input
                    className='orderid-input'
                    placeholder='depositCid'
                    value={depositCid}
                    onChange={e => setDepositCid(e.currentTarget.value)}
                />
                <Button
                    basic
                    color='black'
                    content='Fill Order'
                    loading={loading}
                    onClick={handleAcceptBrokerOrderFill}
                />
            </div>
        </div>
        </FormErrorHandled>
    )
};

type BrokerOrderRequestCardProps = {
    cid: ContractId<BrokerOrderRequest>;
    cdata: BrokerOrderRequest;
};


const BrokerOrderRequestCard: React.FC<BrokerOrderRequestCardProps> = ({children, ...props}) => {
    const [ loading, setLoading ] = useState(false);
    const base = unwrapDamlTuple(props.cdata.pair)[0].label;
    const quote = unwrapDamlTuple(props.cdata.pair)[1].label;
    const label = props.cdata.isBid ? `Buy ${base}/${quote}` : `Sell ${base}/${quote}`;
    const amount = props.cdata.isBid ? `+ ${props.cdata.qty} ${base}` : `- ${props.cdata.qty} ${base}`;
    const customer = props.cdata.brokerCustomer;
    const depositCid = props.cdata.depositCid;
    const price = `${props.cdata.price} ${quote}`;
    const [ brokerOrderId, setBrokerOrderId ] = useState<string>('');
    const [ error, setError ] = useState<ErrorMessage>();
    const ledger = useLedger();

    const handleAcceptBrokerOrderRequest = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            const args = {
                brokerOrderId
            }
            await ledger.exercise(BrokerOrderRequest.BrokerOrderRequest_Accept, props.cid, args)
        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    return (
        <FormErrorHandled
            className='order-card-container'
            error={error}
            clearError={() => setError(undefined)}
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
                    loading={loading}
                    onClick={handleAcceptBrokerOrderRequest}
                />
            </div>
        </div>
        </FormErrorHandled>
    )
}



type OrderProps = {
    order: Order;
}

const OrderCard: React.FC<OrderProps> = ({ children, order }) => {
    const base = unwrapDamlTuple(order.pair)[0].label;
    const label = order.isBid ? `Buy ${base}` : `Sell ${base}`;
    const amount = order.isBid ? `+ ${order.qty} ${base}` : `- ${order.qty} ${base}`;

    return (
        <div className='order-card-container'>
            <div className='order-card'>
                <Card fluid className='order-info'>
                    <div><ExchangeIcon/> {label}</div>
                    <div>{ amount }</div>
                </Card>

                { children }
            </div>
        </div>
    )
}

const OpenOrderCard: React.FC<OrderProps> = ({ order }) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();
    const ledger = useLedger();

    const handleCancelOrder = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            const key = wrapDamlTuple([order.exchange, order.orderId])
            await ledger.exerciseByKey(Order.Order_RequestCancel, key, {});
        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    return (
        <FormErrorHandled
            className='order-card-container'
            error={error}
            clearError={() => setError(undefined)}
        >
            <OrderCard order={order}>
                <Button
                    basic
                    color='black'
                    content='Cancel'
                    className='basic-button-fill'
                    loading={loading}
                    onClick={handleCancelOrder}/>
            </OrderCard>
        </FormErrorHandled>
    )
}

export default BrokerOrders;
