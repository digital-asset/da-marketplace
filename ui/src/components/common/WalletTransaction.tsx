import React, { useState } from 'react';

import { Form, Button } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQueries } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'

import { WalletIcon } from '../../icons/Icons'

import { preciseInputSteps } from './utils'

import Page from '../common/Page'
import PageSection from '../common/PageSection'
import { useOperator } from './common'
import { RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { makeContractInfo, wrapDamlTuple, ContractInfo } from '../common/damlTypes'

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'

import ContractSelect from './ContractSelect'

const WalletTransaction = (props: {
    transactionType: 'Withdraw' | 'Deposit';
    sideNav: React.ReactElement;
    onLogout: () => void;
}) => {
    const { transactionType, sideNav, onLogout } = props;

    const [ custodianId, setCustodianId ] = useState<string>();
    const [ depositQuantity, setDepositQuantity ] = useState<number>();
    const [ depositCid, setDepositCid ] = useState<string>()
    const [ token, setToken ] = useState<ContractInfo<Token>>();

    const operator = useOperator();
    const party = useParty();
    const ledger = useLedger();

    const registeredCustodians = useStreamQueryAsPublic(RegisteredCustodian).contracts
        .map(makeContractInfo)

    const allTokens = useStreamQueries(Token, () => [], [], (e) => {
            console.log("Unexpected close from Token: ", e);
        }).contracts.map(makeContractInfo)

    const allDeposits = useStreamQueries(AssetDeposit, () => [], [], (e) => {
            console.log("Unexpected close from assetDepositBroker: ", e);
        }).contracts.map(makeContractInfo);

    const { step, placeholder } = preciseInputSteps(Number(token?.contractData.quantityPrecision));

    let body

    switch(transactionType) {
        case 'Withdraw':
            body = <>
                <Form.Field>
                    <ContractSelect
                        clearable
                        className='asset-select'
                        contracts={allDeposits}
                        label='Select Deposit'
                        placeholder='Select...'
                        value={depositCid || ""}
                        getOptionText={deposit => `${deposit.contractData.asset.quantity} ${deposit.contractData.asset.id.label} `}
                        setContract={deposit => setDepositCid(deposit.contractId)}/>
                </Form.Field>
            </>
            break;
        case 'Deposit':
            body = <>
                <Form.Field className='field-step'>
                    <ContractSelect
                        selection
                        label='Select Custodian'
                        clearable
                        contracts={registeredCustodians}
                        placeholder='Custodian ID'
                        value={custodianId || ""}
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
                                label='Amount'
                                placeholder={placeholder}
                                disabled={!token}
                                onChange={e => setDepositQuantity(Number(e))}/>
                        </Form.Field>
                    </Form.Group>
                </Form.Field>
            </>
            break;
    }

    return (
        <Page
            sideNav={sideNav}
            activeMenuTitle={true}
            menuTitle={<><WalletIcon/>Wallet</>}
            onLogout={onLogout}
            >
            <PageSection border='blue' background='grey'>
                <div className='wallet-transaction'>
                    <h2>{transactionType} Funds</h2>
                    <Form onSubmit={() => onSubmit()}>
                        {body}
                        <Button className='ghost' type='submit'>
                            Submit
                        </Button>
                    </Form>
                </div>
            </PageSection>
        </Page>
    )

    async function onSubmit() {
        const key = wrapDamlTuple([operator, party]);
        let args = {}

        switch(transactionType) {
            case 'Deposit':
                args = {
                    tokenId: token?.contractData.id,
                    depositQuantity,
                    custodian: custodianId
                };
                return await ledger.exerciseByKey(Investor.Investor_RequestDeposit, key, args);
            case 'Withdraw':
                args = { depositCid };
                return await ledger.exerciseByKey(Investor.Investor_RequestWithdrawl, key, args);
        }
    }
}

export default WalletTransaction;
