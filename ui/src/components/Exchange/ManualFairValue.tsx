import React, { useEffect, useState } from 'react'
import { Button, Form, Header } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'

import { useParty, useLedger } from '@daml/react'
import { Custodian, CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { RegisteredBroker, RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import { useOperator } from '../common/common'
import { countDecimals, preciseInputSteps } from '../common/utils'
import { TokenInfo, wrapDamlTuple, ContractInfo, ManualFairValueCalculationInfo } from '../common/damlTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'
import {ManualFairValueCalculation} from '@daml.js/da-marketplace/lib/Marketplace/Derivative'

type Props = {
    fairValueRequest: ManualFairValueCalculationInfo;
}

const ManualFairValue: React.FC<Props> = ({fairValueRequest}) => {
    const [ price, setPrice ] = useState('');
    const [ priceError, setPriceError ] = useState<string>()

    // const { investorId } = useParams<{investorId: string}>()

    const ledger = useLedger();

    // useEffect(()=> {
    //     if (!!investorId) {
    //         setBeneficiary(investorId)
    //     }
    // }, [investorId])

    const quantityPrecision = 5; // Number(token?.contractData.quantityPrecision) || 0

    const handleCalculate = async () => {

        const args = { price };
        await ledger.exercise(ManualFairValueCalculation.ManualFairValueCalculation_Calculate, fairValueRequest.contractId, args);

        setPrice('')
    }

    const validatePrice = (event: React.SyntheticEvent, result: any) => {
        const number = Number(result.value)

        if (number < 0) {
            return setPriceError(`The quantity must be a positive number.`)
        }

        // if (countDecimals(number) > quantityPrecision) {
        //     return setDepositQuantityError(`The decimal precision of this quantity must be equal to ${quantityPrecision !== 0 && 'or less than'} ${quantityPrecision}.`)
        // }
        //
        setPriceError(undefined)
        setPrice(number.toString())
    }

    const { step, placeholder } = preciseInputSteps(quantityPrecision);

    return (
        <div className='manual-fair-value'>
            <FormErrorHandled onSubmit={handleCalculate}>
                <Header as='h2'>Fair Value Request for {fairValueRequest.contractData.assetId.label}</Header>
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
