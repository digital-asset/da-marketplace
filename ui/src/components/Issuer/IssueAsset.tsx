import React, { useState } from 'react'
import { Button, Checkbox, Form, Header } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import {
    RegisteredCustodian,
    RegisteredIssuer,
    RegisteredInvestor,
    RegisteredExchange,
    RegisteredBroker
} from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import { wrapDamlTuple } from '../common/damlTypes'
import { useOperator } from '../common/common'
import FormErrorHandled from '../common/FormErrorHandled'
import FormToggle from '../common/FormToggle'

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

    const FormLabel = (props: {label: string, subLabel?: string}) => (
        <div className='form-label'>
            <Header as='h3'>{props.label}</Header>
            <p><i>{props.subLabel}</i></p>
        </div>
    )

    return (
        <div className='issue-asset'>
        <FormErrorHandled onSubmit={submit}>
            <div className='issue-asset-fields'>
                <div className='asset-row'>
                    <Form.Input
                        fluid
                        label={<FormLabel label='Asset ID' subLabel='Give this asset a name'/>}
                        value={name}
                        className='issue-asset-form-field'
                        onChange={e => setName(e.currentTarget.value)}/>
                    </div>

                <div className='asset-row'>
                    <Form.TextArea
                        label={<FormLabel label='Description' subLabel='Describe the asset to potential investors'/>}
                        className='issue-asset-form-field'
                        value={description}
                        onChange={e => setDescription(e.currentTarget.value)}/>
                </div>

                <div className='asset-row'>
                    <Form.Input
                        fluid
                        step={1}
                        type='number'
                        label={<FormLabel label='Quantity Precision'/>}
                        value={quantityPrecision}
                        className='issue-asset-form-field'
                        onChange={e => setQuantityPrecision(e.currentTarget.value)}/>
                </div>

                <div className='asset-row'>
                    <FormLabel label='Observers' subLabel='Who should be aware that this has been issued?'/>
                    <div className='observer-select'>
                        <div className='public-select'>
                            <FormLabel label='Public' subLabel='All parties will be aware of this token.'/>
                            <Checkbox checked={isPublic} onClick={() => setIsPublic(!isPublic)}/>
                        </div>
                        <Form.Select
                            multiple
                            label={<FormLabel label='Private' subLabel='Only a set of parties will be aware of this token.'/>}
                            className='issue-asset-form-field select-observer'
                            disabled={isPublic}
                            placeholder='Select...'
                            options={partyOptions}
                            onChange={handleObserversChange}/>
                    </div>
                </div>
                <Button
                    className='ghost'
                    disabled={!name || !quantityPrecision || !description}
                    content='Submit'/>
            </div>
        </FormErrorHandled>
        </div>
    )
}

export default IssueAsset;
