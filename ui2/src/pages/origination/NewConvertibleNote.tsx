import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { Typography, Grid, Paper, Select, MenuItem, TextField, Button, MenuProps, FormControl, InputLabel } from "@material-ui/core";
import useStyles from "../styles";
import { AssetDescription } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription";
import { render } from "../../components/Claims/render";
import { transformClaim } from "../../components/Claims/util";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Id } from "@daml.js/da-marketplace/lib/DA/Finance/Types";
import { Observation } from "@daml.js/da-marketplace/lib/ContingentClaims/Observation";
import { Claim } from "@daml.js/da-marketplace/lib/ContingentClaims/Claim/Serializable";
import { Date as DamlDate } from "@daml/types";
import DateFnsUtils from "@date-io/date-fns";
import { Service } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/Service";
import { AssetSettlementRule } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement";
import { RouteComponentProps, withRouter } from "react-router-dom";

const NewConvertibleNoteComponent = ({ history } : RouteComponentProps) => {
  const classes = useStyles();

  const el = useRef<HTMLDivElement>(null);

  const [ underlying, setUnderlying ] = useState("");
  const [ principal, setPrincipal ] = useState("");
  const [ currency, setCurrency ] = useState("");
  const [ interest, setInterest ] = useState("");
  const [ discount, setDiscount ] = useState("");
  const [ cap, setCap ] = useState("");
  const [ maturity, setMaturity ] = useState<Date | null>(null);
  const [ label, setLabel ] = useState("");
  const [ description, setDescription ] = useState("");
  const [ account, setAccount ] = useState("");

  const canRequest = !!underlying && !!principal && !!currency && !!discount && !!interest && !!cap && !!maturity && !!label && !!description && !!account;

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
  const asset = assets.find(c => c.payload.assetId.label === underlying);
  const assetId : Id = asset?.payload.assetId || { signatories: { textMap: {} }, label: "", version: "0" };

  const parseDate = (d : Date | null) => (!!d && d.toString() !== "Invalid Date" && new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)) || "";

  const obsToday      : Observation<DamlDate, Id> = { tag: "DateIdentity", value: {} };
  const obsExpiry     : Observation<DamlDate, Id> = { tag: "DateConst", value: parseDate(maturity) };
  const obsEuropean   : Observation<DamlDate, Id> = { tag: "DateEqu", value: { _1: obsToday, _2: obsExpiry } };
  const obsPrincipal  : Observation<DamlDate, Id> = { tag: "DecimalConst", value: (parseFloat(principal || "0") * (1.0 + parseFloat(interest || "0"))).toString() };
  const obsCap        : Observation<DamlDate, Id> = { tag: "DecimalConst", value: cap };
  const obsDiscount   : Observation<DamlDate, Id> = { tag: "DecimalConst", value: (1.0 - parseFloat(discount || "0")).toFixed(2) };
  const obsSpot       : Observation<DamlDate, Id> = { tag: "DecimalObs", value: underlying };
  const obsPayoff     : Observation<DamlDate, Id> = { tag: "DecimalLte", value: { _1: obsSpot, _2: obsCap } };
  const obsDiscounted : Observation<DamlDate, Id> = { tag: "DecimalMul", value: { _1: obsSpot, _2: obsDiscount }}
  const obsConversion : Observation<DamlDate, Id> = { tag: "DecimalDiv", value: { _1: obsPrincipal, _2: obsDiscounted } };

  const oneUsd     : Claim<DamlDate, Id> = { tag: "One", value: ccyId };
  const oneAsset   : Claim<DamlDate, Id> = { tag: "One", value: assetId };
  const notional   : Claim<DamlDate, Id> = { tag: "Scale", value: { k: obsPrincipal, obligation: oneUsd } };
  const conversion : Claim<DamlDate, Id> = { tag: "Scale", value: { k: obsConversion, obligation: oneAsset } };
  const cond       : Claim<DamlDate, Id> = { tag: "Cond", value: { predicate: obsPayoff, success: conversion, failure: notional } };
  const claims     : Claim<DamlDate, Id> = { tag: "When", value: { predicate: obsEuropean, obligation: cond } };

  useEffect(() => {
    if (!el.current) return;
    el.current.innerHTML = "";
    const data = transformClaim(claims, "root");
    render(el.current, data);
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
    history.push("/apps/registry/requests");
  };

  const menuProps : Partial<MenuProps> = { anchorOrigin: { vertical: "bottom", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" }, getContentAnchorEl: null };
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.heading}>New Convertible Note</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Details</Typography>
                  <FormControl className={classes.inputField} fullWidth>
                    <InputLabel>Underlying</InputLabel>
                    <Select value={underlying} onChange={e => setUnderlying(e.target.value as string)} MenuProps={menuProps}>
                      {assets.map((c, i) => (<MenuItem key={i} value={c.payload.assetId.label}>{c.payload.assetId.label}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <TextField className={classes.inputField} fullWidth label="Principal" type="number" value={principal} onChange={e => setPrincipal(e.target.value as string)} />
                  <FormControl className={classes.inputField} fullWidth>
                    <InputLabel>Principal Currency</InputLabel>
                    <Select value={currency} onChange={e => setCurrency(e.target.value as string)} MenuProps={menuProps}>
                      {assets.map((c, i) => (<MenuItem key={i} value={c.payload.assetId.label}>{c.payload.assetId.label}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <TextField className={classes.inputField} fullWidth label="Interest" type="number" value={interest} onChange={e => setInterest(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Cap Price" type="number" value={cap} onChange={e => setCap(e.target.value as string)} />
                  <TextField className={classes.inputField} fullWidth label="Discount" type="number" value={discount} onChange={e => setDiscount(e.target.value as string)} />
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      className={classes.inputField}
                      fullWidth
                      disableToolbar
                      variant="inline"
                      format="yyyy-MM-dd"
                      margin="normal"
                      label="Maturity Date"
                      defaultValue=""
                      value={maturity}
                      onChange={e => setMaturity(e)} />
                  </MuiPickersUtilsProvider>
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

export const NewConvertibleNote = withRouter(NewConvertibleNoteComponent);