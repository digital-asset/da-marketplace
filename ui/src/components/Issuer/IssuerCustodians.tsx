import React, { useState } from 'react'

import { Button, Form, Header } from 'semantic-ui-react'

import { useStreamQuery, useParty, useLedger } from '@daml/react'

import { RegisteredCustodian } from '@daml.js/da-marketplace/lib/Marketplace/Registry'
import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'
import { CustodianRelationshipRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custodian'

import { wrapDamlTuple } from '../common/Tuple'

import { getWellKnownParties } from '../../config'

const IssuerCustodians = () => {
    const custodians = useStreamQuery(RegisteredCustodian).contracts
    const requests = useStreamQuery(CustodianRelationshipRequest).contracts
    const ledger = useLedger();
    const issuer = useParty();

    const [ custodian, setCustodian ] = useState<string>('')

    console.log(requests)

    async function submit() {
        const { operator } = await getWellKnownParties();

        if (!custodian) {
            return
        }

        const key = wrapDamlTuple([operator, issuer]);
        const args = { custodian };

        await ledger.exerciseByKey(Issuer.Issuer_RequestCustodianRelationship, key, args);
    }

    return (
        <>
            <Form size='large' className='issue-asset-form'>
                <div className='issue-asset-form-item'>
                    <p>Request a relationship with a custodian.</p>
                    <p><i>Enter the custodian's party Id</i></p>
                    <Form.Input
                        fluid
                        placeholder='custodian'
                        value={custodian}
                        className='issue-asset-form-field'
                        onChange={e => setCustodian(e.currentTarget.value)}
                    />
                </div>
                <Button
                    primary
                    disabled={!custodian}
                    className='issue-asset-submit-button'
                    onClick={submit}>
                        Submit
                </Button>
            </Form>
            <Header as='h4'>Pending Requests:</Header>
            {requests.map((r) =>
                <div>
                    {r.payload.custodian}
                </div>
            )}
        </>
    )
}
export default IssuerCustodians;
