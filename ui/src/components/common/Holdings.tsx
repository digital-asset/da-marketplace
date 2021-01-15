import React, { useState } from 'react'
import { Button, Header, Form } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQueries } from '@daml/react'
import { ContractId } from '@daml/types'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { IconClose } from '../../icons/Icons'
import { DepositInfo, wrapDamlTuple, getAccountProvider } from './damlTypes'
import { groupDeposits, countDecimals, preciseInputSteps } from './utils'
import { useOperator } from './common'
import FormErrorHandled from './FormErrorHandled'

import OverflowMenu, { OverflowMenuEntry } from '../common/OverflowMenu';

import "./Holdings.scss"

export type DepositProvider = {
    party: string;
    label: string;
}

type Props = {
    deposits: DepositInfo[];
    providers: DepositProvider[];
    role: MarketRole;
    selectableView?: boolean;
}

const Holdings: React.FC<Props> = ({ deposits, providers, role, selectableView }) => {
    const depositsGrouped = groupDeposits(deposits);

    const assetSections = Object.entries(depositsGrouped)
        .map(([assetLabel, depositsForAsset]) => {
            return (
                <div className='asset-section' key={assetLabel}>
                    { getProviderLabel(assetLabel) }
                    { depositsForAsset.map(deposit =>
                        <DepositRow
                            role={role}
                            selectableView={selectableView}
                            key={deposit.contractId}
                            deposit={deposit}
                            providers={providers}
                            depositsForAsset={depositsForAsset}/>
                    )}
                </div>
            )
        })

    return (
        <div className='holdings'>
            { !selectableView && <Header as='h3'>Holdings</Header> }
            { assetSections.length === 0 ?
                <i>none</i> : assetSections }
        </div>
    )

    function getProviderLabel(assetLabel: string) {
        const providerInfo = providers.find(p => p.party === assetLabel)
        return (
            <div className='provider-info'>
                <Header as='h5'>
                    {providerInfo?.label.substring(providerInfo.label.lastIndexOf('|')+1)}
                </Header>
                <p className='p2'>
                    {providerInfo?.party}
                </p>
            </div>
        )
    }
}

type DepositRowProps = {
    deposit: DepositInfo;
    providers: DepositProvider[];
    role: MarketRole;
    depositsForAsset: DepositInfo[];
    selectableView?: boolean;
}

type FormSelectorOptions = 'provider' | 'merge' | 'split'

const DepositRow: React.FC<DepositRowProps> = ({ deposit, providers, role, depositsForAsset, selectableView}) => {
    const [ selectedForm, setSelectedForm ] = useState<FormSelectorOptions>()

    return (
        <div key={deposit.contractId} className={`deposit-row ${selectableView && ''}`}>
            <div className='deposit-row-body'>
                <div className='deposit-info'>
                    <h3>{deposit.contractData.asset.id.label}</h3>
                    <h3>{deposit.contractData.asset.quantity}</h3>
                </div>
                {!selectableView &&
                    <OverflowMenu>
                        <OverflowMenuEntry label='Allocate to Different Provider' onClick={() => setSelectedForm('provider')}/>
                        <OverflowMenuEntry label='Merge' onClick={() => setSelectedForm('merge')}/>
                        <OverflowMenuEntry label='Split' onClick={() => setSelectedForm('split')}/>
                    </OverflowMenu>
                }
            </div>
            <div className='selected-form'>
                {selectedForm === 'provider' &&
                    <ProviderForm
                        onRequestClose={() => setSelectedForm(undefined)}
                        deposit={deposit}
                        providers={providers}
                        role={role}/>}
                {selectedForm === 'merge' &&
                    <MergeForm
                        onRequestClose={() => setSelectedForm(undefined)}
                        availableDeposits={depositsForAsset}
                        deposit={deposit}/>}
                {selectedForm === 'split' &&
                    <SplitForm
                    onRequestClose={() => setSelectedForm(undefined)}
                    deposit={deposit}/>}
            </div>
        </div>
    )
}

type ProviderFormProps = {
    deposit: DepositInfo;
    providers: DepositProvider[];
    role: MarketRole;
    onRequestClose: () => void;
}

const ProviderForm: React.FC<ProviderFormProps> = ({ deposit, providers, role, onRequestClose }) => {
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
        <>
            <div className='selected-form-heading'>
               <p>Allocate to a Different Provider</p>
                <Button
                    className='close-button'
                    onClick={onRequestClose}>
                    <IconClose/>
                </Button>
            </div>
            <FormErrorHandled onSubmit={allocateToProvider}>
                <Form.Group className='stacked-form-group' >
                    <Form.Select
                        clearable
                        label='Select Provider'
                        value={provider}
                        placeholder='Select...'
                        options={providerOptions}
                        onChange={handleProviderChange}/>
                    <Button
                        secondary
                        disabled={provider === ''}
                        content='Submit'/>
                </Form.Group>
            </FormErrorHandled>
        </>
    )
}

type MergeFormProps = {
    availableDeposits: DepositInfo[];
    deposit: DepositInfo;
    onRequestClose: () => void;
}

const MergeForm: React.FC<MergeFormProps> = ({ availableDeposits, deposit, onRequestClose }) => {
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
        <>
            <div className='selected-form-heading'>
               <p>Merge</p>
                <Button
                    className='close-button'
                    onClick={onRequestClose}>
                    <IconClose/>
                </Button>
            </div>
            <FormErrorHandled onSubmit={assetDepositMerge}>
                <Form.Group className='stacked-form-group' >
                    <Form.Select
                        multiple
                        placeholder='Select...'
                        options={assetOptions}
                        onChange={handleMergeAssetsChange}/>
                    <Button
                        secondary
                        disabled={mergeAssets.length === 0}
                        content='Submit'/>
                </Form.Group>
            </FormErrorHandled>
        </>
    )
}

type SplitFormProps = {
    deposit: DepositInfo;
    onRequestClose: () => void;
}

const SplitForm: React.FC<SplitFormProps> = ({ deposit, onRequestClose }) => {
    const { asset } = deposit.contractData;
    const ledger = useLedger();
    const [ splitNumberError, setSplitNumberError ] = useState<string>()

    const tokenQuantityPrecision = Number(useStreamQueries(Token, () => [], [], (e) => {
        console.log("Unexpected close from Token: ", e);
    }).contracts
            .find(t => t.payload.id.label === deposit.contractData.asset.id.label &&
                       t.payload.id.version === deposit.contractData.asset.id.version)?.payload.quantityPrecision) || 0

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

    const { step, placeholder } = preciseInputSteps(tokenQuantityPrecision);

    return (
        <>
            <div className='selected-form-heading'>
               <p>Split</p>
                <Button
                    className='close-button'
                    onClick={onRequestClose}>
                    <IconClose/>
                </Button>
            </div>
            <FormErrorHandled className='inline-form' onSubmit={handleSplitAsset}>
                <Form.Group className='stacked-form-group' >
                    <Form.Input
                        type='number'
                        step={step}
                        placeholder={placeholder}
                        error={splitNumberError}
                        onChange={validateSplitNumber}/>
                    <Button
                        secondary
                        disabled={!splitAssetDecimal}
                        content='Submit'/>
                </Form.Group>
            </FormErrorHandled>
        </>
    )
}

export default Holdings;
