import React, { useEffect, useState } from 'react'
import { Button, Form, Header } from 'semantic-ui-react'
import { useParams } from 'react-router-dom'

import { useParty, useLedger } from '@daml/react'
import { CCP } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { useContractQuery } from '../../websocket/queryStream'

import { useOperator } from '../common/common'
import { countDecimals, preciseInputSteps } from '../common/utils'
import { TokenInfo, wrapDamlTuple } from '../common/damlTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'

type Props = {
    allCustomers: {
        party: any;
        label: string;
    }[];
}

const MarkToMarketCalc: React.FC<Props> = ({ allCustomers }) => {
    const [ customer, setCustomer ] = useState('');
    const [ token, setToken ] = useState<TokenInfo>();
    const [ mtmAmount, setMtmAmount ] = useState('');
    const [ mtmAmountError, setMtmAmountError ] = useState<string>()

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

    const handleMarkToMarketCalc = async () => {
        if (!token) {
            throw new Error('Token not selected');
        }
        const time = new Date();
        const tokenId = token.contractData.id;
        const args = {
            ccpCustomer: customer,
            optAccountId: null,
            currency: tokenId.label,
            mtmAmount: mtmAmount,
            calculationId: time.toString(),
            calculationTime: time.toISOString()
        };
        const key = wrapDamlTuple([operator, ccp]);
        await ledger.exerciseByKey(CCP.CCP_CreateMarkToMarketCalculation, key, args);

        setCustomer(investorId? investorId : '')
        setToken(undefined)
        setMtmAmount('')
    }

    const validateMtmAmount = (event: React.SyntheticEvent, result: any) => {
        const number = Number(result.value)

        if (countDecimals(number) > quantityPrecision) {
            return setMtmAmountError(`The decimal precision of this quantity must be equal to ${quantityPrecision !== 0 && 'or less than'} ${quantityPrecision}.`)
        }

        setMtmAmountError(undefined)
        setMtmAmount(number.toString())
    }


    const { step, placeholder } = preciseInputSteps(quantityPrecision);

    return (
        <div className='margin-call'>
            <FormErrorHandled onSubmit={handleMarkToMarketCalc}>
                <Header as='h2'>MTM Calculation</Header>
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
                            label={<p>MTM Amount</p>}
                            type='number'
                            step={step}
                            value={mtmAmount}
                            placeholder={placeholder}
                            error={mtmAmountError}
                            disabled={!token}
                            onChange={validateMtmAmount}/>
                    <Button
                        disabled={!customer || !token || !mtmAmount}
                        content='Create MTM Calculation'
                        className='ghost'/>
            </FormErrorHandled>
        </div>
    )
}

export default MarkToMarketCalc;
