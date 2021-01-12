import React, { useState } from 'react'
import { Button, Form, Header } from 'semantic-ui-react'

import { DepositInfo } from '../common/damlTypes'
import { AppError } from '../common/errorTypes'
import { preciseInputSteps } from '../common/utils'
import FormErrorHandled from '../common/FormErrorHandled'

import { OrderKind } from './InvestorTrade'

import './OrderForm.scss'

type Props = {
    kind: OrderKind;
    assetPrecisions: [number, number];
    deposits: DepositInfo[];
    quotePrecision: number;
    labels: [string, string];
    placeOrder: (depositCids: string[], price: string, amount: string) => Promise<void>;
}

const OrderForm: React.FC<Props> = ({
    kind,
    assetPrecisions,
    quotePrecision,
    deposits,
    labels,
    placeOrder
}) => {
    const title = kind[0].toUpperCase() + kind.slice(1);

    const [ price, setPrice ] = useState('');
    const [ amount, setAmount ] = useState('');

    const total = kind === OrderKind.OFFER
        ? Number(amount) * Number(price)
        : Number(price) !== 0 ? Number(amount) / Number(price) : 0;

    const submit = async () => {
        const totalAvailableAmount = deposits.reduce(
            (sum, d) => sum + Number(d.contractData.asset.quantity), 0);

        if (Number(amount) > totalAvailableAmount) {
            throw new AppError(`Insufficient ${labels[0]} amount. Try:`, [
                `Allocating funds to the exchange or`,
                `Depositing funds to your account`,
            ]);
        }

        await placeOrder(deposits.map(d => d.contractId), price, amount);
        setPrice('');
        setAmount('');
    };

    const validateInput = (
        value: string,
        precision: number,
        callback: (value: React.SetStateAction<string>) => void
    ) => {
        const fractional = value.split(".")[1];
        if (fractional && fractional.length > precision) {
            return;
        }

        callback(value);
    }

    const amountInput = preciseInputSteps(assetPrecisions[0]);
    const priceInput = preciseInputSteps(quotePrecision);

    return (
        <FormErrorHandled onSubmit={submit} className='order-form'>
            <Header>{title}</Header>
            <Form.Field required>
                <label>Amount {labels[0]}</label>
                <input
                    className='order-input'
                    type='number'
                    step={amountInput.step}
                    placeholder={amountInput.placeholder}
                    value={amount}
                    onChange={e => validateInput(e.target.value, assetPrecisions[0], setAmount)}/>
            </Form.Field>

            <Form.Field required>
                <label>Price</label>
                <input
                    className='order-input'
                    value={price}
                    step={priceInput.step}
                    placeholder={priceInput.placeholder}
                    onChange={e => validateInput(e.target.value, quotePrecision, setPrice)}/>
            </Form.Field>

            <Form.Field>
                <label>Total {labels[1]}</label>
                <input
                    disabled
                    className='order-input uncontrolled'
                    value={total.toFixed(assetPrecisions[1])}/>
            </Form.Field>

            <Button secondary disabled={!price || !amount}>{title}</Button>
        </FormErrorHandled>
    )
}

export default OrderForm;
