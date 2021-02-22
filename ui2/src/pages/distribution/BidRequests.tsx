import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow, TableHead, Button, Grid, Paper, Typography } from "@material-ui/core";
import { useStreamQueries } from "@daml/react";
import useStyles from "../styles";
import { getName } from "../../config";
import { Request } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Request/module";
import { CreateEvent } from "@daml/ledger";
import { InputDialog, InputDialogProps } from "../../components/InputDialog/InputDialog";

const BidRequestsComponent : React.FC<RouteComponentProps> = ({ history } : RouteComponentProps) => {
  const classes = useStyles();

  // const ledger = useLedger();
  const requests = useStreamQueries(Request).contracts;

  const defaultBidDialogProps : InputDialogProps<any> = {
    open: false,
    title: "Submit Bid",
    defaultValue: { price: "", quantity: "" },
    fields: {
      price: { label: "Price", type: "number" },
      quantity: { label: "Quantity", type: "number" },
    },
    onClose: async function(state : any | null) {}
  };
  const [bidDialogProps, setBidDialogProps] = useState<InputDialogProps<any>>(defaultBidDialogProps);

  const submitBid = (c : CreateEvent<Request>) => {
    const onClose = async (state : any | null) => {
      setBidDialogProps({ ...defaultBidDialogProps, open: false });
      if (!state) return;
      // await ledger.exercise(Request.SubmitBid, c.contractId, { price: state.price, quantity: state.quantity });
    };
    setBidDialogProps({ ...defaultBidDialogProps, open: true, onClose });
  };

  return (
    <>
      <InputDialog { ...bidDialogProps } />
      <Grid container direction="column">
        <Grid container direction="row">
          {/* <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Actions</Typography></Grid>
              <Grid container direction="row" justify="center">
                <Grid item xs={12}>
                  <Grid container justify="center">
                    <Button color="primary" size="large" className={classes.actionButton} variant="outlined" onClick={() => history.push("/apps/distribution/new")}>New Auction</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid> */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Auctions</Typography></Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Auction ID</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Agent</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}><b>Issuer</b></TableCell>
                    <TableCell key={3} className={classes.tableCell}><b>Asset</b></TableCell>
                    <TableCell key={4} className={classes.tableCell}><b>Quantity</b></TableCell>
                    <TableCell key={5} className={classes.tableCell}><b>Action</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{c.payload.auctionId}</TableCell>
                      <TableCell key={1} className={classes.tableCell}>{getName(c.payload.provider)}</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{getName(c.payload.issuer)}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{c.payload.asset.id.label}</TableCell>
                      <TableCell key={4} className={classes.tableCell}>{c.payload.asset.quantity}</TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => submitBid(c)}>Bid</Button>
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

export const BidRequests = withRouter(BidRequestsComponent);