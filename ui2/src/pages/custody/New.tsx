import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableRow, TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import useStyles from "../styles";
import { RequestOpenAccount, Service } from "@daml.js/da-marketplace/lib/Marketplace/Custody/Service";
import { Party } from "@daml/types";
import classnames from "classnames";
import { AssetSettlementRule } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement";
import { ServicePageProps } from "../common";

const NewComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({ history, services }: RouteComponentProps & ServicePageProps<Service>) => {
  const classes = useStyles();
  const party = useParty();
  const ledger = useLedger();

  const accounts = useStreamQueries(AssetSettlementRule).contracts;

  const [operator, setOperator] = useState<Party>();
  const [provider, setProvider] = useState<Party>();
  const [accountName, setAccountName] = useState<string>("");

  const canRequest = !!operator && !!provider && !!accountName
    && accounts.find(a => a.payload.account.provider === provider && a.payload.account.owner === party && a.payload.account.id.label === accountName) === undefined

  const requestAccount = async () => {
    const service = services.find(s => s.payload.operator === operator && s.payload.provider === provider && s.payload.customer === party);
    if (!service) return;
    const request: RequestOpenAccount = {
      accountId: { signatories: { textMap: { [service.payload.provider]: {}, [service.payload.customer]: {} } }, label: accountName, version: "0" },
      observers: ["Public"], // TODO: Use real public party
      ctrls: [service.payload.provider, service.payload.customer]
    };
    await ledger.exercise(Service.RequestOpenAccount, service.contractId, request);
    history.push("/app/custody/requests");
  }

  return (
    <Grid item xs={4}>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">New Account Request</Typography></Grid>
        <Table size="small">
          <TableBody>
            <TableRow key={0} className={classes.tableRow}>
              <FormControl className={classes.inputField} fullWidth>
                <InputLabel>Operator</InputLabel>
                <Select className={classes.fullWidth} value={operator} onChange={e => setOperator(e.target.value as Party)} >
                  {services.map((c, i) => (<MenuItem key={i} value={c.payload.operator}>{c.payload.operator}</MenuItem>))}
                </Select>
              </FormControl>
            </TableRow>
            <TableRow key={1} className={classes.tableRow}>
              <FormControl className={classes.inputField} fullWidth>
                <InputLabel>Provider</InputLabel>
                <Select className={classes.fullWidth} value={provider} disabled={!operator} onChange={e => setProvider(e.target.value as Party)} >
                  {services.filter(s => s.payload.operator === operator).map((c, i) => (<MenuItem key={i} value={c.payload.provider}>{c.payload.provider}</MenuItem>))}
                </Select>
              </FormControl>
            </TableRow>
            <TableRow key={2} className={classes.tableRow}>
              <FormControl className={classes.inputField} fullWidth>
                <InputLabel>Customer</InputLabel>
                <Select className={classes.fullWidth} value={party} disabled={true} >
                  {services.map((c, i) => (<MenuItem key={i} value={c.payload.customer}>{c.payload.customer}</MenuItem>))}
                </Select>
              </FormControl>
            </TableRow>
            <TableRow key={3} className={classes.tableRow}>
              <TextField className={classes.inputField} fullWidth label="Account name" type="text" onChange={e => setAccountName(e.target.value as string)} />
            </TableRow>
            <TableRow key={4} className={classes.tableRow}>
              <TextField className={classes.inputField} fullWidth label="Version" type="text" value={0} disabled={true} />
            </TableRow>
            <TableRow key={5} className={classes.tableRow}>
              <Button className={classnames(classes.fullWidth, classes.buttonMargin)} size="large" variant="contained" color="primary" disabled={!canRequest} onClick={() => requestAccount()} >Request Account</Button>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  );
};

export const New = withRouter(NewComponent);
