import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow, TableHead, Button, Grid, Paper, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import { useStreamQueries } from "@daml/react";
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Listing/Model/module'
import useStyles from "../styles";
import { getName } from "../../config";

const MarketsComponent : React.FC<RouteComponentProps> = ({ history } : RouteComponentProps) => {
  const classes = useStyles();
  const listings = useStreamQueries(Listing).contracts;

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
                    <Button color="primary" size="large" className={classes.actionButton} variant="outlined" onClick={() => history.push("/apps/listing/new")}>New Market</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Markets</Typography></Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Provider</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Client</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}><b>Symbol</b></TableCell>
                    <TableCell key={3} className={classes.tableCell}><b>Traded Asset</b></TableCell>
                    <TableCell key={4} className={classes.tableCell}><b>Quoted Asset</b></TableCell>
                    <TableCell key={5} className={classes.tableCell}><b>Details</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listings.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{getName(c.payload.provider)}</TableCell>
                      <TableCell key={1} className={classes.tableCell}>{getName(c.payload.customer)}</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{c.payload.listingId}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{c.payload.tradedAssetId.label}</TableCell>
                      <TableCell key={4} className={classes.tableCell}>{c.payload.quotedAssetId.label}</TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        <IconButton color="primary" size="small" component="span" onClick={() => history.push("/apps/trading/markets/" + c.contractId.replace("#", "_"))}>
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

export const Markets = withRouter(MarketsComponent);