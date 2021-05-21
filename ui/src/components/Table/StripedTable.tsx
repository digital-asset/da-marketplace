import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Loader, Table, Header } from 'semantic-ui-react';
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
  title?: string;
}) => {
  const { headings, rows, loading, rowsClickable, showLabel, clickableIcon, title } = props;

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
      <div className="striped-table">
        {!!title && <Header as="h2">{title}</Header>}
        <div className="empty-table">
          <p className="p2">This table doesn't contain data yet...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="striped-table">
        {!!title && <Header as="h2">{title}</Header>}
        <div className="empty-table">
          <Loader active indeterminate size="small" />
        </div>
      </div>
    );
  }

  return (
    <div className="striped-table">
      {!!title && <Header as="h2">{title}</Header>}

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

        <Table.Body>
          {activePageRows.map((row, i) => (
            <Table.Row
              key={i}
              className={classNames({ clickable: rowsClickable })}
              onClick={row.onClick}
            >
              {row.elements.map((item, j) => (
                <Table.Cell key={j} textAlign={j + 1 > row.elements.length / 2 ? 'right' : 'left'}>
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
