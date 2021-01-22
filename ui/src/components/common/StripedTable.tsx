import React from 'react'
import { Table } from 'semantic-ui-react'
import classNames from 'classnames'

type CellItem = string | React.ReactElement;

type Props = {
    className?: string;
    header: CellItem[];
    rows: string[][];
}

const StripedTable: React.FC<Props> = ({ className, header, rows }) => {
    return (
        <Table fixed className={classNames('striped-table', className)}>
            <Table.Header>
                    <Table.Row>
                        { header.map((headerCell, index) => (
                            <Table.HeaderCell key={index}>
                                { headerCell }
                            </Table.HeaderCell>))}
                    </Table.Row>
                </Table.Header>

            <Table.Body>
                { rows }
            </Table.Body>
        </Table>
    )
}

export default StripedTable;
