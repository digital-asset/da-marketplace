import React, { useMemo } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Paper, Typography } from "@material-ui/core";
import { useParty, useStreamQueries } from "@daml/react";
import useStyles from "../styles";
import { AssetDeposit } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/module";
import { AssetSettlementRule } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement/module";
import { AllocationAccountRule } from "@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount/module";

const AssetsComponent : React.FC<RouteComponentProps> = ({ history } : RouteComponentProps) => {
  const party = useParty();
  const classes = useStyles();

  const settlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const allocationRules = useStreamQueries(AllocationAccountRule).contracts;
  const deposits = useStreamQueries(AssetDeposit).contracts;

  const allocatedDeposits = useMemo(() =>
    deposits.filter(d => allocationRules.findIndex(a => a.payload.account.id.label === d.payload.account.id.label) !== -1 && d.payload.account.owner === party)
  , [deposits, allocationRules, party]);

  const tradeableDeposits = useMemo(() =>
    deposits.filter(d => settlementRules.findIndex(s => s.payload.account.id.label === d.payload.account.id.label) !== -1 && d.payload.account.owner === party)
  , [deposits, settlementRules, party]);

  return (
    <>
      <Grid container direction="column">
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Tradeable Deposits</Typography></Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Account</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}><b>Provider</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Owner</b></TableCell>
                    <TableCell key={3} className={classes.tableCell}><b>Asset</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tradeableDeposits.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{c.payload.account.id.label}</TableCell>
                      <TableCell key={1} className={classes.tableCell}>{c.payload.account.provider}</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{c.payload.account.owner}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{c.payload.asset.quantity} {c.payload.asset.id.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Allocated Deposits</Typography></Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Account</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}><b>Provider</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Owner</b></TableCell>
                    <TableCell key={3} className={classes.tableCell}><b>Asset</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allocatedDeposits.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{c.payload.account.id.label}</TableCell>
                      <TableCell key={1} className={classes.tableCell}>{c.payload.account.provider}</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{c.payload.account.owner}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{c.payload.asset.quantity} {c.payload.asset.id.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export const Assets = withRouter(AssetsComponent);