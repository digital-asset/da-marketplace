import React, { useState } from 'react'
import { Button, Form, Header } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { AssetType } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { ExchangeIcon } from '../../icons/Icons'
import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import { useOperator } from '../common/common'
import { TokenInfo, DerivativeInfo, wrapDamlTuple } from '../common/damlTypes'
import { countDecimals, preciseInputSteps } from '../common/utils'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'
import FormToggle from '../common/FormToggle'
import { RegisteredCCP } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import {Id} from '@daml.js/da-marketplace/lib/DA/Finance/Types'
import { Derivative } from '@daml.js/da-marketplace/lib/Marketplace/Derivative'

const CreateMarket: React.FC<{}> = () => {
    const [ baseToken, setBaseToken ] = useState<TokenInfo>();
    const [ quoteToken, setQuoteToken ] = useState<TokenInfo>();

    const [ baseOption, setBaseOption ] = useState('');
    const [ quoteOption, setQuoteOption ] = useState('');

    const [ minQuantity, setMinQuantity ] = useState('');
    const [ maxQuantity, setMaxQuantity ] = useState('');
    const [ ccpInput, setCcpInput ] = useState('');
    const [ defaultCCP, setDefaultCCP ] = useState<string | null>(null);
    const [ clearedMarket, setClearedMarket ] = useState(false);

    const [ minQuantityError, setMinQuantityError ] = useState<string>()
    const [ maxQuantityError, setMaxQuantityError ] = useState<string>()

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useOperator();

    const allTokens: TokenInfo[] = useContractQuery(Token);
    const allDerivatives: DerivativeInfo[] = useContractQuery(Derivative);
    const registeredCCPs = useContractQuery(RegisteredCCP, AS_PUBLIC);
    const quantityPrecision = Number(baseToken?.contractData.quantityPrecision) || 0

    const allTokenOptions = allTokens.map(tk => {
            return {
                key: tk.contractId,
                text: `${tk.contractData.id.label} - Spot`,
                value: tk.contractId
            }
        });

    const allDerivativeOptions = allDerivatives.map(dr => {
        return {
            key: dr.contractId,
            text: `${dr.contractData.id.label} - Derivative`,
            value: dr.contractId
        }
    });
    const tokenMap = new Map(allTokens.map(tk => [String(tk.contractId), tk.contractData.id]));
    const derivativeMap = new Map(allDerivatives.map(dr => [String(dr.contractId), dr.contractData.id]));
    const allMap = new Map([...Array.from(tokenMap.entries()), ...Array.from(derivativeMap.entries())]);
    const allOptions = [...allTokenOptions, ...allDerivativeOptions]

    const handleQuoteOptionSet = (event: React.SyntheticEvent, result: any) => {
        setQuoteOption(result.value);
    }
    const handleBaseOptionSet = (event: React.SyntheticEvent, result: any) => {
        setBaseOption(result.value);
    }

    const getType = (val: string) => {
        const derivative = derivativeMap.get(val);
        const token = tokenMap.get(val);
        if (!token && !derivative) {
            throw new Error('Options not found');
        }
        return !derivative ? AssetType.TokenAsset : AssetType.DerivativeAsset;
    }

    const handleIdPairSubmit = async () => {
        if (clearedMarket) {
            if (!baseOption || !quoteOption) {
                throw new Error('Options not selected');
            }
            const baseId = allMap.get(baseOption);
            const quoteId = allMap.get(quoteOption);

            if (!baseId || !quoteId) {
                throw new Error('Options do not exist');
            }

            const baseType = getType(baseOption);
            const quoteType = getType(quoteOption);

            if (+minQuantity > +maxQuantity) {
                throw new Error('Minimum quantity is greater than maximum quantity.');
            }

            const key = wrapDamlTuple([operator, exchange]);
            const args = {
                minQuantity,
                maxQuantity,
                clearedMarket,
                defaultCCP,
                baseTokenId: baseId,
                baseType: baseType,
                quoteTokenId: quoteId,
                quoteType: quoteType
            };

            console.log("Adding pair: ", args);

            await ledger.exerciseByKey(Exchange.Exchange_AddPair, key, args);

            setBaseOption('');
            setQuoteOption('');
        } else {
            if (!baseToken || !quoteToken) {
                throw new Error('Tokens not selected');
            }

            if (+minQuantity > +maxQuantity) {
                throw new Error('Minimum quantity is greater than maximum quantity.');
            }

            const key = wrapDamlTuple([operator, exchange]);
            const args = {
                minQuantity,
                maxQuantity,
                clearedMarket,
                defaultCCP,
                baseTokenId: baseToken.contractData.id,
                baseType: AssetType.TokenAsset,
                quoteTokenId: quoteToken.contractData.id,
                quoteType: AssetType.TokenAsset
            };

            console.log("Adding pair: ", args);

            await ledger.exerciseByKey(Exchange.Exchange_AddPair, key, args);

            setBaseToken(undefined);
            setQuoteToken(undefined);
        }
    }

    const validateMinQuantity = (event: React.SyntheticEvent, result: any) => {
        const number = Number(result.value)

        if (number < 0) {
            return setMinQuantityError(`The min quantity must a positive number.`)
        }

        if (countDecimals(number) > quantityPrecision) {
            return setMinQuantityError(`The decimal precision of this quantity must be equal to ${quantityPrecision !== 0 && 'or less than'} ${quantityPrecision}.`)
        }

        setMinQuantityError(undefined)
        setMinQuantity(number.toString())
    }

    const validateMaxQuantity = (event: React.SyntheticEvent, result: any) => {

        const newMaxQuantity = Number(result.value)
        if (newMaxQuantity < 0) {
            return setMaxQuantityError(`The max quantity must a positive number.`)
        }

        if (countDecimals(newMaxQuantity) > quantityPrecision) {
            return setMaxQuantityError(`The decimal precision of this quantity must be equal to ${quantityPrecision !== 0 && 'or less than'} ${quantityPrecision}.`)
        }

        setMaxQuantityError(undefined)
        setMaxQuantity(newMaxQuantity.toString())
    }

    const { step, placeholder } = preciseInputSteps(quantityPrecision);

    return (
        <div className='create-market'>
            <Header as='h2'>Create a Market</Header>
            <FormErrorHandled onSubmit={handleIdPairSubmit}>
                <div className='create-market-options'>
                    {clearedMarket ? <>
                    <Form.Select
                            multiple={false}
                            label={<p>Base</p>}
                            // className='issue-asset-form-field select-observer'
                            className='create-market-select'
                            disabled={allOptions.length === 0}
                            placeholder='Select...'
                            options={allOptions}
                            onChange={handleBaseOptionSet}/>
                        <Form.Select
                            multiple={false}
                            label={<p>Quote</p>}
                            className='issue-asset-form-field select-observer'
                            disabled={allOptions.length === 0}
                            placeholder='Select...'
                            options={allOptions}
                            onChange={handleQuoteOptionSet}/>
                        </>:<>
                        <ContractSelect
                            clearable
                            className='create-market-select'
                            contracts={allTokens}
                            label='Base Asset'
                            placeholder='Select...'
                            value={baseToken?.contractId || ''}
                            getOptionText={token => token.contractData.id.label}
                            setContract={token => setBaseToken(token)}/>

                        <ExchangeIcon/>

                        <ContractSelect
                            clearable
                            className='create-market-select'
                            contracts={allTokens.filter(t => t.contractId !== baseToken?.contractId)}
                            label='Quote Asset'
                            placeholder='Select...'
                            value={quoteToken?.contractId || ''}
                            getOptionText={token => token.contractData.id.label}
                            setContract={token => setQuoteToken(token)}/>
                        </>}
                </div>

                <div className='create-market-options'>
                    <Form.Input
                        className='quantity-select'
                        label={<p className='p2'>Minimum Quantity</p>}
                        type='number'
                        step={step}
                        placeholder={placeholder}
                        error={minQuantityError}
                        disabled={clearedMarket ? !baseOption || !quoteOption : !baseToken || !quoteToken}
                        onChange={validateMinQuantity}/>

                    <Form.Input
                        className='quantity-select'
                        label={<p className='p2'>Maximum Quantity</p>}
                        type='number'
                        step={step}
                        placeholder={placeholder}
                        error={maxQuantityError}
                        disabled={clearedMarket ? !baseOption || !quoteOption : !baseToken || !quoteToken}
                        onChange={validateMaxQuantity}/>
                </div>

                <FormToggle
                    className='cleared-market-toggle'
                    onLabel='Cleared'
                    offLabel='Collateralized'
                    onClick={cleared => setClearedMarket(cleared)}/>

                { clearedMarket && (
                    <ContractSelect
                        className='ccp-select'
                        contracts={registeredCCPs} // TODO: Lookup from exchange relationships, not public
                        label='CCP Party'
                        placeholder='Select...'
                        value={ccpInput}
                        getOptionText={ccp => ccp.contractData.name}
                        setContract={ccp => setDefaultCCP(ccp.contractData.ccp)}/>
                )}

                <Button
                    content='Submit'
                    className='create-market-save ghost'
                    disabled={clearedMarket ? !baseOption || !quoteOption : !baseToken || !quoteToken}/>
            </FormErrorHandled>
        </div>
    )
}

export default CreateMarket;
