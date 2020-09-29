import React, { useState } from 'react'
import { Button, Header, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Asset } from '@daml.js/da-marketplace/lib/DA/Finance/Types'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { WalletIcon } from '../../icons/Icons'
import { ExchangeInfoRegistered, DepositInfo, wrapDamlTuple, getAccountProvider } from './damlTypes'
import { parseError, ErrorMessage } from './errorTypes'
import FormErrorHandled from './FormErrorHandled'
import PageSection from './PageSection'
import Page from './Page'


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
                        const options = exchanges.map(exchange => {
                            const exchangeParty = exchange.contractData.exchange;
                            return {
                                key: exchange.contractId,
                                text: exchange.registryData?.name + ' (' + exchangeParty + ')' || exchangeParty,
                                value: exchange.contractData.exchange
                            }
                        })
                        return (
                            <AllocationForm
                                key={deposit.contractId}
                                asset={asset}
                                role={role}
                                provider={getAccountProvider(account.id.label) || ''}
                                depositCid={deposit.contractId}
                                options={options}/>
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
    options: {
        key: string;
        text: string;
        value: string;
    }[];
    role: MarketRole;
}

const AllocationForm: React.FC<FormProps> = ({ asset, provider, role, depositCid, options }) => {
    const [ exchange, setExchange ] = useState('');
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

    const handleExchangeChange = (event: React.SyntheticEvent, result: any) => {
        if (typeof result.value === 'string') {
            setExchange(result.value);
        }
    }

    return (
        <FormErrorHandled
            loading={loading}
            error={error}
            clearError={() => setError(undefined)}
        >
            <Form.Group className='inline-form-group'>
                <div><b>{asset.id.label}</b> {asset.quantity} | </div>
                <div>Provider: <b>{provider}</b></div>
            </Form.Group>
            <Form.Group className='inline-form-group' style={{alignItems: "center"}}>
                <Form.Select
                    value={exchange}
                    options={options}
                    onChange={handleExchangeChange}/>
                <Button
                    primary
                    content='Allocate to Exchange'
                    onClick={handleDepositAllocation}/>
            </Form.Group>
        </FormErrorHandled>
    )
}

export default Holdings;
