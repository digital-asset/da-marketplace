import React, { useState } from 'react'
import { Button, Card, Header, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties, useStreamFetchByKeyAsPublic } from '@daml/dabl-react'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'
import { RegisteredExchange } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import { WalletIcon } from '../../icons/Icons'
import { ExchangeInfo, DepositInfo, wrapDamlTuple } from '../common/damlTypes'
import { parseError, ErrorMessage } from '../common/errorTypes'
import FormErrorHandled from '../common/FormErrorHandled'
import Page from '../common/Page'

type Props = {
    deposits: DepositInfo[];
    exchanges: ExchangeInfo[];
    exchangeMap: Map<any, any>;
    sideNav: React.ReactElement;
    onLogout: () => void;
}

const InvestorWallet: React.FC<Props> = ({ deposits, exchanges, sideNav, onLogout }) => {
    return (
        <Page
            sideNav={sideNav}
            menuTitle={<><WalletIcon/>Wallet</>}
            onLogout={onLogout}
        >
            <Header as='h2'>Holdings</Header>
            <div className='investor-wallet'>
                { deposits.map(deposit => {

                    const { asset, account } = deposit.contractData;
                    const options = exchanges.map(exchange => {
                        console.log(exchange.name);
                        return {
                            key:  exchange.contractData.exchange, // exchange.contractId,
                            text: exchange.name.concat(' (', exchange.contractData.exchange, ')'),
                            value: exchange.contractData.exchange
                        }
                    })
                    return (
                        <Card fluid key={deposit.contractId}>
                            {asset.quantity} {asset.id.label} | {account.id.label}
                            <AllocationForm depositCid={deposit.contractId} options={options}/>
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
}

const AllocationForm: React.FC<FormProps> = ({ depositCid, options }) => {
    const [ exchange, setExchange ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<ErrorMessage>();

    const operator = useWellKnownParties().userAdminParty;
    const investor = useParty();
    const ledger = useLedger();

    const handleDepositAllocation = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        try {
            const key = wrapDamlTuple([operator, investor]);
            const args = { depositCid, provider: exchange };
            await ledger.exerciseByKey(Investor.Investor_AllocateToProvider, key, args);
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

export default InvestorWallet;
