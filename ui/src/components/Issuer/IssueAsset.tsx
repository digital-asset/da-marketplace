import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useParty, useLedger } from '@daml/react'
import { useWellKnownParties } from '@daml/dabl-react'
import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'

import { wrapDamlTuple } from '../common/Tuple'
import { parseError, ErrorMessage } from '../common/utils'
import FormErrorHandled from '../common/FormErrorHandled'
import FormToggle from '../common/FormToggle'

import './IssueAsset.css'

const IssueAsset = () => {
    const ledger = useLedger();
    const issuer = useParty();
    const operator = useWellKnownParties().userAdminParty;

    const [ name, setName ] = useState<string>('')
    const [ quantityPrecision, setQuantityPrecision ] = useState<string>('')
    const [ description, setDescription ] = useState<string>('')
    const [ isPublic, setIsPublic ] = useState<boolean>(true)
    const [ observers, setObservers ] = useState<string[]>([]);
    const [ error, setError ] = useState<ErrorMessage>();
    const [ loading, setLoading ] = useState(false);

    async function submit() {
        setLoading(true);

        try {
            const key = wrapDamlTuple([operator, issuer]);
            const args = { name, quantityPrecision, description, isPublic, observers};

            await ledger.exerciseByKey(Issuer.Issuer_IssueToken, key, args);
        } catch (err) {
            setError(parseError(err));
        }
        setLoading(false);
    }

    return (
        <FormErrorHandled
            size='large'
            className='issue-asset-form'
            error={error}
            clearError={() => setError(undefined)}
        >
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
                <p>Description</p>
                <p><i>Describe the asset to potential investors.</i></p>
                <Form.TextArea
                    placeholder='description'
                    className='issue-asset-form-field'
                    onChange={e => setDescription(e.currentTarget.value)}
                />
            </div>
            <div className='is-public'>
                <FormToggle
                    defaultChecked
                    className='issue-asset-form-item'
                    onLabel='Public'
                    onInfo='All parties will be aware of this token.'
                    offLabel='Private'
                    offInfo='Only a set of parties will be aware of this token.'
                    onClick={val => setIsPublic(val)}/>

                {!isPublic &&
                    <div className='issue-asset-form-item'>
                        <p>Add Observers</p>
                        <p><i> Input each party Id separated by a comma </i></p>
                        <Form.TextArea
                            placeholder='observers'
                            className='issue-asset-form-field observers'
                            onChange={e => setObservers((e.currentTarget.value).split(','))}
                        />
                    </div>
                }
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
                loading={loading}
                disabled={!name || !quantityPrecision || !description}
                className='issue-asset-submit-button'
                onClick={submit}>
                    Submit
            </Button>
        </FormErrorHandled>
    )
}

export default IssueAsset;
