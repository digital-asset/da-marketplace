import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow, TableHead, Button, Grid, Paper, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import { CreateEvent } from "@daml/ledger";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { Service, CreateIssuanceRequest, DeleteIssuanceRequest } from '@daml.js/da-marketplace/lib/Marketplace/Issuance'
import useStyles from "../styles";
import { getName } from "../../config";

const RequestsComponent : React.FC<RouteComponentProps> = ({ history } : RouteComponentProps) => {
  const classes = useStyles();
  const party = useParty();
  const ledger = useLedger();

  const services = useStreamQueries(Service).contracts;
  const providerServices = services.filter(s => s.payload.provider === party);
  const createRequests = useStreamQueries(CreateIssuanceRequest).contracts;
  const deleteRequests = useStreamQueries(DeleteIssuanceRequest).contracts;
  
  const createIssuance = async (c : CreateEvent<CreateIssuanceRequest>) => {
    const service = providerServices.find(s => s.payload.client === c.payload.client);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.CreateIssuance, service.contractId, { createIssuanceRequestCid: c.contractId });
    history.push("/apps/issuance/issuances");
  }

  const deleteIssuance = async (c : CreateEvent<DeleteIssuanceRequest>) => {
    const service = providerServices.find(s => s.payload.client === c.payload.client);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.DeleteIssuance, service.contractId, { deleteIssuanceRequestCid: c.contractId });
    history.push("/apps/issuance/issuances");
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
                    <Button color="primary" size="large" className={classes.actionButton} variant="outlined" onClick={() => history.push("/apps/issuance/new")}>New Issuance</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Issuance Requests</Typography></Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Provider</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Client</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}><b>Role</b></TableCell>
                    <TableCell key={3} className={classes.tableCell}><b>Issuance ID</b></TableCell>
                    <TableCell key={4} className={classes.tableCell}><b>Account</b></TableCell>
                    <TableCell key={5} className={classes.tableCell}><b>Asset</b></TableCell>
                    <TableCell key={6} className={classes.tableCell}><b>Quantity</b></TableCell>
                    <TableCell key={7} className={classes.tableCell}><b>Action</b></TableCell>
                    <TableCell key={8} className={classes.tableCell}><b>Details</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {createRequests.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{getName(c.payload.provider)}</TableCell>
                      <TableCell key={1} className={classes.tableCell}>{getName(c.payload.client)}</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{party === c.payload.provider ? "Provider" : "Client"}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{c.payload.issuanceId}</TableCell>
                      <TableCell key={4} className={classes.tableCell}>{c.payload.accountId.label}</TableCell>
                      <TableCell key={5} className={classes.tableCell}>{c.payload.assetId.label}</TableCell>
                      <TableCell key={6} className={classes.tableCell}>{c.payload.quantity}</TableCell>
                      <TableCell key={7} className={classes.tableCell}>
                        {party === c.payload.provider && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => createIssuance(c)}>Process</Button>}
                        {/* {party === c.payload.client && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => cancelRequest(c)}>Cancel</Button>} */}
                      </TableCell>
                      <TableCell key={8} className={classes.tableCell}>
                        <IconButton color="primary" size="small" component="span" onClick={() => history.push("/apps/issuance/createrequest/" + c.contractId.replace("#", "_"))}>
                          <KeyboardArrowRight fontSize="small"/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Deissuance Requests</Typography></Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Provider</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Client</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}><b>Role</b></TableCell>
                    <TableCell key={3} className={classes.tableCell}><b>Issuance ID</b></TableCell>
                    <TableCell key={4} className={classes.tableCell}><b>Account</b></TableCell>
                    {/* <TableCell key={5} className={classes.tableCell}><b>Asset</b></TableCell>
                    <TableCell key={6} className={classes.tableCell}><b>Quantity</b></TableCell> */}
                    <TableCell key={7} className={classes.tableCell}><b>Action</b></TableCell>
                    <TableCell key={8} className={classes.tableCell}><b>Details</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deleteRequests.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{getName(c.payload.provider)}</TableCell>
                      <TableCell key={1} className={classes.tableCell}>{getName(c.payload.client)}</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{party === c.payload.provider ? "Provider" : "Client"}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{c.payload.issuanceId}</TableCell>
                      <TableCell key={4} className={classes.tableCell}>{c.payload.accountId.label}</TableCell>
                      {/* <TableCell key={5} className={classes.tableCell}>{c.payload.assetId.label}</TableCell>
                      <TableCell key={6} className={classes.tableCell}>{c.payload.quotedAssetId.label}</TableCell> */}
                      <TableCell key={7} className={classes.tableCell}>
                        {party === c.payload.provider && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => deleteIssuance(c)}>Process</Button>}
                        {/* {party === c.payload.client && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => cancelRequest(c)}>Cancel</Button>} */}
                      </TableCell>
                      <TableCell key={8} className={classes.tableCell}>
                        <IconButton color="primary" size="small" component="span" onClick={() => history.push("/apps/issuance/deleterequest/" + c.contractId.replace("#", "_"))}>
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

export const Requests = withRouter(RequestsComponent);