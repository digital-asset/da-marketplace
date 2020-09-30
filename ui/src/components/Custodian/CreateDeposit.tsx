import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQuery } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Custodian } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { TokenInfo, wrapDamlTuple } from '../common/damlTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'

const CreateDeposit: React.FC = () => {
    const [ beneficiary, setBeneficiary ] = useState('');
    const [ token, setToken ] = useState<TokenInfo>();
    const [ depositQuantity, setDepositQuantity ] = useState('');

    const operator = useWellKnownParties().userAdminParty;
    const custodian = useParty();
    const ledger = useLedger();

    const allTokens: TokenInfo[] = useStreamQuery(Token).contracts
        .map(tc => ({ contractId: tc.contractId, contractData: tc.payload }));

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

    return (
        <FormErrorHandled onSubmit={handleCreateDeposit}>
            <Form.Group className='inline-form-group'>
                <Form.Input
                    label='Beneficiary'
                    placeholder='Investor party ID'
                    value={beneficiary}
                    onChange={e => setBeneficiary(e.currentTarget.value)}/>
                <ContractSelect
                    clearable
                    className='asset-select'
                    contracts={allTokens}
                    label='Asset'
                    value={token?.contractId || ""}
                    getOptionText={token => token.contractData.id.label}
                    setContract={token => setToken(token)}/>
                <Form.Input
                    label='Quantity'
                    placeholder='Quantity'
                    value={depositQuantity}
                    onChange={e => setDepositQuantity(e.currentTarget.value)}/>
                <Button
                    disabled={!beneficiary || !token || !depositQuantity}
                    content='Create Deposit'
                    className='create-deposit-btn'/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default CreateDeposit;
