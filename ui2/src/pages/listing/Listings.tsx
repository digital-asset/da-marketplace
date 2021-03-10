import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow, TableHead, Button, Grid, Paper, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import { CreateEvent } from "@daml/ledger";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import useStyles from "../styles";
import { getName } from "../../config";
import { Service } from "@daml.js/da-marketplace/lib/Marketplace/Listing/Service";
import { Listing } from "@daml.js/da-marketplace/lib/Marketplace/Listing/Model";

const ListingsComponent : React.FC<RouteComponentProps> = ({ history } : RouteComponentProps) => {
  const classes = useStyles();
  const party = useParty();
  const ledger = useLedger();

  const services = useStreamQueries(Service).contracts;
  const service = services.find(s => s.payload.customer === party);
  const listings = useStreamQueries(Listing).contracts;

  const requestDisableDelisting = async (c : CreateEvent<Listing>) => {
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.RequestDisableListing, service.contractId, { listingCid: c.contractId });
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
                    <Button color="primary" size="large" className={classes.actionButton} variant="outlined" onClick={() => history.push("/apps/listing/new")}>New Listing</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Listings</Typography></Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Provider</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Client</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}><b>Listing ID</b></TableCell>
                    <TableCell key={3} className={classes.tableCell}><b>Calendar ID</b></TableCell>
                    <TableCell key={4} className={classes.tableCell}><b>Traded Asset</b></TableCell>
                    <TableCell key={5} className={classes.tableCell}><b>Traded Asset Precision</b></TableCell>
                    <TableCell key={6} className={classes.tableCell}><b>Quoted Asset</b></TableCell>
                    <TableCell key={7} className={classes.tableCell}><b>Quoted Asset Precision</b></TableCell>
                    <TableCell key={8} className={classes.tableCell}><b>Action</b></TableCell>
                    <TableCell key={9} className={classes.tableCell}><b>Details</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listings.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{getName(c.payload.provider)}</TableCell>
                      <TableCell key={1} className={classes.tableCell}>{getName(c.payload.customer)}</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{c.payload.listingId}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{c.payload.calendarId}</TableCell>
                      <TableCell key={4} className={classes.tableCell}>{c.payload.tradedAssetId.label}</TableCell>
                      <TableCell key={5} className={classes.tableCell}>{c.payload.tradedAssetPrecision}</TableCell>
                      <TableCell key={6} className={classes.tableCell}>{c.payload.quotedAssetId.label}</TableCell>
                      <TableCell key={7} className={classes.tableCell}>{c.payload.quotedAssetPrecision}</TableCell>
                      <TableCell key={8} className={classes.tableCell}>
                        {party === c.payload.customer && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => requestDisableDelisting(c)}>Disable</Button>}
                      </TableCell>
                      <TableCell key={9} className={classes.tableCell}>
                        <IconButton color="primary" size="small" component="span" onClick={() => history.push("/apps/listing/listings/" + c.contractId.replace("#", "_"))}>
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

export const Listings = withRouter(ListingsComponent);