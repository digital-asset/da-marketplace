import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQuery } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Exchange } from '@daml.js/da-marketplace/lib/Marketplace/Exchange'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { ExchangeIcon, PublicIcon } from '../../icons/Icons'
import { TokenInfo, wrapDamlTuple } from '../common/damlTypes'
import { parseError, ErrorMessage } from '../common/errorTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import PageSection from '../common/PageSection'
import ContractSelect from '../common/ContractSelect'
import Page from '../common/Page'

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

    return (
        <Page
            sideNav={sideNav}
            onLogout={onLogout}
            menuTitle={<><PublicIcon/>Create a Market</>}
        >
            <PageSection border='blue' background='white'>
                <div className='create-market'>
                    <FormErrorHandled
                        loading={loading}
                        error={error}
                        clearError={() => setError(undefined)}
                        onSubmit={handleTokenPairSubmit}
                    >
                        <div className='create-market-options'>
                            <ContractSelect
                                clearable
                                className='create-market-select'
                                contracts={allTokens}
                                label='Base Token'
                                getOptionText={token => token.contractData.id.label}
                                setContract={token => setBaseToken(token)}/>

                            <div className='token-select-exchange-icon'><ExchangeIcon/></div>

                            <ContractSelect
                                clearable
                                className='create-market-select'
                                contracts={allTokens.filter(t => t.contractId !== baseToken?.contractId)}
                                label='Quote Token'
                                getOptionText={token => token.contractData.id.label}
                                setContract={token => setQuoteToken(token)}/>
                        </div>
                        <Button
                            basic
                            content='Save'
                            className='create-market-save'
                            disabled={!baseToken || !quoteToken}/>
                    </FormErrorHandled>
                </div>
            </PageSection>
        </Page>
    )
}

export default CreateMarket;
