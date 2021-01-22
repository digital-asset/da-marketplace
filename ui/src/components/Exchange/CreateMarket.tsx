import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { ExchangeIcon, PublicIcon } from '../../icons/Icons'
import { useContractQuery } from '../../websocket/queryStream'

import { useOperator } from '../common/common'
import { TokenInfo, wrapDamlTuple } from '../common/damlTypes'
import { countDecimals, preciseInputSteps } from '../common/utils'
import FormErrorHandled from '../common/FormErrorHandled'
import ContractSelect from '../common/ContractSelect'
import PageSection from '../common/PageSection'
import Page from '../common/Page'

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const CreateMarket: React.FC<Props> = ({ sideNav, onLogout }) => {
    const [ baseToken, setBaseToken ] = useState<TokenInfo>();
    const [ quoteToken, setQuoteToken ] = useState<TokenInfo>();

    const [ minQuantity, setMinQuantity ] = useState('');
    const [ maxQuantity, setMaxQuantity ] = useState('');

    const [ minQuantityError, setMinQuantityError ] = useState<string>()
    const [ maxQuantityError, setMaxQuantityError ] = useState<string>()

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useOperator();

    const allTokens: TokenInfo[] = useContractQuery(Token);
    const quantityPrecision = Number(baseToken?.contractData.quantityPrecision) || 0

    const handleIdPairSubmit = async () => {
        if (!baseToken || !quoteToken) {
            throw new Error('Tokens not selected');
        }

        if (minQuantity > maxQuantity) {
            throw new Error('min quantity is greater than max quantity');
        }

        const key = wrapDamlTuple([operator, exchange]);
        const args = {
            baseTokenId: baseToken.contractData.id,
            quoteTokenId: quoteToken.contractData.id,
            minQuantity: minQuantity,
            maxQuantity: maxQuantity
        };

        await ledger.exerciseByKey(Exchange.Exchange_AddPair, key, args);

        setBaseToken(undefined);
        setQuoteToken(undefined);
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
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><PublicIcon size='24'/>Create a Market</>}
        >
            <PageSection>
                <div className='create-market'>
                    <FormErrorHandled onSubmit={handleIdPairSubmit}>
                        <div className='create-market-options'>
                            <ContractSelect
                                clearable
                                className='create-market-select'
                                contracts={allTokens}
                                label='Base Asset'
                                placeholder='Select...'
                                value={baseToken?.contractId || ''}
                                getOptionText={token => token.contractData.id.label}
                                setContract={token => setBaseToken(token)}/>

                            <div className='token-select-exchange-icon'><ExchangeIcon/></div>

                            <ContractSelect
                                clearable
                                className='create-market-select'
                                contracts={allTokens.filter(t => t.contractId !== baseToken?.contractId)}
                                label='Quote Asset'
                                placeholder='Select...'
                                value={quoteToken?.contractId || ''}
                                getOptionText={token => token.contractData.id.label}
                                setContract={token => setQuoteToken(token)}/>

                        </div>

                        <div className='create-market-quantities'>
                            <Form.Input
                                label='Minimum Quantity'
                                type='number'
                                step={step}
                                placeholder={placeholder}
                                error={minQuantityError}
                                disabled={!quoteToken || !baseToken}
                                onChange={validateMinQuantity}/>

                            <Form.Input
                                label='Maximum Quantity'
                                type='number'
                                step={step}
                                placeholder={placeholder}
                                error={maxQuantityError}
                                disabled={!quoteToken || !baseToken}
                                onChange={validateMaxQuantity}/>
                        </div>
                            <Button
                                content='Submit'
                                className='create-market-save ghost'
                                disabled={!baseToken || !quoteToken}/>
                        </FormErrorHandled>
                </div>
            </PageSection>
        </Page>
    )
}

export default CreateMarket;
