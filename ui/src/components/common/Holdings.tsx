import React, { useState } from 'react'
import { Button, Header, Form } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQueries } from '@daml/react'
import { ContractId } from '@daml/types'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { WalletIcon } from '../../icons/Icons'
import { DepositInfo, wrapDamlTuple, getAccountProvider } from './damlTypes'
import { groupDeposits, sumDeposits, countDecimals } from './utils'
import { useOperator } from './common'
import FormErrorHandled from './FormErrorHandled'
import PageSection from './PageSection'
import Page from './Page'

import "./Holdings.css"

export type DepositProvider = {
    party: string;
    label: string;
}

type Props = {
    deposits: DepositInfo[];
    providers: DepositProvider[];
    role: MarketRole;
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Holdings: React.FC<Props> = ({ deposits, providers, role, sideNav, onLogout }) => {
    const depositsGrouped = groupDeposits(deposits);
    const depositsSummed = sumDeposits(deposits);
    const assetSections = Object.entries(depositsGrouped)
        .map(([assetLabel, depositsForAsset]) => {
            return (
                <div className='asset-section' key={assetLabel}>
                    <Header as='h4'>{assetLabel}</Header>
                    <p>Total: <b>{depositsSummed[assetLabel]}</b></p>
                    { depositsForAsset.map(deposit => {
                        return (
                            <div key={deposit.contractId} className='deposit-row'>
                                <div>{deposit.contractData.asset.quantity}</div>
                                <div>{deposit.contractData.account.provider}</div>
                                <ProviderForm
                                    deposit={deposit}
                                    providers={providers}
                                    role={role}/>
                                <MergeForm
                                    availableDeposits={depositsForAsset}
                                    deposit={deposit}/>
                                <SplitForm deposit={deposit}/>
                            </div>
                        )
                    })}
                </div>
            )
        })

    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><WalletIcon/>Wallet</>}
            onLogout={onLogout}
        >
            <PageSection border='blue' background='white'>
                <Header as='h2'>Holdings</Header>
                <div className='wallet'>
                    { assetSections }
                </div>
            </PageSection>
        </Page>
    )
}

type ProviderFormProps = {
    deposit: DepositInfo;
    providers: DepositProvider[];
    role: MarketRole;
}

const ProviderForm: React.FC<ProviderFormProps> = ({ deposit, providers, role }) => {
    const operator = useOperator();
    const party = useParty();
    const ledger = useLedger();

    const [ provider, setProvider ] = useState('');

    const depositCid = deposit.contractId;
    const { account } = deposit.contractData;

    const providerOptions = providers
        .filter(provider => provider.party !== getAccountProvider(account.id.label))
        .map(provider => ({
            key: provider.party,
            text: provider.label,
            value: provider.party
        }));

    const handleProviderChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setProvider(result.value);
        }
    }

    const allocateToProvider = async () => {
        const key = wrapDamlTuple([operator, party]);
        const args = { depositCid, provider };

        switch(role) {
            case MarketRole.InvestorRole:
                await ledger.exerciseByKey(Investor.Investor_AllocateToProvider, key, args);
                break;
            case MarketRole.BrokerRole:
                await ledger.exerciseByKey(Broker.Broker_AllocateToProvider, key, args);
                break;
            default:
                throw new Error(`The ${role} role can not allocate deposits.`)
        }
        setProvider('');
    }

    return (
        <FormErrorHandled className='inline-form' onSubmit={allocateToProvider}>
            <Form.Group className='inline-form-group deposit-action'>
                <Form.Select
                    clearable
                    value={provider}
                    placeholder='Select...'
                    options={providerOptions}
                    onChange={handleProviderChange}/>
                <Button
                    primary
                    disabled={provider === ''}
                    content='Allocate to Provider'/>
            </Form.Group>
        </FormErrorHandled>
    )
}

type MergeFormProps = {
    availableDeposits: DepositInfo[];
    deposit: DepositInfo;
}

const MergeForm: React.FC<MergeFormProps> = ({ availableDeposits, deposit }) => {
    const [ mergeAssets, setMergeAssets ] = useState<string[]>([])
    const ledger = useLedger();

    const { asset } = deposit.contractData;

    const assetOptions = availableDeposits
        .filter(d => d.contractId !== deposit.contractId)
        .filter(d => d.contractData.asset.id.label === asset.id.label)
        .filter(d => d.contractData.account.id.label === deposit.contractData.account.id.label)
        .map(d => {
            return {
                key: d.contractId,
                text: `${d.contractData.asset.id.label} ${d.contractData.asset.quantity}`,
                value: d.contractId
            }
        })

    const handleMergeAssetsChange = (event: React.SyntheticEvent, result: any) => {
        setMergeAssets(result.value)
    }

    const assetDepositMerge = async () => {
        const args = { depositCids: mergeAssets };
        const cid = deposit.contractId as ContractId<AssetDeposit>
        await ledger.exercise(AssetDeposit.AssetDeposit_Merge, cid, args)
        setMergeAssets([]);
    }

    return (
        <FormErrorHandled onSubmit={assetDepositMerge}>
            <Form.Group className='inline-form-group deposit-action'>
                <Form.Select
                    multiple
                    placeholder='Select...'
                    options={assetOptions}
                    onChange={handleMergeAssetsChange}/>
                <Button
                    primary
                    disabled={mergeAssets.length === 0}
                    content='Merge'/>
            </Form.Group>
        </FormErrorHandled>
    )
}

type SplitFormProps = {
    deposit: DepositInfo;
}

const SplitForm: React.FC<SplitFormProps> = ({ deposit }) => {
    const { asset } = deposit.contractData;
    const ledger = useLedger();
    const [ splitNumberError, setSplitNumberError ] = useState<string>()

    const tokenQuantityPrecision = Number(useStreamQueries(Token, () => [], [], (e) => {
        console.log("Unexpected close from Token: ", e);
    }).contracts
            .find(t => t.payload.id.label == deposit.contractData.asset.id.label &&
                       t.payload.id.version === t.payload.id.version)?.payload.quantityPrecision) || 0

    const [ splitAssetDecimal, setSplitAssetDecimal ] = useState<number>()

    const handleSplitAsset = async () => {
        if (!splitAssetDecimal) {
            return
        }

        const args = { quantities: [String(splitAssetDecimal)] };
        const cid = deposit.contractId as ContractId<AssetDeposit>
        await ledger.exercise(AssetDeposit.AssetDeposit_Split, cid, args)
        setSplitAssetDecimal(undefined)
    }

    const validateSplitNumber = (event: React.SyntheticEvent, result: any) => {
        const number = Number(result.value)

        if (number >= Number(asset.quantity)) {
            return setSplitNumberError(`The splitting quantity must be less than ${asset.quantity}`)
        }

        if (number <= 0) {
            return setSplitNumberError(`The splitting quantity must be greater than 0.`)
        }

        if (countDecimals(number) > tokenQuantityPrecision) {
            return setSplitNumberError(`The decimal precision of the splitting quantity must be equal to ${tokenQuantityPrecision !== 0 && 'or less than'} ${tokenQuantityPrecision}.`)
        }

        setSplitNumberError(undefined)
        setSplitAssetDecimal(number)
    }

    return (
        <FormErrorHandled className='inline-form' onSubmit={handleSplitAsset}>
            <Form.Group className='inline-form-group deposit-action'>
                <Form.Input
                    type='number'
                    step={`0.${"0".repeat(tokenQuantityPrecision === 0? tokenQuantityPrecision : tokenQuantityPrecision-1)}1`}
                    placeholder={`0.${"0".repeat(tokenQuantityPrecision)}`}
                    error={splitNumberError}
                    onChange={validateSplitNumber}/>
                <Button
                    primary
                    disabled={!splitAssetDecimal}
                    content='Split'/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default Holdings;