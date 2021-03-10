import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { Typography, Grid, Paper, Select, MenuItem, TextField, Button, MenuProps, FormControl, InputLabel, IconButton, Box } from "@material-ui/core";
import useStyles from "../styles";
import { render } from "../../components/Claims/render";
import { transformClaim } from "../../components/Claims/util";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Visibility } from "@material-ui/icons";
import { AssetDescription } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription";
import { RequestCreateListing, Service } from "@daml.js/da-marketplace/lib/Marketplace/Listing/Service";

const NewComponent : React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();

  const el1 = useRef<HTMLDivElement>(null);
  const el2 = useRef<HTMLDivElement>(null);

  const [ showTradedAsset, setShowTradedAsset ] = useState(false);
  const [ showQuotedAsset, setShowQuotedAsset ] = useState(false);

  const [ tradedAssetLabel, setTradedAssetLabel ] = useState("");
  const [ tradedAssetPrecision, setTradedAssetPrecision ] = useState("");
  const [ quotedAssetLabel, setQuotedAssetLabel ] = useState("");
  const [ quotedAssetPrecision, setQuotedAssetPrecision ] = useState("");
  const [ minimumTradableQuantity, setMinimumTradableQuantity ] = useState("");
  const [ maximumTradableQuantity, setMaximumTradableQuantity ] = useState("");
  const [ listingId, setListingId ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ calendarId, ] = useState("1261007448");

  const ledger = useLedger();
  const party = useParty();
  const services = useStreamQueries(Service).contracts;
  const customerServices = services.filter(s => s.payload.customer === party);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(c => c.payload.assetId.version === "0");
  const tradedAsset = assets.find(c => c.payload.assetId.label === tradedAssetLabel);
  const quotedAsset = assets.find(c => c.payload.assetId.label === quotedAssetLabel);

  const canRequest =
    !!tradedAssetLabel && !!tradedAsset && !!tradedAssetPrecision &&
    !!quotedAssetLabel && !!quotedAsset && !!quotedAssetPrecision &&
    !!minimumTradableQuantity && !!maximumTradableQuantity && !!listingId && !!calendarId;

  useEffect(() => {
    if (!el1.current || !tradedAsset) return;
    el1.current.innerHTML = "";
    const data = transformClaim(tradedAsset.payload.claims, "root");
    render(el1.current, data);
  }, [el1, tradedAsset, showTradedAsset]);

  useEffect(() => {
    if (!el2.current || !quotedAsset) return;
    el2.current.innerHTML = "";
    const data = transformClaim(quotedAsset.payload.claims, "root");
    render(el2.current, data);
  }, [el2, quotedAsset, showQuotedAsset]);

  const service = customerServices[0];
  if (!service) return (<></>);

  const requestListing = async () => {
    if (!tradedAsset || !quotedAsset) return;
    const request : RequestCreateListing = {
      listingId,
      calendarId,
      description,
      tradedAssetId: tradedAsset.payload.assetId,
      quotedAssetId: quotedAsset.payload.assetId,
      tradedAssetPrecision,
      quotedAssetPrecision,
      minimumTradableQuantity,
      maximumTradableQuantity,
      observers : [ "Public" ] // TODO: Use real public party
    };
    await ledger.exercise(Service.RequestCreateListing, service.contractId, request);
    history.push("/apps/listing/requests");
  }

  const menuProps : Partial<MenuProps> = { anchorOrigin: { vertical: "bottom", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" }, getContentAnchorEl: null };
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.heading}>New Listing</Typography>
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
                      <InputLabel>Traded Asset</InputLabel>
                      <Select className={classes.width90} value={tradedAssetLabel} onChange={e => setTradedAssetLabel(e.target.value as string)} MenuProps={menuProps}>
                        {assets.filter(c => c.payload.assetId.label !== quotedAssetLabel).map((c, i) => (<MenuItem key={i} value={c.payload.assetId.label}>{c.payload.assetId.label}</MenuItem>))}
                      </Select>
                      <IconButton className={classes.marginLeft10} color="primary" size="small" component="span" onClick={() => setShowTradedAsset(!showTradedAsset)}>
                        <Visibility fontSize="small"/>
                      </IconButton>
                    </Box>
                  </FormControl>
                  <TextField className={classes.inputField} fullWidth label="Traded Asset Precision" type="number" value={tradedAssetPrecision} onChange={e => setTradedAssetPrecision(e.target.value as string)} />
                  <FormControl className={classes.inputField} fullWidth>
                    <Box className={classes.fullWidth}>
                      <InputLabel>Quoted Asset</InputLabel>
                      <Select className={classes.width90} value={quotedAssetLabel} onChange={e => setQuotedAssetLabel(e.target.value as string)} MenuProps={menuProps}>
                        {assets.filter(c => c.payload.assetId.label !== tradedAssetLabel).map((c, i) => (<MenuItem key={i} value={c.payload.assetId.label}>{c.payload.assetId.label}</MenuItem>))}
                      </Select>
                      <IconButton className={classes.marginLeft10} color="primary" size="small" component="span" onClick={() => setShowQuotedAsset(!showQuotedAsset)}>
                        <Visibility fontSize="small"/>
                      </IconButton>
                    </Box>
                  </FormControl>
                  <TextField className={classes.inputField} fullWidth label="Quoted Asset Precision" type="number" value={quotedAssetPrecision} onChange={e => setQuotedAssetPrecision(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Minimum Tradable Quantity" type="number" value={minimumTradableQuantity} onChange={e => setMinimumTradableQuantity(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Maximum Tradable Quantity" type="number" value={maximumTradableQuantity} onChange={e => setMaximumTradableQuantity(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Symbol" type="text" value={listingId} onChange={e => setListingId(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Description" type="text" value={description} onChange={e => setDescription(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Trading Calendar ID" type="text" value={calendarId} disabled={true} />
                  <Button className={classnames(classes.fullWidth, classes.buttonMargin)} size="large" variant="contained" color="primary" disabled={!canRequest} onClick={requestListing}>Request Listing</Button>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid container direction="column" spacing={2}>
              {showTradedAsset && (
                <Grid item xs={12}>
                  <Paper className={classnames(classes.fullWidth, classes.paper)}>
                    <Typography variant="h5" className={classes.heading}>Traded Asset</Typography>
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