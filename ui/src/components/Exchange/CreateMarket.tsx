import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQuery } from '@daml/react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { ExchangeIcon, PublicIcon } from '../../icons/Icons'
import { wrapDamlTuple } from '../common/Tuple'
import { parseError, ErrorMessage } from '../common/utils'
import FormErrorHandled from '../common/FormErrorHandled'
import Page from '../common/Page'

import { TokenInfo } from './Exchange'
import TokenSelect from './TokenSelect'
import { useWellKnownParties } from '@daml/dabl-react'

import "./CreateMarket.css"

type Props = {
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const CreateMarket: React.FC<Props> = ({ sideNav, onLogout }) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();
    const [ baseToken, setBaseToken ] = useState<TokenInfo>();
    const [ quoteToken, setQuoteToken ] = useState<TokenInfo>();

    const allTokens: TokenInfo[] = useStreamQuery(Token).contracts
        .map(tc => ({ contractId: tc.contractId, contractData: tc.payload }));

    const ledger = useLedger();
    const exchange = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const clearForm = () => {
        setLoading(false);
        setBaseToken(undefined);
        setQuoteToken(undefined);
    }

    const handleTokenPairSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        try {
            if (!baseToken || !quoteToken) {
                throw new Error('Tokens not selected');
            }

            const key = wrapDamlTuple([operator, exchange]);
            const args = {
                baseTokenId: baseToken.contractData.id,
                quoteTokenId: quoteToken.contractData.id
            };

            await ledger.exerciseByKey(Exchange.Exchange_AddPair, key, args);
            clearForm();
        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

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

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><PublicIcon/>Create a Market</>}
        >
            <div className='create-market'>
                <FormErrorHandled
                    loading={loading}
                    error={error}
                    clearError={() => setError(undefined)}
                    onSubmit={handleTokenPairSubmit}
                >
                    <div className='create-market-options'>
                        <TokenSelect
                            label='Base Token'
                            className='create-market-select'
                            tokens={allTokens}
                            selected={baseToken?.contractId}
                            setTokenCid={contractId => handleTokenSelect(contractId, setBaseToken)}/>

                        <div className='token-select-exchange-icon'><ExchangeIcon/></div>

                        <TokenSelect
                            label='Quote Token'
                            className='create-market-select'
                            tokens={allTokens}
                            selected={quoteToken?.contractId}
                            setTokenCid={contractId => handleTokenSelect(contractId, setQuoteToken)}/>
                    </div>
                    <Button
                        basic
                        content='Save'
                        className='create-market-save'
                        disabled={!baseToken || !quoteToken}/>
                </FormErrorHandled>
            </div>
        </Page>
    )
}

export default CreateMarket;
