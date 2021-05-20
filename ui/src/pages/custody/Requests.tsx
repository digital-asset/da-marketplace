import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { Header } from 'semantic-ui-react';

import { useStreamQueries } from '../../Main';
import {
  CloseAccountRequest,
  DebitAccountRequest,
  OpenAccountRequest,
  TransferDepositRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import useStyles from '../styles';
import { usePartyName } from '../../config';
import { CreditAccountRequest } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model/module';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { damlSetValues } from '../common';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import StripedTable from '../../components/Table/StripedTable';
import BackButton from '../../components/Common/BackButton';
type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

const RequestsComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  services,
}: RouteComponentProps & Props) => {
  const classes = useStyles();
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();

  const providerServices = services.filter(s => s.payload.provider === party);
  const openRequests = useStreamQueries(OpenAccountRequest).contracts;
  const closeRequests = useStreamQueries(CloseAccountRequest).contracts;
  const creditRequests = useStreamQueries(CreditAccountRequest).contracts;
  const debitRequests = useStreamQueries(DebitAccountRequest).contracts;
  const transferRequests = useStreamQueries(TransferDepositRequest).contracts;
  const assetDeposits = useStreamQueries(AssetDeposit).contracts;

  const openAccount = async (c: CreateEvent<OpenAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return;
    await ledger.exercise(Service.OpenAccount, service.contractId, {
      openAccountRequestCid: c.contractId,
    });
    history.push('/app/custody/accounts');
  };

  const closeAccount = async (c: CreateEvent<CloseAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to close account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.CloseAccount, service.contractId, {
      closeAccountRequestCid: c.contractId,
    });
    history.push('/app/custody/accounts');
  };

  const creditAccount = async (c: CreateEvent<CreditAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Credit Account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.CreditAccount, service.contractId, {
      creditAccountRequestCid: c.contractId,
    });
    history.push('/app/custody/accounts');
  };

  const debitAccount = async (c: CreateEvent<DebitAccountRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Debit Account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.DebitAccount, service.contractId, {
      debitAccountRequestCid: c.contractId,
    });
    history.push('/app/custody/accounts');
  };

  const transferDeposit = async (c: CreateEvent<TransferDepositRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Transfer Deposit',
        message: 'Could not find Custody service contract',
      });
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
      <BackButton />
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
                          {damlSetValues(c.payload.ctrls).join(', ')}
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
            <>
              <Header as="h2">Close Account Requests</Header>
              <StripedTable
                headings={['Account', 'Provider', 'Client', 'Role', 'Action', 'Details']}
                rows={closeRequests.map((c, i) => {
                  return {
                    elements: [
                      c.payload.accountId.label,
                      getName(c.payload.provider),
                      getName(c.payload.customer),
                      party === c.payload.provider ? 'Provider' : 'Client',
                      party === c.payload.provider && (
                        <Button
                          color="primary"
                          size="small"
                          className={classes.choiceButton}
                          variant="contained"
                          onClick={() => closeAccount(c)}
                        >
                          Process
                        </Button>
                      ),
                      <IconButton
                        color="primary"
                        size="small"
                        component="span"
                        onClick={() =>
                          history.push('/app/custody/account/' + c.contractId.replace('#', '_'))
                        }
                      >
                        <KeyboardArrowRight fontSize="small" />
                      </IconButton>,
                    ],
                  };
                })}
              />
            </>
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
