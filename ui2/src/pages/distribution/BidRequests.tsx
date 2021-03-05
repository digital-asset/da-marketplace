import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow, TableHead, Button, Grid, Paper, Typography, IconButton, Collapse, Box } from "@material-ui/core";
import { useLedger, useStreamQueries } from "@daml/react";
import useStyles from "../styles";
import { getName } from "../../config";
import { PublishedBid, Request } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model";
import { CreateEvent } from "@daml/ledger";
import { InputDialog, InputDialogProps } from "../../components/InputDialog/InputDialog";
import { Service, SubmitBid } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service";
import { Bid } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model";
import { AssetDeposit } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/module";
import { ContractId } from "@daml/types";
import { getBidStatus, getBidAllocation } from "./Utils";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";

const BidRequestsComponent: React.FC<RouteComponentProps> = ({ history }: RouteComponentProps) => {
  const classes = useStyles();

  const ledger = useLedger();
  const services = useStreamQueries(Service).contracts;
  const requests = useStreamQueries(Request).contracts;
  const bids = useStreamQueries(Bid).contracts;
  const deposits = useStreamQueries(AssetDeposit).contracts;
  const publishedBids = useStreamQueries(PublishedBid).contracts;

  const defaultBidDialogProps: InputDialogProps<any> = {
    open: false,
    title: "Submit Bid",
    defaultValue: { price: "", quantity: "", publish: false },
    fields: {
      price: { label: "Price", type: "number" },
      quantity: { label: "Quantity", type: "number" },
      publish: { label: "Allow Publishing of Bid ?", type: "checkbox" },
    },
    onClose: async function (state: any | null) { }
  };
  const [bidDialogProps, setBidDialogProps] = useState<InputDialogProps<any>>(defaultBidDialogProps);

  if (services.length === 0) return (<></>);
  const service = services[0];

  const rightsizeAsset = async (deposit: CreateEvent<AssetDeposit>, quantity: string): Promise<ContractId<AssetDeposit>> => {
    if (parseFloat(deposit.payload.asset.quantity) > parseFloat(quantity)) {
      const [[splitDepositCid,],] = await ledger.exercise(AssetDeposit.AssetDeposit_Split, deposit.contractId, { quantities: [quantity] });
      return splitDepositCid;
    }
    return deposit.contractId;
  }

  const submitBid = (r: CreateEvent<Request>) => {
    const onClose = async (state: any | null) => {
      setBidDialogProps({ ...defaultBidDialogProps, open: false });
      if (!state) return;
      const volume = state.price * state.quantity;
      const deposit = deposits.find(c => c.payload.asset.id.label === r.payload.quotedAssetId.label && parseFloat(c.payload.asset.quantity) >= volume);
      if (!deposit) return;
      const depositCid = await rightsizeAsset(deposit, volume.toString());
      const arg: SubmitBid = {
        bidRequestCid: r.contractId,
        price: state.price.toString(),
        quantity: state.quantity.toString(),
        depositCid,
        allowPublishing: state.publish
      };
      await ledger.exercise(Service.SubmitBid, service.contractId, arg);
    };
    setBidDialogProps({ ...defaultBidDialogProps, open: true, onClose });
  };

  const AuctionRequestRow = (request: CreateEvent<Request>, index: number): React.ReactElement => {
    const [open, setOpen] = useState(false);

    return (
      <React.Fragment>
        <TableRow key={index} className={classes.tableRow}>
          <TableCell key={0} className={classes.tableCell}>{request.payload.auctionId}</TableCell>
          <TableCell key={1} className={classes.tableCell}>{getName(request.payload.provider)}</TableCell>
          <TableCell key={2} className={classes.tableCell}>{getName(request.payload.issuer)}</TableCell>
          <TableCell key={3} className={classes.tableCell}>{request.payload.asset.id.label}</TableCell>
          <TableCell key={4} className={classes.tableCell}>{request.payload.asset.quantity}</TableCell>
          <TableCell key={5} className={classes.tableCell}>
            <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => submitBid(request)}>Bid</Button>
          </TableCell>
          <TableCell key={6} className={classes.tableCell} align="right">
            <IconButton disabled={publishedBids.length === 0} onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow className={classes.tableRow}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}/>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div" align="right">Published Bids</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell} align="right"><b>Quantity</b></TableCell>
                      <TableCell key={1} className={classes.tableCell} align="right"><b>Price</b></TableCell>
                      <TableCell key={2} className={classes.tableCell} align="right"><b>Allocation %</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {publishedBids.filter(p => p.payload.auctionId === request.payload.auctionId).map((p, i) => (
                      <TableRow key={i} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell} align="right">{p.payload.quantity}</TableCell>
                        <TableCell key={1} className={classes.tableCell} align="right">{p.payload.price}</TableCell>
                        <TableCell key={2} className={classes.tableCell} align="right">{(parseFloat(p.payload.quantity) / parseFloat(request.payload.asset.quantity) * 100).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  };

  return (
    <>
      <InputDialog {...bidDialogProps} />
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
                    <TableCell key={5} className={classes.tableCell}><b>Action</b></TableCell>
                    <TableCell key={6} className={classes.tableCell}/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((c, i) => <AuctionRequestRow {...c} />)}
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
    </>
  );
};

export const BidRequests = withRouter(BidRequestsComponent);