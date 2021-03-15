import React, { useState } from 'react'
import { Button, Form, Header } from 'semantic-ui-react'

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

import classNames from 'classnames';

import { wrapDamlTuple, TokenInfo } from '../common/damlTypes'
import { useOperator } from '../common/common'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'

import { LockIcon, PublicIcon, IconCircledCheck } from '../../icons/Icons'
import {Token} from '@daml.js/da-marketplace/lib/Marketplace/Token'

const IssueDerivative = () => {
    const ledger = useLedger();
    const issuer = useParty();
    const operator = useOperator();

    const allTokens: TokenInfo[] = useContractQuery(Token);

    const [ prodSym, setProdSym ] = useState<string>('')
    const [ prodCode, setProdCode ] = useState<string>('')
    const [ description, setDescription ] = useState<string>('')
    const [ pricePrecision, setPricePrecision ] = useState<string>('')
    const [ mmy, setMMY ] = useState<string>('')
    const [ mult, setMult ] = useState<string>('')
    const [ uom, setUom ] = useState<string>('')
    const [ underlying, setUnderlying ] = useState<TokenInfo>();
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
        if (!underlying) {
            throw new Error('Underlying not selected');
        }
        const key = wrapDamlTuple([operator, issuer]);
        const underlyingId = underlying.contractData.id;
        const args = {
            prodSym,
            prodCode,
            description,
            pricePrecision,
            mmy,
            mult,
            uom,
            underlying: underlyingId,
            isPublic,
            observers,
            secType: null,
            optionData: null}

        await ledger.exerciseByKey(Issuer.Issuer_IssueDerivative, key, args);
        clearForm()
    }

    function clearForm () {
        setProdSym('')
        setProdCode('')
        setDescription('')
        setPricePrecision('')
        setMMY('')
        setMult('')
        setUom('')
        setUnderlying(undefined)
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
                        label={<FormLabel label='Prod Symbol' subLabel='e.g. BTCF21'/>}
                        value={prodSym}
                        className='issue-asset-form-field'
                        onChange={e => setProdSym(e.currentTarget.value)}/>
                </div>
                <div className='asset-row'>
                    <Form.Input
                        fluid
                        label={<FormLabel label='Prod Code' subLabel='e.g. BTC'/>}
                        value={prodCode}
                        className='issue-asset-form-field'
                        onChange={e => setProdCode(e.currentTarget.value)}/>
                </div>

                <div className='asset-row'>
                    <Form.Input
                        fluid
                        label={<FormLabel label='MMY' subLabel='YYYYMM or YYYYMMDD or YYYMMwN'/>}
                        value={mmy}
                        className='issue-asset-form-field'
                        onChange={e => setMMY(e.currentTarget.value)}/>
                </div>

                <div className='asset-row'>
                    <Form.Input
                        fluid
                        step={1}
                        type='number'
                        label={<FormLabel label='Price Precision'/>}
                        value={pricePrecision}
                        className='issue-asset-form-field'
                        onChange={e => setPricePrecision(e.currentTarget.value)}/>
                </div>

                <div className='asset-row'>
                    <Form.Input
                        fluid
                        step={1}
                        type='number'
                        label={<FormLabel label='Contract Multiplier'/>}
                        value={mult}
                        className='issue-asset-form-field'
                        onChange={e => setMult(e.currentTarget.value)}/>
                </div>

                <div className='asset-row'>
                    <Form.Input
                        fluid
                        label={<FormLabel label='Unit of Measurement' subLabel='Barrels, bushels, coins, etc.'/>}
                        value={uom}
                        className='issue-asset-form-field'
                        onChange={e => setUom(e.currentTarget.value)}/>
                </div>

                <div className='asset-row'>
                    <Form.TextArea
                        label={<FormLabel label='Description' subLabel='Describe the asset to potential investors'/>}
                        className='issue-asset-form-field'
                        value={description}
                        onChange={e => setDescription(e.currentTarget.value)}/>
                </div>

                <div className='asset-row'>
                    <ContractSelect
                        clearable
                        className='asset-select'
                        contracts={allTokens}
                        label='Asset'
                        placeholder='Underlying instrument...'
                        value={underlying?.contractId || ""}
                        getOptionText={token => token.contractData.id.label}
                        setContract={token => setUnderlying(token)}/>
                </div>

                <div className='asset-row'>
                    <FormLabel label='Observers' subLabel='Who should be aware that this has been issued?'/>
                    <div className='button-toggle'>
                        <Button
                            type="button"
                            className={classNames('ghost checked', {'darken': !isPublic})}
                            onClick={() => setIsPublic(true)}>
                            { isPublic && <IconCircledCheck/> }
                            <PublicIcon/><p>Public</p>
                        </Button>
                        <Button
                            type="button"
                            className={classNames('ghost checked', {'darken': isPublic})}
                            onClick={() => setIsPublic(false)}>
                            { !isPublic && <IconCircledCheck/> }
                            <LockIcon/><p>Private</p>
                        </Button>
                    </div>
                    {!isPublic &&
                        <Form.Select
                            multiple
                            className='issue-asset-form-field select-observer'
                            disabled={isPublic}
                            placeholder='Select...'
                            options={partyOptions}
                            onChange={handleObserversChange}/>}
                </div>
                <Button
                    type='submit'
                    className='ghost'
                    disabled={!prodSym || !prodCode || !mmy || !mult || !uom || !underlying}
                    content='Submit'/>
            </div>
        </FormErrorHandled>
        </div>
    )
}

export default IssueDerivative;
