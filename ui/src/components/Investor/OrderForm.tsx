import React, { useState } from 'react'
import { Button, Form, Header } from 'semantic-ui-react'

import { DepositInfo } from '../common/damlTypes'
import FormErrorHandled from '../common/FormErrorHandled'

import { OrderKind } from './InvestorTrade'

import './OrderForm.css'

type Props = {
    kind: OrderKind;
    deposits: DepositInfo[];
    placeOrder: (depositCid: string, price: string) => Promise<void>;
}

const OrderForm: React.FC<Props> = ({ kind, deposits, placeOrder }) => {
    const title = kind[0].toUpperCase() + kind.slice(1);

    const options = deposits
        .map(deposit => ({
            key: deposit.contractId,
            value: deposit.contractId,
            text: `${deposit.contractData.asset.quantity} ${deposit.contractData.asset.id.label}`
        }))

    const [ price, setPrice ] = useState('');
    const [ depositCid, setDepositCid ] = useState('');

    const handleDepositChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setDepositCid(result.value);
        }
    }

    const submit = async () => {
        await placeOrder(depositCid, price);
        setPrice('');
        setDepositCid('');
    };

    return (
        <FormErrorHandled onSubmit={submit}>
            <Header>{title}</Header>
            <Form.Select
                required
                label='Deposit'
                options={options}
                onChange={handleDepositChange}
                value={depositCid}
            />

            <Form.Field required>
                <label>Price</label>
                <input
                    className='order-input'
                    value={price}
                    onChange={e => setPrice(e.target.value)}/>
            </Form.Field>

            <Button disabled={!price || !depositCid}>{title}</Button>
        </FormErrorHandled>
    )
}

export default OrderForm;
