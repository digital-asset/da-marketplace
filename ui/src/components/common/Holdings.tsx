import React, { useState } from 'react'
import { Button, Card, Header, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Broker } from '@daml.js/da-marketplace/lib/Marketplace/Broker'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { MarketRole } from '@daml.js/da-marketplace/lib/Marketplace/Utils'

import { WalletIcon } from '../../icons/Icons'
import { ExchangeInfo, DepositInfo, wrapDamlTuple } from './damlTypes'
import { parseError, ErrorMessage } from './errorTypes'
import FormErrorHandled from './FormErrorHandled'
import Page from './Page'


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
            <Header as='h2'>Holdings</Header>
            <div className='wallet'>
                { deposits.map(deposit => {
                    const { asset, account } = deposit.contractData;
                    const options = exchanges.map(exchange => {
                        return {
                            key: exchange.contractId,
                            text: exchange.contractData.exchange,
                            value: exchange.contractData.exchange
                        }
                    })
                    return (
                        <Card fluid key={deposit.contractId}>
                            {asset.quantity} {asset.id.label} | {account.id.label}
                            <AllocationForm depositCid={deposit.contractId} options={options} role={role}/>
                        </Card>
                    )
                })}
            </div>
        </Page>
    )
}

type FormProps = {
    depositCid: string;
    options: {
        key: string;
        text: string;
        value: string;
    }[];
    role: MarketRole;
}

const AllocationForm: React.FC<FormProps> = ({ depositCid, options, role }) => {
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
            <Form.Group widths='equal'>
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
