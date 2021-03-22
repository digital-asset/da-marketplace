import React, { useState } from "react";
import classnames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { Typography, Grid, Table, TableBody, TableCell, TableRow, TextField, Button, Slider, Paper } from "@material-ui/core";
import { useParams, RouteComponentProps } from "react-router-dom";
import useStyles from "../styles";
import { Listing } from "@daml.js/da-marketplace/lib/Marketplace/Listing/Model";
import { Details, Order, OrderType, Side } from "@daml.js/da-marketplace/lib/Marketplace/Trading/Model";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { Service } from "@daml.js/da-marketplace/lib/Marketplace/Trading/Service";
import { withStyles } from "@material-ui/styles";
import { CreateEvent } from "@daml/ledger";
import { ContractId } from "@daml/types";
import { AssetDeposit } from "@daml.js/da-marketplace/lib/DA/Finance/Asset";

const PercentageSlider = withStyles({
  root: {
    paddingTop: "30px",
  },
  active: {},
  valueLabel: {
    top: -22,
    "& *": {
      background: "transparent",
      color: "#203260",
    },
  },
})(Slider);

type Props = {
  services : Readonly<CreateEvent<Service, any, any>[]>
}

export const Market : React.FC<Props> = ({ services } : Props) => {
  const classes = useStyles();

  const [ isBuy, setIsBuy ] = useState(true);
  const [ isLimit, setIsLimit ] = useState(true);
  const [ price, setPrice ] = useState(0.0);
  const [ quantity, setQuantity ] = useState(0.0);
  const [ percentage, setPercentage ] = useState(0.0);
  const [ total, setTotal ] = useState(0.0);

  const handlePriceChange = (p : number) => {
    const perc = isBuy ? (quotedAssetsTotal === 0 ? 0 : 100 * quantity * p / quotedAssetsTotal) : (tradedAssetsTotal === 0 ? 0 : 100 * quantity / tradedAssetsTotal);
    setPrice(p);
    setTotal(quantity * p);
    setPercentage(perc);
  }

  const handleQuantityChange = (q : number) => {
    const perc = isBuy ? (quotedAssetsTotal === 0 ? 0 : 100 * q * price / quotedAssetsTotal) : (tradedAssetsTotal === 0 ? 0 : 100 * q / tradedAssetsTotal);
    setQuantity(q);
    setTotal(q * price);
    setPercentage(perc);
  }

  const handleTotalChange = (t : number) => {
    const perc = isBuy ? (quotedAssetsTotal === 0 ? 0 : 100 * t / quotedAssetsTotal) : (tradedAssetsTotal === 0 || price === 0 ? 0 : 100 * t / price / tradedAssetsTotal);
    setQuantity(t / price);
    setTotal(t);
    setPercentage(perc);
  }

  const handlePercentageChange = (perc : number) => {
    const q = isBuy ? (price === 0 ? 0 : perc * quotedAssetsTotal / 100 / price) : perc * tradedAssetsTotal / 100;
    setQuantity(q);
    setTotal(q * price);
    setPercentage(perc);
  }

  const { contractId } = useParams<any>();
  const cid = contractId.replace("_", "#");

  const party = useParty();
  const ledger = useLedger();
  const clientServices = services.filter(s => s.payload.customer === party);
  const listings = useStreamQueries(Listing).contracts;
  const listing = listings.find(c => c.contractId === cid);

  const assets = useStreamQueries(AssetDeposit).contracts;
  const orders = useStreamQueries(Order).contracts;
  const limits = orders.filter(c => c.payload.details.orderType.tag === "Limit")
  const bids = limits.filter(c => c.payload.details.side === Side.Buy).sort((a, b) => parseFloat((b.payload.details.orderType.value as OrderType.Limit).price) - parseFloat((a.payload.details.orderType.value as OrderType.Limit).price));
  const asks = limits.filter(c => c.payload.details.side === Side.Sell).sort((a, b) => parseFloat((b.payload.details.orderType.value as OrderType.Limit).price) - parseFloat((a.payload.details.orderType.value as OrderType.Limit).price));

  if (!listing || clientServices.length === 0) return (<></>); // TODO: Return 404 not found
  const service = clientServices[0];

  const available = assets.filter(c => c.payload.account.id.label === service.payload.tradingAccount.id.label);
  const tradedAssets = available.filter(c => c.payload.asset.id.label === listing?.payload.tradedAssetId.label);
  const quotedAssets = available.filter(c => c.payload.asset.id.label === listing?.payload.quotedAssetId.label);
  const tradedAssetsTotal = tradedAssets.reduce((acc, c) => acc + parseFloat(c.payload.asset.quantity), 0);
  const quotedAssetsTotal = quotedAssets.reduce((acc, c) => acc + parseFloat(c.payload.asset.quantity), 0);

  const getAsset = async (deposits : CreateEvent<AssetDeposit>[], quantity : number) : Promise<ContractId<AssetDeposit> | null> => {
    const deposit = deposits.find(c => parseFloat(c.payload.asset.quantity) >= quantity);
    if (!deposit) return null;
    if (parseFloat(deposit.payload.asset.quantity) > quantity) {
      const [ [ split,], ] = await ledger.exercise(AssetDeposit.AssetDeposit_Split, deposit.contractId, { quantities: [quantity.toString()] });
      return split;
    }
    return deposit.contractId;
  }

  const requestCreateOrder = async () => {
    const depositCid = isBuy ? await getAsset(quotedAssets, price * quantity) : await getAsset(tradedAssets, quantity);
    if (!depositCid) return;
    const details : Details = {
      id: { signatories: { textMap: {} }, label: uuidv4(), version: "0" },
      symbol: listing.payload.listingId,
      asset: { id : listing.payload.tradedAssetId, quantity: quantity.toString() },
      side: isBuy ? Side.Buy : Side.Sell,
      orderType: isLimit ? { tag: "Limit", value: { price: price.toString() } } : { tag: "Market", value: {} },
      timeInForce: { tag: "GTC", value: {} }
    }
    await ledger.exercise(Service.RequestCreateOrder, service.contractId, { details, depositCid });
  };

  const getPrice = (c : CreateEvent<Order>) => {
    return parseFloat((c.payload.details.orderType.value as OrderType.Limit).price);
  }

  const getQuantity = (c : CreateEvent<Order>) => {
    return parseFloat(c.payload.details.asset.quantity);
  }

  const getVolume = (c : CreateEvent<Order>) => {
    return getPrice(c) * getQuantity(c);
  }

  const getColor = (c : CreateEvent<Order>) => {
    return c.payload.details.side === Side.Buy ? "green" : "red";
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.heading}>{listing.payload.listingId}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Orderbook</Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow key={0} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}></TableCell>
                        <TableCell key={1} className={classes.tableCell}></TableCell>
                        <TableCell key={2} className={classes.tableCell}><b>Price</b></TableCell>
                        <TableCell key={3} className={classes.tableCell}><b>Sell Quantity ({listing.payload.tradedAssetId.label})</b></TableCell>
                        <TableCell key={4} className={classes.tableCell}><b>Sell Volume ({listing.payload.quotedAssetId.label})</b></TableCell>
                      </TableRow>
                      {asks.map((c, i) => (
                        <TableRow key={i+1} className={classes.tableRow}>
                          <TableCell key={0} className={classes.tableCell}></TableCell>
                          <TableCell key={1} className={classes.tableCell}></TableCell>
                          <TableCell key={2} className={classes.tableCell} style={{ color: "red"}}>{getPrice(c)}</TableCell>
                          <TableCell key={3} className={classes.tableCell}>{getQuantity(c)}</TableCell>
                          <TableCell key={4} className={classes.tableCell}>{getVolume(c)}</TableCell>
                        </TableRow>
                      ))}
                      {bids.map((c, i) => (
                        <TableRow key={i+1} className={classes.tableRow}>
                          <TableCell key={0} className={classes.tableCell}>{getVolume(c)}</TableCell>
                          <TableCell key={1} className={classes.tableCell}>{getQuantity(c)}</TableCell>
                          <TableCell key={2} className={classes.tableCell} style={{ color: "green"}}>{getPrice(c)}</TableCell>
                          <TableCell key={3} className={classes.tableCell}></TableCell>
                          <TableCell key={4} className={classes.tableCell}></TableCell>
                        </TableRow>
                      ))}
                      <TableRow key={0} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Buy Volume ({listing.payload.quotedAssetId.label})</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}><b>Buy Quantity ({listing.payload.tradedAssetId.label})</b></TableCell>
                        <TableCell key={2} className={classes.tableCell}><b>Price</b></TableCell>
                        <TableCell key={3} className={classes.tableCell}></TableCell>
                        <TableCell key={4} className={classes.tableCell}></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <ToggleButtonGroup className={classes.fullWidth} value={isBuy} exclusive onChange={(_, v) => { if (v !== null) setIsBuy(v); }}>
                  <ToggleButton className={classes.fullWidth} color="primary" value={true}>Buy</ToggleButton>
                  <ToggleButton className={classes.fullWidth} value={false}>Sell</ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup className={classnames(classes.fullWidth, classes.buttonMargin)} value={isLimit} exclusive onChange={(_, v) => { if (v !== null) setIsLimit(v); }}>
                  <ToggleButton className={classes.fullWidth} value={true}>Limit</ToggleButton>
                  <ToggleButton className={classes.fullWidth} value={false}>Market</ToggleButton>
                </ToggleButtonGroup>
                <TextField className={classes.inputField} fullWidth label="Price" type="number" value={isLimit ? price : "Market"} disabled={!isLimit} onChange={e => handlePriceChange(parseFloat(e.target.value))}/>
                <TextField className={classes.inputField} fullWidth label="Quantity" type="number" value={quantity} onChange={e => handleQuantityChange(parseFloat(e.target.value))}/>
                <PercentageSlider step={1} valueLabelFormat={v => v + "%"} value={percentage} valueLabelDisplay="auto" onChange={(_, v) => handlePercentageChange(v as number)} />
                <TextField className={classes.inputField} fullWidth label="Total" type="number" value={total} onChange={e => handleTotalChange(parseFloat(e.target.value))}/>
                <Button className={classnames(classes.fullWidth, classes.buttonMargin)} size="large" variant="contained" color="primary" disabled={!price || !quantity} onClick={requestCreateOrder}>{isBuy ? "Buy" : "Sell"} {listing.payload.tradedAssetId.label}</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  );
};
