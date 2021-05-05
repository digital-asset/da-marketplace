import React, {useState} from 'react'
import {Button, Form, Header} from 'semantic-ui-react'

import {useLedger, useParty} from '@daml/react'
import {Exchange} from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import {Token} from '@daml.js/da-marketplace/lib/Marketplace/Token'
import {AssetType} from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import {CCPExchangeRelationship} from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterparty'
import {Derivative} from '@daml.js/da-marketplace/lib/Marketplace/Derivative'

import {useRegistryLookup} from '../common/RegistryLookup'
import {ExchangeIcon} from '../../icons/Icons'
import {useContractQuery} from '../../websocket/queryStream'

import {useOperator} from '../common/common'
import {DerivativeInfo, TokenInfo, wrapDamlTuple} from '../common/damlTypes'
import {countDecimals, preciseInputSteps} from '../common/utils'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'
import FormToggle from '../common/FormToggle'
import {Id} from '@daml.js/da-marketplace/lib/DA/Finance/Types'

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
    const quantityPrecision = Number(baseToken?.contractData.quantityPrecision) || 0

    const ccpRelationships = useContractQuery(CCPExchangeRelationship);
    const { ccpMap } = useRegistryLookup();
    const ccpOptions = ccpRelationships
        .map(relationship => {
            const party = relationship.contractData.ccp;
            const name = ccpMap.get(party)?.name;
            return {
                key: party,
                text: name ? name : party,
                value: party
            }
        });

    const handleSetCcp = (event: React.SyntheticEvent, result: any) => {
        setCcpInput(result.value);
        setDefaultCCP(result.value);
    }

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

    type AssetMap = Map<string, {id: Id, assetType: AssetType}>

    const tokenMap: AssetMap = new Map(allTokens.map(tk =>
        [String(tk.contractId), {
            id: tk.contractData.id,
            assetType: AssetType.TokenAsset
        }]
    ));

    const derivativeMap: AssetMap = new Map(allDerivatives.map(dr =>
        [String(dr.contractId), {
            id: dr.contractData.id,
            assetType: AssetType.DerivativeAsset
        }]
    ));

    const allMap = new Map([...Array.from(tokenMap.entries()), ...Array.from(derivativeMap.entries())]);
    const allOptions = [...allTokenOptions, ...allDerivativeOptions]

    const handleQuoteOptionSet = (event: React.SyntheticEvent, result: any) => {
        setQuoteOption(result.value);
    }
    const handleBaseOptionSet = (event: React.SyntheticEvent, result: any) => {
        setBaseOption(result.value);
    }

    const getType = (val: string) => {
        const asset = allMap.get(val);
        if (!asset) {
            throw new Error('Option not found');
        }

        return asset.assetType;
    }

    const handleIdPairSubmit = async () => {
        if (clearedMarket) {
            if (!baseOption || !quoteOption) {
                throw new Error('Options not selected');
            }
            const baseId = allMap.get(baseOption)?.id;
            const quoteId = allMap.get(quoteOption)?.id;

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
                        <div className='contract-select-container'>
                            <Form.Select
                                multiple={false}
                                label={<p>Base</p>}
                                className='create-market-select'
                                disabled={allOptions.length === 0}
                                placeholder='Select...'
                                options={allOptions}
                                onChange={handleBaseOptionSet}/>
                        </div>
                        <ExchangeIcon/>
                        <div className='contract-select-container'>
                            <Form.Select
                                multiple={false}
                                label={<p>Quote</p>}
                                className='create-market-select'
                                disabled={allOptions.length === 0}
                                placeholder='Select...'
                                options={allOptions}
                                onChange={handleQuoteOptionSet}/>
                        </div>
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

                { clearedMarket && (ccpOptions.length == 0 ?
                        <p>You must have a relationship with a Clearinghouse to list a cleared market!</p>
                    : (
                        <Form.Select
                            clearable
                            className='beneficiary-select'
                            label='CCP Party'
                            // value={ccpInput}
                            placeholder='Select...'
                            options={ccpOptions}
                            onChange={handleSetCcp}/>
                    )
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
