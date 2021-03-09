import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow, TableHead, Button, Grid, Paper, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import { CreateEvent } from "@daml/ledger";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import useStyles from "../styles";
import { getName } from "../../config";
import { Service } from "@daml.js/da-marketplace/lib/Marketplace/Custody/Service";
import { AssetSettlementRule } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement/module";

const AccountsComponent : React.FC<RouteComponentProps> = ({ history } : RouteComponentProps) => {
  const classes = useStyles();
  const party = useParty();
  const ledger = useLedger();

  const services = useStreamQueries(Service).contracts;

  const clientServices = services.filter(s => s.payload.customer === party);
  const accounts = useStreamQueries(AssetSettlementRule).contracts;

  const requestCloseAccount = async (c : CreateEvent<AssetSettlementRule>) => {
    const service = clientServices.find(s => s.payload.provider === c.payload.account.provider);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.RequestCloseAccount, service.contractId, { accountId: c.payload.account.id });
    history.push("/apps/custody/requests")
  }

  return (
    <>
      <Grid container direction="column">
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Actions</Typography></Grid>
              <Grid container direction="row" justify="center">
                <Grid item xs={12}>
                  <Grid container justify="center">
                    <Button color="primary" size="large" className={classes.actionButton} variant="outlined" onClick={() => history.push("/apps/custody/account/new")}>New Account</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Accounts</Typography></Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Account</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Provider</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}><b>Owner</b></TableCell>
                    <TableCell key={3} className={classes.tableCell}><b>Role</b></TableCell>
                    <TableCell key={4} className={classes.tableCell}><b>Controllers</b></TableCell>
                    <TableCell key={5} className={classes.tableCell}><b>Action</b></TableCell>
                    <TableCell key={6} className={classes.tableCell}><b>Details</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{c.payload.account.id.label}</TableCell>
                      <TableCell key={1} className={classes.tableCell}>{getName(c.payload.account.provider)}</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{getName(c.payload.account.owner)}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{party === c.payload.account.provider ? "Provider" : "Client"}</TableCell>
                      <TableCell key={4} className={classes.tableCell}>{Object.keys(c.payload.ctrls.textMap).join(", ")}</TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        {party === c.payload.account.owner && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => requestCloseAccount(c)}>Close</Button>}
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
                        <IconButton color="primary" size="small" component="span" onClick={() => history.push("/apps/custody/account/" + c.contractId.replace("#", "_"))}>
                          <KeyboardArrowRight fontSize="small"/>
                        </IconButton>
                      </TableCell>
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

export const Accounts = withRouter(AccountsComponent);