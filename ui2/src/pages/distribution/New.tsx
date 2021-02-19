import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableRow, TextField } from "@material-ui/core";
import MobileStepper from "@material-ui/core/MobileStepper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { getName } from "../../config";
import useStyles from "../styles";
import { AssetCategorization } from "@daml.js/finlib/lib/DA/Finance/Asset/module";
import { RequestCreateListing, Service } from "@daml.js/da-marketplace/lib/Marketplace/Listing";

const NewComponent : React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();
  const party = useParty();
  const ledger = useLedger();
  const [activeStep, setActiveStep] = React.useState(0);
  const [canRequest, setCanRequest] = React.useState(true);
  const [state, setState] = React.useState<any>({ listingId: "", calendarId: "1261007448", description: "" });
  const maxSteps = 3;

  const services = useStreamQueries(Service).contracts
  const clientServices = services.filter(s => s.payload.client === party);
  const assetCategorizations = useStreamQueries(AssetCategorization).contracts;
  const assets = assetCategorizations.map(a => a.payload.id);

  if (clientServices.length === 0) return (<></>);
  const service = clientServices[0]; // TODO: Randomly selects first client, need to handle multiple services

  const requestListing = async () => {
    setCanRequest(false);
    const tradedAssetId = assets.find(a => a.label === state.tradedAsset);
    const quotedAssetId = assets.find(a => a.label === state.quotedAsset);
    if (!tradedAssetId || !quotedAssetId) return;
    const request : RequestCreateListing = {
      listingId: state.listingId,
      calendarId: state.calendarId,
      description: state.description,
      tradedAssetId,
      quotedAssetId,
      tradedAssetPrecision: state.tradedAssetPrecision,
      quotedAssetPrecision: state.quotedAssetPrecision,
      minimumTradableQuantity: state.minimumTradableQuantity,
      maximumTradableQuantity: state.maximumTradableQuantity,
      observers : [ "Public" ] // TODO: Use real public party
    };
    console.log(request);
    await ledger.exercise(Service.RequestCreateListing, service.contractId, request);
    history.push("/apps/listing/requests");
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step : number) => {
    setActiveStep(step);
  };

  const getStepTitle = (i : number) => {
    if (i === 0) return "Listing";
    if (i === 1) return "Assets";
    if (i === 2) return "Confirmation";
    return "Invalid Step";
  }

  return (
    <Box display="flex" flexDirection="column" className={classes.mobileScreen}>
      <Typography variant="h3" className={classes.heading}>{getStepTitle(activeStep)}</Typography>
      <Box flexGrow={1}>
        <SwipeableViews index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
          {activeStep === 0 && (
            <div>
              <TextField key={0} className={classes.inputField} fullWidth label="Operator" type="text" value={getName(service.payload.operator)} disabled={true} />
              <TextField key={1} className={classes.inputField} fullWidth label="Provider" type="text" value={getName(service.payload.provider)} disabled={true} />
              <TextField key={2} className={classes.inputField} fullWidth label="Client" type="text" value={getName(service.payload.client)} disabled={true} />
              <TextField key={3} className={classes.inputField} autoFocus fullWidth label="Listing ID" type="text" value={state.listingId} onChange={e => setState({ ...state, listingId: e.target.value as string})} />
              <TextField key={4} className={classes.inputField} autoFocus fullWidth label="Calendar ID" type="text" value={state.calendarId} disabled={true} />
            </div>
          )}
          {activeStep === 1 && (
            <div>
              <FormControl key={5} className={classes.inputField} fullWidth>
                <InputLabel>Traded Asset</InputLabel>
                <Select
                    autoFocus
                    value={state.tradedAsset}
                    onChange={e => setState({ ...state, tradedAsset: e.target.value as string })}
                    MenuProps={{ anchorOrigin: { vertical: "bottom", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" }, getContentAnchorEl: null }}>
                  {assets.map((a, i) => <MenuItem key={i} value={a.label}>{a.label}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField key={6} className={classes.inputField}  fullWidth label="Traded Asset Precision" type="number" value={state.tradedAssetPrecision} onChange={e => setState({ ...state, tradedAssetPrecision: e.target.value as string})} />
              <TextField key={7} className={classes.inputField}  fullWidth label="Minimum Tradable Quantity" type="number" value={state.minimumTradableQuantity} onChange={e => setState({ ...state, minimumTradableQuantity: e.target.value as string})} />
              <TextField key={8} className={classes.inputField}  fullWidth label="Maximum Tradable Quantity" type="number" value={state.maximumTradableQuantity} onChange={e => setState({ ...state, maximumTradableQuantity: e.target.value as string})} />
              <FormControl key={9} className={classes.inputField} fullWidth>
                <InputLabel>Quoted Asset</InputLabel>
                <Select
                    autoFocus
                    value={state.quotedAsset}
                    onChange={e => setState({ ...state, quotedAsset: e.target.value as string })}
                    MenuProps={{ anchorOrigin: { vertical: "bottom", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" }, getContentAnchorEl: null }}>
                  {assets.map((a, i) => <MenuItem key={i} value={a.label}>{a.label}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField key={10} className={classes.inputField}  fullWidth label="Quoted Asset Precision" type="number" value={state.quotedAssetPrecision} onChange={e => setState({ ...state, quotedAssetPrecision: e.target.value as string})} />
            </div>
          )}
          {activeStep === 2 && (
            <div>
              <Table>
                <TableBody>
                  <TableRow key={0} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Operator</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{getName(service.payload.operator)}</TableCell>
                  </TableRow>
                  <TableRow key={1} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Provider</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{getName(service.payload.provider)}</TableCell>
                  </TableRow>
                  <TableRow key={2} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Client</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{getName(service.payload.client)}</TableCell>
                  </TableRow>
                  <TableRow key={3} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Listing ID</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.listingId}</TableCell>
                  </TableRow>
                  <TableRow key={4} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Calendar ID</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.calendarId}</TableCell>
                  </TableRow>
                  <TableRow key={5} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Traded Asset</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.tradedAsset}</TableCell>
                  </TableRow>
                  <TableRow key={5} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Precision</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.tradedAssetPrecision}</TableCell>
                  </TableRow>
                  <TableRow key={6} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Min Qty</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.minimumTradableQuantity}</TableCell>
                  </TableRow>
                  <TableRow key={7} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Max Qty</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.maximumTradableQuantity}</TableCell>
                  </TableRow>
                  <TableRow key={8} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Quoted Asset</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.quotedAsset}</TableCell>
                  </TableRow>
                  <TableRow key={8} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Precision</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.quotedAssetPrecision}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </SwipeableViews>
      </Box>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="dots"
        activeStep={activeStep}
        nextButton={
          activeStep === maxSteps - 1
            ? (<Button size="small" variant="contained" color="primary" disabled={!canRequest} onClick={requestListing}>Request</Button>)
            : (<Button size="small" onClick={handleNext}>Next<KeyboardArrowRight /></Button>)
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Box>
  );
};

export const New = withRouter(NewComponent);