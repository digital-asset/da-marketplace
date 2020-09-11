import React, { useState } from 'react'
import { Button, Form, Header, Message } from 'semantic-ui-react'

import { DepositInfo } from './Investor'

import './OrderForm.css'

type Props = {
    kind: 'bid' | 'offer';
    deposits: DepositInfo[];
    placeOrder: (depositCid: string, price: string) => void;
}

const OrderForm: React.FC<Props> = ({ kind, deposits, placeOrder }) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');
    const [ price, setPrice ] = useState('');
    const [ depositCid, setDepositCid ] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            await placeOrder(depositCid, price);
            setError('');
        } catch (err) {
            setError(err.errors.join('\n'));
        }
        setLoading(false);
        setPrice('');
        setDepositCid('');
    }

    const title = kind[0].toUpperCase() + kind.slice(1);

    const options = deposits
        .filter(deposit => deposit.contractData.asset.id.label)
        .map(deposit => ({
            key: deposit.contractId,
            value: deposit.contractId,
            text: `${deposit.contractData.asset.quantity} ${deposit.contractData.asset.id.label}`
        }))

    return (
        <Form className="order-form" loading={loading} error={error.length > 0} onSubmit={handleSubmit}>
            <Header>{title}</Header>
            <Form.Select
                required
                label='Deposit'
                options={options}
                onChange={(_, result) => {
                    if (typeof result.value === 'string') {
                        setDepositCid(result.value);
                    }
                }}
                value={depositCid}
            />

            <Form.Field required>
                <label>Price</label>
                <input
                    className='order-input'
                    value={price}
                    onChange={e => setPrice(e.target.value)}/>
            </Form.Field>

            <Message
                error
                header='DAML JSON API error'
                content={error}/>
            <Button disabled={!price || !depositCid}>{title}</Button>
        </Form>
    )
}

export default OrderForm;
