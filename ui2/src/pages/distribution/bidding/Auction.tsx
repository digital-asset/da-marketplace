import React, { useEffect, useRef, useState } from "react";
import useStyles from "../../styles";
import classnames from "classnames";
import { Auction as BiddingAuctionContract, Bid } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model";
import { useLedger, useStreamQueries } from "@daml/react";
import { Grid, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Checkbox, FormControlLabel, FormControl, IconButton } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { AssetDeposit } from "@daml.js/da-marketplace/lib/DA/Finance/Asset";
import { CreateEvent } from "@daml/ledger";
import { ContractId } from "@daml/types";
import { Service, SubmitBid } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service";
import { transformClaim } from "../../../components/Claims/util";
import { render } from "../../../components/Claims/render";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { getBidAllocation, getBidStatus } from "../Utils";
import { AssetDescription } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription/module";

export const BiddingAuction = () => {
  const classes = useStyles();
  const ledger = useLedger();
  const { contractId } = useParams<any>();

  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [allowPublishing, setAllowPublishing] = useState<boolean>(false);

  const allBiddingAuctions = useStreamQueries(BiddingAuctionContract);
  const deposits = useStreamQueries(AssetDeposit).contracts;
  const services = useStreamQueries(Service).contracts;
  const bids = useStreamQueries(Bid);

  const biddingAuction = allBiddingAuctions.contracts.find(b => b.contractId === contractId);

  // TODO : We should refactor the claims into their own component
  const el1 = useRef<HTMLDivElement>(null);
  const el2 = useRef<HTMLDivElement>(null);
  const [showAuctionedAsset, setShowAuctionedAsset] = useState<boolean>(true);
  const [showQuotedAsset, setShowQuotedAsset] = useState<boolean>(false);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(c => c.payload.assetId.version === "0");

  useEffect(() => {
    if (!el1.current || !biddingAuction) return;
    el1.current.innerHTML = "";
    const auctionedAsset = assets.find(c => c.payload.assetId.label === biddingAuction.payload.asset.id.label);
    if (!auctionedAsset) return;
    const data = transformClaim(auctionedAsset.payload.claims, "root");
    render(el1.current, data);
  }, [el1, assets, biddingAuction, showAuctionedAsset]);

  useEffect(() => {
    if (!el2.current || !biddingAuction) return;
    el2.current.innerHTML = "";
    const quotedAsset = assets.find(c => c.payload.assetId.label === biddingAuction.payload.quotedAssetId.label);
    if (!quotedAsset) return;
    const data = transformClaim(quotedAsset.payload.claims, "root");
    render(el2.current, data);
  }, [el2, assets, biddingAuction, showQuotedAsset]);

  if (!biddingAuction || services.length === 0) return (<></>);
  const service = services[0];

  const bid = bids.contracts.find(b => b.payload.auctionId === biddingAuction.payload.auctionId);

  const rightsizeAsset = async (deposit: CreateEvent<AssetDeposit>, quantity: string): Promise<ContractId<AssetDeposit>> => {
    if (parseFloat(deposit.payload.asset.quantity) > parseFloat(quantity)) {
      const [[splitDepositCid,],] = await ledger.exercise(AssetDeposit.AssetDeposit_Split, deposit.contractId, { quantities: [quantity] });
      return splitDepositCid;
    }
    return deposit.contractId;
  }

  const submitBid = async () => {
    const volume = price * quantity;
    const deposit = deposits.find(c => c.payload.asset.id.label === biddingAuction.payload.quotedAssetId.label && parseFloat(c.payload.asset.quantity) >= volume);
    if (!deposit) return;
    const depositCid = await rightsizeAsset(deposit, volume.toString());
    const arg: SubmitBid = {
      auctionCid: biddingAuction.contractId,
      price: price.toString(),
      quantity: quantity.toString(),
      depositCid,
      allowPublishing
    };
    await ledger.exercise(Service.SubmitBid, service.contractId, arg);
  };

  return (
    <Grid container direction="column">
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.heading}>Auction - {biddingAuction.payload.asset.id.label}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Grid container direction="column">
              <Grid xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Auction Details</Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow key={0} className={classes.tableRow}>
                        <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Issuer</b></TableCell>
                        <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{biddingAuction.payload.issuer}</TableCell>
                      </TableRow>
                      <TableRow key={1} className={classes.tableRow}>
                        <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Agent</b></TableCell>
                        <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{biddingAuction.payload.provider}</TableCell>
                      </TableRow>
                      <TableRow key={2} className={classes.tableRow}>
                        <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Auction ID</b></TableCell>
                        <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{biddingAuction.payload.auctionId}</TableCell>
                      </TableRow>
                      <TableRow key={3} className={classes.tableRow}>
                        <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Asset</b></TableCell>
                        <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{biddingAuction.payload.asset.id.label}
                          <IconButton className={classes.marginLeft10} color="primary" size="small" component="span" onClick={() => setShowAuctionedAsset(!showAuctionedAsset)}>
                            {showAuctionedAsset ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow key={4} className={classes.tableRow}>
                        <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Quantity</b></TableCell>
                        <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{biddingAuction.payload.asset.quantity}</TableCell>
                      </TableRow>
                      <TableRow key={5} className={classes.tableRow}>
                        <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Quoted Asset</b></TableCell>
                        <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{biddingAuction.payload.quotedAssetId.label}
                          <IconButton className={classes.marginLeft10} color="primary" size="small" component="span" onClick={() => setShowQuotedAsset(!showQuotedAsset)}>
                            {showQuotedAsset ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
              <Grid xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Published Bids</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow key={0} className={classes.tableRow}>
                        <TableCell key={1} className={classes.tableCell}>Investor</TableCell>
                        <TableCell key={0} className={classes.tableCell} align="right">Quantity</TableCell>
                        <TableCell key={2} className={classes.tableCell} align="right">Allocation %</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {biddingAuction.payload.publishedBids.map((c, i) =>
                        <TableRow key={0} className={classes.tableRow}>
                          <TableCell key={1} className={classes.tableCell}>{c.investor}</TableCell>
                          <TableCell key={0} className={classes.tableCell} align="right">{c.quantity}</TableCell>
                          <TableCell key={2} className={classes.tableCell} align="right">{(parseFloat(c.quantity) / parseFloat(biddingAuction.payload.asset.quantity) * 100).toFixed(2)}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
              <Grid xs={12}>
                {!!bid &&
                  <Paper className={classnames(classes.fullWidth, classes.paper)}>
                    <Typography variant="h5" className={classes.heading}>Bid</Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow key={0} className={classes.tableRow}>
                          <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Quantity</b></TableCell>
                          <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{bid.payload.details.quantity}</TableCell>
                        </TableRow>
                        <TableRow key={1} className={classes.tableRow}>
                          <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Price</b></TableCell>
                          <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{bid.payload.details.price} {bid.payload.quotedAssetId.label}</TableCell>
                        </TableRow>
                        <TableRow key={1} className={classes.tableRow}>
                          <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Status</b></TableCell>
                          <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{getBidStatus(bid.payload.status)}</TableCell>
                        </TableRow>
                        {getBidAllocation(bid.payload) &&
                          <TableRow key={1} className={classes.tableRow}>
                            <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Allocation</b></TableCell>
                            <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{getBidAllocation(bid.payload)}</TableCell>
                          </TableRow>
                        }
                      </TableBody>
                    </Table>
                  </Paper>}
                {!bid &&
                  <Paper className={classnames(classes.fullWidth, classes.paper)}>
                    <Typography variant="h5" className={classes.heading}>Submit Bid</Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow key={0} className={classes.tableRow}>
                          <TextField required autoFocus fullWidth type="number" label={"Quantity (" + biddingAuction.payload.asset.id.label + ")"} onChange={e => setQuantity(parseFloat(e.target.value))} />
                        </TableRow>
                        <TableRow key={1} className={classes.tableRow}>
                          <TextField required fullWidth className={classes.inputField} type="number" label={"Price (" + biddingAuction.payload.quotedAssetId.label + ")"} onChange={e => setPrice(parseFloat(e.target.value))} />
                        </TableRow>
                        <TableRow key={2} className={classes.tableRow}>
                          <br />
                          <FormControl key={0} fullWidth>
                            <FormControlLabel key={1} label="Allow Publishing of Bid?" control={<Checkbox color="primary" onChange={e => setAllowPublishing(e.target.checked)} />} />
                          </FormControl>
                        </TableRow>
                        <TableRow key={3} className={classes.tableRow}>
                          <Button color="primary" className={classnames(classes.fullWidth, classes.buttonMargin)} variant="contained" disabled={price === 0 || quantity === 0} onClick={() => submitBid()}>Bid</Button>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Paper>}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid container direction="column" spacing={2}>
              {showAuctionedAsset && (
                <Grid item xs={12}>
                  <Paper className={classnames(classes.fullWidth, classes.paper)}>
                    <Typography variant="h5" className={classes.heading}>Auctioned Asset</Typography>
                    <div ref={el1} style={{ height: "100%" }} />
                  </Paper>
                </Grid>)}
              {showQuotedAsset && (
                <Grid item xs={12}>
                  <Paper className={classnames(classes.fullWidth, classes.paper)}>
                    <Typography variant="h5" className={classes.heading}>Quoted Asset</Typography>
                    <div ref={el2} style={{ height: "100%" }} />
                  </Paper>
                </Grid>)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
