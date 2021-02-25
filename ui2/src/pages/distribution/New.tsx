import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { Typography, Grid, Paper, Select, MenuItem, TextField, Button, MenuProps, FormControl, InputLabel } from "@material-ui/core";
import useStyles from "../styles";
import { AssetDescription } from "@daml.js/da-marketplace/lib/Marketplace/AssetDescription/module";
import { render } from "../../components/Claims/render";
import { transformClaim } from "../../components/Claims/util";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AssetDeposit } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/module";
import { Service, RequestCreateAuction } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service";
import { CreateEvent } from "@daml/ledger";
import { ContractId } from "@daml/types";

const NewComponent : React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();

  const el1 = useRef<HTMLDivElement>(null);
  const el2 = useRef<HTMLDivElement>(null);

  const [ auctionedAssetLabel, setAuctionedAssetLabel ] = useState("");
  const [ quotedAssetLabel, setQuotedAssetLabel ] = useState("");
  const [ quantity, setQuantity ] = useState("");
  const [ floorPrice, setFloorPrice ] = useState("");
  const [ auctionId, setAuctionId ] = useState("");

  const ledger = useLedger();
  const party = useParty();
  const services = useStreamQueries(Service).contracts;
  const customerServices = services.filter(s => s.payload.customer === party);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(c => c.payload.assetId.version === "0");
  const auctionedAsset = assets.find(c => c.payload.assetId.label === auctionedAssetLabel);
  const quotedAsset = assets.find(c => c.payload.assetId.label === quotedAssetLabel);
  const deposits = useStreamQueries(AssetDeposit).contracts;
  const heldAssets = deposits.filter(c => c.payload.account.owner === party);
  const heldAssetLabels = heldAssets.map(c => c.payload.asset.id.label).filter((v, i, a) => a.indexOf(v) === i);

  const canRequest = !!auctionedAssetLabel && !!auctionedAsset && !!quotedAssetLabel && !!quotedAsset && !!auctionId && !!quantity && !!floorPrice;

  useEffect(() => {
    if (!el1.current || !auctionedAsset) return;
    el1.current.innerHTML = "";
    const data = transformClaim(auctionedAsset.payload.claims, "root");
    render(el1.current, data);
  }, [el1, auctionedAsset]);

  useEffect(() => {
    if (!el2.current || !quotedAsset) return;
    el2.current.innerHTML = "";
    const data = transformClaim(quotedAsset.payload.claims, "root");
    render(el2.current, data);
  }, [el2, quotedAsset]);

  console.log(customerServices);
  const service = customerServices[0];
  if (!service) return (<></>);

  const rightsizeAsset = async (deposit : CreateEvent<AssetDeposit>, quantity : string) : Promise<ContractId<AssetDeposit>> => {
    if (parseFloat(deposit.payload.asset.quantity) > parseFloat(quantity)) {
      const [ [ splitDepositCid,], ] = await ledger.exercise(AssetDeposit.AssetDeposit_Split, deposit.contractId, { quantities: [ quantity ] });
      return splitDepositCid;
    }
    return deposit.contractId;
  }

  const requestCreateAuction = async () => {
    const deposit = deposits.find(c => c.payload.asset.id.label === auctionedAssetLabel && parseFloat(c.payload.asset.quantity) >= parseFloat(quantity));
    if (!auctionedAsset || !quotedAsset || !deposit) return;
    const assetDepositCid = await rightsizeAsset(deposit, quantity);
    const request : RequestCreateAuction = {
      auctionId,
      asset: { id: deposit.payload.asset.id, quantity },
      quotedAssetId: quotedAsset.payload.assetId,
      floorPrice,
      assetDepositCid,
    };
    await ledger.exercise(Service.RequestCreateAuction, service.contractId, request);
    history.push("/apps/distribution/requests");
  }

  const menuProps : Partial<MenuProps> = { anchorOrigin: { vertical: "bottom", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" }, getContentAnchorEl: null };
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.heading}>New Auction</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Auctioned Asset</Typography>
                  <div ref={el1} style={{ height: "100%" }}/>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Quoted Asset</Typography>
                  <div ref={el2} style={{ height: "100%" }}/>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Details</Typography>
                  <FormControl className={classes.inputField} fullWidth>
                    <InputLabel>Auctioned Asset</InputLabel>
                    <Select value={auctionedAssetLabel} onChange={e => setAuctionedAssetLabel(e.target.value as string)} MenuProps={menuProps}>
                      {heldAssetLabels.filter(a => a !== quotedAssetLabel).map((a, i) => (<MenuItem key={i} value={a}>{a}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <FormControl className={classes.inputField} fullWidth>
                    <InputLabel>Quoted Asset</InputLabel>
                    <Select value={quotedAssetLabel} onChange={e => setQuotedAssetLabel(e.target.value as string)} MenuProps={menuProps}>
                      {assets.filter(c => c.payload.assetId.label !== auctionedAssetLabel).map((c, i) => (<MenuItem key={i} value={c.payload.assetId.label}>{c.payload.assetId.label}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <TextField className={classes.inputField} fullWidth label="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Floor Price" type="number" value={floorPrice} onChange={e => setFloorPrice(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Auction ID" type="text" value={auctionId} onChange={e => setAuctionId(e.target.value as string)} />
                  <Button className={classnames(classes.fullWidth, classes.buttonMargin)} size="large" variant="contained" color="primary" disabled={!canRequest} onClick={requestCreateAuction}>Request Auction</Button>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const New = withRouter(NewComponent);