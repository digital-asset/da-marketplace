import React, { useState } from 'react'
import { Button, Header, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { ContractId } from '@daml/types'
import { Asset } from '@daml.js/da-marketplace/lib/DA/Finance/Types'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'

import { WalletIcon } from '../../icons/Icons'
import { ExchangeInfo, DepositInfo, wrapDamlTuple, getAccountProvider, ContractInfo } from './damlTypes'
import { parseError, ErrorMessage } from './errorTypes'
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
                        const exchangeOptions = exchanges.map(exchange => {
                            return {
                                key: exchange.contractId,
                                text: exchange.contractData.exchange,
                                value: exchange.contractData.exchange
                            }
                        })
                        const assetOptions = deposits.map(d => {
                            return {
                                key: d.contractId,
                                text: `${d.contractData.asset.id.label} - ${d}`,
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
    const [ exchange, setExchange ] = useState('');
    const [ mergeAssets, setMergeAssets ] = useState<string[]>([])
    const [ splitAssetDecimal, setSplitAssetDecimal ] = useState<number>()

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();

    const operator = useWellKnownParties().userAdminParty;
    const party = useParty();
    const ledger = useLedger();

    const handleDepositAllocation = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const key = wrapDamlTuple([operator, party]);
            const args = { depositCid, provider: exchange };
            if (role === MarketRole.InvestorRole) {
                await ledger.exerciseByKey(Investor.Investor_AllocateToProvider, key, args);
            } else if (role === MarketRole.BrokerRole) {
                await ledger.exerciseByKey(Broker.Broker_AllocateToProvider, key, args)
            }
        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    const handleMergeAssets = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const args = { depositCids: mergeAssets };
            const cid = depositCid as ContractId<AssetDeposit>
            await ledger.exercise(AssetDeposit.AssetDeposit_Merge, cid, args)
            clearForm()

        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    const handleSplitAsset = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        if (!splitAssetDecimal) {
            return
        }

        if (splitAssetDecimal >= Number(asset.quantity)){
            setLoading(false);
            return setError({
                header: 'Invalid Split Quantity',
                message: `The splitting quantity must be less than ${asset.quantity}`
            })
        }

        if (splitAssetDecimal <= 0 ){
            setLoading(false);
            return setError({
                header: 'Invalid Split Quantity',
                message: `The splitting quantity must be greater than 0.`
            })
        }

        try {
            const args = { quantities: [String(splitAssetDecimal)] };
            const cid = depositCid as ContractId<AssetDeposit>
            await ledger.exercise(AssetDeposit.AssetDeposit_Split, cid, args)
            clearForm()

        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    const handleExchangeChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setExchange(result.value);
        }
    }

    const handleMergeAssetsChange = (event: React.SyntheticEvent, result: any) => {
        setMergeAssets(result.value)
    }

    function clearForm() {
        setExchange('')
        setMergeAssets([])
        setSplitAssetDecimal(undefined)
    }

    return (
        <FormErrorHandled
            loading={loading}
            error={error}
            clearError={() => setError(undefined)}
            className='holding'
        >
            <Form.Group className='inline-form-group label'>
                <div><b>{asset.id.label}</b> {asset.quantity} | </div>
                <div>Provider: <b>{provider}</b></div>
            </Form.Group>
            <Form.Group className='inline-form-group action' style={{alignItems: "center"}}>
                <Form.Select
                    value={exchange}
                    options={exchangeOptions}
                    onChange={handleExchangeChange}/>
                <Button
                    primary
                    disabled={exchange == ''}
                    content='Allocate to Exchange'
                    onClick={handleDepositAllocation}/>
            </Form.Group>
            <Form.Group className='inline-form-group action' style={{alignItems: "center"}}>
                <Form.Select
                    multiple
                    options={assetOptions}
                    onChange={handleMergeAssetsChange}/>
                <Button
                    primary
                    disabled={mergeAssets.length === 0}
                    content='Merge Assets'
                    onClick={handleMergeAssets}/>
            </Form.Group>
            <Form.Group className='inline-form-group action' style={{alignItems: "center"}}>
                <Form.Input
                    type='number'
                    value={splitAssetDecimal}
                    onChange={e => setSplitAssetDecimal(e.currentTarget.valueAsNumber)}/>
                <Button
                    primary
                    disabled={!splitAssetDecimal}
                    content='Split Asset'
                    onClick={handleSplitAsset}/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default Holdings;
