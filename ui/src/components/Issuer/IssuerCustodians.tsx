import React, { useState } from 'react'

import { Button, Form, Header, List } from 'semantic-ui-react'

import { useStreamQuery, useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'

import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import { CustodianRelationshipRequest, Custodian } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'

import { parseError, ErrorMessage } from '../common/errorTypes'
import { wrapDamlTuple } from '../common/damlTypes'
import FormErrorHandled from '../common/FormErrorHandled'

import './IssuerCustodians.css';

const IssuerCustodians = () => {
    const requests = useStreamQuery(CustodianRelationshipRequest).contracts
    const custodians = useStreamQuery(Custodian).contracts

    const ledger = useLedger();
    const issuer = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const [ custodian, setCustodian ] = useState<string>('')
    const [ error, setError ] = useState<ErrorMessage>();
    const [ loading, setLoading ] = useState(false);

    async function submit() {
        setLoading(true);
        try {
            const args = { custodian };
            const key = wrapDamlTuple([operator, issuer]);
            await ledger.exerciseByKey(Issuer.Issuer_RequestCustodianRelationship, key, args);
        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    return (
        <div>
            <FormErrorHandled
                size='large'
                className='issuer-custodian-form'
                error={error}
                clearError={() => setError(undefined)}
            >
                <div className='issuer-custodian-form-item'>
                    <p>Request a relationship with a custodian.</p>
                    <p><i>Enter the custodian's party Id</i></p>
                    <Form.Input
                        fluid
                        placeholder='custodian'
                        value={custodian}
                        className='issuer-custodian-form-field'
                        onChange={e => setCustodian(e.currentTarget.value)}
                    />
                </div>
                <Button
                    primary
                    disabled={!custodian}
                    className='issuer-custodian-submit-button'
                    onClick={submit}
                    loading={loading}>
                        Submit
                </Button>
            </FormErrorHandled>

            <div className='issuer-custodian-form'>
                <div className='issuer-custodian-form-item'>
                    <Header as='h3'>Outbound Requests:</Header>
                    {requests.length === 0 ?
                        <i> There are no outbound custodian relationship requests. </i>
                        :
                        requests.map(r => <p>{r.payload.custodian}</p>)
                    }
                </div>
                <div className='issuer-custodian-form-item'>
                    <Header as='h3'>Custodians:</Header>
                    { custodians.length === 0 ?
                        <i>There are no approved custodian relationship requests.</i>
                        :
                        custodians.map(c =>
                            <div>
                                {c.payload.custodian}
                                <Header as='h4'>Issuers:</Header>
                                <List verticalAlign='middle'>
                                {c.payload.issuers.map(i =>
                                    <List.Item>
                                        <List.Content>
                                            <p>{i}</p>
                                        </List.Content>
                                    </List.Item>
                                    )}
                                </List>
                                <Header as='h4'>Investors:</Header>
                                <List verticalAlign='middle'>
                                {c.payload.investors.map(i =>
                                    <List.Item>
                                        <List.Content>
                                            <p>{i}</p>
                                        </List.Content>
                                    </List.Item>
                                    )}
                                </List>
                                <Header as='h4'>Exchanges:</Header>
                                <List verticalAlign='middle'>
                                {c.payload.exchanges.map(e =>
                                    <List.Item>
                                        <List.Content>
                                            <p>{e}</p>
                                        </List.Content>
                                    </List.Item>
                                    )}
                                </List>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default IssuerCustodians;
