import React, { useEffect, useRef } from "react";
import classnames from "classnames";
import { useStreamQueries } from "@daml/react";
import { Typography, Grid, Table, TableBody, TableCell, TableRow, Paper } from "@material-ui/core";
import { useParams, RouteComponentProps } from "react-router-dom";
import useStyles from "../styles";
import { getName } from "../../config";
import { render } from "../../components/Claims/render";
import { transformClaim } from "../../components/Claims/util";
import { AssetDescription } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription/module";

export const Instrument : React.FC<RouteComponentProps> = () => {
  const classes = useStyles();

  const el = useRef<HTMLDivElement>(null);

  const { contractId } = useParams<any>();
  const cid = contractId.replace("_", "#");

  const instruments = useStreamQueries(AssetDescription).contracts;
  const instrument = instruments.find(c => c.contractId === cid);

  useEffect(() => {
    if (!el.current || !instrument) return;
    const data = transformClaim(instrument.payload.claims, "root");
    render(el.current, data);
  }, [el, instrument]);

  if (!instrument) return (<Typography variant="h5">Instrument not found</Typography>);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.heading}>{instrument.payload.description}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
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
        </Grid>
      </Grid>
    </Grid>
  );
};
