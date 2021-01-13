import React, { useEffect, useState } from 'react'
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
    const [ amountQuote, setAmountQuote ] = useState('');
    const [ amountBase, setAmountBase ] = useState('');

    // useEffect(() => {
    //     // Recalculate fields:

    // }, [amountQuote, amountBase]);

    // const total = kind === OrderKind.OFFER
    //     ? Number(amountQuote) * Number(price)
    //     : Number(price) !== 0 ? Number(amountQuote) / Number(price) : 0;

    const submit = async () => {
        const totalAvailableAmount = deposits.reduce(
            (sum, d) => sum + Number(d.contractData.asset.quantity), 0);

        if (Number(amountQuote) > totalAvailableAmount) {
            throw new AppError(`Insufficient ${labels[0]} amount. Try:`, [
                `Allocating funds to the exchange or`,
                `Depositing funds to your account`,
            ]);
        }

        await placeOrder(deposits.map(d => d.contractId), price, amountQuote);
        setPrice('');
        setAmountQuote('');
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

    const priceInput = preciseInputSteps(quotePrecision);
    const amountQuoteInput = preciseInputSteps(assetPrecisions[0]);
    const amountBaseInput = preciseInputSteps(assetPrecisions[1]);

    return (
        <FormErrorHandled onSubmit={submit} className='order-form'>
            <Header>{title}</Header>
            <Form.Field required>
                <label className='order-label'>Price</label>
                <input
                    className='order-input'
                    value={price}
                    step={priceInput.step}
                    placeholder={priceInput.placeholder}
                    onChange={e => validateInput(e.target.value, quotePrecision, setPrice)}/>
            </Form.Field>

            <Form.Field required>
                <label className='order-label'>Amount {labels[0]}</label>
                <input
                    className='order-input'
                    type='number'
                    step={amountQuoteInput.step}
                    placeholder={amountQuoteInput.placeholder}
                    value={amountQuote}
                    onChange={e => validateInput(e.target.value, assetPrecisions[0], setAmountQuote)}/>
            </Form.Field>

            <Form.Field>
                <label className='order-label'>Amount {labels[1]}</label>
                <input
                    className='order-input'
                    type='number'
                    step={amountBaseInput.step}
                    placeholder={amountBaseInput.placeholder}
                    value={amountBase}
                    onChange={e => {}}/>
            </Form.Field>

            <Button secondary disabled={!price || !amountQuote}>{title}</Button>
        </FormErrorHandled>
    )
}

export default OrderForm;
