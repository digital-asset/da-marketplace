import React, { useEffect, useState } from 'react'
import { Table } from 'semantic-ui-react'

import PaginationControls from './PaginationControls';

const CapTable = (props: {
    headings: string[],
    rows: string[][],
    emptyLabel?: string
}) => {
    const { headings, rows, emptyLabel } = props

    const rowsPerPage = 10
    const totalPages = Math.ceil(rows.length / rowsPerPage)

    const [ activePage, setActivePage ] = useState(1);
    const [ activePageRows, setActivePageRows ] = useState<string[][]>([])

    useEffect(()=> {
        setActivePageRows(rows.slice((activePage-1)*rowsPerPage, activePage*rowsPerPage))
    },[activePage, rows, totalPages])

    return (
        <div className='cap-table'>
            <Table>
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
                        activePageRows.map(row =>
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
                                <i>{emptyLabel || 'none'}</i>
                            </Table.Cell>
                        </Table.Row>
                    }
                </Table.Body>
            </Table>
            {totalPages > 1 &&
                <PaginationControls
                    totalPages={totalPages}
                    onPageChange={(num: number) => setActivePage(num)}/>}
        </div>
    )
}

export default CapTable;
