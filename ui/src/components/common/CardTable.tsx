import React from 'react'
import { Table } from 'semantic-ui-react'

import "./CardTable.css"

type CellItem = string | React.ReactElement;

type Props = {
    className?: string;
    header?: CellItem[];
    rows: CellItem[][];
}

const CardTable: React.FC<Props> = ({ className, header, rows }) => {
    return (
        <div className={`${className} card-table`}>
            {/* Split the header into its own table because `border-spacing` would affect the header if included in the body table */}

            { header && (
                <Table fixed className='card-table-header-table'>
                    <Table.Header className='card-table-header'>
                        <Table.Row className='card-table-row'>
                            { header.map((headerCell, index) => (
                                <Table.HeaderCell key={index} className='card-table-cell'>
                                    {headerCell}
                                </Table.HeaderCell>))}
                        </Table.Row>
                    </Table.Header>
                </Table>
            )}

            <Table fixed className='card-table-body-table'>
                <Table.Body>
                { rows.map((row, rowIndex) => (
                    <Table.Row key={rowIndex} className='card-table-row'>
                        { row.map((cell, cellIndex) => (
                            <Table.Cell key={cellIndex} className='card-table-cell'>{cell}</Table.Cell>
                        )) }
                    </Table.Row>
                ))}
                </Table.Body>
            </Table>
        </div>
    )
}

export default CardTable;
