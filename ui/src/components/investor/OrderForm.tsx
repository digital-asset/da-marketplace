import React, { useState } from 'react'
import { Button, Form, Header } from 'semantic-ui-react'

import { ContractInfo } from './Investor'

import './OrderForm.css'

type Props = {
    kind: 'bid' | 'offer';
    deposits: ContractInfo[];
    placeOrder: (unallocatedDepositCid: string, price: string) => void;
}

const OrderForm: React.FC<Props> = ({ kind, deposits, placeOrder }) => {
    const [ price, setPrice ] = useState("");
    const [ depositCid, setDepositCid ] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        placeOrder(depositCid, price);
    }

    const title = kind[0].toUpperCase() + kind.slice(1);
    // const buttonColor = kind === 'bid' ? "green" : "red";

    const options = deposits
        .filter(deposit => deposit.contractData.asset.id.label)
        .map(deposit => ({
            key: deposit.contractId,
            value: deposit.contractId,
            text: `${deposit.contractData.asset.quantity} ${deposit.contractData.asset.id.label}`
        }))

    return (
        <Form className="order-form" onSubmit={handleSubmit}>
            <Header>{title}</Header>
            <Form.Select
                label='Deposit'
                options={options}
                onChange={(_, result) => {
                    if (typeof result.value === 'string') {
                        setDepositCid(result.value);
                    }
                }}
                value={depositCid}
            />

            <Form.Field>
                <label>Price</label>
                <input
                    className="order-input"
                    value={price}
                    onChange={e => setPrice(e.target.value)}/>
            </Form.Field>

            {/* <Form.Field>
                <label>Amount</label>
                <input
                    className="order-input"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}/>
            </Form.Field>

            <Form.Field>
                <label>Total</label>
                <input
                    className="order-input"
                    value={total}
                    onChange={e => setTotal(e.target.value)}/>
            </Form.Field> */}
            <Button>{title}</Button>
        </Form>
    )
}

export default OrderForm;
