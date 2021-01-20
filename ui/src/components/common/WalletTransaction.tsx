import React, { useEffect, useState } from 'react';

import { Form, Button } from 'semantic-ui-react'

import { useHistory } from 'react-router-dom';

import { useParty, useLedger, useStreamQueries } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'

import { WalletIcon } from '../../icons/Icons'

import { preciseInputSteps, groupDepositsByAsset, sumDepositArray } from './utils'

import Page from '../common/Page'
import PageSection from '../common/PageSection'
import { useOperator } from './common'
import { makeContractInfo, wrapDamlTuple, ContractInfo, DepositInfo } from '../common/damlTypes'
import { DepositProvider } from '../common/Holdings';

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import ContractSelect from './ContractSelect'
import FormErrorHandled from './FormErrorHandled';
import { AppError } from './errorTypes';

const WalletTransaction = (props: {
    transactionType: 'Withdraw' | 'Deposit';
    sideNav: React.ReactElement;
    onLogout: () => void;
    deposits?: DepositInfo[];
    providers?: DepositProvider[];
}) => {
    const { transactionType, sideNav, onLogout, deposits, providers } = props;

    const [ custodianId, setCustodianId ] = useState<string>();
    const [ quantity, setQuantity ] = useState<string>('');
    const [ token, setToken ] = useState<ContractInfo<Token>>();
    const [ showSuccessMessage, setShowSuccessMessage ] = useState<boolean>();

    useEffect(()=> {
        if (showSuccessMessage) {
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 2500);
        }
    }, [showSuccessMessage])

    const operator = useOperator();
    const party = useParty();
    const ledger = useLedger();
    const history = useHistory();

    const registeredCustodians = useStreamQueryAsPublic(RegisteredCustodian).contracts
        .map(makeContractInfo)

    const allTokens = useStreamQueries(Token, () => [], [], (e) => {
            console.log("Unexpected close from Token: ", e);
        }).contracts.map(makeContractInfo)

    const { step, placeholder } = preciseInputSteps(Number(token?.contractData.quantityPrecision));

    const handleSetDepositQuantity = (event: React.SyntheticEvent, result: any) => {
        const quantity = Number(result.value)

        if (quantity > 0) {
            setQuantity(result.value);
        }
    }

    let body = <>
        <Form.Field className='field-step'>
            <ContractSelect
                selection
                label='Select Custodian'
                clearable
                contracts={registeredCustodians}
                placeholder='Custodian ID'
                getOptionText={rc => rc.contractData.name}
                setContract={rc => setCustodianId(rc.contractData.custodian)}/>
        </Form.Field>
        <Form.Field className='field-step'>
            <Form.Group>
                <Form.Field>
                <ContractSelect
                    clearable
                    className='asset-select'
                    contracts={allTokens}
                    label='Asset'
                    placeholder='Select...'
                    value={token?.contractId || ""}
                    getOptionText={token => token.contractData.id.label}
                    setContract={token => setToken(token)}/>
                </Form.Field>
                <Form.Field >
                    <Form.Input
                        type='number'
                        step={step}
                        label={<p className='p2'>Amount</p>}
                        placeholder={placeholder}
                        disabled={!token}
                        onChange={handleSetDepositQuantity}/>
                </Form.Field>
            </Form.Group>
        </Form.Field>
    </>;

    return (
        <Page
            activeMenuTitle
            sideNav={sideNav}
            menuTitle={<><WalletIcon/>Wallet</>}
            onLogout={onLogout}
            >
            <PageSection>
                <div className='wallet-transaction'>
                    <h2>{transactionType} Funds</h2>
                    <FormErrorHandled onSubmit={onSubmit}>
                        {body}
                        <Button className='ghost' type='submit'>
                            Submit
                        </Button>
                    </FormErrorHandled>
                </div>
            </PageSection>
        </Page>
    )

    async function onSubmit() {
        const key = wrapDamlTuple([operator, party]);

        setShowSuccessMessage(false)

        let args = {}

        switch(transactionType) {
            case 'Deposit':
                args = {
                    tokenId: token?.contractData.id,
                    depositQuantity: quantity,
                    custodian: custodianId
                };

                return await ledger.exerciseByKey(Investor.RequestDeposit, key, args)
                    .then(_ => history.goBack())

            case 'Withdraw':
                const depositsByAsset = groupDepositsByAsset(deposits || []);
                const selectedAssetDeposits = depositsByAsset[token?.contractData.id.label || ''];

                if (+quantity > sumDepositArray(selectedAssetDeposits)) {
                    throw new AppError("Invalid withdrawal amount", "Withdraw amount exceeds asset total");
                }

                args = {
                    depositCids: selectedAssetDeposits?.map(d => d.contractId),
                    withdrawalQuantity: quantity,
                };

                return await ledger.exerciseByKey(Investor.RequestWithdrawl, key, args)
                    .then(_ => history.goBack())
        }
    }
}

export default WalletTransaction;
