import React, { useEffect, useState } from 'react'
import { Table } from 'semantic-ui-react'

import PaginationControls from './PaginationControls';

const StripedTable = (props: {
    headings: React.ReactNode[],
    rows: React.ReactNode[][],
    rowsPerPage?: number,
    emptyLabel?: string
}) => {
    const { headings, rows, rowsPerPage, emptyLabel } = props

    const totalPages = rowsPerPage ? Math.ceil(rows.length / rowsPerPage) : 0;

    const [ activePage, setActivePage ] = useState<number>(1);
    const [ activePageRows, setActivePageRows ] = useState<React.ReactNode[][]>([])

    useEffect(()=> {
        if (rowsPerPage) {
            setActivePageRows(rows.slice((activePage-1)*rowsPerPage, activePage*rowsPerPage))
        } else {
            setActivePageRows(rows);
        }
    },[activePage, rows, rowsPerPage])

    return (
        <div className='striped-table'>
            <Table>
                <Table.Header>
                    <Table.Row>
                        {headings.map((heading, index) =>
                            <Table.HeaderCell
                                key={index}
                                textAlign={index+1 > headings.length/2 ? 'right': 'left'}>
                                {heading}
                            </Table.HeaderCell>
                        )}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {rows.length > 0 ?
                        activePageRows.map((row, i) =>
                            <Table.Row key={i}>
                                {row.map((item, j) =>
                                    <Table.Cell
                                        key={j}
                                        textAlign={j+1 > row.length/2 ? 'right': 'left'}>
                                        <b className='label'>{headings[j]}: </b> {item}
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

export default StripedTable;
