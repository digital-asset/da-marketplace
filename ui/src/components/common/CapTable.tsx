import React from 'react'
import { Table } from 'semantic-ui-react'

const CapTable = (props: {
    headings: string[],
    rows: string[]
}) => {
    const {headings, rows} = props
    return (
        <Table className='issuer-cap-table'>
            <Table.Header>
                <Table.Row>

                    <Table.HeaderCell>Investor</Table.HeaderCell>
                    <Table.HeaderCell>Provider</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Amount</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Percentage Owned</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {nettedTokenDeposits.length > 0 ?
                    nettedTokenDeposits.map(deposit =>
                        <Table.Row>
                            <Table.Cell>{deposit.investor || '-'}</Table.Cell>
                            <Table.Cell>{deposit.provider || '-'}</Table.Cell>
                            <Table.Cell textAlign='right'>{deposit.quantity || '-'}</Table.Cell>
                            <Table.Cell textAlign='right'>{((deposit.quantity/totalAllocatedQuantity)*100).toFixed(1)}%</Table.Cell>
                        </Table.Row>
                    )
                :
                    <Table.Row className='empty-table' >
                        <Table.Cell textAlign={'center'} colSpan={4}>
                            <i>There are no position holdings for this token</i>
                        </Table.Cell>
                    </Table.Row>
                }
            </Table.Body>
        </Table>
    )
}
