import React from 'react'
import { useParams } from 'react-router-dom'
import { Header, Table } from 'semantic-ui-react'

import { useStreamQuery } from '@daml/react'
import { Token } from '@daml.js/da-marketplace/lib/Marketplace/Token'

import './IssueAsset.css'

const IssuedToken = () => {
    const { tokenId } = useParams()

    const token = useStreamQuery(Token).contracts.find(c => c.contractId === tokenId)
    console.log(token)
    return (
        <>
            <Header as='h3'>{token?.payload.id.label}</Header>
            <Header as='h3'>Trend Over Time</Header>
            <Header as='h3'>Position Holdings</Header>
            <Table basic='very' striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell></Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </>
    )
}

export default IssuedToken;
