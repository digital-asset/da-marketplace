import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { Typography, Grid, Paper, Select, MenuItem, TextField, Button, MenuProps, FormControl, InputLabel, Box, IconButton } from "@material-ui/core";
import useStyles from "../styles";
import { render } from "../../components/Claims/render";
import { transformClaim } from "../../components/Claims/util";
import { AssetSettlementRule } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { AssetDescription } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription";
import { Service } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/Service";
import {CreateEvent} from "@daml/ledger";

type Props = {
  services : Readonly<CreateEvent<Service, any, any>[]>
}

const NewComponent : React.FC<RouteComponentProps & Props> = ({ history, services } : RouteComponentProps & Props) => {
  const classes = useStyles();

  const el = useRef<HTMLDivElement>(null);

  const [ showAsset, setShowAsset ] = useState(false);
  const [ assetLabel, setAssetLabel ] = useState("");
  const [ accountLabel, setAccountLabel ] = useState("");
  const [ issuanceId, setIssuanceId ] = useState("");
  const [ quantity, setQuantity ] = useState("");

  const ledger = useLedger();
  const party = useParty();
  const customerServices = services.filter(s => s.payload.customer === party);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(c => c.payload.issuer === party && c.payload.assetId.version === "0");
  const asset = assets.find(c => c.payload.assetId.label === assetLabel);
  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules.map(c => c.payload.account);
  const account = accounts.find(a => a.id.label === accountLabel);

  const canRequest = !!assetLabel && !!asset && !!accountLabel && !!account && !!issuanceId && !!quantity;

  useEffect(() => {
    if (!el.current || !asset) return;
    el.current.innerHTML = "";
    const data = transformClaim(asset.payload.claims, "root");
    render(el.current, data);
  }, [el, asset, showAsset]);

  const service = customerServices[0];
  if (!service) return (<></>);

  const requestIssuance = async () => {
    if (!asset || !account) return;
    await ledger.exercise(Service.RequestCreateIssuance, service.contractId, { issuanceId, accountId: account.id, assetId: asset.payload.assetId, quantity });
    history.push("/app/issuance/requests");
  }

  const menuProps : Partial<MenuProps> = { anchorOrigin: { vertical: "bottom", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" }, getContentAnchorEl: null };
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.heading}>New Issuance</Typography>
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
                      <InputLabel>Asset</InputLabel>
                      <Select className={classes.width90} value={assetLabel} onChange={e => setAssetLabel(e.target.value as string)} MenuProps={menuProps}>
                        {assets.map((c, i) => (<MenuItem key={i} value={c.payload.assetId.label}>{c.payload.assetId.label}</MenuItem>))}
                      </Select>
                      <IconButton className={classes.marginLeft10} color="primary" size="small" component="span" onClick={() => setShowAsset(!showAsset)}>
                        {showAsset ? <VisibilityOff fontSize="small"/> : <Visibility fontSize="small"/>}
                      </IconButton>
                    </Box>
                  </FormControl>
                  <FormControl className={classes.inputField} fullWidth>
                    <InputLabel>Issuance Account</InputLabel>
                    <Select value={accountLabel} onChange={e => setAccountLabel(e.target.value as string)} MenuProps={menuProps}>
                      {accounts.map((a, i) => (<MenuItem key={i} value={a.id.label}>{a.id.label}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <TextField className={classes.inputField} fullWidth label="Issuance ID" type="text" value={issuanceId} onChange={e => setIssuanceId(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value as string)} />
                  <Button className={classnames(classes.fullWidth, classes.buttonMargin)} size="large" variant="contained" color="primary" disabled={!canRequest} onClick={requestIssuance}>Request Issuance</Button>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Grid container direction="column" spacing={2}>
              {showAsset && (
                <Grid item xs={12}>
                  <Paper className={classnames(classes.fullWidth, classes.paper)}>
                    <Typography variant="h5" className={classes.heading}>Instrument</Typography>
                    <div ref={el} style={{ height: "100%" }}/>
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