import React from "react";
import classnames from "classnames";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { Typography, Grid, Table, TableBody, TableCell, TableRow, Button, Paper, TableHead } from "@material-ui/core";
import { useParams, RouteComponentProps } from "react-router-dom";
import useStyles from "../styles";
import { Auction as AuctionContract, Status as AuctionStatus } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model";
import { Service as AuctionService } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service";
import { Service as BiddingService } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service";
import { Bid, Request } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model/module";
import { CreateEvent } from "@daml/ledger";
import { getAuctionStatus, getBidStatus, getBidAllocation } from "./Utils";

export const Auction : React.FC<RouteComponentProps> = ({ history } : RouteComponentProps) => {
  const classes = useStyles();

  const { contractId } = useParams<any>();
  const cid = contractId.replace("_", "#");

  const party = useParty();
  const ledger = useLedger();
  const auctionServices = useStreamQueries(AuctionService).contracts;
  const auctionProviderServices = auctionServices.filter(s => s.payload.provider === party);
  const biddingServices = useStreamQueries(BiddingService).contracts;
  const biddingProviderServices = biddingServices.filter(s => s.payload.provider === party);
  const auctions = useStreamQueries(AuctionContract).contracts;
  const auction = auctions.find(c => c.contractId === cid);

  const allBidRequests = useStreamQueries(Request).contracts;
  const allBids = useStreamQueries(Bid).contracts;
  if (!auction || auctionProviderServices.length === 0) return (<></>); // TODO: Return 404 not found
  const auctionService = auctionProviderServices[0];

  const bidRequests = allBidRequests.filter(c => c.payload.auctionId === auction.payload.auctionId);
  const bids = allBids.filter(c => c.payload.auctionId === auction.payload.auctionId);
  const filledPerc = 100.0 * bids.reduce((a, b) => a + (parseFloat(b.payload.details.price) >= parseFloat(auction.payload.floorPrice) ? parseFloat(b.payload.details.quantity) : 0), 0) / parseFloat(auction.payload.asset.quantity);
  const currentPrice = bids.length === 0 ? 0.0 : bids.reduce((a, b) => parseFloat(b.payload.details.price) >= parseFloat(auction.payload.floorPrice) && parseFloat(b.payload.details.price) < a ? parseFloat(b.payload.details.price) : a, Number.MAX_VALUE);

  const closeAuction = async () => {
    const bidCids = bids.map(c => c.contractId);
    const result = await ledger.exercise(AuctionService.ProcessAuction, auctionService.contractId, { auctionCid: auction.contractId, bidCids });
    history.push("/apps/distribution/auctions/" + result[0]._1.replace("#", "_"))
  };

  const requestBid = async (biddingService : CreateEvent<BiddingService>) => {
    const issuer = auction.payload.customer;
    const auctionId = auction.payload.auctionId;
    const asset = auction.payload.asset;
    const quotedAssetId = auction.payload.quotedAssetId;
    await ledger.exercise(BiddingService.RequestBid, biddingService.contractId, { issuer, auctionId, asset, quotedAssetId });
  };

  const getBidRequestStatus = (investor : string) => {
    const bidRequest = bidRequests.find(c => c.payload.customer === investor);
    if (bidRequest) return "Bid requested";
    const bid = bids.find(c => c.payload.customer === investor);
    if (!!bid) return "Bid received";
    return "No bid requested";
  };

  const getFinalPrice = (auctionStatus : AuctionStatus) : string | undefined => {
    switch (auctionStatus.tag) {
      case 'PartiallyAllocated' :
        return auctionStatus.value.finalPrice
      case 'FullyAllocated' :
        return auctionStatus.value.finalPrice
      default:
        return undefined
    }
  }

  const getParticallyAllocatedUnits = (auction : AuctionContract) : number | undefined => {
    switch (auction.status.tag) {
      case 'PartiallyAllocated' :
        return parseFloat(auction.asset.quantity) - parseFloat(auction.status.value.remaining)
      default:
        return undefined
    }
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.heading}>{auction.payload.auctionId}</Typography>
      </Grid>
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
                        <TableCell key={5} className={classes.tableCell}><b>Status</b></TableCell>
                        <TableCell key={6} className={classes.tableCell}><b>Allocation</b></TableCell>
                      </TableRow>
                      {bids.map((c, i) => (
                        <TableRow key={i+1} className={classes.tableRow}>
                          <TableCell key={0} className={classes.tableCell}>{c.payload.customer}</TableCell>
                          <TableCell key={1} className={classes.tableCell}>{c.payload.details.quantity}</TableCell>
                          <TableCell key={2} className={classes.tableCell}>{c.payload.details.price}</TableCell>
                          <TableCell key={3} className={classes.tableCell}>{(100.0 * parseFloat(c.payload.details.quantity) / parseFloat(auction.payload.asset.quantity)).toFixed(2)}%</TableCell>
                          <TableCell key={4} className={classes.tableCell}>{c.payload.details.time}</TableCell>
                          <TableCell key={5} className={classes.tableCell}>{getBidStatus(c.payload.status)}</TableCell>
                          <TableCell key={6} className={classes.tableCell}>{getBidAllocation(c.payload)}</TableCell>
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
                  <Typography variant="h5" className={classes.heading}>Details</Typography>
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
                        <TableCell key={0} className={classes.tableCell}><b>Subscribed %</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{filledPerc.toFixed(2)}%</TableCell>
                      </TableRow>
                      <TableRow key={6} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Status</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{getAuctionStatus(auction.payload.status)}</TableCell>
                      </TableRow>
                      { getFinalPrice(auction.payload.status)
                        ?
                        <TableRow key={7} className={classes.tableRow}>
                          <TableCell key={0} className={classes.tableCell}><b>Final price</b></TableCell>
                          <TableCell key={1} className={classes.tableCell}>{getFinalPrice(auction.payload.status)} {auction.payload.quotedAssetId.label}</TableCell>
                        </TableRow>
                        :
                        <TableRow key={7} className={classes.tableRow}>
                          <TableCell key={0} className={classes.tableCell}><b>Current price</b></TableCell>
                          <TableCell key={1} className={classes.tableCell}>{currentPrice.toFixed(2)} {auction.payload.quotedAssetId.label}</TableCell>
                        </TableRow>
                      }
                      { getParticallyAllocatedUnits(auction.payload) &&
                        <TableRow key={7} className={classes.tableRow}>
                          <TableCell key={0} className={classes.tableCell}><b>Allocated</b></TableCell>
                          <TableCell key={1} className={classes.tableCell}>{getParticallyAllocatedUnits(auction.payload)?.toFixed(2)} {auction.payload.asset.id.label}</TableCell>
                        </TableRow>
                      }
                    </TableBody>
                  </Table>
                  <Button className={classnames(classes.fullWidth, classes.buttonMargin)} size="large" variant="contained" color="primary" disabled={auction.payload.status.tag !== "Open" || bids.length === 0} onClick={closeAuction}>Close Auction</Button>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Investors</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow key={0} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Investor</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}><b>Status</b></TableCell>
                        <TableCell key={2} className={classes.tableCell}><b>Action</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {biddingProviderServices.map((c, i) => (
                        <TableRow key={i} className={classes.tableRow}>
                          <TableCell key={0} className={classes.tableCell}>{c.payload.customer}</TableCell>
                          <TableCell key={1} className={classes.tableCell}>{getBidRequestStatus(c.payload.customer)}</TableCell>
                          <TableCell key={2} className={classes.tableCell}>
                            <Button color="primary" size="small" className={classes.choiceButton} variant="contained" disabled={getBidRequestStatus(c.payload.customer) !== "No bid requested" || auction.payload.status.tag !== "Open"} onClick={() => requestBid(c)}>Request Bid</Button>
                          </TableCell>
                        </TableRow>))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
