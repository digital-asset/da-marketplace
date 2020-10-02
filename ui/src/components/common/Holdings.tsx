import React, { useState } from 'react'
import { Button, Header, Form } from 'semantic-ui-react'

import { useParty, useLedger, useStreamQuery } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { ContractId } from '@daml/types'
import { Asset } from '@daml.js/da-marketplace/lib/DA/Finance/Types'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import { WalletIcon } from '../../icons/Icons'
import { ExchangeInfoRegistered, DepositInfo, wrapDamlTuple, getAccountProvider, ContractInfo } from './damlTypes'

import { countDecimals } from './utils';
import FormErrorHandled from './FormErrorHandled'
import PageSection from './PageSection'
import Page from './Page'

import "./Holdings.css"

type Props = {
    deposits: DepositInfo[];
    exchanges: ExchangeInfoRegistered[];
    role: MarketRole;
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Holdings: React.FC<Props> = ({ deposits, exchanges, role, sideNav, onLogout }) => {
    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><WalletIcon/>Wallet</>}
            onLogout={onLogout}
        >
            <PageSection border='blue' background='white'>
                <Header as='h2'>Holdings</Header>
                <div className='wallet'>
                    { deposits.map(deposit => {
                        const { asset, account } = deposit.contractData;
                        const exchangeOptions = exchanges
                            .filter(exchange => exchange.contractData.exchange !== getAccountProvider(account.id.label))
                            .map(exchange => {
                                const exchangeParty = exchange.contractData.exchange;
                                return {
                                    key: exchange.contractId,
                                    text: exchange.registryData?.name ? `${exchange.registryData.name} (${exchangeParty})`
                                                                    : exchangeParty,
                                    value: exchange.contractData.exchange
                                }
                        })
                        const assetOptions = deposits.map(d => {
                            return {
                                key: d.contractId,
                                text: `${d.contractData.asset.id.label} ${d.contractData.asset.quantity} | Provider: ${d.contractData.account.provider} `,
                                value: d.contractId
                            }
                        }).filter(k => k.key !== deposit.contractId)
                        return (
                            <AllocationForm
                                key={deposit.contractId}
                                asset={asset}
                                role={role}
                                provider={getAccountProvider(account.id.label) || ''}
                                deposit={deposit}
                                exchangeOptions={exchangeOptions}
                                assetOptions={assetOptions}/>
                        )
                    })}
                </div>
            </PageSection>
        </Page>
    )
}

type FormProps = {
    asset: Asset;
    provider: string;
    deposit:  ContractInfo<AssetDeposit>
    exchangeOptions: {
        key: string;
        text: string;
        value: string;
    }[];
    assetOptions: {
        key: string;
        text: string;
        value: string;
    }[];
    role: MarketRole;
}

const AllocationForm: React.FC<FormProps> = ({asset, provider, role, deposit, exchangeOptions, assetOptions}) => {
    const operator = useWellKnownParties().userAdminParty;
    const party = useParty();
    const ledger = useLedger();

    const tokenQuantityPercision = Number(useStreamQuery(Token).contracts
                                   .find(t => t.payload.id.label == deposit.contractData.asset.id.label)?.payload.quantityPrecision)

    const [ exchange, setExchange ] = useState('');
    const [ mergeAssets, setMergeAssets ] = useState<string[]>([])
    const [ splitAssetDecimal, setSplitAssetDecimal ] = useState<number>()

    const [ splitNumberError, setSplitNumberError ] = useState<string>()

    function clearForm() {
        setExchange('')
        setMergeAssets([])
        setSplitAssetDecimal(undefined)
    }

    const depositCid = deposit.contractId

    const filteredAssetOptions = assetOptions.filter(a => a.text.split('| Provider:')[1].trim() === deposit.contractData.account.provider)

    const handleDepositAllocation = async () => {
        const key = wrapDamlTuple([operator, party]);
        const args = { depositCid, provider: exchange };

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

        clearForm();
    }

    const handleMergeAssets = async () => {
        const args = { depositCids: mergeAssets };
        const cid = depositCid as ContractId<AssetDeposit>
        await ledger.exercise(AssetDeposit.AssetDeposit_Merge, cid, args)
        clearForm();
    }

    const handleSplitAsset = async () => {
        if (!splitAssetDecimal) {
            return
        }

        const args = { quantities: [String(splitAssetDecimal)] };
        const cid = depositCid as ContractId<AssetDeposit>
        await ledger.exercise(AssetDeposit.AssetDeposit_Split, cid, args)
        clearForm();
    }

    const handleExchangeChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setExchange(result.value);
        }
    }

    const handleMergeAssetsChange = (event: React.SyntheticEvent, result: any) => {
        setMergeAssets(result.value)
    }

    const validateSplitNumber = (event: React.SyntheticEvent, result: any) => {
        const number = Number(result.value)

        if (number >= Number(asset.quantity)) {
            return setSplitNumberError(`Invalid Split Quantity: The splitting quantity must be less than ${asset.quantity}`)
        }

        if (number < 0) {
            return setSplitNumberError(`Invalid Split Quantity: The splitting quantity must be greater than 0.`)
        }

        if (countDecimals(number) > tokenQuantityPercision) {
            return setSplitNumberError(`Invalid Split Quantity: The decimal percision of the splitting quantity must be equal to or less than ${tokenQuantityPercision}.`)
        }

        setSplitNumberError(undefined)
        setSplitAssetDecimal(number)
    }

    return (
        <FormErrorHandled onSubmit={handleDepositAllocation}>
            { loadAndCatch => <>
                <Form.Group className='inline-form-group label'>
                    <div><b>{asset.id.label}</b> {asset.quantity} | </div>
                    <div>Provider: <b>{provider}</b></div>
                </Form.Group>
                <Form.Group className='inline-form-group action'>
                    <Form.Select
                        value={exchange}
                        placeholder='Select...'
                        disabled={exchangeOptions.length === 0}
                        options={exchangeOptions}
                        onChange={handleExchangeChange}/>
                    <Button
                        primary
                        disabled={exchange === ''}
                        content='Allocate to Exchange'
                        onClick={() => loadAndCatch(handleDepositAllocation)}/>
                </Form.Group>
                <Form.Group className='inline-form-group action'>
                    <Form.Select
                        multiple
                        placeholder='Select...'
                        disabled={filteredAssetOptions.length === 0}
                        options={filteredAssetOptions}
                        onChange={handleMergeAssetsChange}/>
                    <Button
                        primary
                        disabled={mergeAssets.length === 0}
                        content='Merge Assets'
                        onClick={() => loadAndCatch(handleMergeAssets)}/>
                </Form.Group>
                <Form.Group className='inline-form-group action'>
                    <Form.Input
                        type='number'
                        placeholder={`0.${"0".repeat(tokenQuantityPercision)}`}
                        error={splitNumberError}
                        value={splitAssetDecimal}
                        onChange={validateSplitNumber}/>
                    <Button
                        primary
                        disabled={!splitAssetDecimal}
                        content='Split Asset'
                        onClick={() => loadAndCatch(handleSplitAsset)}/>
                </Form.Group></>
            }
        </FormErrorHandled>
    )
}

export default Holdings;
