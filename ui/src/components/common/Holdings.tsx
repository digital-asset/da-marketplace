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
import { groupDepositsByAsset, groupDepositsByProvider, countDecimals, preciseInputSteps, StringKeyedObject, sumDepositArray } from './utils'
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
}

const Holdings: React.FC<Props> = ({ deposits, providers, role }) => {
    const depositsGrouped = groupDepositsByProvider(deposits);

    const assetSections = Object.entries(depositsGrouped)
        .map(([providerLabel, depositsForProvider]) => {
            const assetDeposits = groupDepositsByAsset(depositsForProvider);

            return (
                <div className='asset-section' key={providerLabel}>
                    { getProviderLabel(providerLabel) }
                    { Object.entries(assetDeposits).map(([assetLabel, deposits]) => (
                        <DepositRow
                            key={assetLabel}
                            assetLabel={assetLabel}
                            role={role}
                            deposits={deposits}
                            providers={providers}/>
                    )) }
                </div>
            )
        })

    return (
        <div className='holdings'>
            <Header as='h3'>Holdings</Header>
            { assetSections }
        </div>
    )

    function getProviderLabel(providerLabel: string) {
        const providerInfo = providers.find(p => p.party === providerLabel)
        return (
            <div className='provider-info'>
                <Header as='h5'>
                    {providerInfo?.label}
                </Header>
                <p className='p2'>
                    {providerInfo?.party}
                </p>
            </div>
        )
    }
}

type DepositRowProps = {
    assetLabel: string;
    deposits: DepositInfo[];
    providers: DepositProvider[];
    role: MarketRole;
}

type FormSelectorOptions = 'provider' | 'merge' | 'split'

const DepositRow: React.FC<DepositRowProps> = ({
    assetLabel,
    deposits,
    providers,
    role
}) => {
    const [ selectedForm, setSelectedForm ] = useState<FormSelectorOptions>()
    const totalQty = sumDepositArray(deposits);
    const providerLabel = deposits.find(_ => true)?.contractData.account.id.label;

    return (
        <div className='deposit-row'>
            <div className='deposit-row-body'>
                <div className='deposit-info'>
                    <h3>{assetLabel}</h3>
                    <h3>{totalQty}</h3>
                </div>
                <OverflowMenu>
                    <OverflowMenuEntry label='Allocate to Different Provider' onClick={() => setSelectedForm('provider')}/>
                </OverflowMenu>
            </div>
            <div className='selected-form'>
                {selectedForm === 'provider' &&
                    <ProviderForm
                        onRequestClose={() => setSelectedForm(undefined)}
                        depositCids={deposits.map(d => d.contractId)}
                        totalQty={totalQty}
                        providers={providers}
                        providerLabel={providerLabel}
                        role={role}/>}
            </div>
        </div>
    )
}

type ProviderFormProps = {
    depositCids: string[];
    providers: DepositProvider[];
    providerLabel?: string;
    totalQty: number;
    role: MarketRole;
    onRequestClose: () => void;
}

const ProviderForm: React.FC<ProviderFormProps> = ({
    depositCids,
    providers,
    providerLabel,
    totalQty,
    role,
    onRequestClose
}) => {
    const operator = useOperator();
    const party = useParty();
    const ledger = useLedger();

    const [ provider, setProvider ] = useState('');
    const [ amount, setAmount ] = useState('');

    const providerOptions = providers
        .filter(provider =>
            providerLabel && (provider.party !== getAccountProvider(providerLabel)))
        .map(provider => ({
            key: provider.party,
            text: provider.label,
            value: provider.party
        }));

    const handleAmountChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setAmount(result.value);
        }
    }

    const handleProviderChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setProvider(result.value);
        }
    }

    const allocateToProvider = async () => {
        const key = wrapDamlTuple([operator, party]);
        const args = { depositCids, amount, provider };

        if (+amount > totalQty) {
            throw new Error("Amount greater than total allocated funds.");
        }

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

                    <Form.Input
                        clearable
                        label='Allocation Amount'
                        value={amount}
                        onChange={handleAmountChange}/>

                    <Button
                        secondary
                        disabled={provider === ''}
                        content='Submit'/>
                </Form.Group>
            </FormErrorHandled>
        </>
    )
}

export default Holdings;
