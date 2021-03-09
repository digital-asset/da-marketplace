import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow, TableHead, Button, Grid, Paper, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import { useStreamQueries } from "@daml/react";
import useStyles from "../styles";
import { getName } from "../../config";
import { Issuance } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/Model/module";

const IssuancesComponent : React.FC<RouteComponentProps> = ({ history } : RouteComponentProps) => {
  const classes = useStyles();

  const issuances = useStreamQueries(Issuance).contracts;

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
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Issuances</Typography></Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Issuing Agent</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Issuer</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}><b>Issuance ID</b></TableCell>
                    <TableCell key={3} className={classes.tableCell}><b>Issuance Account</b></TableCell>
                    <TableCell key={4} className={classes.tableCell}><b>Asset</b></TableCell>
                    <TableCell key={5} className={classes.tableCell}><b>Quantity</b></TableCell>
                    <TableCell key={6} className={classes.tableCell}><b>Action</b></TableCell>
                    <TableCell key={7} className={classes.tableCell}><b>Details</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {issuances.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{getName(c.payload.provider)}</TableCell>
                      <TableCell key={1} className={classes.tableCell}>{getName(c.payload.customer)}</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{c.payload.issuanceId}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{c.payload.accountId.label}</TableCell>
                      <TableCell key={4} className={classes.tableCell}>{c.payload.assetId.label}</TableCell>
                      <TableCell key={5} className={classes.tableCell}>{c.payload.quantity}</TableCell>
                      <TableCell key={6} className={classes.tableCell}>
                        {/* {party === c.payload.client && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => requestDelisting(c)}>Delist</Button>} */}
                      </TableCell>
                      <TableCell key={7} className={classes.tableCell}>
                        <IconButton color="primary" size="small" component="span" onClick={() => history.push("/apps/issuance/issuances/" + c.contractId.replace("#", "_"))}>
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

export const Issuances = withRouter(IssuancesComponent);