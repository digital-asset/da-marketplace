import React, { useState } from 'react'
import { Button, Card, Form, Header } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQuery } from '@daml/react'
import { Order, BrokerOrderRequest, BrokerOrder } from '@daml.js/da-marketplace/lib/Marketplace/Trading'
import { ContractId } from '@daml/types'

import { ExchangeIcon, OrdersIcon } from '../../icons/Icons'
import { DepositInfo, unwrapDamlTuple, wrapDamlTuple } from '../common/damlTypes'
import { parseError, ErrorMessage } from '../common/errorTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import ExchangeOrderCard from '../common/ExchangeOrderCard'
import PageSection from '../common/PageSection'
import Page from '../common/Page'


import './BrokerOrders.css'


type Props = {
    sideNav: React.ReactElement;
    deposits: DepositInfo[];
    onLogout: () => void;
};


const BrokerOrders: React.FC<Props> = ({ sideNav, deposits, onLogout }) => {
    const allExchangeOrders = useStreamQuery(Order).contracts;
    const allBrokerOrderRequests = useStreamQuery(BrokerOrderRequest).contracts;
    const allBrokerOrders = useStreamQuery(BrokerOrder).contracts;

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><OrdersIcon/>Orders</>}
            onLogout={onLogout}
        >
            <PageSection border='blue' background='white'>
                <div className='customer-orders'>
                    <Header as='h4'>Requested Customer Orders</Header>
                    { allBrokerOrderRequests.map(or => <BrokerOrderRequestCard key={or.contractId} cid={or.contractId} cdata={or.payload}/>)}

                    <Header as='h4'>Open Customer Orders</Header>
                    { allBrokerOrders.map(o => <BrokerOrderCard key={o.contractId} cdata={o.payload} deposits={deposits}/>)}

                    <Header as='h4'>Exchange Orders</Header>
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
    const [ loading, setLoading ] = useState(false);
    const [ base, quote ] = unwrapDamlTuple(props.cdata.pair).map(t => t.label);
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
                        loading={loading}
                        onClick={handleAcceptBrokerOrderRequest}
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
    const [ loading, setLoading ] = useState(false);
    const [ base, quote ] = unwrapDamlTuple(props.cdata.pair).map(t => t.label);
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

    const handleDepositChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setDepositCid(result.value);
        }
    }
    const broker = useParty();

    const options = props.deposits
    .filter(deposit => deposit.contractData.account.owner === broker)
    .map(deposit => ({
        key: deposit.contractId,
        value: deposit.contractId,
        text: `${deposit.contractData.asset.quantity} ${deposit.contractData.asset.id.label} | ${deposit.contractData.account.id.label}`
    }))

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
                            loading={loading}
                            onClick={handleAcceptBrokerOrderFill}
                        />
                    </Form.Group>
                </div>
            </div>
        </FormErrorHandled>
    )
};

export default BrokerOrders;
