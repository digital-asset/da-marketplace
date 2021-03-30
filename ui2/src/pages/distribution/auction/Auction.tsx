import React from "react";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { useParams, RouteComponentProps } from "react-router-dom";
import useStyles from "../../styles";
import { Auction as AuctionContract, Status as AuctionStatus } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model";
import { Service as AuctionService } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service";
import { Service as BiddingService } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service";
import { Auction as BiddingAuction, Bid } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model";
import { CreateEvent } from "@daml/ledger";
import { getAuctionStatus, getBidStatus, getBidAllocation } from "../Utils";
import { DateTime } from "luxon"
import {Button, Header, Table} from "semantic-ui-react";
import StripedTable from "../../../components/Table/StripedTable";
import {getName} from "../../../config";
import {KeyboardArrowRight} from "@material-ui/icons";
import Tile from "../../../components/Tile/Tile";

type Props = {
  auctionServices : Readonly<CreateEvent<AuctionService, any, any>[]>,
  biddingServices : Readonly<CreateEvent<BiddingService, any, any>[]>
}

export const Auction: React.FC<RouteComponentProps & Props> = ({ history, auctionServices, biddingServices }: RouteComponentProps & Props) => {
  const classes = useStyles();

  const { contractId } = useParams<any>();
  const cid = contractId.replace("_", "#");

  const party = useParty();
  const ledger = useLedger();
  const auctionProviderServices = auctionServices.filter(s => s.payload.provider === party);
  const isAuctionProvider = auctionProviderServices.length > 0;
  const auctionCustomerServices = auctionServices.filter(s => s.payload.customer === party);
  const isAuctionCustomer = auctionCustomerServices.length > 0;
  const biddingProviderServices = biddingServices.filter(s => s.payload.provider === party);
  const auctions = useStreamQueries(AuctionContract).contracts;
  const auction = auctions.find(c => c.contractId === cid);

  const allBiddingAuctions = useStreamQueries(BiddingAuction).contracts;
  const allBids = useStreamQueries(Bid).contracts;

  if (!auction || (!isAuctionProvider && !isAuctionCustomer)) return (<></>); // TODO: Return 404 not found
  const auctionProviderService = auctionProviderServices[0];

  const biddingAuctions = allBiddingAuctions.filter(c => c.payload.auctionId === auction.payload.auctionId);
  const bids = allBids.filter(c => c.payload.auctionId === auction.payload.auctionId);
  const filledPerc = 100.0 * bids.reduce((a, b) => a + (parseFloat(b.payload.details.price) >= parseFloat(auction.payload.floorPrice) ? parseFloat(b.payload.details.quantity) : 0), 0) / parseFloat(auction.payload.asset.quantity);
  const currentPrice = bids.length === 0 ? 0.0 : bids.reduce((a, b) => parseFloat(b.payload.details.price) >= parseFloat(auction.payload.floorPrice) && parseFloat(b.payload.details.price) < a ? parseFloat(b.payload.details.price) : a, Number.MAX_VALUE);

  const closeAuction = async () => {
    const bidCids = bids.map(c => c.contractId);
    const [result,] = await ledger.exercise(AuctionService.ProcessAuction, auctionProviderService.contractId, { auctionCid: auction.contractId, bidCids });
    history.push("/app/distribution/auctions/" + result._1.replace("#", "_"))
  };

  const requestBid = async (biddingService: CreateEvent<BiddingService>) => {
    const publishedBidCids = bids.filter(c => c.payload.allowPublishing).map(c => c.contractId);
    const issuer = auction.payload.customer;
    const auctionId = auction.payload.auctionId;
    const asset = auction.payload.asset;
    const quotedAssetId = auction.payload.quotedAssetId;
    await ledger.exercise(BiddingService.RequestBid, biddingService.contractId, { issuer, auctionId, asset, quotedAssetId, publishedBidCids });
  };

  const getbiddingAuctionstatus = (investor: string) => {
    const biddingAuction = biddingAuctions.find(c => c.payload.customer === investor);
    if (biddingAuction) return "Bid requested";
    const bid = bids.find(c => c.payload.customer === investor);
    if (!!bid) return "Bid received";
    return "No bid requested";
  };

  const getFinalPrice = (auctionStatus: AuctionStatus): string | undefined => {
    switch (auctionStatus.tag) {
      case 'PartiallyAllocated':
        return auctionStatus.value.finalPrice
      case 'FullyAllocated':
        return auctionStatus.value.finalPrice
      default:
        return undefined
    }
  };

  const getParticallyAllocatedUnits = (auction: AuctionContract): number | undefined => {
    switch (auction.status.tag) {
      case 'PartiallyAllocated':
        return parseFloat(auction.asset.quantity) - parseFloat(auction.status.value.remaining)
      default:
        return undefined
    }
  };

  return (
    <div className='auction'>
      <div className='bids'>
        <Tile header={<h2>Bids</h2>}>
          <StripedTable
            headings={[
              'Bidder',
              'Quantity',
              'Price',
              'Percentage',
              'Submitted',
              'Visibility',
              'Status',
              'Allocation'
            ]}
            rows={
              bids.map(c => [
                c.payload.customer,
                c.payload.details.quantity,
                c.payload.details.price,
                (100.0 * parseFloat(c.payload.details.quantity) / parseFloat(auction.payload.asset.quantity)).toFixed(2) + "%",
                DateTime.fromISO(c.payload.details.time).toLocaleString(DateTime.DATETIME_FULL),
                c.payload.allowPublishing ? "Public" : "Private",
                getBidStatus(c.payload.status),
                getBidAllocation(c.payload)
              ])
            }
          />
        </Tile>
      </div>
      <div className='details'>
        <Tile header={<h2>Details</h2>}>
          <Table basic='very'>
            <Table.Body>
              <Table.Row key={0}>
                <Table.Cell key={0}><b>Issuer</b></Table.Cell>
                <Table.Cell key={1}>{account.payload.account.id.label}</Table.Cell>
              </Table.Row>
              <Table.Row key={1}>
                <Table.Cell key={0}><b>Agent</b></Table.Cell>
                <Table.Cell key={1}>{getName(account.payload.account.provider)}</Table.Cell>
              </Table.Row>
              <Table.Row key={2}>
                <Table.Cell key={0}><b>Auction ID</b></Table.Cell>
                <Table.Cell key={1}>{getName(account.payload.account.owner)}</Table.Cell>
              </Table.Row>
              <Table.Row key={3}>
                <Table.Cell key={0}><b>Asset</b></Table.Cell>
                <Table.Cell key={1}>{party === account.payload.account.provider ? "Provider" : "Client"}</Table.Cell>
              </Table.Row>
              <Table.Row key={4}>
                <Table.Cell key={0}><b>Floor</b></Table.Cell>
                <Table.Cell key={1}>{Object.keys(account.payload.ctrls.textMap).join(", ")}</Table.Cell>
              </Table.Row>
              <Table.Row key={5}>
                <Table.Cell key={0}><b>Subscribed %</b></Table.Cell>
                <Table.Cell key={1}>{Object.keys(account.payload.ctrls.textMap).join(", ")}</Table.Cell>
              </Table.Row>
              <Table.Row key={6}>
                <Table.Cell key={0}><b>Status</b></Table.Cell>
                <Table.Cell key={1}>{Object.keys(account.payload.ctrls.textMap).join(", ")}</Table.Cell>
              </Table.Row>
              {getFinalPrice(auction.payload.status)
                ?
                <Table.Row key={7} className={classes.tableRow}>
                  <Table.Cell key={0} className={classes.tableCell}><b>Final price</b></Table.Cell>
                  <Table.Cell key={1} className={classes.tableCell}>{getFinalPrice(auction.payload.status)} {auction.payload.quotedAssetId.label}</Table.Cell>
                </Table.Row>
                :
                <Table.Row key={8} className={classes.tableRow}>
                  <Table.Cell key={0} className={classes.tableCell}><b>Current price</b></Table.Cell>
                  <Table.Cell key={1} className={classes.tableCell}>{currentPrice.toFixed(2)} {auction.payload.quotedAssetId.label}</Table.Cell>
                </Table.Row>
              }
              {getParticallyAllocatedUnits(auction.payload) &&
                <Table.Row key={9} className={classes.tableRow}>
                  <Table.Cell key={0} className={classes.tableCell}><b>Allocated</b></Table.Cell>
                  <Table.Cell key={1} className={classes.tableCell}>{getParticallyAllocatedUnits(auction.payload)?.toFixed(2)} {auction.payload.asset.id.label}</Table.Cell>
                </Table.Row>
              }
              <Button type='submit' className='ghost' disabled={auction.payload.status.tag !== "Open" || bids.length === 0} onClick={closeAuction}>Close Auction</Button>
            </Table.Body>
          </Table>
        </Tile>
      </div>
    </div>

    // <>
    //   <Grid container direction="column" spacing={2}>
    //     <Grid item xs={12}>
    //       <Typography variant="h3" className={classes.heading}>{auction.payload.auctionId}</Typography>
    //     </Grid>
    //     <Grid item xs={12}>
    //       <Grid container spacing={4}>
    //         <Grid item xs={8}>
    //           <Grid container direction="column" spacing={2}>
    //             <Grid item xs={12}>
    //               <Paper className={classnames(classes.fullWidth, classes.paper)}>
    //                 <Typography variant="h5" className={classes.heading}>Bids</Typography>
    //                 <Table size="small">
    //                   <TableBody>
    //                     <TableRow key={0} className={classes.tableRow}>
    //                       <TableCell key={0} className={classes.tableCell}><b>Bidder</b></TableCell>
    //                       <TableCell key={1} className={classes.tableCell}><b>Quantity</b></TableCell>
    //                       <TableCell key={2} className={classes.tableCell}><b>Price</b></TableCell>
    //                       <TableCell key={3} className={classes.tableCell}><b>Percentage</b></TableCell>
    //                       <TableCell key={4} className={classes.tableCell}><b>Submitted at</b></TableCell>
    //                       <TableCell key={5} className={classes.tableCell}><b>Visibility</b></TableCell>
    //                       <TableCell key={6} className={classes.tableCell}><b>Status</b></TableCell>
    //                       <TableCell key={7} className={classes.tableCell}><b>Allocation</b></TableCell>
    //                     </TableRow>
    //                     {bids.map((c, i) => (
    //                       <TableRow key={i + 1} className={classes.tableRow} hover={true}>
    //                         <TableCell key={0} className={classes.tableCell}>{c.payload.customer}</TableCell>
    //                         <TableCell key={1} className={classes.tableCell}>{c.payload.details.quantity}</TableCell>
    //                         <TableCell key={2} className={classes.tableCell}>{c.payload.details.price}</TableCell>
    //                         <TableCell key={3} className={classes.tableCell}>{(100.0 * parseFloat(c.payload.details.quantity) / parseFloat(auction.payload.asset.quantity)).toFixed(2)}%</TableCell>
    //                         <TableCell key={4} className={classes.tableCell}>{DateTime.fromISO(c.payload.details.time).toLocaleString(DateTime.DATETIME_FULL)}</TableCell>
    //                         <TableCell key={7} className={classes.tableCell}>{c.payload.allowPublishing ? "Public" : "Private"}</TableCell>
    //                         <TableCell key={5} className={classes.tableCell}>{getBidStatus(c.payload.status)}</TableCell>
    //                         <TableCell key={6} className={classes.tableCell}>{getBidAllocation(c.payload)}</TableCell>
    //                       </TableRow>
    //                     ))}
    //                   </TableBody>
    //                 </Table>
    //               </Paper>
    //             </Grid>
    //           </Grid>
    //         </Grid>
    //         <Grid item xs={4}>
    //           <Grid container direction="column" spacing={2}>
    //             <Grid item xs={12}>
    //               <Paper className={classnames(classes.fullWidth, classes.paper)}>
    //                 <Typography variant="h5" className={classes.heading}>Details</Typography>
    //                 <Table size="small">
    //                   <TableBody>
    //                     <TableRow key={0} className={classes.tableRow}>
    //                       <TableCell key={0} className={classes.tableCell}><b>Issuer</b></TableCell>
    //                       <TableCell key={1} className={classes.tableCell}>{auction.payload.customer}</TableCell>
    //                     </TableRow>
    //                     <TableRow key={1} className={classes.tableRow}>
    //                       <TableCell key={0} className={classes.tableCell}><b>Agent</b></TableCell>
    //                       <TableCell key={1} className={classes.tableCell}>{auction.payload.provider}</TableCell>
    //                     </TableRow>
    //                     <TableRow key={2} className={classes.tableRow}>
    //                       <TableCell key={0} className={classes.tableCell}><b>Auction ID</b></TableCell>
    //                       <TableCell key={1} className={classes.tableCell}>{auction.payload.auctionId}</TableCell>
    //                     </TableRow>
    //                     <TableRow key={3} className={classes.tableRow}>
    //                       <TableCell key={0} className={classes.tableCell}><b>Asset</b></TableCell>
    //                       <TableCell key={1} className={classes.tableCell}>{auction.payload.asset.quantity} {auction.payload.asset.id.label}</TableCell>
    //                     </TableRow>
    //                     <TableRow key={4} className={classes.tableRow}>
    //                       <TableCell key={0} className={classes.tableCell}><b>Floor</b></TableCell>
    //                       <TableCell key={1} className={classes.tableCell}>{auction.payload.floorPrice} {auction.payload.quotedAssetId.label}</TableCell>
    //                     </TableRow>
    //                     <TableRow key={5} className={classes.tableRow}>
    //                       <TableCell key={0} className={classes.tableCell}><b>Subscribed %</b></TableCell>
    //                       <TableCell key={1} className={classes.tableCell}>{filledPerc.toFixed(2)}%</TableCell>
    //                     </TableRow>
    //                     <TableRow key={6} className={classes.tableRow}>
    //                       <TableCell key={0} className={classes.tableCell}><b>Status</b></TableCell>
    //                       <TableCell key={1} className={classes.tableCell}>{getAuctionStatus(auction.payload.status)}</TableCell>
    //                     </TableRow>
    //                     {getFinalPrice(auction.payload.status)
    //                       ?
    //                       <TableRow key={7} className={classes.tableRow}>
    //                         <TableCell key={0} className={classes.tableCell}><b>Final price</b></TableCell>
    //                         <TableCell key={1} className={classes.tableCell}>{getFinalPrice(auction.payload.status)} {auction.payload.quotedAssetId.label}</TableCell>
    //                       </TableRow>
    //                       :
    //                       <TableRow key={8} className={classes.tableRow}>
    //                         <TableCell key={0} className={classes.tableCell}><b>Current price</b></TableCell>
    //                         <TableCell key={1} className={classes.tableCell}>{currentPrice.toFixed(2)} {auction.payload.quotedAssetId.label}</TableCell>
    //                       </TableRow>
    //                     }
    //                     {getParticallyAllocatedUnits(auction.payload) &&
    //                       <TableRow key={9} className={classes.tableRow}>
    //                         <TableCell key={0} className={classes.tableCell}><b>Allocated</b></TableCell>
    //                         <TableCell key={1} className={classes.tableCell}>{getParticallyAllocatedUnits(auction.payload)?.toFixed(2)} {auction.payload.asset.id.label}</TableCell>
    //                       </TableRow>
    //                     }
    //                   </TableBody>
    //                 </Table>
    //                 <Button className={classnames(classes.fullWidth, classes.buttonMargin)} size="large" variant="contained" color="primary" disabled={auction.payload.status.tag !== "Open" || bids.length === 0} onClick={closeAuction}>Close Auction</Button>
    //               </Paper>
    //             </Grid>
    //             <Grid item xs={12}>
    //               <Paper className={classnames(classes.fullWidth, classes.paper)}>
    //                 <Typography variant="h5" className={classes.heading}>Investors</Typography>
    //                 <Table size="small">
    //                   <TableHead>
    //                     <TableRow key={0} className={classes.tableRow}>
    //                       <TableCell key={0} className={classes.tableCell}><b>Investor</b></TableCell>
    //                       <TableCell key={1} className={classes.tableCell}><b>Status</b></TableCell>
    //                       <TableCell key={2} className={classes.tableCell}><b>Action</b></TableCell>
    //                     </TableRow>
    //                   </TableHead>
    //                   <TableBody>
    //                     {biddingProviderServices.filter(c => c.payload.customer !== auction.payload.customer).map((c, i) => (
    //                       <TableRow key={i} className={classes.tableRow}>
    //                         <TableCell key={0} className={classes.tableCell}>{c.payload.customer}</TableCell>
    //                         <TableCell key={1} className={classes.tableCell}>{getbiddingAuctionstatus(c.payload.customer)}</TableCell>
    //                         <TableCell key={2} className={classes.tableCell}>
    //                           {isAuctionProvider && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" disabled={getbiddingAuctionstatus(c.payload.customer) !== "No bid requested" || auction.payload.status.tag !== "Open"} onClick={() => requestBid(c)}>Request Bid</Button>}
    //                         </TableCell>
    //                       </TableRow>))}
    //                   </TableBody>
    //                 </Table>
    //               </Paper>
    //             </Grid>
    //           </Grid>
    //         </Grid>
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </>
  );
};
