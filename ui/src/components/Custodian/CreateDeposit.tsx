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
import { TokenInfo, wrapDamlTuple, ContractInfo } from '../common/damlTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'

const CreateDeposit = () => {
    const [ beneficiary, setBeneficiary ] = useState('');
    const [ token, setToken ] = useState<TokenInfo>();
    const [ depositQuantity, setDepositQuantity ] = useState('');
    const [ depositQuantityError, setDepositQuantityError ] = useState<string>()

    const { investorId } = useParams<{investorId: string}>()

    const operator = useOperator();
    const custodian = useParty();
    const ledger = useLedger();

    useEffect(()=> {
        if (!!investorId) {
            setBeneficiary(investorId)
        }
    }, [investorId])

    const allTokens: TokenInfo[] = useContractQuery(Token);
    const quantityPrecision = Number(token?.contractData.quantityPrecision) || 0

    const relationshipParties = useContractQuery(CustodianRelationship)
        .map(relationship => relationship.contractData.party )

    const brokerBeneficiaries = useContractQuery(RegisteredBroker, AS_PUBLIC)
        .filter(broker => relationshipParties.find(p => broker.contractData.broker === p))
        .map(broker => {
            const party = broker.contractData.broker;
            const name = broker.contractData.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Broker`
            }
        })

    const investorBeneficiaries = useContractQuery(RegisteredInvestor, AS_PUBLIC)
        .filter(investor => relationshipParties.find(p => investor.contractData.investor === p))
        .map(investor => {
            const party = investor.contractData.investor;
            const name = investor.contractData.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Investor`
            }
        })

    const allBeneficiaries = [...brokerBeneficiaries, ...investorBeneficiaries]

    const beneficiaryOptions = allBeneficiaries
        .map(beneficiary => ({
            key: beneficiary.party,
            text: beneficiary.label,
            value: beneficiary.party
        }));

    const handleBeneficiaryChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setBeneficiary(result.value);
        }
    }

    const handleCreateDeposit = async () => {
        if (!token) {
            throw new Error('Token not selected');
        }

        const tokenId = token.contractData.id;
        const args = { beneficiary, tokenId, depositQuantity };
        const key = wrapDamlTuple([operator, custodian]);
        await ledger.exerciseByKey(Custodian.Custodian_CreateDeposit, key, args);

        setBeneficiary(investorId? investorId : '')
        setToken(undefined)
        setDepositQuantity('')
    }

    const validateTokenQuantity = (event: React.SyntheticEvent, result: any) => {
        const number = Number(result.value)

        if (number < 0) {
            return setDepositQuantityError(`The quantity must be a positive number.`)
        }

        if (countDecimals(number) > quantityPrecision) {
            return setDepositQuantityError(`The decimal precision of this quantity must be equal to ${quantityPrecision !== 0 && 'or less than'} ${quantityPrecision}.`)
        }

        setDepositQuantityError(undefined)
        setDepositQuantity(number.toString())
    }

    const { step, placeholder } = preciseInputSteps(quantityPrecision);

    return (
        <div className='create-deposit'>
            <FormErrorHandled onSubmit={handleCreateDeposit}>
                <Header as='h2'>Quick Deposit</Header>
                    {!investorId &&
                        <Form.Select
                            clearable
                            className='beneficiary-select'
                            label={<p>Beneficiary</p>}
                            value={beneficiary}
                            placeholder='Select...'
                            options={beneficiaryOptions}
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
                        <Form.Input
                            className='create-deposit-quantity'
                            label={<p>Quantity</p>}
                            type='number'
                            step={step}
                            value={depositQuantity}
                            placeholder={placeholder}
                            error={depositQuantityError}
                            disabled={!token}
                            onChange={validateTokenQuantity}/>
                    </Form.Group>
                    <Button
                        disabled={!beneficiary || !token || !depositQuantity}
                        content='Create Deposit'
                        className='ghost'/>
            </FormErrorHandled>
        </div>
    )
}

export default CreateDeposit;
