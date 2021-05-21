import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Loader, Table } from 'semantic-ui-react';
import { ArrowRightIcon } from '../../icons/icons';

import PaginationControls from './PaginationControls';

interface IStripedTableRow {
  elements: React.ReactNode[];
  onClick?: () => void;
}

const StripedTable = (props: {
  headings: React.ReactNode[];
  rows: IStripedTableRow[];
  loading?: boolean;
  rowsClickable?: boolean;
  clickableIcon?: JSX.Element;
  showLabel?: boolean;
}) => {
  const { headings, rows, loading, rowsClickable, showLabel, clickableIcon } = props;

  const clickIcon =
    clickableIcon || (rowsClickable && !clickableIcon ? <ArrowRightIcon /> : undefined);

  const rowsPerPage = 10;

  const totalPages = rowsPerPage ? Math.ceil(rows.length / rowsPerPage) : 0;

  const [activePage, setActivePage] = useState<number>(1);
  const [activePageRows, setActivePageRows] = useState<IStripedTableRow[]>([]);

  useEffect(() => {
    if (rowsPerPage) {
      setActivePageRows(rows.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage));
    } else {
      setActivePageRows(rows);
    }
  }, [activePage, rows, rowsPerPage]);

  // TODO: In body of empty table, provide a link to whatever needs to be done to make the table un-empty
  if (activePageRows.length === 0) {
    return (
      <div className="striped-table empty">
        <p className="p2">This table contains on data...yet..</p>
      </div>
    );
  }

  return (
    <div className="striped-table">
      <Table>
        <Table.Header>
          <Table.Row>
            {headings.map((heading, index) => (
              <Table.HeaderCell
                key={index}
                textAlign={index + 1 > headings.length / 2 ? 'right' : 'left'}
              >
                {heading}
              </Table.HeaderCell>
            ))}
            {!!clickIcon && <Table.HeaderCell></Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        {loading ? (
          <Table.Body>
            <Table.Row className="loading-table">
              <Table.Cell textAlign={'center'} colSpan={headings.length}>
                <Loader active indeterminate size="small" />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ) : (
          <Table.Body>
            {activePageRows.map((row, i) => (
              <Table.Row
                key={i}
                className={classNames({ clickable: rowsClickable })}
                onClick={row.onClick}
              >
                {row.elements.map((item, j) => (
                  <Table.Cell
                    key={j}
                    textAlign={j + 1 > row.elements.length / 2 ? 'right' : 'left'}
                  >
                    {showLabel && <b className="label">{headings[j]}: </b>} {item}
                  </Table.Cell>
                ))}
                {!!clickIcon && (
                  <Table.Cell key={row.elements.length + 1} textAlign={'right'}>
                    {clickIcon}
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        )}
      </Table>
      {totalPages > 1 && (
        <PaginationControls
          totalPages={totalPages}
          onPageChange={(num: number) => setActivePage(num)}
        />
      )}
    </div>
  );
};

export default StripedTable;
