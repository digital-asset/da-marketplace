import React, { useEffect, useState } from 'react';

import { Form, Button, Header } from 'semantic-ui-react'

import { useHistory } from 'react-router-dom';

import { useParty, useLedger, useStreamQueries } from '@daml/react'
import { useStreamQueryAsPublic } from '@daml/dabl-react'

import { WalletIcon } from '../../icons/Icons'

import { preciseInputSteps, groupDeposits } from './utils'

import Page from '../common/Page'
import PageSection from '../common/PageSection'
import { useOperator } from './common'
import { makeContractInfo, wrapDamlTuple, ContractInfo, DepositInfo } from '../common/damlTypes'
import { DepositProvider, getProviderLabel } from '../common/Holdings';

import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import ContractSelect from './ContractSelect'

const WalletTransaction = (props: {
    transactionType: 'Withdraw' | 'Deposit';
    sideNav: React.ReactElement;
    onLogout: () => void;
    deposits?: DepositInfo[];
    providers?: DepositProvider[];
}) => {
    const { transactionType, sideNav, onLogout, deposits, providers } = props;

    const [ custodianId, setCustodianId ] = useState<string>();
    const [ depositQuantity, setDepositQuantity ] = useState<number>();
    const [ depositCid, setDepositCid ] = useState<string>()
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
            setDepositQuantity(Number(result.value))
        }
    }

    let body

    switch(transactionType) {
        case 'Withdraw':
            body = <>
                <Form.Field>
                    { deposits && providers &&
                        <HoldingsSelector
                            deposits={deposits}
                            providers={providers}
                            selectedDepositCid={depositCid}
                            onSelect={(cid) => setDepositCid(cid)}/>
                    }
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
                                onChange={handleSetDepositQuantity}/>
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
            <PageSection>
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

        setShowSuccessMessage(false)

        let args = {}

        switch(transactionType) {
            case 'Deposit':
                args = {
                    tokenId: token?.contractData.id,
                    depositQuantity,
                    custodian: custodianId
                };

                return await ledger.exerciseByKey(Investor.Investor_RequestDeposit, key, args)
                    .then(_ => history.goBack())

            case 'Withdraw':
                args = { depositCid };

                return await ledger.exerciseByKey(Investor.Investor_RequestWithdrawl, key, args)
                    .then(_ => history.goBack())
        }
    }
}

type Props = {
    deposits: DepositInfo[];
    providers: DepositProvider[];
    onSelect: (cid: string) => void;
    selectedDepositCid?: string;
}

const HoldingsSelector: React.FC<Props> = ({ deposits, providers, onSelect, selectedDepositCid }) => {
    const depositsGrouped = groupDeposits(deposits);

    return (
        <div className='holdings-selector'>
            { Object.entries(depositsGrouped)
                .map(([assetLabel, depositsForAsset]) => {
                    return (
                        <div className='asset-section' key={assetLabel}>
                            { getProviderLabel(assetLabel, providers) }
                            { depositsForAsset.map(deposit =>
                                <DepositRow
                                    key={deposit.contractId}
                                    deposit={deposit}
                                    selected={deposit.contractId === selectedDepositCid}
                                    onClick={()=> onSelect(deposit.contractId)}
                                    />
                            )}
                        </div>
                    )
                })
            }
        </div>
    )
}

type DepositRowProps = {
    deposit: DepositInfo;
    onClick: () => void;
    selected: boolean;
}

const DepositRow: React.FC<DepositRowProps> = ({ deposit, onClick, selected }) => {
    return (
        <div key={deposit.contractId} className={`deposit-row ${selected && 'selected'}`}onClick={onClick}>
            <div className='deposit-row-body'>
                <div className='deposit-info'>
                    <h3>{deposit.contractData.asset.id.label}</h3>
                    <h3>{deposit.contractData.asset.quantity}</h3>
                </div>
            </div>
        </div>
    )
}

export default WalletTransaction;
