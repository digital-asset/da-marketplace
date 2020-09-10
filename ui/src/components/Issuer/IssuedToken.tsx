import React from 'react'
import { useParams } from 'react-router-dom'
import { Header, List } from 'semantic-ui-react'

import { useStreamQuery } from '@daml/react'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import './IssueAsset.css'

const IssuedToken = () => {
    const { tokenId } = useParams()

    const token = useStreamQuery(Token).contracts.find(c => c.contractId === tokenId)
    const signatories = Object.keys(token?.payload.id.signatories.textMap || [])
    const observers = Object.keys(token?.payload.observers.textMap || [])

    return (
        <>
            <Header as='h3'>{token?.payload.id.label}</Header>
            <Header as='h4'>Issuer:</Header>
            <List verticalAlign='middle'>
                {signatories.map(s =>
                    <List.Item>
                        <List.Content>
                            <p>{s}</p>
                        </List.Content>
                    </List.Item>
                )}
            </List>
            <Header as='h4'>Quantity Precision:</Header>
            {token?.payload.quantityPrecision}
            <Header as='h4'>Observers:</Header>
            <List verticalAlign='middle'>
                {observers.map(o =>
                    <List.Item>
                        <List.Content>
                            <p>{o}</p>
                        </List.Content>
                    </List.Item>
                )}
            </List>
        </>
    )
}

export default IssuedToken;
