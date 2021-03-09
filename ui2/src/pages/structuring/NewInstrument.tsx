import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { Typography, Grid, Paper, Select, MenuItem, TextField, Button, MenuProps, FormControl, InputLabel } from "@material-ui/core";
import useStyles from "../styles";
import { AssetDescription } from "@daml.js/da-marketplace/lib/Marketplace/AssetDescription/module";
import { renderInteractive } from "../../components/Claims/renderInteractive";
import { transformClaim } from "../../components/Claims/util";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Id } from "@daml.js/da-marketplace/lib/DA/Finance/Types/module";
import { Observation } from "@daml.js/da-marketplace/lib/ContingentClaims/Observation/module";
import { Claim } from "@daml.js/da-marketplace/lib/ContingentClaims/Claim/Serializable/module";
import { Date as DamlDate } from "@daml/types";
import DateFnsUtils from "@date-io/date-fns";
import { Service } from "@daml.js/da-marketplace/lib/Marketplace/Issuance";
import { AssetSettlementRule } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement/module";
import { RouteComponentProps, withRouter } from "react-router-dom";

const NewInstrumentComponent = ({ history } : RouteComponentProps) => {
  const classes = useStyles();

  const el = useRef<HTMLDivElement>(null);

  const [ isCall, setIsCall ] = useState(true);
  const [ underlying, setUnderlying ] = useState("");
  const [ strike, setStrike ] = useState("");
  const [ expiry, setExpiry ] = useState<Date | null>(null);
  const [ currency, setCurrency ] = useState("");
  const [ label, setLabel ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ account, setAccount ] = useState("");

  const canRequest = !!underlying && !!strike && !!expiry && !!currency && !!label && !!description && !!account;

  const ledger = useLedger();
  const party = useParty();
  const services = useStreamQueries(Service).contracts;
  const customerServices = services.filter(s => s.payload.customer === party);
  const allAssets = useStreamQueries(AssetDescription).contracts;
  const assets = allAssets.filter(c => c.payload.claims.tag === "Zero" && c.payload.assetId.version === "0");
  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules.map(c => c.payload.account);
  const ccy = assets.find(c => c.payload.assetId.label === currency);
  const ccyId : Id = ccy?.payload.assetId || { signatories: { textMap: {} }, label: "", version: "0" };

  const parseDate = (d : Date | null) => (!!d && d.toString() !== "Invalid Date" && new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)) || "";

  const obsToday    : Observation<DamlDate, Id> = { tag: "DateIdentity", value: {} };
  const obsExpiry   : Observation<DamlDate, Id> = { tag: "DateConst", value: parseDate(expiry) };
  const obsEuropean : Observation<DamlDate, Id> = { tag: "DateEqu", value: { _1: obsToday, _2: obsExpiry } };
  const obsStrike   : Observation<DamlDate, Id> = { tag: "DecimalConst", value: strike };
  const obsSpot     : Observation<DamlDate, Id> = { tag: "DecimalObs", value: underlying };
  const obsPayoff   : Observation<DamlDate, Id> = { tag: "DecimalLte", value: isCall ? { _1: obsStrike, _2: obsSpot } : { _1: obsSpot, _2: obsStrike } };

  const zero      : Claim<DamlDate, Id> = { tag: "Zero", value: {} };
  const oneUsd    : Claim<DamlDate, Id> = { tag: "One", value: ccyId };
  const cond      : Claim<DamlDate, Id> = { tag: "Cond", value: { predicate: obsPayoff, success: oneUsd, failure: zero } };
  const choice    : Claim<DamlDate, Id> = { tag: "Or", value: { lhs: cond, rhs: zero } };
  const claims    : Claim<DamlDate, Id> = { tag: "When", value: { predicate: obsEuropean, obligation: choice } };

  useEffect(() => {
    if (!el.current) return;
    el.current.innerHTML = "";
    const data = transformClaim(claims, "root");
    renderInteractive(el.current, data);
  }, [el, claims]);

  const service = customerServices[0];
  if (!service) return (<></>);

  const requestOrigination = async () => {
    const safekeepingAccountId = accounts.find(a => a.provider === service.payload.provider && a.id.label === account)?.id;
    if (!safekeepingAccountId) {
      console.log(`Couldn't find account from provider ${service.payload.provider} with label ${account}`);
      return;
    }
    await ledger.exercise(Service.RequestOrigination, service.contractId, { assetLabel: label, description, claims, safekeepingAccountId, observers: [ service.payload.provider, party ] });
    history.push("/apps/structuring/requests");
  };

  const menuProps : Partial<MenuProps> = { anchorOrigin: { vertical: "bottom", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" }, getContentAnchorEl: null };
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.heading}>New Instrument</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  {/* <Typography variant="h5" className={classes.heading}>Details</Typography>
                    <ToggleButtonGroup className={classes.fullWidth} value={isCall} exclusive onChange={(_, v) => { if (v !== null) setIsCall(v); }}>
                    <ToggleButton className={classes.fullWidth} value={true}>Call</ToggleButton>
                    <ToggleButton className={classes.fullWidth} value={false}>Put</ToggleButton>
                  </ToggleButtonGroup>
                  <FormControl className={classes.inputField} fullWidth>
                    <InputLabel>Underlying</InputLabel>
                    <Select value={underlying} onChange={e => setUnderlying(e.target.value as string)} MenuProps={menuProps}>
                      {assets.map((c, i) => (<MenuItem key={i} value={c.payload.assetId.label}>{c.payload.assetId.label}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <TextField className={classes.inputField} fullWidth label="Strike" type="number" value={strike} onChange={e => setStrike(e.target.value as string)} />
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      className={classes.inputField}
                      fullWidth
                      disableToolbar
                      variant="inline"
                      format="yyyy-MM-dd"
                      margin="normal"
                      label="Expiry Date"
                      defaultValue=""
                      value={expiry}
                      onChange={e => setExpiry(e)} />
                  </MuiPickersUtilsProvider>
                  <FormControl className={classes.inputField} fullWidth>
                    <InputLabel>Payout Currency</InputLabel>
                    <Select value={currency} onChange={e => setCurrency(e.target.value as string)} MenuProps={menuProps}>
                      {assets.map((c, i) => (<MenuItem key={i} value={c.payload.assetId.label}>{c.payload.assetId.label}</MenuItem>))}
                    </Select>
                  </FormControl> */}
                  <TextField className={classes.inputField} fullWidth label="Instrument ID" type="text" value={label} onChange={e => setLabel(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Description" type="text" value={description} onChange={e => setDescription(e.target.value as string)} />
                  <FormControl className={classes.inputField} fullWidth>
                    <InputLabel>Safekeeping Account</InputLabel>
                    <Select value={account} onChange={e => setAccount(e.target.value as string)} MenuProps={menuProps}>
                      {accounts.filter(a => a.provider === service.payload.provider).map((c, i) => (<MenuItem key={i} value={c.id.label}>{c.id.label}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <Button className={classnames(classes.fullWidth, classes.buttonMargin)} size="large" variant="contained" color="primary" disabled={!canRequest} onClick={requestOrigination}>Request Origination</Button>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Payoff</Typography>
                  <div ref={el} style={{ height: "100%" }}/>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const NewInstrument = withRouter(NewInstrumentComponent);