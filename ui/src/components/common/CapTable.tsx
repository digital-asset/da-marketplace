import React from 'react'
import { Table } from 'semantic-ui-react'

const CapTable = (props: {
    headings: string[],
    rows: string[][],
    emptyLabel: string
}) => {
    const { headings, rows, emptyLabel } = props

    return (
        <Table className='cap-table'>
            <Table.Header>
                <Table.Row>
                    {headings.map((heading, index) =>
                        <Table.HeaderCell
                            textAlign={index+1 > headings.length/2 ? 'right': 'left'}>
                            {heading}
                        </Table.HeaderCell>
                    )}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {rows.length > 0 ?
                    rows.map(row =>
                        <Table.Row>
                            {row.map((item, index) =>
                                <Table.Cell
                                    textAlign={index+1 > row.length/2 ? 'right': 'left'}>
                                    {item}
                                </Table.Cell>
                            )}
                        </Table.Row>
                    )
                :
                    <Table.Row className='empty-table' >
                        <Table.Cell textAlign={'center'} colSpan={4}>
                            <i>{emptyLabel}</i>
                        </Table.Cell>
                    </Table.Row>
                }
            </Table.Body>
        </Table>
    )
}

export default CapTable;
