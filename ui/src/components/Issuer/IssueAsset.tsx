import React, { useState } from 'react'
import { Button, Form, Radio } from 'semantic-ui-react'

import { Issuer } from '@daml.js/da-marketplace/lib/Marketplace/Issuer'

import { useParty, useLedger } from '@daml/react'

import { wrapDamlTuple } from '../common/Tuple'
import { getWellKnownParties } from '../../config'

import './IssueAsset.css'

const IssueAsset = () => {
    const ledger = useLedger();
    const issuer = useParty();

    const [ name, setName ] = useState<string>('')
    const [ quantityPrecision, setQuantityPrecision ] = useState<string>('')
    const [ description, setDescription ] = useState<string>('')
    const [ isPublic, setIsPublic ] = useState<boolean>(true)
    const [ observers, setObservers ] = useState<string[]>([]);

    async function submit() {
        const { operator } = await getWellKnownParties();

        if (!name || !quantityPrecision || !description) {
            return
        }

        const key = wrapDamlTuple([operator, issuer]);
        const args = { name, quantityPrecision, description, isPublic, observers};

        await ledger.exerciseByKey(Issuer.Issuer_IssueToken, key, args);
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
                <p>Description</p>
                <p><i>Describe the asset to potential investors.</i></p>
                <Form.Input
                    fluid
                    placeholder='description'
                    value={description}
                    className='issue-asset-form-field'
                    onChange={e => setDescription(e.currentTarget.value)}
                />
            </div>
            <div className='issue-asset-form-item'>
                {isPublic?
                    <>
                        <p>Public</p>
                        <p><i>All parties will be aware of this token.</i></p>
                    </>
                :
                    <>
                        <p>Private</p>
                        <p><i>Only a set of parties will be aware of this token.</i></p>
                    </>}
                <Radio toggle defaultChecked onClick={() => setIsPublic(!isPublic)}/>
            </div>

            {!isPublic &&
                <>
                    <p>Add Observers</p>
                    <p><i> Input each party Id seporated by a comma </i></p>
                    <Form.Input
                        fluid
                        placeholder='observer'
                        value={observers}
                        className='issue-asset-form-field'
                        onChange={e => setObservers((e.currentTarget.value).split(','))}
                    />
                </>
            }
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
                disabled={!name || !quantityPrecision || !description}
                className='issue-asset-submit-button'
                onClick={submit}>
                    Submit
            </Button>
        </Form>
    )
}

export default IssueAsset;
