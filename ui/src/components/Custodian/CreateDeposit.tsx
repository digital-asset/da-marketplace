import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQueries } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'
import { Custodian, CustodianRelationship } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { RegisteredBroker, RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { TokenInfo, wrapDamlTuple, damlTupleToString, makeContractInfo } from '../common/damlTypes'
import { useOperator } from '../common/common'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'
import { countDecimals } from '../common/utils';

import './CreateDeposit.css'

const CreateDeposit: React.FC = () => {
    const [ beneficiary, setBeneficiary ] = useState('');
    const [ token, setToken ] = useState<TokenInfo>();
    const [ depositQuantity, setDepositQuantity ] = useState('');
    const [ depositQuantityError, setDepositQuantityError ] = useState<string>()

    const operator = useOperator();
    const custodian = useParty();
    const ledger = useLedger();

    const allTokens: TokenInfo[] = useStreamQueries(Token, () => [], [], (e) => {
        console.log("Unexpected close from Token: ", e);
    }).contracts.map(makeContractInfo);
    const quantityPrecision = Number(token?.contractData.quantityPrecision) || 0

    const relationshipParties = useStreamQueries(CustodianRelationship, () => [], [], (e) => {
        console.log("Unexpected close from custodianRelationships: ", e);
    }).contracts.map(relationship => { return relationship.payload.party })

    const brokerBeneficiaries = useStreamQueryAsPublic(RegisteredBroker).contracts
        .filter(broker => relationshipParties.find(p => broker.payload.broker === p))
        .map(broker => {
            const party = broker.payload.broker;
            const name = broker.payload.name;
            return {
                party,
                label: `${name ? `${name} (${party})` : party} | Broker`
            }
        })

    const investorBeneficiaries = useStreamQueryAsPublic(RegisteredInvestor).contracts
        .filter(investor => relationshipParties.find(p => investor.payload.investor === p))
        .map(investor => {
            const party = investor.payload.investor;
            const name = investor.payload.name;
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

        setBeneficiary('')
        setToken(undefined)
        setDepositQuantity('')
    }

    const validateTokenQuantity = (event: React.SyntheticEvent, result: any) => {
        const number = Number(result.value)

        if (number < 0) {
            return setDepositQuantityError(`The quantity must a positive number.`)
        }

        if (countDecimals(number) > quantityPrecision) {
            return setDepositQuantityError(`The decimal precision of this quantity must be equal to ${quantityPrecision !== 0 && 'or less than'} ${quantityPrecision}.`)
        }

        setDepositQuantityError(undefined)
        setDepositQuantity(number.toString())
    }

    return (
        <FormErrorHandled onSubmit={handleCreateDeposit}>
            <Form.Group className='inline-form-group with-error'>
                <Form.Select
                    clearable
                    label='Select Provider'
                    value={beneficiary}
                    placeholder='Select...'
                    options={beneficiaryOptions}
                    onChange={handleBeneficiaryChange}/>
                <ContractSelect
                    clearable
                    className='asset-select'
                    contracts={allTokens}
                    label='Asset'
                    value={token?.contractId || ""}
                    getOptionText={token => token.contractData.id.label}
                    setContract={token => setToken(token)}/>
                <Form.Input
                    className='create-deposit-quantity'
                    label='Quantity'
                    type='number'
                    step={`0.${"0".repeat(quantityPrecision === 0? quantityPrecision : quantityPrecision-1)}1`}
                    placeholder={`0.${"0".repeat(quantityPrecision)}`}
                    error={depositQuantityError}
                    disabled={!token}
                    onChange={validateTokenQuantity}/>
                <Button
                    disabled={!beneficiary || !token || !depositQuantity}
                    content='Create Deposit'
                    className='create-deposit-btn'/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default CreateDeposit;
