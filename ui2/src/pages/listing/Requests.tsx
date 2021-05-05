import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
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
import {
  CreateListingRequest,
  DisableListingRequest,
  Service,
} from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
  listings: Readonly<CreateEvent<Listing, any, any>[]>;
};

const RequestsComponent: React.FC<RouteComponentProps & Props> = ({
  history,
  services,
  listings,
}: RouteComponentProps & Props) => {
  const classes = useStyles();
  const party = useParty();
  const { getName } = usePartyName(party);

  const ledger = useLedger();

  const providerServices = services.filter(s => s.payload.provider === party);
  const createRequests = useStreamQueries(CreateListingRequest).contracts;
  const disableRequests = useStreamQueries(DisableListingRequest).contracts;
  const deleteEntries = disableRequests.map(dr => ({
    request: dr,
    listing: listings.find(l => l.contractId === dr.payload.listingCid)?.payload,
  }));
  const createListing = async (c: CreateEvent<CreateListingRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.CreateListing, service.contractId, {
      createListingRequestCid: c.contractId,
      providerId: uuidv4(),
    });
    history.push('/app/listing/listings');
  };

  const deleteListing = async (c: CreateEvent<DisableListingRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.DisableListing, service.contractId, {
      disableListingRequestCid: c.contractId,
    });
    history.push('/app/listing/listings');
  };

  return (
    <>
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
                    <Button
                      color="primary"
                      size="large"
                      className={classes.actionButton}
                      variant="outlined"
                      onClick={() => history.push('/app/listing/new')}
                    >
                      New Listing
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}>
                <Typography variant="h2">Listing Requests</Typography>
              </Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}>
                      <b>Provider</b>
                    </TableCell>
                    <TableCell key={1} className={classes.tableCell}>
                      <b>Client</b>
                    </TableCell>
                    <TableCell key={2} className={classes.tableCell}>
                      <b>Role</b>
                    </TableCell>
                    <TableCell key={3} className={classes.tableCell}>
                      <b>Listing ID</b>
                    </TableCell>
                    <TableCell key={4} className={classes.tableCell}>
                      <b>Calendar ID</b>
                    </TableCell>
                    <TableCell key={5} className={classes.tableCell}>
                      <b>Traded Asset</b>
                    </TableCell>
                    <TableCell key={6} className={classes.tableCell}>
                      <b>Quoted Asset</b>
                    </TableCell>
                    <TableCell key={7} className={classes.tableCell}>
                      <b>Action</b>
                    </TableCell>
                    <TableCell key={8} className={classes.tableCell}>
                      <b>Details</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {createRequests.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        {getName(c.payload.provider)}
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        {getName(c.payload.customer)}
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        {party === c.payload.provider ? 'Provider' : 'Client'}
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        {c.payload.symbol}
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        {c.payload.calendarId}
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        {c.payload.tradedAssetId.label}
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
                        {c.payload.quotedAssetId.label}
                      </TableCell>
                      <TableCell key={7} className={classes.tableCell}>
                        {party === c.payload.provider && (
                          <Button
                            color="primary"
                            size="small"
                            className={classes.choiceButton}
                            variant="contained"
                            onClick={() => createListing(c)}
                          >
                            List
                          </Button>
                        )}
                        {/* {party === c.payload.client && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => cancelRequest(c)}>Cancel</Button>} */}
                      </TableCell>
                      <TableCell key={8} className={classes.tableCell}>
                        <IconButton
                          color="primary"
                          size="small"
                          component="span"
                          onClick={() =>
                            history.push(
                              '/app/listing/createrequest/' + c.contractId.replace('#', '_')
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
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}>
                <Typography variant="h2">Delisting Requests</Typography>
              </Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}>
                      <b>Provider</b>
                    </TableCell>
                    <TableCell key={1} className={classes.tableCell}>
                      <b>Client</b>
                    </TableCell>
                    <TableCell key={2} className={classes.tableCell}>
                      <b>Role</b>
                    </TableCell>
                    <TableCell key={3} className={classes.tableCell}>
                      <b>Listing ID</b>
                    </TableCell>
                    <TableCell key={4} className={classes.tableCell}>
                      <b>Calendar ID</b>
                    </TableCell>
                    <TableCell key={5} className={classes.tableCell}>
                      <b>Traded Asset</b>
                    </TableCell>
                    <TableCell key={6} className={classes.tableCell}>
                      <b>Quoted Asset</b>
                    </TableCell>
                    <TableCell key={7} className={classes.tableCell}>
                      <b>Action</b>
                    </TableCell>
                    <TableCell key={8} className={classes.tableCell}>
                      <b>Details</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deleteEntries.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        {getName(c.request.payload.provider)}
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        {getName(c.request.payload.customer)}
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        {party === c.request.payload.provider ? 'Provider' : 'Client'}
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        {c.listing?.listingId}
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        {c.listing?.calendarId}
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        {c.listing?.tradedAssetId.label}
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
                        {c.listing?.quotedAssetId.label}
                      </TableCell>
                      <TableCell key={7} className={classes.tableCell}>
                        {party === c.request.payload.provider && (
                          <Button
                            color="primary"
                            size="small"
                            className={classes.choiceButton}
                            variant="contained"
                            onClick={() => deleteListing(c.request)}
                          >
                            Process
                          </Button>
                        )}
                        {/* {party === c.payload.client && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => cancelRequest(c)}>Cancel</Button>} */}
                      </TableCell>
                      <TableCell key={8} className={classes.tableCell}>
                        <IconButton
                          color="primary"
                          size="small"
                          component="span"
                          onClick={() =>
                            history.push(
                              '/app/listing/deleterequest/' + c.request.contractId.replace('#', '_')
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

export const Requests = withRouter(RequestsComponent);
