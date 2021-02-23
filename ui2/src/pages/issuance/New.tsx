import React, { useEffect, useRef } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
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
import { RequestCreateIssuance, Service } from "@daml.js/da-marketplace/lib/Marketplace/Issuance";
import { AssetSettlementRule } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement/module";
import { AssetDescription } from "@daml.js/da-marketplace/lib/Marketplace/AssetDescription/module";

const NewComponent : React.FC<RouteComponentProps> = ({ history }) => {
  const classes = useStyles();
  const el = useRef<HTMLDivElement>(null);

  const party = useParty();
  const ledger = useLedger();
  const [activeStep, setActiveStep] = React.useState(0);
  const [canRequest, setCanRequest] = React.useState(true);
  const [state, setState] = React.useState<any>({ issuanceId: "", accountLabel: "", assetLabel: "", quantity: 0 });
  const maxSteps = 3;

  useEffect(() => {
    if (!el.current) return;
    // render(el.current);
  }, [el, activeStep])

  const services = useStreamQueries(Service).contracts
  const clientServices = services.filter(s => s.payload.customer === party);
  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accountLabels = assetSettlementRules.map(c => c.payload.account.id.label);

  const assetDescriptions = useStreamQueries(AssetDescription).contracts;
  console.log(assetDescriptions);

  if (clientServices.length === 0) return (<></>);
  const service = clientServices[0]; // TODO: Randomly selects first client, need to handle multiple services

  const requestIssuance = async () => {
    setCanRequest(false);
    const accountId = assetSettlementRules.find(c => c.payload.account.id.label === state.accountLabel)?.payload.account.id;
    if (!state.issuanceId || !accountId || !state.assetLabel || !state.quantity) return;
    const assetId = { signatories: { textMap: {} }, label: state.assetLabel, version: "0" };
    const request : RequestCreateIssuance = {
      issuanceId: state.issuanceId,
      accountId,
      assetId,
      quantity: state.quantity.toString()
    };
    console.log(request);
    await ledger.exercise(Service.RequestCreateIssuance, service.contractId, request);
    history.push("/apps/issuance/requests");
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
    if (i === 0) return "Issuance";
    if (i === 1) return "Claims";
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
              <TextField key={2} className={classes.inputField} fullWidth label="Client" type="text" value={getName(service.payload.customer)} disabled={true} />
              <TextField key={3} className={classes.inputField} autoFocus fullWidth label="Issuance ID" type="text" value={state.issuanceId} onChange={e => setState({ ...state, issuanceId: e.target.value as string})} />
              <TextField key={4} className={classes.inputField}  fullWidth label="Asset ID" type="text" value={state.assetLabel} onChange={e => setState({ ...state, assetLabel: e.target.value as string})} />
              <TextField key={5} className={classes.inputField}  fullWidth label="Quantity" type="number" value={state.quantity} onChange={e => setState({ ...state, quantity: e.target.value as string})} />
              <FormControl key={6} className={classes.inputField} fullWidth>
                <InputLabel>Issuance Account</InputLabel>
                <Select
                    value={state.accountLabel}
                    onChange={e => setState({ ...state, accountLabel: e.target.value as string })}
                    MenuProps={{ anchorOrigin: { vertical: "bottom", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" }, getContentAnchorEl: null }}>
                  {accountLabels.map((a, i) => <MenuItem key={i} value={a}>{a}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
          )}
          {activeStep === 1 && (
            <div>
              <FormControl key={0} className={classes.inputField} fullWidth>
                <InputLabel>Payoff</InputLabel>
                <Select
                    value={state.payoff}
                    onChange={e => setState({ ...state, payoff: e.target.value as string })}
                    MenuProps={{ anchorOrigin: { vertical: "bottom", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" }, getContentAnchorEl: null }}>
                  <MenuItem key={0} value={"Binary Option"}>Binary Option</MenuItem>
                  <MenuItem key={1} value={"European Option"}>European Option</MenuItem>
                </Select>
              </FormControl>
              {state.payoff === "Binary Option" && (
                <>
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
                      value={state.expiry}
                      onChange={e => setState({ ...state, expiry: e })} />
                  </MuiPickersUtilsProvider>
                  <TextField key={1} className={classes.inputField} fullWidth label="Strike" type="number" value={state.strike} onChange={e => setState({ ...state, strike: e.target.value as string})} />
                </>
              )}
            <div ref={el} />
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
                    <TableCell key={2} className={classes.tableCell}>{getName(service.payload.customer)}</TableCell>
                  </TableRow>
                  <TableRow key={3} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Issuance ID</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.issuanceId}</TableCell>
                  </TableRow>
                  <TableRow key={4} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Account</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.accountLabel}</TableCell>
                  </TableRow>
                  <TableRow key={5} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Asset</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.assetLabel}</TableCell>
                  </TableRow>
                  <TableRow key={5} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Quantity</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.quantity}</TableCell>
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
            ? (<Button size="small" variant="contained" color="primary" disabled={!canRequest} onClick={requestIssuance}>Request</Button>)
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