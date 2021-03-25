import React, {useMemo, useState} from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow, TableHead, Grid, Paper, Typography, Button, IconButton } from "@material-ui/core";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import useStyles from "../styles";
import { AssetDeposit } from "@daml.js/da-marketplace/lib/DA/Finance/Asset";
import { AssetSettlementRule } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement";
import { AllocationAccountRule } from "@daml.js/da-marketplace/lib/Marketplace/Rule/AllocationAccount";
import {getName} from "../../config";
import { KeyboardArrowRight } from "@material-ui/icons";
import {CreateEvent} from "@daml/ledger";
import { Service} from "@daml.js/da-marketplace/lib/Marketplace/Custody/Service";
import {InputDialog, InputDialogProps} from "../../components/InputDialog/InputDialog";
import {Id} from "@daml.js/da-marketplace/lib/DA/Finance/Types";
import {AssetDescription} from "@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription";
import {ServicePageProps} from "../common";
import {Header} from "semantic-ui-react";

const AssetsComponent : React.FC<RouteComponentProps & ServicePageProps<Service>> = ({ history, services } : RouteComponentProps & ServicePageProps<Service>) => {
  const party = useParty();
  const classes = useStyles();
  const ledger = useLedger();

  const accounts = useStreamQueries(AssetSettlementRule).contracts;
  const allocationRules = useStreamQueries(AllocationAccountRule).contracts;
  const deposits = useStreamQueries(AssetDeposit).contracts;
  const assets = useStreamQueries(AssetDescription).contracts;

  const allocatedDeposits = useMemo(() =>
    deposits.filter(d => allocationRules.findIndex(a => a.payload.account.id.label === d.payload.account.id.label) !== -1 && d.payload.account.owner === party)
  , [deposits, allocationRules, party]);

  const tradeableDeposits = useMemo(() =>
    deposits.filter(d => accounts.findIndex(s => s.payload.account.id.label === d.payload.account.id.label) !== -1 && d.payload.account.owner === party)
  , [deposits, accounts, party]);

  const clientServices = services.filter(s => s.payload.customer === party);
  const assetNames = assets.map(a => a.payload.description);

  const requestCloseAccount = async (c : CreateEvent<AssetSettlementRule>) => {
    const service = clientServices.find(s => s.payload.provider === c.payload.account.provider);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.RequestCloseAccount, service.contractId, { accountId: c.payload.account.id });
    history.push("/app/custody/requests")
  }

  const defaultCreditRequestDialogProps : InputDialogProps<any> = {
    open: false,
    title: "Credit Account Request",
    defaultValue: { account: "", asset: "", quantity: 0 },
    fields: {
      account : {label: "Account", type: "selection", items: [] },
      asset: { label: "Asset", type: "selection", items: assetNames },
      quantity : { label: "Quantity", type: "number" }
    },
    onClose: async function(state : any | null) {}
  };
  const [creditDialogProps, setCreditDialogProps] = useState<InputDialogProps<any>>(defaultCreditRequestDialogProps);

  const requestCredit = (accountId : Id) => {
    const onClose = async (state : any | null) => {
      setCreditDialogProps({ ...defaultCreditRequestDialogProps, open: false });
      if (!state) return;
      const asset = assets.find(i => i.payload.description === state.asset);
      const account = accounts.find(a => a.payload.account.id.label === state.account);
      if (!asset || !account) return;
      const service = clientServices.find(s => s.payload.provider === account.payload.account.provider);
      if (!service) return;

      await ledger.exercise(Service.RequestCreditAccount, service.contractId , { accountId: account.payload.account.id, asset: {id: asset.payload.assetId, quantity: state.quantity} });
    };
    setCreditDialogProps({
      ...defaultCreditRequestDialogProps,
      defaultValue: {...defaultCreditRequestDialogProps.fields, account: accountId.label},
      fields: { ...defaultCreditRequestDialogProps.fields, account : {label: "Account", type: "selection", items: [accountId.label] } },
      open: true,
      onClose
    });
  };

  return (
    <>
      <InputDialog { ...creditDialogProps } />
      <div className='assets'>
        <Header as='h2'>Accounts</Header>
        <div className='asset-sections'>
          <div className='deposit-row'>
            <div className='deposit-info'>
        <Table size="small">
          <TableHead>
            <TableRow className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}><b>Account</b></TableCell>
              <TableCell key={1} className={classes.tableCell}><b>Provider</b></TableCell>
              <TableCell key={2} className={classes.tableCell}><b>Owner</b></TableCell>
              <TableCell key={3} className={classes.tableCell}><b>Role</b></TableCell>
              <TableCell key={4} className={classes.tableCell}><b>Controllers</b></TableCell>
              <TableCell key={5} className={classes.tableCell}><b>Requests</b></TableCell>
              <TableCell key={6} className={classes.tableCell}><b>Details</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((c, i) => (
              <TableRow key={i} className={classes.tableRow}>
                <TableCell key={0} className={classes.tableCell}>{c.payload.account.id.label}</TableCell>
                <TableCell key={1} className={classes.tableCell}>{getName(c.payload.account.provider)}</TableCell>
                <TableCell key={2} className={classes.tableCell}>{getName(c.payload.account.owner)}</TableCell>
                <TableCell key={3} className={classes.tableCell}>{party === c.payload.account.provider ? "Provider" : "Client"}</TableCell>
                <TableCell key={4} className={classes.tableCell}>{Object.keys(c.payload.ctrls.textMap).join(", ")}</TableCell>
                <TableCell key={5} className={classes.tableCell}>
                  {party === c.payload.account.owner &&
                  <>
                      <Button color="primary" size="medium" className={classes.choiceButton} variant="outlined" onClick={() => requestCredit(c.payload.account.id)}>Deposit</Button>
                      <Button color="primary" size="medium" className={classes.choiceButton} variant="outlined" onClick={() => requestCloseAccount(c)}>Close</Button>
                  </>
                  }
                </TableCell>
                <TableCell key={6} className={classes.tableCell}>
                  <IconButton color="primary" size="small" component="span" onClick={() => history.push("/app/custody/account/" + c.contractId.replace("#", "_"))}>
                    <KeyboardArrowRight fontSize="small"/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
            </div>
            </div>
        </div>
        <Header as='h2'>Holdings</Header>
      </div>

      <Grid container direction="column">
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}>
                <Typography variant="h2">Accounts</Typography>
              </Grid>
              <Button color="primary" size="medium" className={classes.choiceButton} variant="outlined" onClick={() => history.push("/app/custody/accounts/new")}>New Account</Button>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Account</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Provider</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}><b>Owner</b></TableCell>
                    <TableCell key={3} className={classes.tableCell}><b>Role</b></TableCell>
                    <TableCell key={4} className={classes.tableCell}><b>Controllers</b></TableCell>
                    <TableCell key={5} className={classes.tableCell}><b>Requests</b></TableCell>
                    <TableCell key={6} className={classes.tableCell}><b>Details</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{c.payload.account.id.label}</TableCell>
                      <TableCell key={1} className={classes.tableCell}>{getName(c.payload.account.provider)}</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{getName(c.payload.account.owner)}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{party === c.payload.account.provider ? "Provider" : "Client"}</TableCell>
                      <TableCell key={4} className={classes.tableCell}>{Object.keys(c.payload.ctrls.textMap).join(", ")}</TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        {party === c.payload.account.owner &&
                        <>
                            <Button color="primary" size="medium" className={classes.choiceButton} variant="outlined" onClick={() => requestCredit(c.payload.account.id)}>Deposit</Button>
                            <Button color="primary" size="medium" className={classes.choiceButton} variant="outlined" onClick={() => requestCloseAccount(c)}>Close</Button>
                        </>
                        }
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
                        <IconButton color="primary" size="small" component="span" onClick={() => history.push("/app/custody/account/" + c.contractId.replace("#", "_"))}>
                          <KeyboardArrowRight fontSize="small"/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}><Typography variant="h2">Holdings</Typography></Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Account</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}><b>Type</b></TableCell>
                    <TableCell key={2} className={classes.tableCell}><b>Provider</b></TableCell>
                    <TableCell key={3} className={classes.tableCell}><b>Owner</b></TableCell>
                    <TableCell key={4} className={classes.tableCell}><b>Asset</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tradeableDeposits.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{c.payload.account.id.label}</TableCell>
                      <TableCell key={1} className={classes.tableCell}>Standard Account</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{c.payload.account.provider}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{c.payload.account.owner}</TableCell>
                      <TableCell key={4} className={classes.tableCell}>{c.payload.asset.quantity} {c.payload.asset.id.label}</TableCell>
                    </TableRow>
                  ))}
                  {allocatedDeposits.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>{c.payload.account.id.label}</TableCell>
                      <TableCell key={0} className={classes.tableCell}>Allocated Deposit</TableCell>
                      <TableCell key={1} className={classes.tableCell}>{c.payload.account.provider}</TableCell>
                      <TableCell key={2} className={classes.tableCell}>{c.payload.account.owner}</TableCell>
                      <TableCell key={3} className={classes.tableCell}>{c.payload.asset.quantity} {c.payload.asset.id.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export const Assets = withRouter(AssetsComponent);