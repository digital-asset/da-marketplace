import React, {useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
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
import {Button} from 'semantic-ui-react';
import {KeyboardArrowRight} from '@material-ui/icons';
import {CreateEvent} from '@daml/ledger';
import {useLedger, useParty} from '@daml/react';
import {useStreamQueries} from '../../Main';
import {Offer, Request, Service,} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module';
import useStyles from '../styles';
import {getTemplateId, usePartyName} from '../../config';
import {InputDialog, InputDialogProps} from '../../components/InputDialog/InputDialog';
import {AssetSettlementRule} from '@daml.js/da-marketplace/lib/DA/Finance/Asset/Settlement';
import {VerifiedIdentity} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import {Role} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import StripedTable from '../../components/Table/StripedTable';

type Props = {
  services: Readonly<CreateEvent<Service, any, any>[]>;
};

export const TradingServiceTable: React.FC<Props> = ({ services }) => {
  const party = useParty();
  const { getName } = usePartyName(party);
  const ledger = useLedger();

  const terminateService = async (c: CreateEvent<Service>) => {
    await ledger.exercise(Service.Terminate, c.contractId, { ctrl: party });
  };

  return (
    <StripedTable
      headings={[
        'Service',
        'Operator',
        'Provider',
        'Consumer',
        'Role',
        'Trading Account',
        'Allocation Account',
        'Action',
        // 'Details'
      ]}
      rows={services.map((c, i) => {
        return {
          elements: [
            getTemplateId(c.templateId),
            getName(c.payload.operator),
            getName(c.payload.provider),
            getName(c.payload.customer),
            party === c.payload.provider ? 'Provider' : 'Consumer',
            c.payload.tradingAccount.id.label,
            c.payload.allocationAccount.id.label,
            <Button className="ghost warning" onClick={() => terminateService(c)}>
              Terminate
            </Button>,
            // <NavLink to={`/app/network/trading/service/${c.contractId.replace('#', '_')}`}>
            //     <ArrowRightIcon/>
            // </NavLink>
          ],
        };
      })}
    />
  );
};

const TradingComponent: React.FC<RouteComponentProps & Props> = ({
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

  const assetSettlementRules = useStreamQueries(AssetSettlementRule).contracts;
  const accounts = assetSettlementRules
    .filter(c => c.payload.account.owner === party)
    .map(c => c.payload.account);
  const accountNames = accounts.map(a => a.id.label);

  // Service offer
  const defaultOfferDialogProps: InputDialogProps<any> = {
    open: false,
    title: 'Request Offer Service',
    defaultValue: { client: '' },
    fields: { client: { label: 'Client', type: 'selection', items: legalNames } },
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
      await ledger.exercise(Role.OfferTradingService, roles[0].contractId, {
        customer: identity.payload.customer,
      });
    };
    setOfferDialogProps({ ...defaultOfferDialogProps, open: true, onClose });
  };

  // Service request
  const defaultRequestDialogProps: InputDialogProps<any> = {
    open: false,
    title: 'Request Trading Service',
    defaultValue: { provider: '' },
    fields: {
      provider: { label: 'Provider', type: 'selection', items: legalNames },
      tradingAccount: { label: 'Trading Account', type: 'selection', items: accountNames },
      allocationAccount: { label: 'Allocation Account', type: 'selection', items: accountNames },
    },
    onClose: async function (state: any | null) {},
  };
  const [requestDialogProps, setRequestDialogProps] = useState<InputDialogProps<any>>(
    defaultRequestDialogProps
  );

  const requestService = () => {
    const onClose = async (state: any | null) => {
      setRequestDialogProps({ ...defaultRequestDialogProps, open: false });
      const identity = identities.find(i => i.payload.legalName === state?.provider);
      const tradingAccount = accounts.find(a => a.id.label === state?.tradingAccount);
      const allocationAccount = accounts.find(a => a.id.label === state?.allocationAccount);
      if (!state || !identity || !tradingAccount || !allocationAccount) return;
      await ledger.create(Request, {
        provider: identity.payload.customer,
        customer: party,
        tradingAccount,
        allocationAccount,
      });
    };
    setRequestDialogProps({ ...defaultRequestDialogProps, open: true, onClose });
  };

  // Service acceptance
  const defaultAcceptDialogProps: InputDialogProps<any> = {
    open: false,
    title: 'Accept Trading Service Offer',
    defaultValue: { provider: '' },
    fields: {
      tradingAccount: { label: 'Trading Account', type: 'selection', items: accountNames },
      allocationAccount: { label: 'Allocation Account', type: 'selection', items: accountNames },
    },
    onClose: async function (state: any | null) {},
  };
  const [acceptDialogProps, setAcceptDialogProps] = useState<InputDialogProps<any>>(
    defaultAcceptDialogProps
  );

  const acceptOffer = async (c: CreateEvent<Offer>) => {
    const onClose = async (state: any | null) => {
      setAcceptDialogProps({ ...defaultAcceptDialogProps, open: false });
      const tradingAccount = accounts.find(a => a.id.label === state?.tradingAccount);
      const allocationAccount = accounts.find(a => a.id.label === state?.allocationAccount);
      if (!state || !tradingAccount || !allocationAccount) return;
      await ledger.exercise(Offer.Accept, c.contractId, { tradingAccount, allocationAccount });
    };
    setAcceptDialogProps({ ...defaultAcceptDialogProps, open: true, onClose });
  };

  const approveRequest = async (c: CreateEvent<Request>) => {
    if (!hasRole) return;
    await ledger.exercise(Role.ApproveTradingServiceRequest, roles[0].contractId, {
      tradingRequestCid: c.contractId,
    });
  };

  const cancelRequest = async (c: CreateEvent<Request>) => {
    await ledger.exercise(Request.Cancel, c.contractId, {});
  };

  const withdrawOffer = async (c: CreateEvent<Offer>) => {
    await ledger.exercise(Offer.Withdraw, c.contractId, {});
  };

  return (
    <>
      <InputDialog {...requestDialogProps} />
      <InputDialog {...offerDialogProps} />
      <InputDialog {...acceptDialogProps} />
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
                      Request Trading Service
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container justify="center">
                    {hasRole && (
                      <Button className="ghost" onClick={offerService}>
                        Offer Trading Service
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
              <TradingServiceTable services={services} />
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
                    <TableCell key={4} className={classes.tableCell}>
                      <b>Trading Account</b>
                    </TableCell>
                    <TableCell key={5} className={classes.tableCell}>
                      <b>Allocation Account</b>
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
                        {c.payload.tradingAccount.id.label}
                      </TableCell>
                      <TableCell key={5} className={classes.tableCell}>
                        {c.payload.allocationAccount.id.label}
                      </TableCell>
                      <TableCell key={6} className={classes.tableCell}>
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
                      <TableCell key={7} className={classes.tableCell}>
                        <IconButton
                          className="ghost"
                          onClick={() =>
                            history.push(
                              '/app/network/trading/request/' + c.contractId.replace('#', '_')
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
                    <TableCell key={4} className={classes.tableCell}>
                      <b>Action</b>
                    </TableCell>
                    <TableCell key={5} className={classes.tableCell}>
                      <b>Details</b>
                    </TableCell>
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
                              '/app/network/trading/offer/' + c.contractId.replace('#', '_')
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

export const Trading = withRouter(TradingComponent);
