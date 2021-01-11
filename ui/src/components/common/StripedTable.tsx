import React from 'react'
import { Table } from 'semantic-ui-react'

import "./StripedTable.scss"

type CellItem = string | React.ReactElement;

type Props = {
    className?: string;
    header: CellItem[];
    rows: React.ReactElement[];
}

const StripedTable: React.FC<Props> = ({ className, header, rows }) => {
    return (
        <div className={`${className} striped-table-parent`}>
            <Table fixed className='striped-table'>
                <Table.Header className='striped-table-header'>
                        <Table.Row className='striped-table-row'>
                            { header.map((headerCell, index) => (
                                <Table.HeaderCell key={index} className='striped-table-cell'>
                                    { headerCell }
                                </Table.HeaderCell>))}
                        </Table.Row>
                    </Table.Header>

                <Table.Body className='striped-table-body'>
                    { rows }
                </Table.Body>
            </Table>
        </div>
    )
}

export default StripedTable;
