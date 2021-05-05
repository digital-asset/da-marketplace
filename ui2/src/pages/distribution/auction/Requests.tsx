import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
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
import {KeyboardArrowRight} from '@material-ui/icons';
import {CreateEvent} from '@daml/ledger';
import {useLedger, useParty} from '@daml/react';
import {useStreamQueries} from '../../../Main';
import useStyles from '../../styles';
import {CreateAuctionRequest, Service,} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import {usePartyName} from '../../../config';
import {ServicePageProps} from '../../common';

const RequestsComponent: React.FC<RouteComponentProps & ServicePageProps<Service>> = ({
  history,
  services,
}: RouteComponentProps & ServicePageProps<Service>) => {
  const classes = useStyles();
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const requests = useStreamQueries(CreateAuctionRequest).contracts;
  const providerServices = services.filter(s => s.payload.provider === party);

  const createAuction = async (c: CreateEvent<CreateAuctionRequest>) => {
    const service = providerServices.find(s => s.payload.customer === c.payload.customer);
    if (!service) return; // TODO: Display error
    await ledger.exercise(Service.CreateAuction, service.contractId, {
      createAuctionRequestCid: c.contractId,
    });
    history.push('/app/distribution/auctions');
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
                      onClick={() => history.push('/app/distribution/new')}
                    >
                      New Auction
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container direction="row" justify="center" className={classes.paperHeading}>
                <Typography variant="h2">Auction Requests</Typography>
              </Grid>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}>
                      <b>Agent</b>
                    </TableCell>
                    <TableCell key={1} className={classes.tableCell}>
                      <b>Issuer</b>
                    </TableCell>
                    <TableCell key={2} className={classes.tableCell}>
                      <b>Auction ID</b>
                    </TableCell>
                    <TableCell key={3} className={classes.tableCell}>
                      <b>Auctioned Asset</b>
                    </TableCell>
                    <TableCell key={4} className={classes.tableCell}>
                      <b>Quoted Asset</b>
                    </TableCell>
                    <TableCell key={5} className={classes.tableCell}>
                      <b>Floor Price</b>
                    </TableCell>
                    <TableCell key={6} className={classes.tableCell}>
                      <b>Action</b>
                    </TableCell>
                    <TableCell key={7} className={classes.tableCell}>
                      <b>Details</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((c, i) => (
                    <TableRow key={i} className={classes.tableRow}>
                      <TableCell key={0} className={classes.tableCell}>
                        {getName(c.payload.provider)}
                      </TableCell>
                      <TableCell key={1} className={classes.tableCell}>
                        {getName(c.payload.customer)}
                      </TableCell>
                      <TableCell key={2} className={classes.tableCell}>
                        {c.payload.auctionId}
                      </TableCell>
                      <TableCell key={3} className={classes.tableCell}>
                        {c.payload.asset.quantity} {c.payload.asset.id.label}
                      </TableCell>
                      <TableCell key={4} className={classes.tableCell}>
                        {c.payload.quotedAssetId.label}
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        {c.payload.floorPrice} {c.payload.quotedAssetId.label}
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
                        {party === c.payload.provider && (
                          <Button
                            color="primary"
                            size="small"
                            className={classes.choiceButton}
                            variant="contained"
                            onClick={() => createAuction(c)}
                          >
                            Create
                          </Button>
                        )}
                        {/* {party === c.payload.client && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => cancelRequest(c)}>Cancel</Button>} */}
                      </TableCell>
                      <TableCell key={7} className={classes.tableCell}>
                        <IconButton
                          color="primary"
                          size="small"
                          component="span"
                          onClick={() =>
                            history.push(
                              '/app/distribution/requests/' + c.contractId.replace('#', '_')
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
