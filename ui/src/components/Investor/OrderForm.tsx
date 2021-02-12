import React, { useState } from 'react'
import { Button, Form, Header} from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types/module'
import { ExchangeParticipant } from '@daml.js/da-marketplace/lib/Marketplace/ExchangeParticipant'

import { DepositInfo, wrapDamlTuple } from '../common/damlTypes'
import { AppError } from '../common/errorTypes'
import { useOperator } from '../common/common'
import { preciseInputSteps } from '../common/utils'
import FormErrorHandled from '../common/FormErrorHandled'

import { OrderKind } from './InvestorTrade'

type Props = {
    allowedToOrder: boolean;
    assetPrecisions: [ number, number ];
    deposits: [ DepositInfo[], DepositInfo[] ];
    defaultCCP?: string;
    exchange: string;
    isCleared: boolean;
    tokenPair: Id[];
}

const OrderForm: React.FC<Props> = ({
    allowedToOrder,
    assetPrecisions,
    deposits,
    defaultCCP,
    exchange,
    isCleared,
    tokenPair
}) => {
    const [ price, setPrice ] = useState('');
    const [ amountQuote, setAmountQuote ] = useState('');
    const [ amountBase, setAmountBase ] = useState('');

    const ledger = useLedger();
    const operator = useOperator();
    const investor = useParty();

    const [ bidDeposits, offerDeposits ] = deposits;
    const [ baseLabel, quoteLabel ] = tokenPair.map(t => t.label);
    const [ basePrecision, quotePrecision ] = assetPrecisions;

    const validateDeposits = (deposits: DepositInfo[], amount: string): string[] => {
        const totalAvailableAmount = deposits.reduce(
            (sum, d) => sum + +d.contractData.asset.quantity, 0);

        if (+amount > totalAvailableAmount) {
            const tokenLabel = deposits[0]?.contractData.asset.id.label;
            throw new AppError(`Insufficient ${tokenLabel} amount. Try:`, [
                `Allocating funds to the exchange or`,
                `Depositing funds to your account`,
            ]);
        }
        return deposits.map(d => d.contractId);
    };

    const placeOrder = async (kind: OrderKind, deposits: DepositInfo[], amount: string) => {
        const key = wrapDamlTuple([exchange, operator, investor]);

        if (isCleared) {
            console.log("Placing a cleared order.");
            if (!defaultCCP) {
                throw new AppError('Order Error.', 'The CCP is missing');
            }

            if (!allowedToOrder) {
                throw new AppError('Insufficient permissions.', `You are not a customer of ${defaultCCP} and can not place trades on this market.`)
            }

            const makeClearedArgs = {
                price,
                amount,
                ccp: defaultCCP, // TODO: Allow user-selectable CCP
                pair: wrapDamlTuple(tokenPair)
            }
            const placeClearedBid = ExchangeParticipant.ExchangeParticipant_PlaceClearedBid;
            const placeClearedOffer = ExchangeParticipant.ExchangeParticipant_PlaceClearedOffer;

            if (kind === OrderKind.BID) {
                await ledger.exerciseByKey(placeClearedBid, key, makeClearedArgs);
            } else if (kind === OrderKind.OFFER) {
                await ledger.exerciseByKey(placeClearedOffer, key, makeClearedArgs);
            }
        } else {
            const depositCids = validateDeposits(deposits, amount);

            const args = {
                price,
                amount,
                depositCids,
                pair: wrapDamlTuple(tokenPair)
            }

            if (kind === OrderKind.BID) {
                await ledger.exerciseByKey(ExchangeParticipant.ExchangeParticipant_PlaceBid, key, args);
            } else if (kind === OrderKind.OFFER) {
                await ledger.exerciseByKey(ExchangeParticipant.ExchangeParticipant_PlaceOffer, key, args);
            }
        }
    }

    const placeBid = async () => placeOrder(OrderKind.BID, bidDeposits, amountQuote);
    const placeOffer = async () => placeOrder(OrderKind.OFFER, offerDeposits, amountBase);

    const computeValues = (
        value: string,
        precision: number,
        field: 'price' | 'amount' | 'total',
        callback: (value: React.SetStateAction<string>) => void
    ) => {
        if (!validateInput(value, precision, callback)) {
            return;
        }

        switch(field) {
            case 'amount':
                const quoteTotal = +value * +price;
                setAmountQuote(quoteTotal.toFixed(quotePrecision));
                break;
            case 'total':
                const baseTotal = +price !== 0 ? +value / +price : 0;
                setAmountBase(baseTotal.toFixed(basePrecision));
                break;
            case 'price':
                const quotePrice = +value * +amountBase;
                setAmountQuote(quotePrice.toFixed(quotePrecision));
                break;
        }
    }

    const validateInput = (
        value: string,
        precision: number,
        callback: (value: React.SetStateAction<string>) => void
    ): boolean => {
        const fractional = value.split(".")[1];
        if (fractional && fractional.length > precision) {
            return false;
        }

        callback(value);
        return true;
    }

    const priceInput = preciseInputSteps(quotePrecision);
    const amountQuoteInput = preciseInputSteps(quotePrecision)
    const amountBaseInput = preciseInputSteps(basePrecision);

    const disableButton =
        !price || +price === 0 ||
        !amountBase || +amountBase === 0 ||
        !amountQuote || +amountQuote === 0;

    return (
        <FormErrorHandled onSubmit={async () => {}} className='order-form'>
            { loadAndCatch => <>
                <Form.Field>
                    <p className='order-label'>Price</p>
                    <input
                        className='order-input'
                        value={price}
                        placeholder={priceInput.placeholder}
                        onChange={e =>
                            computeValues(e.target.value, quotePrecision, 'price', setPrice)}/>
                    <label className='order-label badge'>{quoteLabel}</label>
                </Form.Field>

                <Form.Field>
                    <p className='order-label'>Amount</p>
                    <input
                        className='order-input'
                        placeholder={amountBaseInput.placeholder}
                        value={amountBase}
                        onChange={e =>
                            computeValues(e.target.value, basePrecision, 'amount', setAmountBase)}/>
                    <label className='order-label badge'>{baseLabel}</label>
                </Form.Field>

                <Form.Field>
                    <p className='order-label'>Total</p>
                    <input
                        className='order-input'
                        placeholder={amountQuoteInput.placeholder}
                        value={amountQuote}
                        onChange={e =>
                            computeValues(e.target.value, quotePrecision, 'total', setAmountQuote)}/>
                    <label className='order-label badge'>{quoteLabel}</label>
                </Form.Field>

                {isCleared && <p className='p2 dark'>Market CCP Party: <b>{defaultCCP}</b></p>}

                <div className='buttons'>
                    <Button
                        primary
                        type='button'
                        className='buy'
                        disabled={disableButton}
                        onClick={() => loadAndCatch(placeBid)}>
                           <Header as='h2'>Bid</Header>
                    </Button>

                    <Button
                        primary
                        type='button'
                        className='sell'
                        disabled={disableButton}
                        onClick={() => loadAndCatch(placeOffer)}>
                           <Header as='h2'>Offer</Header>
                    </Button>
                </div></>
            }
        </FormErrorHandled>
    )
}

export default OrderForm;
