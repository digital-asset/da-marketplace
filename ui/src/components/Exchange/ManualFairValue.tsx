import React, {useState} from 'react'
import {Button, Form, Header} from 'semantic-ui-react'

import {useLedger} from '@daml/react'

import {ManualFairValueCalculation} from '@daml.js/da-marketplace/lib/Marketplace/Derivative'

import {preciseInputSteps} from '../common/utils'
import {ManualFairValueCalculationInfo} from '../common/damlTypes'

import FormErrorHandled from '../common/FormErrorHandled'

type Props = {
    fairValueRequest: ManualFairValueCalculationInfo;
}

const ManualFairValue: React.FC<Props> = ({fairValueRequest}) => {
    const [ price, setPrice ] = useState('');
    const [ priceError, setPriceError ] = useState<string>()

    const ledger = useLedger();

    const quantityPrecision = 5;

    const handleCalculate = async () => {

        const args = { price };
        await ledger.exercise(ManualFairValueCalculation.ManualFairValueCalculation_Calculate, fairValueRequest.contractId, args);

        setPrice('')
    }

    const validatePrice = (event: React.SyntheticEvent, result: any) => {
        const number = Number(result.value)

        if (number < 0) {
            return setPriceError(`The price must be a positive number.`)
        }

        setPriceError(undefined)
        setPrice(number.toString())
    }

    const { step, placeholder } = preciseInputSteps(quantityPrecision);

    return (
        <div className='manual-fair-value'>
            <FormErrorHandled onSubmit={handleCalculate}>
                <Header as='h2'>Fair Value Request for {fairValueRequest.contractData.instrumentId.label}</Header>
                    <Form.Group>
                        <Form.Input
                            className='create-deposit-quantity'
                            label={<p>Quantity</p>}
                            type='number'
                            step={step}
                            value={price}
                            placeholder={placeholder}
                            error={priceError}
                            onChange={validatePrice}/>
                    </Form.Group>
                    <Button
                        disabled={!price}
                        content='Submit Calculation'
                        className='ghost'/>
            </FormErrorHandled>
        </div>
    )
}

export default ManualFairValue;
