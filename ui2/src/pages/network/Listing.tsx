import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { Button } from 'semantic-ui-react';
import { IconButton } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { CreateEvent } from '@daml/ledger';
import { useLedger, useParty } from '@daml/react';
import { useStreamQueries } from '../../Main';
import { Service, Request, Offer } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import useStyles from '../styles';
import { getTemplateId, usePartyName } from '../../config';
import { InputDialog, InputDialogProps } from '../../components/InputDialog/InputDialog';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { Role } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

const ListingComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  services,
}: RouteComponentProps & Props) => {
  const classes = useStyles();
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const identities = useStreamQueries(VerifiedIdentity).contracts;
  const legalNames = identities.map(c => c.payload.legalName);

  const roles = useStreamQueries(Role).contracts;
  const hasRole = roles.length > 0 && roles[0].payload.provider === party;
  const requests = useStreamQueries(Request).contracts;
  const offers = useStreamQueries(Offer).contracts;

  // Service request
  const defaultRequestDialogProps: InputDialogProps<any> = {
    open: false,
    title: 'Request Listing Service',
    defaultValue: { provider: '' },
    fields: { provider: { label: 'Provider', type: 'selection', items: legalNames } },
    onClose: async function (state: any | null) {},
  };
  const [requestDialogProps, setRequestDialogProps] = useState<InputDialogProps<any>>(
    defaultRequestDialogProps
  );

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
    title: 'Offer Listing Service',
    defaultValue: { customer: '' },
    fields: { customer: { label: 'Customer', type: 'selection', items: legalNames } },
    onClose: async function (state: any | null) {},
  };
  const [offerDialogProps, setOfferDialogProps] = useState<InputDialogProps<any>>(
    defaultOfferDialogProps
  );

  const offerService = () => {
    const onClose = async (state: any | null) => {
      setOfferDialogProps({ ...defaultRequestDialogProps, open: false });
      const identity = identities.find(i => i.payload.legalName === state?.client);
      if (!state || !identity || !hasRole) return;
      await ledger.exercise(Role.OfferListingService, roles[0].contractId, {
        customer: identity.payload.customer,
      });
    };
    setOfferDialogProps({ ...defaultOfferDialogProps, open: true, onClose });
  };

  const terminateService = async (c: CreateEvent<Service>) => {
    await ledger.exercise(Service.Terminate, c.contractId, { ctrl: party });
  };

  const approveRequest = async (c: CreateEvent<Request>) => {
    if (!hasRole) return; // TODO: Display error
    await ledger.exercise(Role.ApproveListingServiceRequest, roles[0].contractId, {
      listingRequestCid: c.contractId,
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
      <InputDialog {...requestDialogProps} />
      <InputDialog {...offerDialogProps} />
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
                      Request Listing Service
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container justify="center">
                    {hasRole && (
                      <Button className="ghost" onClick={offerService}>
                        Offer Listing Service
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
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}>
                      <b>Service</b>
                    </TableCell>
                    <TableCell key={1} className={classes.tableCell}>
                      <b>Operator</b>
                    </TableCell>
                    <TableCell key={2} className={classes.tableCell}>
                      <b>Provider</b>
                    </TableCell>
                    <TableCell key={3} className={classes.tableCell}>
                      <b>Consumer</b>
                    </TableCell>
                    <TableCell key={4} className={classes.tableCell}>
                      <b>Role</b>
                    </TableCell>
                    <TableCell key={5} className={classes.tableCell}></TableCell>
                    <TableCell key={6} className={classes.tableCell}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        {getTemplateId(c.templateId)}
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        {getName(c.payload.operator)}
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        {getName(c.payload.provider)}
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        {getName(c.payload.customer)}
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        {party === c.payload.provider ? 'Provider' : 'Consumer'}
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        <Button className="ghost warning" onClick={() => terminateService(c)}>
                          Terminate
                        </Button>
                        ,
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
                        <IconButton
                          color="primary"
                          size="small"
                          component="span"
                          onClick={() =>
                            history.push(
                              '/app/network/listing/service/' + c.contractId.replace('#', '_')
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
                              '/app/network/listing/request/' + c.contractId.replace('#', '_')
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
                              '/app/network/listing/offer/' + c.contractId.replace('#', '_')
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
    </>
  );
};

export const Listing = withRouter(ListingComponent);
