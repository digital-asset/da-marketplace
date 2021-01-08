import React, { useState } from 'react'
import { Button, Form, Header } from 'semantic-ui-react'

import { DepositInfo } from '../common/damlTypes'
import { AppError } from '../common/errorTypes'
import { preciseInputSteps } from '../common/utils'
import FormErrorHandled from '../common/FormErrorHandled'

import { OrderKind } from './InvestorTrade'

import './OrderForm.css'

type Props = {
    kind: OrderKind;
    assetPrecisions: [number, number];
    deposits: DepositInfo[];
    quotePrecision: number;
    labels: [string, string];
    limits: [number, number];
    placeOrder: (depositCid: string, price: string, amount: string) => Promise<void>;
}

const OrderForm: React.FC<Props> = ({
    kind,
    assetPrecisions,
    quotePrecision,
    deposits,
    labels,
    limits,
    placeOrder
}) => {
    const [ price, setPrice ] = useState('');
    const [ amount, setAmount ] = useState('');
    const [ amountFieldError, setAmountFieldError ] = useState<string>();

    const title = kind[0].toUpperCase() + kind.slice(1);
    const [ minimumQuantity, maximumQuantity ] = limits;

    const total = kind === OrderKind.OFFER
        ? +amount * +price
        : +price !== 0 ? +amount / +price : 0;

    const submit = async () => {
        const depositCid = deposits.find(deposit => +amount <= +deposit.contractData.asset.quantity)?.contractId;

        if (!depositCid) {
            throw new AppError(`Insufficient ${labels[0]} amount`, [
                `Add a new deposit,`,
                `Allocate a deposit to the exchange,`,
                `or merge existing ${labels[0]} deposits in your wallet.`
            ]);
        }

        await placeOrder(depositCid, price, amount);
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
            <Form.Input
                required
                label={'Amount ' + labels[0]}
                error={amountFieldError}
            >
                <input
                    className='order-input'
                    type='number'
                    step={amountInput.step}
                    placeholder={amountInput.placeholder}
                    value={amount}
                    onChange={e => {
                        const inputAmount = +e.target.value;
                        if (inputAmount < minimumQuantity) {
                            setAmountFieldError(`Order quantity is below the minimum quantity of ${minimumQuantity}.`)
                        }

                        if (inputAmount > maximumQuantity) {
                            setAmountFieldError(`Order quantity exceeds the maximum quantity of ${maximumQuantity}.`)
                        }
                        validateInput(e.target.value, assetPrecisions[0], setAmount)
                    }}/>
            </Form.Input>

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
