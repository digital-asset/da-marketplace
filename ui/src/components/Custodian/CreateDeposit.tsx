import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQuery } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Custodian } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { TokenInfo, wrapDamlTuple } from '../common/damlTypes'
import { parseError, ErrorMessage } from '../common/errorTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import TokenSelect from '../common/TokenSelect'

const CreateDeposit: React.FC = () => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();

    const allTokens: TokenInfo[] = useStreamQuery(Token).contracts
        .map(tc => ({ contractId: tc.contractId, contractData: tc.payload }));

    const [ beneficiary, setBeneficiary ] = useState('');
    const [ token, setToken ] = useState<TokenInfo>();
    const [ depositQuantity, setDepositQuantity ] = useState('');

    const operator = useWellKnownParties().userAdminParty;
    const custodian = useParty();
    const ledger = useLedger();

    const getTokenFromCid = (contractId: string): TokenInfo => {
        const token = allTokens.find(t => t.contractId === contractId);
        if (!token) {
            throw new Error(`Token with contractId ${contractId} does not exist.`);
        }
        return token;
    }

    const handleTokenSelect = (contractId: string, setToken: (token: TokenInfo) => void) => {
        try {
            const token = getTokenFromCid(contractId);
            setToken(token);
        } catch (err) {
            setError(parseError(err));
        }
    }

    const handleCreateDeposit = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        try {
            if (!token) {
                throw new Error('Token not selected');
            }

            const tokenId = token.contractData.id;
            const args = { beneficiary, tokenId, depositQuantity };
            const key = wrapDamlTuple([operator, custodian]);
            await ledger.exerciseByKey(Custodian.Custodian_CreateDeposit, key, args);
        } catch(err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    return (
        <FormErrorHandled
            loading={loading}
            error={error}
            clearError={() => setError(undefined)}
            onSubmit={handleCreateDeposit}
        >
            <Form.Group className='inline-form-group'>
                <Form.Input
                    label='Beneficiary'
                    placeholder='Investor party ID'
                    onChange={e => setBeneficiary(e.currentTarget.value)}/>
                <TokenSelect
                    label='Asset'
                    className='asset-select'
                    tokens={allTokens}
                    selected={token?.contractId}
                    setTokenCid={contractId => handleTokenSelect(contractId, setToken)}/>
                <Form.Input
                    label='Quantity'
                    placeholder='Quantity'
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
