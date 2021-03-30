import React, { useEffect, useState } from 'react';

import { Form, Button, Header } from 'semantic-ui-react'

import { useHistory } from 'react-router-dom';

import { useParty, useLedger } from '@daml/react'

import { WalletIcon, IconClose} from '../../icons/Icons'

import { preciseInputSteps, groupDepositsByAsset, sumDepositArray } from './utils'

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import {  wrapDamlTuple, ContractInfo, DepositInfo } from './damlTypes'

import { AS_PUBLIC, useContractQuery } from '../../websocket/queryStream'

import { useOperator } from './common'
import { AppError } from './errorTypes'
import FormErrorHandled from './FormErrorHandled'
import ContractSelect from './ContractSelect'
import PageSection from './PageSection'
import Page from './Page'

const WalletTransaction = (props: {
    transactionType: 'Withdraw' | 'Deposit';
    sideNav: React.ReactElement;
    onLogout: () => void;
    deposits?: DepositInfo[];
    showNotificationAlert?: boolean;
    handleNotificationAlert?: () => void;
}) => {
    const { transactionType, sideNav, onLogout, deposits, showNotificationAlert, handleNotificationAlert } = props;

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

    const registeredCustodians = useContractQuery(RegisteredCustodian, AS_PUBLIC);
    const allTokens = useContractQuery(Token);

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
                        label={<p>Amount</p>}
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
            showNotificationAlert={showNotificationAlert}
            handleNotificationAlert={handleNotificationAlert}
        >
            <PageSection>
                <div className='wallet-transaction'>
                    <Header as='h2'>{transactionType} Funds</Header>
                    <FormErrorHandled onSubmit={onSubmit}>
                        {body}
                        <div className='actions'>
                            <Button className='ghost' type='submit'>
                                Submit
                            </Button>
                            <a className='a2' onClick={() => history.goBack()}><IconClose/> Cancel</a>
                        </div>
                    </FormErrorHandled>
                </div>
            </PageSection>
        </Page>
    )

    async function onSubmit() {
        if (!token || !custodianId) { return; }
        const key = wrapDamlTuple([operator, party]);
        setShowSuccessMessage(false)

        switch(transactionType) {
            case 'Deposit':
                const depositArgs = {
                    tokenId: token.contractData.id,
                    depositQuantity: quantity,
                    custodian: custodianId
                };

                return await ledger.exerciseByKey(Investor.Investor_RequestDeposit, key, depositArgs)
                    .then(_ => history.goBack())

            case 'Withdraw':
                const depositsByAsset = groupDepositsByAsset(deposits || []);
                const selectedAssetDeposits = depositsByAsset[token?.contractData.id.label || ''];

                if (+quantity > sumDepositArray(selectedAssetDeposits)) {
                    throw new AppError("Invalid withdrawal amount", "Withdraw amount exceeds asset total");
                }

                const withdrawlArgs = {
                    depositCids: selectedAssetDeposits?.map(d => d.contractId),
                    withdrawalQuantity: quantity,
                };

                return await ledger.exerciseByKey(Investor.Investor_RequestWithdrawl, key, withdrawlArgs)
                    .then(_ => history.goBack())
        }
    }
}

export default WalletTransaction;
