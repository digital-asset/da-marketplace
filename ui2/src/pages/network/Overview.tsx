import React from 'react';
// import { useStreamQueries } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { Table, TableBody, TableCell, TableRow, TableHead } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import useStyles from '../styles';
import { IconButton } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { getName } from '../../config';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/module';

const OverviewComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const classes = useStyles();
  const entries = useStreamQueries(CustodyService).contracts;

  return (
    <Table size="small">
      <TableHead>
        <TableRow className={classes.tableRow}>
          <TableCell key={0} className={classes.tableCell}>
            <b>Operator</b>
          </TableCell>
          <TableCell key={1} className={classes.tableCell}>
            <b>Provider</b>
          </TableCell>
          <TableCell key={2} className={classes.tableCell}>
            <b>Consumer</b>
          </TableCell>
          <TableCell key={6} className={classes.tableCell}></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {entries.map((e, i) => (
          <TableRow key={i} className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>
              {getName(e.payload.operator)}
            </TableCell>
            <TableCell key={1} className={classes.tableCell}>
              {getName(e.payload.provider)}
            </TableCell>
            <TableCell key={2} className={classes.tableCell}>
              {getName(e.payload.customer)}
            </TableCell>
            <TableCell key={6} className={classes.tableCell}>
              <IconButton
                color="primary"
                size="small"
                component="span"
                onClick={() =>
                  history.push('/app/network/services/' + e.contractId.replace('#', '_'))
                }
              >
                <KeyboardArrowRight fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const Overview = withRouter(OverviewComponent);
