import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties, useStreamQueryAsPublic } from '@daml/dabl-react'
import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'

import { wrapDamlTuple } from '../common/damlTypes'
import { parseError, ErrorMessage } from '../common/errorTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import FormToggle from '../common/FormToggle'

import { RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { RegisteredIssuer } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { RegisteredInvestor } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { RegisteredExchange } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { RegisteredBroker } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import './IssueAsset.css'

const IssueAsset = () => {
    const ledger = useLedger();
    const issuer = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const [ name, setName ] = useState<string>('')
    const [ quantityPrecision, setQuantityPrecision ] = useState<string>('')
    const [ description, setDescription ] = useState<string>('')
    const [ isPublic, setIsPublic ] = useState<boolean>(true)
    const [ observers, setObservers ] = useState<string[]>([]);
    const [ error, setError ] = useState<ErrorMessage>();
    const [ loading, setLoading ] = useState(false);

    const allRegisteredParties = [
            useStreamQueryAsPublic(RegisteredCustodian).contracts
                .map(ri => ({ contractId: ri.contractId, contractData: ri.payload.custodian })),
            useStreamQueryAsPublic(RegisteredIssuer).contracts
                .map(ri => ({ contractId: ri.contractId, contractData: ri.payload.issuer })),
            useStreamQueryAsPublic(RegisteredInvestor).contracts
                .map(ri => ({ contractId: ri.contractId, contractData: ri.payload.investor })),
            useStreamQueryAsPublic(RegisteredExchange).contracts
                .map(ri => ({ contractId: ri.contractId, contractData: ri.payload.exchange })),
            useStreamQueryAsPublic(RegisteredBroker).contracts
                .map(ri => ({ contractId: ri.contractId, contractData: ri.payload.broker }))
            ].flat()

    async function submit() {
        setLoading(true);

        try {
            const key = wrapDamlTuple([operator, issuer]);
            const args = { name, quantityPrecision, description, isPublic, observers};

            await ledger.exerciseByKey(Issuer.Issuer_IssueToken, key, args);
            clearForm()

        } catch (err) {
            setError(parseError(err));
        }

        setLoading(false);
    }

    function clearForm () {
        setName('')
        setQuantityPrecision('')
        setDescription('')
        setIsPublic(true)
        setObservers([])
        setError(undefined)
        setLoading(false)
    }

    const handleObserversChange = (event: React.SyntheticEvent, result: any) => {
        setObservers(result.value)
    }

    const partyOptions = allRegisteredParties.map(d => {
        return {
            key: d.contractId,
            text: `${d.contractData}`,
            value: d.contractData
        }
    })

    return (
        <FormErrorHandled
            size='large'
            className='issue-asset-form'
            error={error}
            clearError={() => setError(undefined)}
        >
        <Form.Input
            fluid
            label='Asset ID'
            placeholder='Give this asset a name'
            value={name}
            className='issue-asset-form-field'
            onChange={e => setName(e.currentTarget.value)}
        />
        <Form.TextArea
            label='Description'
            placeholder='Describe the asset to potential investors'
            className='issue-asset-form-field'
            value={description}
            onChange={e => setDescription(e.currentTarget.value)}
        />
        <div className='is-public'>
            <FormToggle
                defaultChecked
                className='issue-asset-form-field'
                onLabel='Public'
                onInfo='All parties will be aware of this token.'
                offLabel='Private'
                offInfo='Only a set of parties will be aware of this token.'
                onClick={val => setIsPublic(val)}/>
            <Form.Select
                multiple
                disabled={isPublic}
                placeholder='Select...'
                options={partyOptions}
                onChange={handleObserversChange}/>
        </div>
            <Form.Input
                fluid
                label='Quantity Precision'
                placeholder='quantityPrecision'
                value={quantityPrecision}
                className='issue-asset-form-field'
                onChange={e => setQuantityPrecision(e.currentTarget.value)}
            />
            <Button
                primary
                loading={loading}
                disabled={!name || !quantityPrecision || !description}
                className='issue-asset-submit-button'
                onClick={submit}>
                    Submit
            </Button>
        </FormErrorHandled>
    )
}

export default IssueAsset;
