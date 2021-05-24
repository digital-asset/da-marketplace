import React, { useState, useEffect } from 'react';
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
import { useStreamQueries } from '../../Main';
import useStyles from '../styles';
import { usePartyName } from '../../config';
import { Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import { AssetSettlementRule } from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import { AssetDeposit } from '@daml.js/da-marketplace/lib/DA/Finance/Asset';

import { InputDialog, InputDialogProps } from '../../components/InputDialog/InputDialog';
import { AssetDescription } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/AssetDescription';
import { Id } from '@daml.js/da-marketplace/lib/DA/Finance/Types';
import { damlSetValues, makeDamlSet } from '../common';
import { useDisplayErrorMessage } from '../../context/MessagesContext';
import { AddPlusIcon } from '../../icons/icons';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

const AccountsComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  services,
}: RouteComponentProps & Props) => {
  const classes = useStyles();
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();

  const accounts = useStreamQueries(AssetSettlementRule).contracts;
  const assets = useStreamQueries(AssetDescription).contracts;
  const deposits = useStreamQueries(AssetDeposit).contracts;

  const clientServices = services.filter(s => s.payload.customer === party);
  const assetNames = assets.map(a => a.payload.description);

  const requestCloseAccount = async (c: CreateEvent<AssetSettlementRule>) => {
    const service = clientServices.find(s => s.payload.provider === c.payload.account.provider);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to close account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.RequestCloseAccount, service.contractId, {
      accountId: c.payload.account.id,
    });
    history.push('/app/custody/requests');
  };

  const defaultCreditRequestDialogProps: InputDialogProps<any> = {
    open: false,
    title: 'Create Deposit',
    defaultValue: { account: '', asset: '', quantity: 0 },
    fields: {
      account: { label: 'Account', type: 'selection', items: [] },
      asset: { label: 'Asset', type: 'selection', items: assetNames },
      quantity: { label: 'Quantity', type: 'number' },
    },
    onClose: async function (state: any | null) {},
  };
  const [creditDialogProps, setCreditDialogProps] = useState<InputDialogProps<any>>(
    defaultCreditRequestDialogProps
  );

  const requestCredit = (accountId: Id) => {
    const onClose = async (state: any | null) => {
      setCreditDialogProps({ ...defaultCreditRequestDialogProps, open: false });
      const asset = assets.find(i => i.payload.description === state.asset);
      const account = accounts.find(a => a.payload.account.id.label === state.account);
      if (!asset || !account) return;
      const service = clientServices.find(
        s => s.payload.provider === account.payload.account.provider
      );
      if (!service) return;

      await ledger.exercise(Service.RequestCreditAccount, service.contractId, {
        accountId: account.payload.account.id,
        asset: { id: asset.payload.assetId, quantity: state.quantity },
      });
    };
    setCreditDialogProps({
      ...defaultCreditRequestDialogProps,
      defaultValue: { ...defaultCreditRequestDialogProps.fields, account: accountId.label },
      fields: {
        ...defaultCreditRequestDialogProps.fields,
        account: { label: 'Account', type: 'selection', items: [accountId.label] },
      },
      open: true,
      onClose,
    });
  };

  return (
    <>
      <InputDialog {...creditDialogProps} isModal />
      <Grid container direction="column">
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}>
                <Typography variant="h2">Actions</Typography>
              </Grid>
              <Grid container direction="row" justify="center">
                <Grid item xs={12}>
                  <Grid container justify="center">
                    <a
                      className="a2 with-icon"
                      onClick={() => history.push('/app/custody/accounts/new')}
                    >
                      <AddPlusIcon /> New Account
                    </a>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}>
                <Typography variant="h2">Accounts</Typography>
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
                      <b>Owner</b>
                    </TableCell>
                    <TableCell key={3} className={classes.tableCell}>
                      <b>Role</b>
                    </TableCell>
                    <TableCell key={4} className={classes.tableCell}>
                      <b>Controllers</b>
                    </TableCell>
                    <TableCell key={5} className={classes.tableCell}>
                      <b>Requests</b>
                    </TableCell>
                    <TableCell key={6} className={classes.tableCell}>
                      <b>Details</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        {c.payload.account.id.label}
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        {getName(c.payload.account.provider)}
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        {getName(c.payload.account.owner)}
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        {party === c.payload.account.provider ? 'Provider' : 'Client'}
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        {damlSetValues(c.payload.ctrls).join(', ')}
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        {party === c.payload.account.owner && (
                          <>
                            <Button
                              color="primary"
                              size="small"
                              className={classes.choiceButton}
                              variant="contained"
                              onClick={() => requestCredit(c.payload.account.id)}
                            >
                              Credit
                            </Button>
                            <Button
                              color="primary"
                              size="small"
                              className={classes.choiceButton}
                              variant="contained"
                              onClick={() => requestCloseAccount(c)}
                            >
                              Close
                            </Button>
                          </>
                        )}
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
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
        </Grid>
      </Grid>
    </>
  );
};

export const Accounts = withRouter(AccountsComponent);
