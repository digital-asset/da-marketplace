import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Paper, Typography, IconButton } from "@material-ui/core";
import { useStreamQueries } from "@daml/react";
import useStyles from "../../styles";
import { getName } from "../../../config";
import { Auction as BiddingAuctionContract } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model";
import { Bid } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model";
import { getBidStatus, getBidAllocation } from "../Utils";
import { KeyboardArrowRight } from "@material-ui/icons";

const BiddingAuctionsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const classes = useStyles();

  const biddingAuctions = useStreamQueries(BiddingAuctionContract).contracts;
  const bids = useStreamQueries(Bid).contracts;

  return (
    <Grid container direction="column">
      <Grid container direction="row">
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
                  <TableCell key={5} className={classes.tableCell}><b>Details</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {biddingAuctions.map((c, i) =>
                  <TableRow key={i} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}>{c.payload.auctionId}</TableCell>
                    <TableCell key={1} className={classes.tableCell}>{getName(c.payload.provider)}</TableCell>
                    <TableCell key={2} className={classes.tableCell}>{getName(c.payload.issuer)}</TableCell>
                    <TableCell key={3} className={classes.tableCell}>{c.payload.asset.id.label}</TableCell>
                    <TableCell key={4} className={classes.tableCell}>{c.payload.asset.quantity}</TableCell>
                    <TableCell key={5} className={classes.tableCell}>
                      <IconButton color="primary" size="small" component="span" onClick={() => history.push("/apps/distribution/auction/" + c.contractId.replace("#", "_"))}>
                        <KeyboardArrowRight fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Bids</Typography></Grid>
            <Table size="small">
              <TableHead>
                <TableRow className={classes.tableRow}>
                  <TableCell key={0} className={classes.tableCell}><b>Auction ID</b></TableCell>
                  <TableCell key={1} className={classes.tableCell}><b>Agent</b></TableCell>
                  <TableCell key={2} className={classes.tableCell}><b>Issuer</b></TableCell>
                  <TableCell key={3} className={classes.tableCell}><b>Asset</b></TableCell>
                  <TableCell key={4} className={classes.tableCell}><b>Quantity</b></TableCell>
                  <TableCell key={5} className={classes.tableCell}><b>Price</b></TableCell>
                  <TableCell key={6} className={classes.tableCell}><b>Status</b></TableCell>
                  <TableCell key={7} className={classes.tableCell}><b>Allocation</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bids.map((c, i) => (
                  <TableRow key={i} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}>{c.payload.auctionId}</TableCell>
                    <TableCell key={1} className={classes.tableCell}>{getName(c.payload.provider)}</TableCell>
                    <TableCell key={2} className={classes.tableCell}>{getName(c.payload.issuer)}</TableCell>
                    <TableCell key={3} className={classes.tableCell}>{c.payload.assetId.label}</TableCell>
                    <TableCell key={4} className={classes.tableCell}>{c.payload.details.quantity}</TableCell>
                    <TableCell key={5} className={classes.tableCell}>{c.payload.details.price}</TableCell>
                    <TableCell key={6} className={classes.tableCell}>{getBidStatus(c.payload.status)}</TableCell>
                    <TableCell key={7} className={classes.tableCell}>{getBidAllocation(c.payload)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const BiddingAuctions = withRouter(BiddingAuctionsComponent);