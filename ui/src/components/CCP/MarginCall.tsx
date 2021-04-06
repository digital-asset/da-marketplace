import React, { useEffect, useState } from 'react'
import { useParty, useLedger } from '@daml/react'
import { Button, Form, Header } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'

import { CCP } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { useContractQuery } from '../../websocket/queryStream'
import ContractSelect from '../common/ContractSelect'

import { useOperator } from '../common/common'
import FormErrorHandled from '../common/FormErrorHandled'
import { countDecimals, preciseInputSteps } from '../common/utils'
import { TokenInfo, wrapDamlTuple } from '../common/damlTypes'

type Props = {
    allCustomers: {
        party: any;
        label: string;
    }[];
}

const MarginCall: React.FC<Props> = ({ allCustomers }) => {
    const [ customer, setCustomer ] = useState('');
    const [ token, setToken ] = useState<TokenInfo>();
    const [ targetAmount, setTargetAmount ] = useState('');
    const [ targetAmountError, setTargetAmountError ] = useState<string>()

    const { investorId } = useParams<{investorId: string}>()

    const operator = useOperator();
    const ccp = useParty();
    const ledger = useLedger();

    useEffect(()=> {
        if (!!investorId) {
            setCustomer(investorId)
        }
    }, [investorId])

    const allTokens: TokenInfo[] = useContractQuery(Token);
    const quantityPrecision = Number(token?.contractData.quantityPrecision) || 0

    const customerOptions = allCustomers
        .map(customer => ({
            key: customer.party,
            text: customer.label,
            value: customer.party
        }));

    const handleBeneficiaryChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setCustomer(result.value);
        }
    }

    const handleMarginCall = async () => {
        if (!token) {
            throw new Error('Token not selected');
        }
        const time = new Date();
        const tokenId = token.contractData.id;
        const args = {
            ccpCustomer: customer,
            optAccountId: null,
            currency: tokenId.label,
            targetAmount: targetAmount,
            calculationId: time.toISOString()
        };
        const key = wrapDamlTuple([operator, ccp]);
        await ledger.exerciseByKey(CCP.CCP_CreateMarginCalculation, key, args);

        setCustomer(investorId? investorId : '')
        setToken(undefined)
        setTargetAmount('')
    }

    const validateTargetAmount = (event: React.SyntheticEvent, result: any) => {
        const number = Number(result.value)

        if (number < 0) {
            return setTargetAmountError(`The quantity must be a positive number.`)
        }

        if (countDecimals(number) > quantityPrecision) {
            return setTargetAmountError(`The decimal precision of this quantity must be equal to ${quantityPrecision !== 0 && 'or less than'} ${quantityPrecision}.`)
        }

        setTargetAmountError(undefined)
        setTargetAmount(number.toString())
    }

    const { step, placeholder } = preciseInputSteps(quantityPrecision);

    return (
        <div className='margin-call'>
            <FormErrorHandled onSubmit={handleMarginCall}>
                <Header as='h2'>Margin Call</Header>
                    {!investorId &&
                        <Form.Select
                            clearable
                            className='beneficiary-select'
                            label={<p>Client</p>}
                            value={customer}
                            placeholder='Select...'
                            options={customerOptions}
                            onChange={handleBeneficiaryChange}/>}
                    <Form.Group className='inline-form-group'>
                        <ContractSelect
                            clearable
                            className='asset-select'
                            contracts={allTokens}
                            label='Asset'
                            placeholder='Select...'
                            value={token?.contractId || ""}
                            getOptionText={token => token.contractData.id.label}
                            setContract={token => setToken(token)}/>
                    </Form.Group>
                        <Form.Input
                            className='create-deposit-quantity'
                            label={<p>Target</p>}
                            type='number'
                            step={step}
                            value={targetAmount}
                            placeholder={placeholder}
                            error={targetAmountError}
                            disabled={!token}
                            onChange={validateTargetAmount}/>
                    <Button
                        disabled={!customer || !token || !targetAmount}
                        content='Create Margin Call'
                        className='ghost'/>
            </FormErrorHandled>
        </div>
    )
}

export default MarginCall;
