import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Button,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import {
  CloseAccountRequest,
  DebitAccountRequest,
  OpenAccountRequest,
  TransferDepositRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import useStyles from '../styles';
import { getName } from '../../config';
import { CreditAccountRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model/module';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

const RequestsComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  services,
}: RouteComponentProps & Props) => {
  const classes = useStyles();
  const party = useParty();
  const ledger = useLedger();

  const providerServices = services.filter(s => s.payload.provider === party);
  const openRequests = useStreamQueries(OpenAccountRequest).contracts;
  const closeRequests = useStreamQueries(CloseAccountRequest).contracts;
  const creditRequests = useStreamQueries(CreditAccountRequest).contracts;
  const debitRequests = useStreamQueries(DebitAccountRequest).contracts;
  const transferRequests = useStreamQueries(TransferDepositRequest).contracts;
  const assetDeposits = useStreamQueries(AssetDeposit).contracts;

  const openAccount = async (c: CreateEvent<OpenAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.OpenAccount, service.contractId, {
      openAccountRequestCid: c.contractId,
    });
    history.push('/app/custody/accounts');
  };

  const closeAccount = async (c: CreateEvent<CloseAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.CloseAccount, service.contractId, {
      closeAccountRequestCid: c.contractId,
    });
    history.push('/app/custody/accounts');
  };

  const creditAccount = async (c: CreateEvent<CreditAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.CreditAccount, service.contractId, {
      creditAccountRequestCid: c.contractId,
    });
    history.push('/app/custody/accounts');
  };

  const debitAccount = async (c: CreateEvent<DebitAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.DebitAccount, service.contractId, {
      debitAccountRequestCid: c.contractId,
    });
    history.push('/app/custody/accounts');
  };

  const transferDeposit = async (c: CreateEvent<TransferDepositRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.TransferDeposit, service.contractId, {
      transferDepositRequestCid: c.contractId,
    });
    history.push('/app/custody/accounts');
  };

  const getDebitDepositDetail = (
    c: CreateEvent<DebitAccountRequest>,
    extract: (deposit: AssetDeposit) => string
  ): string => {
    const deposit = assetDeposits.find(a => a.contractId === c.payload.debit.depositCid);
    if (!deposit) return '';
    return extract(deposit.payload);
  };

  const getTransferDepositDetail = (
    c: CreateEvent<TransferDepositRequest>,
    extract: (deposit: AssetDeposit) => string
  ): string => {
    const deposit = assetDeposits.find(a => a.contractId === c.payload.transfer.depositCid);
    if (!deposit) return '';
    return extract(deposit.payload);
  };

  return (
    <>
      <Grid container direction="column">
        <Grid container direction="row">
          {openRequests.length > 0 && (
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container direction="row" justify="center" className={classes.paperHeading}>
                  <Typography variant="h2">Open Account Requests</Typography>
                </Grid>
                <Table size="small">
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        <b>Account</b>
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        <b>Provider</b>
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        <b>Client</b>
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        <b>Role</b>
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        <b>Controllers</b>
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        <b>Action</b>
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
                        <b>Details</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {openRequests.map((c, i) => (
                      <TableRow key={i} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}>
                          {c.payload.accountId.label}
                        </TableCell>
                        <TableCell key={1} className={classes.tableCell}>
                          {getName(c.payload.provider)}
                        </TableCell>
                        <TableCell key={2} className={classes.tableCell}>
                          {getName(c.payload.customer)}
                        </TableCell>
                        <TableCell key={3} className={classes.tableCell}>
                          {party === c.payload.provider ? 'Provider' : 'Client'}
                        </TableCell>
                        <TableCell key={4} className={classes.tableCell}>
                          {Object.keys(c.payload.ctrls.textMap).join(', ')}
                        </TableCell>
                        <TableCell key={5} className={classes.tableCell}>
                          {party === c.payload.provider && (
                            <Button
                              color="primary"
                              size="small"
                              className={classes.choiceButton}
                              variant="contained"
                              onClick={() => openAccount(c)}
                            >
                              Process
                            </Button>
                          )}
                          {/* {party === c.payload.client && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => cancelRequest(c)}>Cancel</Button>} */}
                        </TableCell>
                        <TableCell key={6} className={classes.tableCell}>
                          <IconButton
                            color="primary"
                            size="small"
                            component="span"
                            onClick={() =>
                              history.push(
                                '/app/custody/openrequest/' + c.contractId.replace('#', '_')
                              )
                            }
                          >
                            <KeyboardArrowRight fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          )}
          {closeRequests.length > 0 && (
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container direction="row" justify="center" className={classes.paperHeading}>
                  <Typography variant="h2">Close Account Requests</Typography>
                </Grid>
                <Table size="small">
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        <b>Account</b>
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        <b>Provider</b>
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        <b>Client</b>
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        <b>Role</b>
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        <b>Action</b>
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        <b>Details</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {closeRequests.map((c, i) => (
                      <TableRow key={i} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}>
                          {c.payload.accountId.label}
                        </TableCell>
                        <TableCell key={1} className={classes.tableCell}>
                          {getName(c.payload.provider)}
                        </TableCell>
                        <TableCell key={2} className={classes.tableCell}>
                          {getName(c.payload.customer)}
                        </TableCell>
                        <TableCell key={3} className={classes.tableCell}>
                          {party === c.payload.provider ? 'Provider' : 'Client'}
                        </TableCell>
                        <TableCell key={4} className={classes.tableCell}>
                          {party === c.payload.provider && (
                            <Button
                              color="primary"
                              size="small"
                              className={classes.choiceButton}
                              variant="contained"
                              onClick={() => closeAccount(c)}
                            >
                              Process
                            </Button>
                          )}
                          {/* {party === c.payload.client && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => cancelRequest(c)}>Cancel</Button>} */}
                        </TableCell>
                        <TableCell key={5} className={classes.tableCell}>
                          <IconButton
                            color="primary"
                            size="small"
                            component="span"
                            onClick={() =>
                              history.push('/app/custody/account/' + c.contractId.replace('#', '_'))
                            }
                          >
                            <KeyboardArrowRight fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          )}
          {creditRequests.length > 0 && (
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container direction="row" justify="center" className={classes.paperHeading}>
                  <Typography variant="h2">Credit Account Requests</Typography>
                </Grid>
                <Table size="small">
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        <b>Account</b>
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        <b>Provider</b>
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        <b>Client</b>
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        <b>Account</b>
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        <b>Asset</b>
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        <b>Quantity</b>
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
                        <b>Action</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {creditRequests.map((c, i) => (
                      <TableRow key={i} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}>
                          {c.payload.accountId.label}
                        </TableCell>
                        <TableCell key={1} className={classes.tableCell}>
                          {getName(c.payload.provider)}
                        </TableCell>
                        <TableCell key={2} className={classes.tableCell}>
                          {getName(c.payload.customer)}
                        </TableCell>
                        <TableCell key={3} className={classes.tableCell}>
                          {c.payload.accountId.label}
                        </TableCell>
                        <TableCell key={4} className={classes.tableCell}>
                          {c.payload.asset.id.label}
                        </TableCell>
                        <TableCell key={5} className={classes.tableCell}>
                          {c.payload.asset.quantity}
                        </TableCell>
                        <TableCell key={6} className={classes.tableCell}>
                          {party === c.payload.provider && (
                            <Button
                              color="primary"
                              size="small"
                              className={classes.choiceButton}
                              variant="contained"
                              onClick={() => creditAccount(c)}
                            >
                              Process
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          )}
          {debitRequests.length > 0 && (
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container direction="row" justify="center" className={classes.paperHeading}>
                  <Typography variant="h2">Withdraw Deposit Requests</Typography>
                </Grid>
                <Table size="small">
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        <b>Account</b>
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        <b>Provider</b>
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        <b>Client</b>
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        <b>Account</b>
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        <b>Asset</b>
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        <b>Quantity</b>
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
                        <b>Action</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {debitRequests.map((c, i) => (
                      <TableRow key={i} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}>
                          {c.payload.accountId.label}
                        </TableCell>
                        <TableCell key={1} className={classes.tableCell}>
                          {getName(c.payload.provider)}
                        </TableCell>
                        <TableCell key={2} className={classes.tableCell}>
                          {getName(c.payload.customer)}
                        </TableCell>
                        <TableCell key={3} className={classes.tableCell}>
                          {c.payload.accountId.label}
                        </TableCell>
                        <TableCell key={4} className={classes.tableCell}>
                          {getDebitDepositDetail(c, d => d.asset.id.label)}
                        </TableCell>
                        <TableCell key={4} className={classes.tableCell}>
                          {getDebitDepositDetail(c, d => d.asset.quantity)}
                        </TableCell>
                        <TableCell key={6} className={classes.tableCell}>
                          {party === c.payload.provider && (
                            <Button
                              color="primary"
                              size="small"
                              className={classes.choiceButton}
                              variant="contained"
                              onClick={() => debitAccount(c)}
                            >
                              Process
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          )}
          {transferRequests.length > 0 && (
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container direction="row" justify="center" className={classes.paperHeading}>
                  <Typography variant="h2">Transfer Requests</Typography>
                </Grid>
                <Table size="small">
                  <TableHead>
                    <TableRow className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        <b>Account</b>
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        <b>Provider</b>
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        <b>Client</b>
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        <b>Asset</b>
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        <b>Quantity</b>
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        <b>Transfer to</b>
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
                        <b>Action</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transferRequests.map((c, i) => (
                      <TableRow key={i} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}>
                          {c.payload.accountId.label}
                        </TableCell>
                        <TableCell key={1} className={classes.tableCell}>
                          {getName(c.payload.provider)}
                        </TableCell>
                        <TableCell key={2} className={classes.tableCell}>
                          {getName(c.payload.customer)}
                        </TableCell>
                        <TableCell key={3} className={classes.tableCell}>
                          {getTransferDepositDetail(c, d => d.asset.id.label)}
                        </TableCell>
                        <TableCell key={4} className={classes.tableCell}>
                          {getTransferDepositDetail(c, d => d.asset.quantity)}
                        </TableCell>
                        <TableCell key={5} className={classes.tableCell}>
                          {c.payload.transfer.receiverAccountId.label}
                        </TableCell>
                        <TableCell key={6} className={classes.tableCell}>
                          {party === c.payload.provider && (
                            <Button
                              color="primary"
                              size="small"
                              className={classes.choiceButton}
                              variant="contained"
                              onClick={() => transferDeposit(c)}
                            >
                              Process
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export const Requests = withRouter(RequestsComponent);
