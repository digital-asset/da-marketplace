import React, { useState } from 'react'
import { Button, Header, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { ContractId } from '@daml/types'
import { Asset } from '@daml.js/da-marketplace/lib/DA/Finance/Types'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { WalletIcon } from '../../icons/Icons'
import { useRegistryLookup } from './RegistryLookup'
import { ExchangeInfo, DepositInfo, wrapDamlTuple, getAccountProvider } from './damlTypes'
import { useOperator } from './common'
import FormErrorHandled from './FormErrorHandled'
import PageSection from './PageSection'
import Page from './Page'

import "./Holdings.css"

type Props = {
    deposits: DepositInfo[];
    exchanges: ExchangeInfo[];
    role: MarketRole;
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const Holdings: React.FC<Props> = ({ deposits, exchanges, role, sideNav, onLogout }) => {
    const exchangeLookup = useRegistryLookup().exchangeMap;
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
                                const name = exchangeLookup.get(exchange.contractData.exchange)?.name;
                                return {
                                    key: exchange.contractId,
                                    text: name ? `${name} (${exchangeParty})` : exchangeParty,
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
                                depositCid={deposit.contractId}
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
    depositCid: string;
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

const AllocationForm: React.FC<FormProps> = ({ asset, provider, role, depositCid, exchangeOptions, assetOptions}) => {
    const operator = useOperator();
    const party = useParty();
    const ledger = useLedger();

    const [ exchange, setExchange ] = useState('');
    const [ mergeAssets, setMergeAssets ] = useState<string[]>([])
    const [ splitAssetDecimal, setSplitAssetDecimal ] = useState<number>()

    function clearForm() {
        setExchange('')
        setMergeAssets([])
        setSplitAssetDecimal(undefined)
    }

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

        if (splitAssetDecimal >= Number(asset.quantity)) {
            const error = {
                header: 'Invalid Split Quantity',
                message: `The splitting quantity must be less than ${asset.quantity}`
            };
            throw error;
        }

        if (splitAssetDecimal <= 0 ){
            const error = {
                header: 'Invalid Split Quantity',
                message: `The splitting quantity must be greater than 0.`
            };
            throw error;
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
                        options={assetOptions}
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
                        placeholder='0'
                        value={splitAssetDecimal}
                        onChange={e => setSplitAssetDecimal(e.currentTarget.valueAsNumber)}/>
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
