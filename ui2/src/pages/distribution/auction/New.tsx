import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { Typography, Grid, Paper, Select, MenuItem, TextField, Button, MenuProps, FormControl, InputLabel, IconButton, Box } from "@material-ui/core";
import useStyles from "../../styles";
import { transformClaim } from "../../../components/Claims/util";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AssetDeposit } from "@daml.js/da-marketplace/lib/DA/Finance/Asset";
import { Service, RequestCreateAuction, CreateAuctionRequest } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service";
import { CreateEvent } from "@daml/ledger";
import { ContractId } from "@daml/types";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { render } from "../../../components/Claims/render";
import { AssetDescription } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription";

const NewComponent : React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();

  const el1 = useRef<HTMLDivElement>(null);
  const el2 = useRef<HTMLDivElement>(null);

  const [ showAuctionedAsset, setShowAuctionedAsset ] = useState(false);
  const [ showQuotedAsset, setShowQuotedAsset ] = useState(false);

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
  const auctionRequests = useStreamQueries(CreateAuctionRequest).contracts;

  const canRequest = !!auctionedAssetLabel && !!auctionedAsset && !!quotedAssetLabel && !!quotedAsset && !!auctionId && !!quantity && !!floorPrice;

  useEffect(() => {
    if (!el1.current || !auctionedAsset) return;
    el1.current.innerHTML = "";
    const data = transformClaim(auctionedAsset.payload.claims, "root");
    render(el1.current, data);
  }, [el1, auctionedAsset, showAuctionedAsset]);

  useEffect(() => {
    if (!el2.current || !quotedAsset) return;
    el2.current.innerHTML = "";
    const data = transformClaim(quotedAsset.payload.claims, "root");
    render(el2.current, data);
  }, [el2, quotedAsset, showQuotedAsset]);

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
    const deposit = deposits
      .filter(c => auctionRequests.findIndex(a => a.payload.depositCid === c.contractId) === -1)
      .filter(c => c.payload.account !== service.payload.allocationAccount)
      .filter(c => c.payload.asset.id.label === auctionedAssetLabel)
      .find(c => parseFloat(c.payload.asset.quantity) >= parseFloat(quantity));
    if (!auctionedAsset || !quotedAsset || !deposit) return;
    const depositCid = await rightsizeAsset(deposit, quantity);
    const request : RequestCreateAuction = {
      auctionId,
      asset: { id: deposit.payload.asset.id, quantity },
      quotedAssetId: quotedAsset.payload.assetId,
      floorPrice,
      depositCid,
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
          <Grid item xs={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Details</Typography>
                  <FormControl className={classes.inputField} fullWidth>
                    <Box className={classes.fullWidth}>
                      <InputLabel>Auctioned Asset</InputLabel>
                      <Select className={classes.width90} value={auctionedAssetLabel} onChange={e => setAuctionedAssetLabel(e.target.value as string)} MenuProps={menuProps}>
                        {heldAssetLabels.filter(a => a !== quotedAssetLabel).map((a, i) => (<MenuItem key={i} value={a}>{a}</MenuItem>))}
                      </Select>
                      <IconButton className={classes.marginLeft10} color="primary" size="small" component="span" onClick={() => setShowAuctionedAsset(!showAuctionedAsset)}>
                        {showAuctionedAsset ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small"/>}
                      </IconButton>
                    </Box>
                  </FormControl>
                  <FormControl className={classes.inputField} fullWidth>
                    <Box className={classes.fullWidth}>
                      <InputLabel>Quoted Asset</InputLabel>
                      <Select className={classes.width90} value={quotedAssetLabel} onChange={e => setQuotedAssetLabel(e.target.value as string)} MenuProps={menuProps}>
                        {assets.filter(c => c.payload.assetId.label !== auctionedAssetLabel).map((c, i) => (<MenuItem key={i} value={c.payload.assetId.label}>{c.payload.assetId.label}</MenuItem>))}
                      </Select>
                      <IconButton className={classes.marginLeft10} color="primary" size="small" component="span" onClick={() => setShowQuotedAsset(!showQuotedAsset)}>
                        {showQuotedAsset ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small"/>}
                      </IconButton>
                    </Box>
                  </FormControl>
                  <TextField className={classes.inputField} fullWidth label="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Floor Price" type="number" value={floorPrice} onChange={e => setFloorPrice(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Auction ID" type="text" value={auctionId} onChange={e => setAuctionId(e.target.value as string)} />
                  <Button className={classnames(classes.fullWidth, classes.buttonMargin)} size="large" variant="contained" color="primary" disabled={!canRequest} onClick={requestCreateAuction}>Request Auction</Button>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid container direction="column" spacing={2}>
              {showAuctionedAsset && (
                <Grid item xs={12}>
                  <Paper className={classnames(classes.fullWidth, classes.paper)}>
                    <Typography variant="h5" className={classes.heading}>Auctioned Asset</Typography>
                    <div ref={el1} style={{ height: "100%" }}/>
                  </Paper>
                </Grid>)}
              {showQuotedAsset && (
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Quoted Asset</Typography>
                  <div ref={el2} style={{ height: "100%" }}/>
                </Paper>
              </Grid>)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const New = withRouter(NewComponent);