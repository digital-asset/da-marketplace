import React, { useState } from 'react';
import { RouteComponentProps, withRouter, useHistory } from 'react-router-dom';
import {
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
import { Button, Header } from 'semantic-ui-react';
import { KeyboardArrowRight } from '@material-ui/icons';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import useStyles from '../styles';
import { getTemplateId, usePartyName } from '../../config';
import { InputDialog, InputDialogProps } from '../../components/InputDialog/InputDialog';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { Role } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Offer, Request, Service } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service';
import StripedTable from '../../components/Table/StripedTable';
import { Requests as AccountRequests } from '../custody/Requests';
import {
  OpenAccountRequest,
  OpenAllocationAccountRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Model';
import TitleWithActions from '../../components/Common/TitleWithActions';
import { damlSetValues } from '../common';
import { useDisplayErrorMessage } from '../../context/MessagesContext';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

export const CustodyServiceTable: React.FC<Props> = ({ services }) => {
  const party = useParty();
  const history = useHistory();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const terminateService = async (c: CreateEvent<Service>) => {
    await ledger.exercise(Service.Terminate, c.contractId, { ctrl: party });
  };

  return (
    <>
      <TitleWithActions title="Current Services">
        <Button className="ghost" onClick={() => history.push('/app/setup/custody/offer')}>
          Offer Custody Service
        </Button>
      </TitleWithActions>

      <StripedTable
        headings={['Service', 'Operator', 'Provider', 'Consumer', 'Role', 'Action']}
        rows={services.map((c, i) => {
          return {
            elements: [
              getTemplateId(c.templateId),
              getName(c.payload.operator),
              getName(c.payload.provider),
              getName(c.payload.customer),
              party === c.payload.provider ? 'Provider' : 'Consumer',
              <Button
                className="ghost warning small"
                onClick={() => terminateService(c)}
                floated="right"
              >
                Terminate
              </Button>,
            ],
          };
        })}
      />
      <AccountRequestsTable services={services} />
      <AllocationAccountRequestsTable services={services} />
    </>
  );
};

export const AccountRequestsTable: React.FC<Props> = ({ services }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();

  const { contracts: openRequests, loading } = useStreamQueries(OpenAccountRequest);

  const openAccount = async (c: CreateEvent<OpenAccountRequest>) => {
    const service = services.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Open Account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.OpenAccount, service.contractId, {
      openAccountRequestCid: c.contractId,
    });
  };

  return !!openRequests.length ? (
    <>
      <Header as="h2">Account Requests</Header>
      <StripedTable
        headings={['Account', 'Provider', 'Client', 'Role', 'Controllers', 'Action']}
        loading={loading}
        rows={openRequests.map((c, i) => {
          return {
            elements: [
              c.payload.accountId.label,
              getName(c.payload.provider),
              getName(c.payload.customer),
              party === c.payload.provider ? 'Provider' : 'Client',
              damlSetValues(c.payload.ctrls).join(', '),
              party === c.payload.provider && (
                <Button className="ghost" size="small" onClick={() => openAccount(c)}>
                  Process
                </Button>
              ),
            ],
          };
        })}
      />
    </>
  ) : (
    <></>
  );
};

export const AllocationAccountRequestsTable: React.FC<Props> = ({ services }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();

  const { contracts: openRequests, loading } = useStreamQueries(OpenAllocationAccountRequest);

  const openAccount = async (c: CreateEvent<OpenAllocationAccountRequest>) => {
    const service = services.find(s => s.payload.customer === c.payload.customer);
    if (!service)
      return displayErrorMessage({
        header: 'Failed to Open Account',
        message: 'Could not find Custody service contract',
      });
    await ledger.exercise(Service.OpenAllocationAccount, service.contractId, {
      openAllocationAccountRequestCid: c.contractId,
    });
  };

  return !!openRequests.length ? (
    <>
      <Header as="h2">Allocation Account Requests</Header>
      <StripedTable
        headings={['Account', 'Provider', 'Client', 'Role', 'Nominee', 'Action']}
        loading={loading}
        rows={openRequests.map((c, i) => {
          return {
            elements: [
              c.payload.accountId.label,
              getName(c.payload.provider),
              getName(c.payload.customer),
              party === c.payload.provider ? 'Provider' : 'Client',
              c.payload.nominee,
              party === c.payload.provider && (
                <Button className="ghost" size="small" onClick={() => openAccount(c)}>
                  Process
                </Button>
              ),
            ],
          };
        })}
      />
    </>
  ) : (
    <></>
  );
};

const CustodyComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  services,
}: RouteComponentProps & Props) => {
  const classes = useStyles();
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();
  const displayErrorMessage = useDisplayErrorMessage();

  const identities = useStreamQueries(VerifiedIdentity).contracts;
  const legalNames = identities.map(c => c.payload.legalName);

  const roles = useStreamQueries(Role).contracts;
  const hasRole = roles.length > 0 && roles[0].payload.provider === party;
  const requests = useStreamQueries(Request).contracts;
  const offers = useStreamQueries(Offer).contracts;

  // Service request
  const defaultRequestDialogProps: InputDialogProps<any> = {
    open: false,
    title: 'Request Custody Service',
    defaultValue: { provider: '' },
    fields: { provider: { label: 'Provider', type: 'selection', items: legalNames } },
    onClose: async function (state: any | null) {},
  };
  const [requestDialogProps, setRequestDialogProps] =
    useState<InputDialogProps<any>>(defaultRequestDialogProps);

  const requestService = () => {
    const onClose = async (state: any | null) => {
      setRequestDialogProps({ ...defaultRequestDialogProps, open: false });
      const identity = identities.find(i => i.payload.legalName === state?.provider);
      if (!state || !identity) return;
      await ledger.create(Request, { provider: identity.payload.customer, customer: party });
    };
    setRequestDialogProps({ ...defaultRequestDialogProps, open: true, onClose });
  };

  // Service offer
  const defaultOfferDialogProps: InputDialogProps<any> = {
    open: false,
    title: 'Offer Custody Service',
    defaultValue: { client: '' },
    fields: { client: { label: 'Client', type: 'selection', items: legalNames } },
    onClose: async function (state: any | null) {},
  };
  const [offerDialogProps, setOfferDialogProps] =
    useState<InputDialogProps<any>>(defaultOfferDialogProps);

  const offerService = () => {
    const onClose = async (state: any | null) => {
      setOfferDialogProps({ ...defaultRequestDialogProps, open: false });
      const identity = identities.find(i => i.payload.legalName === state?.client);
      if (!state || !identity || !hasRole) return;
      await ledger.exercise(Role.OfferCustodyService, roles[0].contractId, {
        customer: identity.payload.customer,
      });
    };
    setOfferDialogProps({ ...defaultOfferDialogProps, open: true, onClose });
  };

  const approveRequest = async (c: CreateEvent<Request>) => {
    if (!hasRole) return displayErrorMessage({ message: 'Could not find role contract.' });
    await ledger.exercise(Role.ApproveCustodyRequest, roles[0].contractId, {
      custodyRequestCid: c.contractId,
    });
  };

  const cancelRequest = async (c: CreateEvent<Request>) => {
    await ledger.exercise(Request.Cancel, c.contractId, {});
  };

  const acceptOffer = async (c: CreateEvent<Offer>) => {
    await ledger.exercise(Offer.Accept, c.contractId, {});
  };

  const withdrawOffer = async (c: CreateEvent<Offer>) => {
    await ledger.exercise(Offer.Withdraw, c.contractId, {});
  };

  return (
    <>
      <InputDialog {...requestDialogProps} isModal />
      <InputDialog {...offerDialogProps} isModal />
      <Grid container direction="column">
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}>
                <Typography variant="h2">Actions</Typography>
              </Grid>
              <Grid container direction="row" justify="center">
                <Grid item xs={6}>
                  <Grid container justify="center">
                    <Button className="ghost" onClick={requestService}>
                      Request Custody Service
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container justify="center">
                    {hasRole && (
                      <Button className="ghost" onClick={offerService}>
                        Offer Custody Service
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}>
                <Typography variant="h2">Services</Typography>
              </Grid>
              <CustodyServiceTable services={services} />
            </Paper>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}>
                <Typography variant="h2">Requests</Typography>
              </Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}>
                      <b>Service</b>
                    </TableCell>
                    <TableCell key={1} className={classes.tableCell}>
                      <b>Provider</b>
                    </TableCell>
                    <TableCell key={2} className={classes.tableCell}>
                      <b>Consumer</b>
                    </TableCell>
                    <TableCell key={3} className={classes.tableCell}>
                      <b>Role</b>
                    </TableCell>
                    <TableCell key={4} className={classes.tableCell}></TableCell>
                    <TableCell key={5} className={classes.tableCell}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        {getTemplateId(c.templateId)}
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        {getName(c.payload.provider)}
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        {getName(c.payload.customer)}
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        {party === c.payload.provider ? 'Provider' : 'Consumer'}
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        {c.payload.customer === party && (
                          <Button className="ghost" onClick={() => cancelRequest(c)}>
                            Cancel
                          </Button>
                        )}
                        {c.payload.provider === party && (
                          <Button className="ghost" onClick={() => approveRequest(c)}>
                            Approve
                          </Button>
                        )}
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        <IconButton
                          color="primary"
                          size="small"
                          component="span"
                          onClick={() =>
                            history.push(
                              '/app/network/custody/request/' + c.contractId.replace('#', '_')
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
        </Grid>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}>
                <Typography variant="h2">Offers</Typography>
              </Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}>
                      <b>Service</b>
                    </TableCell>
                    <TableCell key={1} className={classes.tableCell}>
                      <b>Provider</b>
                    </TableCell>
                    <TableCell key={2} className={classes.tableCell}>
                      <b>Consumer</b>
                    </TableCell>
                    <TableCell key={3} className={classes.tableCell}>
                      <b>Role</b>
                    </TableCell>
                    <TableCell key={4} className={classes.tableCell}></TableCell>
                    <TableCell key={5} className={classes.tableCell}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {offers.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        {getTemplateId(c.templateId)}
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        {getName(c.payload.provider)}
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        {getName(c.payload.customer)}
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        {party === c.payload.provider ? 'Provider' : 'Consumer'}
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        {c.payload.provider === party && (
                          <Button className="ghost" onClick={() => withdrawOffer(c)}>
                            Withdraw
                          </Button>
                        )}
                        {c.payload.customer === party && (
                          <Button className="ghost" onClick={() => acceptOffer(c)}>
                            Accept
                          </Button>
                        )}
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        <IconButton
                          color="primary"
                          size="small"
                          component="span"
                          onClick={() =>
                            history.push(
                              '/app/network/custody/offer/' + c.contractId.replace('#', '_')
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
        </Grid>
      </Grid>
      <AccountRequests services={services} />
    </>
  );
};

export const Custody = withRouter(CustodyComponent);
