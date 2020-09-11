import React, { useState } from 'react'
import { Button, Card, Header, Form, Message } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { Investor } from '@daml.js/da-marketplace/lib/Marketplace/Investor'

import { getWellKnownParties } from '../../config'
import { WalletIcon } from '../../icons/Icons'
import { wrapDamlTuple } from '../common/Tuple'
import Page from '../common/Page'

import { DepositInfo, ExchangeInfo } from './Investor'
import './InvestorWallet.css'

type Props = {
    deposits: DepositInfo[];
    exchanges: ExchangeInfo[];
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
                        return {
                            key: exchange.contractId,
                            text: exchange.contractData.exchange,
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
    const [ error, setError ] = useState('');

    const investor = useParty();
    const ledger = useLedger();

    const handleDepositAllocation = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        try {
            const { operator } = await getWellKnownParties();

            const key = wrapDamlTuple([operator, investor]);
            const args = { depositCid, exchange };
            await ledger.exerciseByKey(Investor.Investor_AllocateToExchange, key, args);
            setError('');
        } catch (err) {
            setError(err.errors.join('\n'));
        }
        setLoading(false);
    }

    return (
        <Form loading={loading} error={error.length > 0}>
            <Form.Group widths='equal'>
                <Form.Select
                    value={exchange}
                    options={options}
                    onChange={(_, result) => {
                        if (typeof result.value === 'string') {
                            setExchange(result.value);
                        }
                    }}/>
                <Button
                    primary
                    content='Allocate to Exchange'
                    onClick={handleDepositAllocation}/>
            </Form.Group>
            <Message
                error
                header='DAML JSON API error'
                content={error}/>
        </Form>
    )
}

export default InvestorWallet;
