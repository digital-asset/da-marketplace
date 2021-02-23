import React from "react";
import classnames from "classnames";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { Typography, Grid, Table, TableBody, TableCell, TableRow, Button, Paper } from "@material-ui/core";
import { useParams, RouteComponentProps } from "react-router-dom";
import useStyles from "../styles";
import { Auction as AuctionContract } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model";
import { Service } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service";
import { Bid } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model/module";

export const Auction : React.FC<RouteComponentProps> = () => {
  const classes = useStyles();

  const { contractId } = useParams<any>();
  const cid = contractId.replace("_", "#");
  
  const party = useParty();
  const ledger = useLedger();
  const services = useStreamQueries(Service).contracts;
  const providerServices = services.filter(s => s.payload.provider === party);
  const auctions = useStreamQueries(AuctionContract).contracts;
  const auction = auctions.find(c => c.contractId === cid);

  const allBids = useStreamQueries(Bid).contracts;
  console.log(services);
  if (!auction || providerServices.length === 0) return (<></>); // TODO: Return 404 not found
  const service = providerServices[0];

  const bids = allBids.filter(c => c.payload.auctionId === auction.payload.auctionId);
  const filledPerc = 100.0 * bids.reduce((a, b) => a + parseFloat(b.payload.details.quantity), 0) / parseFloat(auction.payload.asset.quantity);
  const currentPrice = bids.reduce((a, b) => parseFloat(b.payload.details.price) < a ? parseFloat(b.payload.details.price) : a, Number.MAX_VALUE);

  const closeAuction = async () => {
    const bidCids = bids.map(c => c.contractId);
    await ledger.exercise(Service.ProcessAuction, service.contractId, { auctionCid: auction.contractId, bidCids });
  }

  return (
    <Grid container direction="column" spacing={2}>
      {/* <Grid item xs={12}>
        <Typography variant="h3" className={classes.heading}>Auction</Typography>
      </Grid> */}
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Bids</Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow key={0} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Bidder</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}><b>Quantity</b></TableCell>
                        <TableCell key={2} className={classes.tableCell}><b>Price</b></TableCell>
                        <TableCell key={3} className={classes.tableCell}><b>Percentage</b></TableCell>
                        <TableCell key={4} className={classes.tableCell}><b>Time</b></TableCell>
                      </TableRow>
                      {bids.map((c, i) => (
                        <TableRow key={i+1} className={classes.tableRow}>
                          <TableCell key={0} className={classes.tableCell}>{c.payload.customer}</TableCell>
                          <TableCell key={1} className={classes.tableCell}>{c.payload.details.quantity}</TableCell>
                          <TableCell key={2} className={classes.tableCell}>{c.payload.details.price}</TableCell>
                          <TableCell key={3} className={classes.tableCell}>{(100.0 * parseFloat(c.payload.details.quantity) / parseFloat(auction.payload.asset.quantity)).toFixed(2)}%</TableCell>
                          <TableCell key={4} className={classes.tableCell}>{c.payload.details.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Auction</Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow key={0} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Issuer</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{auction.payload.customer}</TableCell>
                      </TableRow>
                      <TableRow key={1} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Agent</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{auction.payload.provider}</TableCell>
                      </TableRow>
                      <TableRow key={2} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Auction ID</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{auction.payload.auctionId}</TableCell>
                      </TableRow>
                      <TableRow key={3} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Asset</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{auction.payload.asset.quantity} {auction.payload.asset.id.label}</TableCell>
                      </TableRow>
                      <TableRow key={4} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Floor</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{auction.payload.floorPrice} {auction.payload.quotedAssetId.label}</TableCell>
                      </TableRow>
                      <TableRow key={5} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Filled %</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{filledPerc.toFixed(2)}%</TableCell>
                      </TableRow>
                      <TableRow key={6} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Current price</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{currentPrice.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow key={7} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Status</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{auction.payload.status.tag}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Button className={classnames(classes.fullWidth, classes.buttonMargin)} size="large" variant="contained" color="primary" disabled={auction.payload.status.tag !== "Open" || bids.length === 0} onClick={closeAuction}>Close Auction</Button>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <Paper className={classnames(classes.fullWidth, classes.paper)}>
              <Typography variant="h5" className={classes.heading}>Orders</Typography>
                <Table size="small">
                    <TableBody>
                      <TableRow key={0} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Symbol</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}><b>Order ID</b></TableCell>
                        <TableCell key={2} className={classes.tableCell}><b>Type</b></TableCell>
                        <TableCell key={3} className={classes.tableCell}><b>Side</b></TableCell>
                        <TableCell key={4} className={classes.tableCell}><b>Price</b></TableCell>
                        <TableCell key={4} className={classes.tableCell}><b>Quantity</b></TableCell>
                        <TableCell key={4} className={classes.tableCell}><b>Volume</b></TableCell>
                        <TableCell key={4} className={classes.tableCell}><b>TimeInForce</b></TableCell>
                        <TableCell key={4} className={classes.tableCell}><b>Filled</b></TableCell>
                      </TableRow>
                      {limits.map((c, i) => (
                        <TableRow key={i+1} className={classes.tableRow}>
                          <TableCell key={0} className={classes.tableCell}>{c.payload.details.symbol}</TableCell>
                          <TableCell key={1} className={classes.tableCell}>{c.payload.details.id.label}</TableCell>
                          <TableCell key={2} className={classes.tableCell}>{c.payload.details.orderType.tag}</TableCell>
                          <TableCell key={3} className={classes.tableCell} style={{ color: getColor(c)}}>{c.payload.details.side}</TableCell>
                          <TableCell key={4} className={classes.tableCell}>{getPrice(c)}</TableCell>
                          <TableCell key={5} className={classes.tableCell}>{getQuantity(c)}</TableCell>
                          <TableCell key={6} className={classes.tableCell}>{getVolume(c)}</TableCell>
                          <TableCell key={7} className={classes.tableCell}>{c.payload.details.timeInForce.tag}</TableCell>
                          <TableCell key={8} className={classes.tableCell}>{(100.0 - 100.0 * parseFloat(c.payload.remainingQuantity) / getQuantity(c)).toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classnames(classes.fullWidth, classes.paper)}>
              <Typography variant="h5" className={classes.heading}>Trades</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
};
