import React, { useState } from 'react'
import { Button, Header, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { ContractId } from '@daml/types'
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset'
import { CCPCustomer } from '@daml.js/da-marketplace/lib/Marketplace/CentralCounterpartyCustomer'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { useContractQuery } from '../../websocket/queryStream'

import { IconClose } from '../../icons/Icons'
import { DepositInfo, wrapDamlTuple, getAccountProvider } from './damlTypes'
import { groupDepositsByAsset, groupDepositsByProvider, sumDepositArray, getPartyLabel, IPartyInfo } from './utils'
import { useOperator } from './common'
import { AppError } from './errorTypes'
import FormErrorHandled from './FormErrorHandled'
import { useCCPCustomerNotifications } from '../Investor/CCPCustomerNotifications'
import { useDismissibleNotifications } from './DismissibleNotifications'

import OverflowMenu, { OverflowMenuEntry } from './OverflowMenu'

type Props = {
    deposits: DepositInfo[];
    clearingDeposits: DepositInfo[];
    marginDeposits: DepositInfo[];
    providers: IPartyInfo[];
    role: MarketRole;
}

const Holdings: React.FC<Props> = ({ deposits, clearingDeposits, marginDeposits, providers, role }) => {
    const marginDepositsGrouped = groupDepositsByProvider(marginDeposits);
    const clearingDepositsGrouped = groupDepositsByProvider(clearingDeposits);
    const depositsGrouped = groupDepositsByProvider(deposits);
    const ccpCustomerNotifications = useCCPCustomerNotifications();
    const ccpProviders = useContractQuery(CCPCustomer).map(c => {return c.contractData.ccp});
    const ccpDismissibleNotifications = useDismissibleNotifications()
        .filter(dn => {
            return ccpProviders.includes(dn.props.notification.contractData.sender);
        });

    const assetSections = Object.entries(depositsGrouped)
        .map(([providerLabel, depositsForProvider]) => {
            const assetDeposits = groupDepositsByAsset(depositsForProvider);
            const { label, party }  = getPartyLabel(providerLabel, providers)

            return (
                <div className='asset-sections' key={providerLabel}>
                    <div className='provider-info'>
                        <p className='bold'>
                            {label}
                        </p>
                        <p className='p2'>
                            {party}
                        </p>
                     </div>
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

    const clearingSections = Object.entries(clearingDepositsGrouped)
        .map(([providerLabel, depositsForProvider]) => {
            const assetDeposits = groupDepositsByAsset(depositsForProvider);
            const { label, party }  = getPartyLabel(providerLabel, providers)

            return (
                <div className='asset-sections' key={providerLabel}>
                    <div className='provider-info'>
                        <p className='bold'>
                            {label}
                        </p>
                        <p className='p2'>
                            {party}
                        </p>
                     </div>
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

    const marginSections = Object.entries(marginDepositsGrouped)
        .map(([providerLabel, depositsForProvider]) => {
            const assetDeposits = groupDepositsByAsset(depositsForProvider);

            return (
                <div className='asset-sections' key={providerLabel}>
                    { Object.entries(assetDeposits).map(([assetLabel, deposits]) => (
                        <MarginRow
                            key={assetLabel}
                            assetLabel={assetLabel}
                            deposits={deposits}/>
                    )) }
                </div>
            )
        })

    return (
        <div className='holdings'>
            <Header as='h2'>Holdings</Header>
            { assetSections.length === 0 ?
                <i>none</i> : assetSections }
            <Header as='h2'>Clearing Accounts</Header>
            { ccpCustomerNotifications }
            { ccpDismissibleNotifications }
            { clearingSections.length === 0 ?
                <i>none</i> : clearingSections }
            <Header as='h3'>Margin Account</Header>
            { marginSections.length === 0 ?
                <i>none</i> : marginSections }
        </div>
    )
}

type MarginRowProps = {
    assetLabel: string;
    deposits: DepositInfo[];
}

const MarginRow: React.FC<MarginRowProps> = ({
    assetLabel,
    deposits,
}) => {
    const totalQty = sumDepositArray(deposits);

    return (
        <div className='deposit-row'>
            <div className='deposit-info'>
                <Header as='h3' className='bold'>{assetLabel}</Header>
                <Header as='h3' >{totalQty}</Header>
            </div>
        </div>
    )
}

type DepositRowProps = {
    assetLabel: string;
    deposits: DepositInfo[];
    providers: IPartyInfo[];
    role: MarketRole;
}

const DepositRow: React.FC<DepositRowProps> = ({
    assetLabel,
    deposits,
    providers,
    role
}) => {
    const [ showForm, setShowForm ] = useState<boolean>(false)
    const totalQty = sumDepositArray(deposits);
    const providerLabel = deposits.find(_ => true)?.contractData.account.id.label;

    return (
        <div className='deposit-row'>
            <div className='deposit-info'>
                <Header as='h3' className='bold'>{assetLabel}</Header>
                <Header as='h3' >{totalQty}</Header>
                <Button className='ghost' onClick={() => setShowForm(!showForm)}>
                    Allocate to Different Provider
                </Button>
                <OverflowMenu>
                    <OverflowMenuEntry label='Allocate to Different Provider' onClick={() => setShowForm(!showForm)}/>
                </OverflowMenu>
            </div>
            <div className='selected-form'>
                {showForm &&
                    <ProviderForm
                        onRequestClose={() => setShowForm(false)}
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
    depositCids: ContractId<AssetDeposit>[];
    providers: IPartyInfo[];
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
            throw new AppError("Invalid amount quantity", "Amount greater than total allocated funds.");
        }

        switch(role) {
            case MarketRole.InvestorRole:
                await ledger.exerciseByKey(Investor.Investor_AllocateToProvider, key, args);
                break;
            case MarketRole.BrokerRole:
                await ledger.exerciseByKey(Broker.Broker_AllocateToProvider, key, args);
                break;
            default:
                throw new AppError("Invalid role selected", `The ${role} role can not allocate deposits.`)
        }
        setProvider('');
    }

    return (
        <>
            <div className='selected-form-heading'>
               <Header as='h3'>Allocate to a Different Provider</Header>
                <Button
                    className='close-button'
                    onClick={onRequestClose}>
                    <IconClose/>
                </Button>
            </div>
            <FormErrorHandled onSubmit={allocateToProvider}>
                <Form.Select
                    clearable
                    label={<p>Select Provider</p>}
                    value={provider}
                    placeholder='Select...'
                    options={providerOptions}
                    onChange={handleProviderChange}/>

                <Form.Input
                    clearable
                    label={<p>Allocation Amount</p>}
                    value={amount}
                    onChange={handleAmountChange}/>

                <Button
                    className='ghost'
                    disabled={provider === ''}
                    content='Submit'/>
            </FormErrorHandled>
        </>
    )
}

export default Holdings;
