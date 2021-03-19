import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { Box, Table, TableBody, TableCell, TableRow, TextField } from "@material-ui/core";
import MobileStepper from "@material-ui/core/MobileStepper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { useLedger, useParty, useStreamQueries} from "@daml/react";
import { getName } from "../../config";
import useStyles from "../styles";
import { RequestOpenAccount, Service } from "@daml.js/da-marketplace/lib/Marketplace/Custody/Service";
import { CreateEvent } from "@daml/ledger";

type Props = {
  services : Readonly<CreateEvent<Service, any, any>[]>
}

const NewComponent : React.FC<RouteComponentProps & Props> = ({ history, services }) => {
  const classes = useStyles();
  const party = useParty();
  const ledger = useLedger();
  const [activeStep, setActiveStep] = React.useState(0);
  const [canRequest, setCanRequest] = React.useState(true);
  const [state, setState] = React.useState<any>({ label: "" });
  const maxSteps = 2;

  const clientServices = services.filter(s => s.payload.customer === party);

  if (clientServices.length === 0) return (<></>);
  const service = services[0]; // TODO: Handle multiple services

  const requestAccount = async () => {
    setCanRequest(false);
    const request : RequestOpenAccount = {
      accountId: { signatories: { textMap: { [service.payload.provider]: {}, [service.payload.customer]: {} } }, label: state.label, version: "0" },
      observers: [ "Public" ], // TODO: Use real public party
      ctrls: [ service.payload.provider, service.payload.customer ]
    };
    await ledger.exercise(Service.RequestOpenAccount, service.contractId, request);
    history.push("/app/custody/requests");
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
    if (i === 0) return "Account Details";
    if (i === 1) return "Assets";
    if (i === 2) return "Confirmation";
    return "Invalid Step";
  }

  return (
    <div>
      <h1>{getStepTitle(activeStep)}</h1>
    </div>
  )

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
              <TextField key={3} className={classes.inputField} autoFocus fullWidth label="Account Label" type="text" value={state.label} onChange={e => setState({ ...state, label: e.target.value as string})} />
            </div>
          )}
          {activeStep === 1 && (
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
                    <TableCell key={0} className={classes.tableCell}><b>Account Label</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{state.label}</TableCell>
                  </TableRow>
                  <TableRow key={4} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Account Version</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}></TableCell>
                    <TableCell key={2} className={classes.tableCell}>{0}</TableCell>
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
            ? (<Button size="small" variant="contained" color="primary" disabled={!canRequest} onClick={requestAccount}>Request</Button>)
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
