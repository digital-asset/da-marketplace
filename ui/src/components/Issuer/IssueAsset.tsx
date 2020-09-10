import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Role'

import { getWellKnownParties } from '../../config'

import './IssueAsset.css'

const IssueAsset = () => {
    const ledger = useLedger();
    const issuer = useParty();

    const [ name, setName ] = useState<string>('')
    const [ quantityPrecision, setQuantityPrecision ] = useState<string>('')

    async function submit() {
        const { operator } = await getWellKnownParties();

        if (!name || !quantityPrecision) {
            return
        }

        await ledger.exerciseByKey(Issuer.Issuer_IssueToken, { _1: operator, _2: issuer }, { name, quantityPrecision });
    }

    return (
        <Form size='large' className='issue-asset-form'>
            <div className='issue-asset-form-item'>
                <p>Asset ID</p>
                <p><i>Give this asset a name.</i></p>
                <Form.Input
                    fluid
                    placeholder='name'
                    value={name}
                    className='issue-asset-form-field'
                    onChange={e => setName(e.currentTarget.value)}
                />
            </div>
            <div className='issue-asset-form-item'>
                <p>Quantity Precision</p>
                <Form.Input
                    fluid
                    placeholder='quantityPrecision'
                    value={quantityPrecision}
                    className='issue-asset-form-field'
                    onChange={e => setQuantityPrecision(e.currentTarget.value)}
                />
            </div>
            <Button
                primary
                disabled={!name || !quantityPrecision}
                className='issue-asset-submit-button'
                onClick={submit}>
                    Submit
            </Button>
        </Form>
    )
}

export default IssueAsset;
