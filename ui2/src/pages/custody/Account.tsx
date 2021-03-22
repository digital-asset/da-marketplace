import React, { useState } from "react";
import useStyles from "../styles";
import { useLedger, useParty, useStreamQueries } from "@daml/react";
import { AssetSettlementRule } from "@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement";
import { AssetDeposit } from "@daml.js/da-marketplace/lib/DA/Finance/Asset";
import { RouteComponentProps, useParams, withRouter } from "react-router-dom";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import classnames from "classnames";
import { CreateEvent } from "@daml/ledger";
import { Service } from "@daml.js/da-marketplace/lib/Marketplace/Custody/Service";
import { InputDialog, InputDialogProps } from "../../components/InputDialog/InputDialog";

type Props = {
  services : Readonly<CreateEvent<Service, any, any>[]>
}

const AccountComponent: React.FC<RouteComponentProps & Props> = ({ history, services }: RouteComponentProps & Props) => {
  const classes = useStyles();
  const party = useParty();
  const ledger = useLedger();
  const { contractId } = useParams<any>();

  const cid = contractId.replace("_", "#");

  const accounts = useStreamQueries(AssetSettlementRule);
  const deposits = useStreamQueries(AssetDeposit);

  const defaultTransferRequestDialogProps: InputDialogProps<any> = {
    open: false,
    title: "Transfer Account Request",
    defaultValue: { account: "" },
    fields: {
      account: { label: "Account", type: "selection", items: [] },
    },
    onClose: async function (state: any | null) { }
  };
  const [transferDialogProps, setTransferDialogProps] = useState<InputDialogProps<any>>(defaultTransferRequestDialogProps);

  const clientServices = services.filter(s => s.payload.customer === party);

  const account = accounts.contracts.find(a => a.contractId === cid);
  if (!account) return <></>;

  const accountDeposits = deposits
    .contracts
    .filter(d => d.payload.account.id.label === account.payload.account.id.label
      && d.payload.account.provider === account.payload.account.provider
      && d.payload.account.owner === account.payload.account.owner);

  const requestWithdrawDeposit = async (c: CreateEvent<AssetDeposit>) => {
    const service = clientServices.find(s => s.payload.provider === c.payload.account.provider);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.RequestDebitAccount, service.contractId, { accountId: c.payload.account.id, debit: { depositCid: c.contractId } });
    history.push("/app/custody/requests")
  }

  const relatedAccounts = accounts
    .contracts
    .filter(a => a.contractId !== cid)
    .filter(a => a.payload.account.owner === account.payload.account.owner)
    .map(r => r.payload.account.id.label);

  const requestTransfer = (deposit: CreateEvent<AssetDeposit>) => {
    const onClose = async (state: any | null) => {
      setTransferDialogProps({ ...defaultTransferRequestDialogProps, open: false });
      if (!state) return;
      const transferToAccount = accounts.contracts.find(a => a.payload.account.id.label === state.account);
      const service = clientServices.find(s => s.payload.provider === account.payload.account.provider);
      if (!service || !transferToAccount) return;

      await ledger.exercise(Service.RequestTransferDeposit,
        service.contractId,
        { accountId: account.payload.account.id, transfer: { receiverAccountId: transferToAccount.payload.account.id, depositCid: state.deposit } });
    };
    setTransferDialogProps({
      ...defaultTransferRequestDialogProps,
      defaultValue: { ...defaultTransferRequestDialogProps.defaultValue, deposit: deposit.contractId },
      fields: { ...defaultTransferRequestDialogProps.fields, account: { label: "Account", type: "selection", items: relatedAccounts } },
      open: true,
      onClose
    });
  };

  return (
    <>
      <InputDialog {...transferDialogProps} />
      <Grid container direction="column">
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.heading}>Account - {account.payload.account.id.label}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <Grid container direction="column">
                <Grid item xs={12}>
                  <Paper className={classnames(classes.fullWidth, classes.paper)}>
                    <Typography variant="h5" className={classes.heading}>Account Details</Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow key={0} className={classes.tableRow}>
                          <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Account</b></TableCell>
                          <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{account.payload.account.id.label}</TableCell>
                        </TableRow>
                        <TableRow key={1} className={classes.tableRow}>
                          <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Provider</b></TableCell>
                          <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{account.payload.account.provider}</TableCell>
                        </TableRow>
                        <TableRow key={2} className={classes.tableRow}>
                          <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Owner</b></TableCell>
                          <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{account.payload.account.owner}</TableCell>
                        </TableRow>
                        <TableRow key={3} className={classes.tableRow}>
                          <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Role</b></TableCell>
                          <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{party === account.payload.account.provider ? "Provider" : "Client"}</TableCell>
                        </TableRow>
                        <TableRow key={4} className={classes.tableRow}>
                          <TableCell key={0} className={classnames(classes.tableCell, classes.width50)}><b>Controllers</b></TableCell>
                          <TableCell key={1} className={classnames(classes.tableCell, classes.width50)}>{Object.keys(account.payload.ctrls.textMap).join(", ")}</TableCell>
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
                    <Typography variant="h5" className={classes.heading}>Deposits</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow key={0} className={classes.tableRow}>
                          <TableCell key={0} className={classes.tableCell}><b>Quantity</b></TableCell>
                          <TableCell key={1} className={classes.tableCell}><b>Asset</b></TableCell>
                          <TableCell key={2} className={classes.tableCell}><b>Requests</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {accountDeposits.map((c, i) => (
                          <TableRow key={i} className={classes.tableRow}>
                            <TableCell key={0} className={classes.tableCell}>{c.payload.asset.quantity}</TableCell>
                            <TableCell key={1} className={classes.tableCell}>{c.payload.asset.id.label}</TableCell>
                            <TableCell key={2} className={classes.tableCell}>
                              {party === account.payload.account.owner &&
                                <>
                                  <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => requestWithdrawDeposit(c)}>Withdraw</Button>
                                  {relatedAccounts.length > 0 &&
                                    <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => requestTransfer(c)}>Transfer</Button>
                                  }
                                </>
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export const Account = withRouter(AccountComponent);