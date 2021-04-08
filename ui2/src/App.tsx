import React from 'react';
import { Route, Switch, withRouter, RouteProps } from 'react-router-dom';
import { PlayArrow } from '@material-ui/icons';
import { SidebarEntry } from './components/Sidebar/SidebarEntry';
import { New as CustodyNew } from './pages/custody/New';
import { Requests as CustodyRequests } from './pages/custody/Requests';
import { Account } from './pages/custody/Account';
import { useParty, useStreamQueries } from '@daml/react';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/module';
import { Service as ClearingService } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service/module';
import { Service as AuctionService } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service/module';
import { Service as BiddingService } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service/module';
import { Service as IssuanceService } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service/module';
import { Service as ListingService } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service/module';
import { Service as TradingService } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module';
import { CircularProgress } from '@material-ui/core';
import { Auctions } from './pages/distribution/auction/Auctions';
import { Requests as AuctionRequests } from './pages/distribution/auction/Requests';
import { Assets } from './pages/custody/Assets';
import { New as DistributionNew } from './pages/distribution/auction/New';
import { BiddingAuction } from './pages/distribution/bidding/Auction';
import { Instruments } from './pages/origination/Instruments';
import { New as InstrumentsNew } from './pages/origination/New';
import { Requests as InstrumentsRequests } from './pages/origination/Requests';
import { Issuances } from './pages/issuance/Issuances';
import { New as IssuanceNew } from './pages/issuance/New';
import { Requests as IssuanceRequests } from './pages/issuance/Requests';
import { New as ListingNew } from './pages/listing/New';
import { Requests as ListingRequests } from './pages/listing/Requests';
import { Listings } from './pages/listing/Listings';
import { Auction } from './pages/distribution/auction/Auction';
import { Market } from './pages/trading/Market';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import { Markets, Markets as MarketNetwork } from './pages/trading/Markets';
import { Custody as CustodyNetwork } from './pages/network/Custody';
import { Trading as TradingNetwork } from './pages/network/Trading';
import { BiddingAuctions } from './pages/distribution/bidding/Auctions';
import Page from './pages/page/Page';
import { ExchangeIcon, OrdersIcon, PublicIcon } from './icons/icons';
import { Instrument } from './pages/origination/Instrument';
import { WalletIcon } from './icons/icons';
import { ClearingMembers } from './pages/clearing/Members';
import { MarginCall } from './pages/clearing/MarginCall';
import { MTMCalculation } from './pages/clearing/MTMCalculation';
import { ClearingMember } from './pages/clearing/Member';
import _ from 'lodash';
import { NewConvertibleNote } from './pages/origination/NewConvertibleNote';
import { NewBinaryOption } from './pages/origination/NewBinaryOption';
import { NewBaseInstrument } from './pages/origination/NewBaseInstrument';
import Landing from './pages/landing/Landing';

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
  const { contracts: biddingService, loading: biddingLoading } = useStreamQueries(
    BiddingService,
    () => [{ customer: party }]
  );
  const { contracts: issuanceService, loading: issuanceLoading } = useStreamQueries(
    IssuanceService
  );
  const { contracts: listingService, loading: listingLoading } = useStreamQueries(ListingService);
  const { contracts: tradingService, loading: tradingLoading } = useStreamQueries(TradingService);
  const { contracts: listings, loading: listingsLoading } = useStreamQueries(Listing);

  const servicesLoading: boolean = [
    custodyLoading,
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
      { path: '/app/custody/accounts/new', render: () => <CustodyNew services={custodyService} /> },
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
  // CLEARING_SERVICE_START
  entries.push({
    displayEntry: () => clearingService.length > 0,
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
        path: '/app/clearing/margin-call',
        render: () => <MarginCall services={clearingProvider} />,
      },
      {
        path: '/app/clearing/mtm-calc',
        render: () => <MTMCalculation services={clearingProvider} />,
      },
      {
        path: '/app/clearing/member/:contractId',
        render: () => <ClearingMember services={clearingProvider} />,
      },
      // { path: "/app/custody/requests", render: () => (<CustodyRequests services={custodyService} />) }
    ],
  });
  //CLEARING_SERVICE_END
  //
  entries.push({
    displayEntry: () => true,
    sidebar: [
      {
        label: 'Network',
        path: '/app/network/custody',
        render: () => <CustodyNetwork services={custodyService} />,
        icon: <PlayArrow />,
        children: [
          {
            label: 'Custody',
            path: '/app/network/custody',
            render: () => <CustodyNetwork services={custodyService} />,
            icon: <PlayArrow />,
            children: [],
          },
          {
            label: 'Trading',
            path: '/app/network/trading',
            render: () => <TradingNetwork services={tradingService} />,
            icon: <PlayArrow />,
            children: [],
          },
          {
            label: 'Listing',
            path: '/app/network/listing',
            render: () => <MarketNetwork listings={listings} />,
            icon: <PlayArrow />,
            children: [],
          },
        ],
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
        icon: <PlayArrow />,
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
    displayEntry: () => biddingService.length > 0,
    sidebar: [
      {
        label: 'My Auctions',
        path: '/app/distribution/bidding',
        render: () => <BiddingAuctions />,
        icon: <PlayArrow />,
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
    displayEntry: () => issuanceService.length > 0,
    sidebar: [
      {
        label: 'Instruments',
        path: '/app/instrument/instruments',
        render: () => <Instruments />,
        icon: <PublicIcon />,
        children: [],
      },
      {
        label: 'New Instruments',
        path: '/app/instrument/new',
        render: () => <InstrumentsNew />,
        icon: <PublicIcon />,
        children: [],
      },
      {
        label: 'Instrument Requests',
        path: '/app/instrument/requests',
        render: () => <InstrumentsRequests />,
        icon: <PublicIcon />,
        children: [],
      },
      {
        label: 'Issuances',
        path: '/app/issuance/issuances',
        render: () => <Issuances />,
        icon: <PublicIcon />,
        children: [],
      },
      {
        label: 'New Issuances',
        path: '/app/issuance/new',
        render: () => <IssuanceNew services={issuanceService} />,
        icon: <PublicIcon />,
        children: [],
      },
      {
        label: 'Issuance Requests',
        path: '/app/issuance/requests',
        render: () => <IssuanceRequests services={issuanceService} />,
        icon: <PublicIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      { path: '/app/registry/instruments/new/base', component: NewBaseInstrument },
      { path: '/app/registry/instruments/new/convertiblenote', component: NewConvertibleNote },
      { path: '/app/registry/instruments/new/binaryoption', component: NewBinaryOption },
      { path: '/app/registry/instruments/:contractId', component: Instrument },
    ],
  });
  entries.push({
    displayEntry: () => listingService.length > 0,
    sidebar: [
      {
        label: 'Listings',
        path: '/app/listing/listings',
        render: () => <Listings services={listingService} listings={listings} />,
        icon: <PublicIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      { path: '/app/listing/new', render: () => <ListingNew services={listingService} /> },
      {
        path: '/app/listing/requests',
        render: () => <ListingRequests services={listingService} listings={listings} />,
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
        children: listings.map(c => ({
          label: c.payload.listingId,
          path: '/app/trading/markets/' + c.contractId.replace('#', '_'),
          render: () => <Market services={tradingService} cid={c.contractId} listings={listings} />,
          icon: <ExchangeIcon />,
          children: [],
        })),
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
    <Page className="app" sideBarItems={entriesToDisplay}>
      {servicesLoading ? (
        <div>
          <CircularProgress color={'secondary'} />
        </div>
      ) : (
        <div className="app-container">
          <Switch>
            <Route exact key={'landing'} path="/app/" component={Landing} />
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
