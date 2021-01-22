import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'
import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'

import { wrapDamlTuple } from '../common/damlTypes'
import { useOperator } from '../common/common'
import FormErrorHandled from '../common/FormErrorHandled'
import FormToggle from '../common/FormToggle'
import {
    RegisteredCustodian,
    RegisteredIssuer,
    RegisteredInvestor,
    RegisteredExchange,
    RegisteredBroker
} from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

const IssueAsset = () => {
    const ledger = useLedger();
    const issuer = useParty();
    const operator = useOperator();

    const [ name, setName ] = useState<string>('')
    const [ quantityPrecision, setQuantityPrecision ] = useState<string>('')
    const [ description, setDescription ] = useState<string>('')
    const [ isPublic, setIsPublic ] = useState<boolean>(true)
    const [ observers, setObservers ] = useState<string[]>([]);

    const allRegisteredParties = [
            useContractQuery(RegisteredCustodian, AS_PUBLIC)
                .map(rc => ({ contractId: rc.contractId, contractData: rc.contractData.custodian })),
            useContractQuery(RegisteredIssuer, AS_PUBLIC)
                .map(ri => ({ contractId: ri.contractId, contractData: ri.contractData.issuer })),
            useContractQuery(RegisteredInvestor, AS_PUBLIC)
                .map(ri => ({ contractId: ri.contractId, contractData: ri.contractData.investor })),
            useContractQuery(RegisteredExchange, AS_PUBLIC)
                .map(re => ({ contractId: re.contractId, contractData: re.contractData.exchange })),
            useContractQuery(RegisteredBroker, AS_PUBLIC)
                .map(rb => ({ contractId: rb.contractId, contractData: rb.contractData.broker }))
            ].flat()

    async function submit() {
        const key = wrapDamlTuple([operator, issuer]);
        const args = { name, quantityPrecision, description, isPublic, observers};

        await ledger.exerciseByKey(Issuer.Issuer_IssueToken, key, args);
        clearForm()
    }

    function clearForm () {
        setName('')
        setQuantityPrecision('')
        setDescription('')
        setIsPublic(true)
        setObservers([])
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
        <FormErrorHandled onSubmit={submit}>
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
            <div className='observer-select'>
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
                    className='issue-asset-form-field select-observer'
                    disabled={isPublic}
                    placeholder='Select...'
                    options={partyOptions}
                    onChange={handleObserversChange}
                />
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
                className='ghost'
                disabled={!name || !quantityPrecision || !description}
                content='Submit'>
            </Button>
        </FormErrorHandled>
    )
}

export default IssueAsset;
