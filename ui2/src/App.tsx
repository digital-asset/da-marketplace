import React from 'react';
import { Route, Switch, withRouter, RouteProps, Redirect } from 'react-router-dom';
import { SidebarEntry } from './components/Sidebar/SidebarEntry';
import { New as CustodyNew } from './pages/custody/New';
import { Requests as CustodyRequests } from './pages/custody/Requests';
import { Account } from './pages/custody/Account';
import { useParty } from '@daml/react';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/';
import { Service as ClearingService } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service/';
import { Service as AuctionService } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service/';
import { Service as BiddingService } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service/';
import { Service as IssuanceService } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service/';
import { Service as ListingService } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service/';
import { Service as TradingService } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service/';
import { CircularProgress } from '@material-ui/core';
import { Auctions } from './pages/distribution/auction/Auctions';
import { Requests as AuctionRequests } from './pages/distribution/auction/Requests';
import { Assets } from './pages/custody/Assets';
import { New as DistributionNew } from './pages/distribution/auction/New';
import { BiddingAuction } from './pages/distribution/bidding/Auction';
import { Instruments, InstrumentsTable } from './pages/origination/Instruments';
import { New as InstrumentsNew } from './pages/origination/New';
import { Requests as InstrumentsRequests } from './pages/origination/Requests';
import { Issuances, IssuancesTable } from './pages/issuance/Issuances';
import { New as IssuanceNew } from './pages/issuance/New';
import { Requests as IssuanceRequests } from './pages/issuance/Requests';
import { New as ListingNew } from './pages/listing/New';
import { Requests as ListingRequests } from './pages/listing/Requests';
import { Listings, ListingsTable } from './pages/listing/Listings';
import { Auction } from './pages/distribution/auction/Auction';
import { Market } from './pages/trading/Market';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import { Markets, Markets as MarketNetwork } from './pages/trading/Markets';
import { ClearingServiceTable } from './pages/network/Clearing';
import { Custody as CustodyNetwork, CustodyServiceTable } from './pages/network/Custody';
import { Trading as TradingNetwork, TradingServiceTable } from './pages/network/Trading';
import { BiddingAuctions } from './pages/distribution/bidding/Auctions';
import Page from './pages/page/Page';
import {
  ControlsIcon,
  ExchangeIcon,
  MegaphoneIcon,
  OrdersIcon,
  PublicIcon,
  ToolIcon,
} from './icons/icons';
import { Instrument } from './pages/origination/Instrument';
import { WalletIcon } from './icons/icons';
import { ClearingMembers } from './pages/clearing/Members';
import { ClearingMember } from './pages/clearing/Member';
import _ from 'lodash';
import { NewConvertibleNote } from './pages/origination/NewConvertibleNote';
import { NewBinaryOption } from './pages/origination/NewBinaryOption';
import { NewBaseInstrument } from './pages/origination/NewBaseInstrument';
import { New as NewAuction } from './pages/distribution/auction/New';
import Landing from './pages/landing/Landing';
import Manage from './pages/manage/Manage';
import SetUp from './pages/setup/SetUp';
import Offer from './pages/setup/Offer';
import { useStreamQueries } from './Main';
import { ServiceKind } from './context/ServicesContext';
import { DistributionServiceTable } from './pages/network/Distribution';
import { Header } from 'semantic-ui-react';
import RequestIdentityVerification from './pages/identity/Request';
import { TradingOrder } from './pages/trading/Order';
import Notifications, { useAllNotifications } from './pages/notifications/Notifications';

type Entry = {
  displayEntry: () => boolean;
  sidebar: SidebarEntry[];
  additionalRoutes?: RouteProps[];
};

const AppComponent = () => {
  const party = useParty();

  const { contracts: custodyService, loading: custodyLoading } = useStreamQueries(CustodyService);
  const { contracts: clearingService, loading: clearingLoading } = useStreamQueries(
    ClearingService
  );
  const { contracts: auctionService, loading: auctionLoading } = useStreamQueries(AuctionService);
  const { contracts: biddingService, loading: biddingLoading } = useStreamQueries(BiddingService);
  const { contracts: issuanceService, loading: issuanceLoading } = useStreamQueries(
    IssuanceService
  );
  const { contracts: listingService, loading: listingLoading } = useStreamQueries(ListingService);
  const { contracts: tradingService, loading: tradingLoading } = useStreamQueries(TradingService);
  const { contracts: listings, loading: listingsLoading } = useStreamQueries(Listing);

  const servicesLoading: boolean = [
    custodyLoading,
    clearingLoading,
    auctionLoading,
    biddingLoading,
    issuanceLoading,
    listingLoading,
    tradingLoading,
    listingsLoading,
  ].every(s => s);

  const entries: Entry[] = [];
  entries.push({
    displayEntry: () => custodyService.length > 0,
    sidebar: [
      {
        label: 'Wallet',
        path: '/app/custody/assets',
        render: () => <Assets services={custodyService} />,
        icon: <WalletIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: '/app/custody/accounts/new',
        render: () => <CustodyNew services={custodyService} />,
      },
      {
        path: '/app/custody/account/:contractId',
        render: () => <Account services={custodyService} />,
      },
      {
        path: '/app/custody/requests',
        render: () => <CustodyRequests services={custodyService} />,
      },
    ],
  });

  const clearingProvider = clearingService.filter(cs => cs.payload.provider === party);
  entries.push({
    displayEntry: () => clearingProvider.length > 0,
    sidebar: [
      {
        label: 'Members',
        path: '/app/clearing/members',
        render: () => <ClearingMembers services={clearingProvider} />,
        icon: <WalletIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: '/app/clearing/member/:contractId',
        render: () => <ClearingMember services={clearingProvider} />,
      },
    ],
  });

  const clearingCustomer = clearingService.filter(cs => cs.payload.customer === party);
  entries.push({
    displayEntry: () => clearingCustomer.length > 0,
    sidebar: [
      {
        label: 'Clearing',
        path: `/app/clearing/member`,
        render: () => <ClearingMember services={clearingProvider} member />,
        icon: <WalletIcon />,
        children: [],
      },
    ],
  });

  entries.push({
    displayEntry: () => auctionService.length > 0,
    sidebar: [
      {
        label: 'Auctions',
        path: '/app/distribution/auctions',
        render: () => <Auctions />,
        icon: <MegaphoneIcon />,
        groupBy: 'Primary Market',
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: '/app/distribution/auctions/:contractId',
        render: props => (
          <Auction auctionServices={auctionService} biddingServices={biddingService} {...props} />
        ),
      },
      {
        path: '/app/distribution/new',
        render: () => <DistributionNew services={auctionService} />,
      },
      {
        path: '/app/distribution/requests',
        render: () => <AuctionRequests services={auctionService} />,
      },
    ],
  });
  entries.push({
    displayEntry: () => biddingService.filter(b => b.payload.customer === party).length > 0,
    sidebar: [
      {
        label: 'Bidding Auctions',
        path: '/app/distribution/bidding',
        render: () => <BiddingAuctions />,
        icon: <MegaphoneIcon />,
        groupBy: 'Primary Market',
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: '/app/distribution/bidding/:contractId',
        render: () => <BiddingAuction services={biddingService} />,
      },
    ],
  });

  entries.push({
    displayEntry: () => tradingService.length > 0,
    sidebar: [
      {
        label: 'Markets',
        path: '/app/trading/markets',
        render: () => <Markets listings={listings} />,
        icon: <OrdersIcon />,
        groupBy: 'Secondary Market',
        children: listings.map(c => ({
          label: c.payload.listingId,
          path: '/app/trading/markets/' + c.contractId.replace('#', '_'),
          render: () => <Market services={tradingService} cid={c.contractId} listings={listings} />,
          icon: <ExchangeIcon />,
          children: [],
        })),
      },
    ],
    additionalRoutes: [
      {
        path: '/app/trading/order/:contractId',
        render: () => <TradingOrder listings={listings} />,
      },
    ],
  });

  entries.push({
    displayEntry: () => true,
    sidebar: [
      {
        label: 'Manage',
        path: '/app/manage',
        activeSubroutes: true,
        render: () => <Redirect to="/app/manage/custody" />,
        icon: <ControlsIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: '/app/manage/clearing',
        render: () => (
          <Manage>
            <ClearingServiceTable services={clearingService} />
          </Manage>
        ),
      },
      {
        path: '/app/manage/custody',
        render: () => (
          <Manage>
            <CustodyServiceTable services={custodyService} />
          </Manage>
        ),
      },
      {
        path: '/app/manage/distributions',
        render: () => (
          <Manage>
            <Header as="h2">Service</Header>
            <DistributionServiceTable />
            <Auctions />
          </Manage>
        ),
      },
      {
        path: '/app/manage/instruments',
        render: () => (
          <Manage>
            <InstrumentsTable />
          </Manage>
        ),
      },
      { path: '/app/manage/instrument/:contractId', component: Instrument },
      {
        path: '/app/manage/issuance',
        render: () => (
          <Manage>
            <IssuancesTable />
          </Manage>
        ),
      },
      {
        path: '/app/manage/trading',
        render: () => (
          <Manage>
            <TradingServiceTable services={tradingService} />
          </Manage>
        ),
      },
      {
        path: '/app/manage/listings',
        render: () => (
          <Manage>
            <ListingsTable services={listingService} listings={listings} />
          </Manage>
        ),
      },
    ],
  });

  entries.push({
    displayEntry: () => true,
    sidebar: [
      {
        label: 'Setup',
        path: '/app/setup',
        activeSubroutes: true,
        render: () => <SetUp />,
        icon: <ToolIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: '/app/setup/custody/offer',
        render: () => <Offer service={ServiceKind.CUSTODY} />,
      },
      {
        path: '/app/setup/clearing/offer',
        render: () => <Offer service={ServiceKind.CLEARING} />,
      },
      {
        path: '/app/setup/clearing/market/offer',
        render: () => <Offer service={ServiceKind.MARKET_CLEARING} />,
      },
      {
        path: '/app/setup/distribution/new/auction',
        render: () => <NewAuction services={auctionService} />,
      },
      {
        path: '/app/setup/identity',
        render: () => <RequestIdentityVerification />,
      },
      {
        path: '/app/setup/instrument/new/base',
        component: NewBaseInstrument,
      },
      {
        path: '/app/setup/instrument/new/convertiblenote',
        component: NewConvertibleNote,
      },
      {
        path: '/app/setup/instrument/new/binaryoption',
        component: NewBinaryOption,
      },
      {
        path: '/app/setup/issuance/new',
        render: () => <IssuanceNew services={issuanceService} />,
      },
      {
        path: '/app/setup/listing/new',
        render: () => <ListingNew services={listingService} />,
      },
      {
        path: '/app/setup/trading/offer',
        render: () => <Offer service={ServiceKind.TRADING} />,
      },
    ],
  });

  const notifications = useAllNotifications(party);
  const notifCount = notifications.reduce((count, { contracts }) => count + contracts.length, 0);

  entries.push({
    displayEntry: () => true,
    sidebar: [],
    additionalRoutes: [
      {
        path: '/app/notifications',
        render: () => <Notifications notifications={notifications} />,
      },
    ],
  });

  const entriesToDisplay = entries.filter(e => e.displayEntry()).flatMap(e => e.sidebar);
  const additionRouting: RouteProps[] = _.compact(
    entries.filter(e => e.displayEntry()).flatMap(e => e.additionalRoutes)
  );

  const routeEntries = (sidebarEntries: SidebarEntry[]): React.ReactElement[] => {
    const childRoutes = sidebarEntries.map(e => routeEntries(e.children)).flat();
    const routes = sidebarEntries.map(e => (
      <Route exact={true} key={e.label} path={e.path} render={e.render} />
    ));

    return routes.concat(childRoutes);
  };

  return (
    <Page sideBarItems={entriesToDisplay} showNotificationAlert={notifCount > 0}>
      {servicesLoading ? (
        <div>
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <div>
          <Switch>
            <Route exact path="/app" component={Landing} />
            {routeEntries(entriesToDisplay)}
            {additionRouting.map((routeProps, i) => (
              <Route key={i} {...routeProps} />
            ))}
          </Switch>
        </div>
      )}
    </Page>
  );
};

export const App = withRouter(AppComponent);
