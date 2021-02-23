import React, { useCallback, useEffect, useRef } from "react";
import classnames from "classnames";
import { useStreamQueries } from "@daml/react";
import { Typography, Grid, Table, TableBody, TableCell, TableRow, Paper } from "@material-ui/core";
import { useParams, RouteComponentProps } from "react-router-dom";
import useStyles from "../styles";
import { AssetDescription } from "@daml.js/da-marketplace/lib/Marketplace/AssetDescription/module";
import { getName } from "../../config";
import { render } from "./render";
import { Claim } from "@daml.js/da-marketplace/lib/ContingentClaims/Claim/Serializable/module";
import { Date } from "@daml/types";
import { Id } from "@daml.js/da-marketplace/lib/DA/Finance/Types/module";
import { Observation } from "@daml.js/da-marketplace/lib/ContingentClaims/Observation/module";

export const Instrument : React.FC<RouteComponentProps> = () => {
  const classes = useStyles();

  const el = useRef<HTMLDivElement>(null);

  const { contractId } = useParams<any>();
  const cid = contractId.replace("_", "#");

  const instruments = useStreamQueries(AssetDescription).contracts;
  const instrument = instruments.find(c => c.contractId === cid);

  const transformObservation = useCallback((obs : Observation<Date, boolean>, linkText : string) : any => {
    switch (obs.tag) {
      case "DateEqu":
        const left1 = transformObservation(obs.value._1, "left");
        const right1 = transformObservation(obs.value._2, "right");
        return { ...obs, linkText, type: "Observation", text: "==", collapsedText: `${left1.text} == ${right1.text}`, children: [ left1, right1 ] };
      case "DateIdentity":
        return { ...obs, linkText, type: "Observation", text: "Today", children: null };
      case "DateConst":
        return { ...obs, linkText, type: "Observation", text: obs.value, children: null };
      case "DecimalLte":
        const left2 = transformObservation(obs.value._1, "left");
        const right2 = transformObservation(obs.value._2, "right");
        return { ...obs, linkText, type: "Observation", text: "<=", collapsedText: `${left2.text} == ${right2.text}`, children: [ left2, right2 ] };
      case "DecimalConst":
        return { ...obs, linkText, type: "Observation", text: obs.value, children: null };
      case "DecimalSpot":
        return { ...obs, linkText, type: "Observation", text: `Price(${obs.value})`, children: null };
      default:
        throw new Error("Unknown observation tag: " + obs.tag);
    }
  }, []);

  const transformClaim = useCallback((claim : Claim<Date, Id>, linkText : string) : any => {
    switch (claim.tag) {
      case "When":
        return { ...claim, linkText, type: "Claim", children: [ transformObservation(claim.value.predicate, "condition"), transformClaim(claim.value.obligation, "then") ] };
      case "Or":
        return { ...claim, linkText, type: "Claim", children: [ transformClaim(claim.value.lhs, "left"), transformClaim(claim.value.rhs, "right") ] };
      case "Cond":
        return { ...claim, linkText, type: "Claim", children: [ transformObservation(claim.value.predicate, "if"), transformClaim(claim.value.success, "then"), transformClaim(claim.value.failure, "else") ] };
      case "Zero":
        return { ...claim, linkText, type: "Claim", children: null };
      case "One":
        return { ...claim, linkText, type: "Claim", text: "1 " + claim.value.label, children: null };
      default:
        throw new Error("Unknown claim tag: " + claim.tag);
    }
  }, [transformObservation]);

  useEffect(() => {
    if (!el.current || !instrument) return;
    const data = transformClaim(instrument.payload.claims, "root");
    render(el.current, data);
  }, [el, instrument, transformClaim]);

  if (!instrument) return (<Typography variant="h5">Instrument not found</Typography>);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.heading}>{instrument.payload.description}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Claims</Typography>
                  <div ref={el} style={{ height: "100%" }}/>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Paper className={classnames(classes.fullWidth, classes.paper)}>
                  <Typography variant="h5" className={classes.heading}>Details</Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow key={0} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Issuer</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{getName(instrument.payload.issuer)}</TableCell>
                      </TableRow>
                      <TableRow key={1} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Signatories</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{Object.keys(instrument.payload.assetId.signatories.textMap).join(", ")}</TableCell>
                      </TableRow>
                      <TableRow key={2} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Label</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{instrument.payload.assetId.label}</TableCell>
                      </TableRow>
                      <TableRow key={3} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Version</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{instrument.payload.assetId.version}</TableCell>
                      </TableRow>
                      <TableRow key={4} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Description</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{instrument.payload.description}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
