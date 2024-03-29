import _ from 'lodash';
import React from 'react';
import { Route, RouteProps, Switch, useLocation, withRouter } from 'react-router-dom';
import { Header, Loader } from 'semantic-ui-react';

import { useParty } from '@daml/react';

import { Role as ClearingRole } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import { Service as ClearingService } from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Service/';
import { Role as CustodyRole } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Service as CustodyService } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Service/';
import { Service as AuctionService } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service/';
import { Service as BiddingService } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service/';
import { Service as IssuanceService } from '@daml.js/da-marketplace/lib/Marketplace/Issuance/Service/';
import { Listing } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import { Service as ListingService } from '@daml.js/da-marketplace/lib/Marketplace/Listing/Service/';
import { FeeSchedule } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Model';
import { Service as TradingService } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Service/';

import { useStreamQueries } from './Main';
import { SidebarEntry } from './components/Sidebar/SidebarEntry';
import { ServiceKind } from './context/ServicesContext';
import { ControlsIcon, ExchangeIcon, MegaphoneIcon, OrdersIcon, WalletIcon } from './icons/icons';
import { ClearingMember } from './pages/clearing/Member';
import { ClearingMembers } from './pages/clearing/Members';
import Assets from './pages/custody/Assets';
import { Auction } from './pages/distribution/auction/Auction';
import { Auctions } from './pages/distribution/auction/Auctions';
import { New as NewAuction } from './pages/distribution/auction/New';
import { BiddingAuction } from './pages/distribution/bidding/Auction';
import { BiddingAuctions } from './pages/distribution/bidding/Auctions';
import { ServiceRequired } from './pages/error/ServiceRequired';
import RequestIdentityVerification from './pages/identity/Request';
import { IssuancesTable } from './pages/issuance/Issuances';
import { New as IssuanceNew } from './pages/issuance/New';
import Landing from './pages/landing/Landing';
import { ListingsTable } from './pages/listing/Listings';
import { New as ListingNew } from './pages/listing/New';
import { ClearingServiceTable } from './pages/network/Clearing';
import { CustodyServiceTable } from './pages/network/Custody';
import { DistributionServiceTable } from './pages/network/Distribution';
import { TradingServiceTable } from './pages/network/Trading';
import Notifications, { useAllNotifications } from './pages/notifications/Notifications';
import { Instrument } from './pages/origination/Instrument';
import { InstrumentsTable } from './pages/origination/Instruments';
import { NewBaseInstrument } from './pages/origination/NewBaseInstrument';
import { NewBinaryOption } from './pages/origination/NewBinaryOption';
import { NewConvertibleNote } from './pages/origination/NewConvertibleNote';
import { NewSimpleFuture } from './pages/origination/NewSimpleFuture';
import Page from './pages/page/Page';
import Offer from './pages/setup/Offer';
import { Market } from './pages/trading/Market';
import { Markets } from './pages/trading/Markets';
import { TradingOrder } from './pages/trading/Order';
import paths from './paths';

type Entry = {
  displayEntry: () => boolean;
  sidebar: SidebarEntry[];
  additionalRoutes?: RouteProps[];
};

const AppComponent = () => {
  const party = useParty();

  const { contracts: custodyService, loading: custodyLoading } = useStreamQueries(CustodyService);
  const { contracts: clearingService, loading: clearingLoading } =
    useStreamQueries(ClearingService);
  const { contracts: auctionService, loading: auctionLoading } = useStreamQueries(AuctionService);
  const { contracts: biddingService, loading: biddingLoading } = useStreamQueries(BiddingService);
  const { contracts: issuanceService, loading: issuanceLoading } =
    useStreamQueries(IssuanceService);
  const { contracts: listingService, loading: listingLoading } = useStreamQueries(ListingService);
  const { contracts: tradingService, loading: tradingLoading } = useStreamQueries(TradingService);
  const { contracts: listings, loading: listingsLoading } = useStreamQueries(Listing);
  const { contracts: clearingRole, loading: clearingRoleLoading } = useStreamQueries(ClearingRole);
  const { contracts: custodyRole, loading: custodyRoleLoading } = useStreamQueries(CustodyRole);

  const servicesLoading: boolean = [
    custodyLoading,
    clearingLoading,
    auctionLoading,
    biddingLoading,
    issuanceLoading,
    listingLoading,
    tradingLoading,
    listingsLoading,
    clearingRoleLoading,
    custodyRoleLoading,
  ].every(s => s);

  const entries: Entry[] = [];
  entries.push({
    displayEntry: () => custodyService.length > 0,
    sidebar: [
      {
        label: 'Wallet',
        path: paths.app.wallet.root,
        render: () => <Assets services={custodyService} />,
        icon: <WalletIcon />,
        children: [],
      },
    ],
  });

  const clearingProvider = clearingService.filter(cs => cs.payload.provider === party);
  entries.push({
    displayEntry: () => clearingProvider.length > 0,
    sidebar: [
      {
        label: 'Clearing Members',
        path: paths.app.clearingMembers.root,
        activeSubroutes: true,
        render: () => <ClearingMembers services={clearingProvider} />,
        icon: <WalletIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: paths.app.clearingMembers.member + '/:contractId',
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
        path: paths.app.clearing.member,
        render: () => <ClearingMember services={clearingProvider} member />,
        icon: <WalletIcon />,
        children: [],
      },
    ],
  });

  entries.push({
    displayEntry: () => !!clearingRole.find(c => c.payload.provider === party),
    sidebar: [
      {
        label: 'Clearing Services',
        activeSubroutes: true,
        path: paths.app.clearingServices.root,
        render: () => <ClearingServiceTable services={clearingService} />,
        icon: <ControlsIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: paths.app.clearingServices.offer,
        render: () => <Offer service={ServiceKind.CLEARING} />,
      },
      {
        path: paths.app.clearingServices.market.offer,
        render: () => <Offer service={ServiceKind.MARKET_CLEARING} />,
      },
    ],
  });

  entries.push({
    displayEntry: () => !!custodyRole.find(p => p.payload.provider === party),
    sidebar: [
      {
        label: 'Custody Services',
        activeSubroutes: true,
        path: paths.app.custody.root,
        render: () => <CustodyServiceTable services={custodyService} />,
        icon: <ControlsIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: paths.app.custody.offer,
        render: () => <Offer service={ServiceKind.CUSTODY} />,
      },
    ],
  });

  const auctionCustomer = auctionService.filter(cs => cs.payload.customer === party);
  entries.push({
    displayEntry: () => auctionCustomer.length > 0,
    sidebar: [
      {
        label: 'Distributions',
        path: paths.app.distributions,
        render: () => (
          <>
            <Auctions />
            <DistributionServiceTable />
          </>
        ),
        icon: <ControlsIcon />,
        children: [],
      },
    ],
  });

  entries.push({
    displayEntry: () => true,
    sidebar: [
      {
        label: 'Instruments',
        activeSubroutes: true,
        path: paths.app.instruments.root,
        render: () => <InstrumentsTable />,
        icon: <ControlsIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: paths.app.instruments.instrument + '/:contractId',
        component: Instrument,
      },
      {
        path: paths.app.instruments.new.base,
        render: () => (
          <ServiceRequired
            service={ServiceKind.ISSUANCE}
            action="New Base Instrument"
            services={custodyService}
          >
            <NewBaseInstrument
              custodyServices={custodyService}
              issuanceServices={issuanceService}
            />
          </ServiceRequired>
        ),
      },
      {
        path: paths.app.instruments.new.convertiblenote,
        render: () => (
          <ServiceRequired
            service={ServiceKind.ISSUANCE}
            action="New Convertible Note"
            services={custodyService}
          >
            <NewConvertibleNote services={custodyService} />
          </ServiceRequired>
        ),
      },
      {
        path: paths.app.instruments.new.binaryoption,
        render: () => (
          <ServiceRequired
            service={ServiceKind.ISSUANCE}
            action="New Binary Option"
            services={custodyService}
          >
            <NewBinaryOption services={custodyService} />
          </ServiceRequired>
        ),
      },
      {
        path: paths.app.instruments.new.simplefuture,
        render: () => (
          <ServiceRequired
            service={ServiceKind.ISSUANCE}
            action="New Simple Future"
            services={custodyService}
          >
            <NewSimpleFuture services={custodyService} />
          </ServiceRequired>
        ),
      },
    ],
  });

  const issuanceCustomer = issuanceService.filter(cs => cs.payload.customer === party);

  entries.push({
    displayEntry: () => issuanceCustomer.length > 0,
    sidebar: [
      {
        label: 'Issuance',
        activeSubroutes: true,
        path: paths.app.issuance.root,
        render: () => <IssuancesTable />,
        icon: <ControlsIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: paths.app.issuance.new,
        render: () => (
          <ServiceRequired
            service={ServiceKind.ISSUANCE}
            action="New Issuance"
            services={custodyService}
          >
            <IssuanceNew issuanceServices={issuanceService} custodyServices={custodyService} />
          </ServiceRequired>
        ),
      },
    ],
  });
  entries.push({
    displayEntry: () =>
      !!tradingService.find(c => c.payload.provider === party || c.payload.customer === party),
    sidebar: [
      {
        label: 'Trading',
        path: paths.app.trading,
        render: () => (
          <TradingServiceTable tradingServices={tradingService} custodyServices={custodyService} />
        ),
        icon: <ControlsIcon />,
        children: [],
      },
    ],
  });

  entries.push({
    displayEntry: () => true,
    sidebar: [
      {
        label: 'Listings',
        path: paths.app.listings.root,
        activeSubroutes: true,
        render: () => <ListingsTable services={listingService} listings={listings} />,
        icon: <ControlsIcon />,
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: paths.app.listings.new,
        render: () => (
          <ServiceRequired
            service={ServiceKind.LISTING}
            action="New Listing"
            services={custodyService}
          >
            <ListingNew services={listingService} />
          </ServiceRequired>
        ),
      },
      {
        path: paths.app.listings.root + '/:contractId?',
        render: () => <ListingsTable services={listingService} listings={listings} />,
      },
    ],
  });

  const allNotifications = useAllNotifications(party);

  entries.push({
    displayEntry: () => true,
    sidebar: [],
    additionalRoutes: [
      {
        path: paths.app.notifications,
        render: () => <Notifications notifications={allNotifications} />,
      },
      {
        path: paths.app.identity,
        render: () => <RequestIdentityVerification />,
      },
    ],
  });

  entries.push({
    displayEntry: () => auctionService.length > 0,
    sidebar: [
      {
        label: 'Auctions',
        path: paths.app.auctions.root,
        activeSubroutes: true,
        render: () => <Auctions />,
        icon: <MegaphoneIcon />,
        groupBy: 'Primary Market',
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: paths.app.auctions.new,
        render: () => (
          <ServiceRequired
            service={ServiceKind.AUCTION}
            action="New Auction"
            services={custodyService}
          >
            <NewAuction auctionServices={auctionService} custodyServices={custodyService} />
          </ServiceRequired>
        ),
      },

      {
        path: paths.app.auctions.root + '/:contractId',
        render: (props: any) => (
          <Auction auctionServices={auctionService} biddingServices={biddingService} {...props} />
        ),
      },
    ],
  });

  const { contracts: feeSchedules } = useStreamQueries(FeeSchedule);
  entries.push({
    displayEntry: () => tradingService.length > 0,
    sidebar: [
      {
        label: 'Markets',
        path: paths.app.markets.root,
        activeSubroutes: true,
        render: () => <Markets listings={listings} />,
        icon: <OrdersIcon />,
        groupBy: 'Secondary Market',
        children: listings.map(c => ({
          label: c.payload.listingId,
          path: paths.app.markets.root + '/' + c.contractId.replace('#', '_'),
          render: () => (
            <Market
              tradingServices={tradingService}
              custodyServices={custodyService}
              cid={c.contractId}
              listings={listings}
              feeSchedules={feeSchedules}
            />
          ),
          icon: <ExchangeIcon />,
          children: [],
        })),
      },
    ],
    additionalRoutes: [
      {
        path: paths.app.markets.order + '/:contractId',
        render: () => <TradingOrder listings={listings} services={tradingService} />,
      },
      {
        path: paths.app.markets.offer,
        render: () => <Offer service={ServiceKind.TRADING} />,
      },
    ],
  });

  entries.push({
    displayEntry: () => biddingService.filter(b => b.payload.customer === party).length > 0,
    sidebar: [
      {
        label: 'Bidding Auctions',
        path: paths.app.biddingAuctions,
        render: () => <BiddingAuctions />,
        activeSubroutes: true,
        icon: <MegaphoneIcon />,
        groupBy: 'Primary Market',
        children: [],
      },
    ],
    additionalRoutes: [
      {
        path: paths.app.biddingAuctions + '/:contractId',
        render: () => (
          <BiddingAuction biddingServices={biddingService} custodyServices={custodyService} />
        ),
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

  const path = useLocation().pathname;
  const currentEntry = entriesToDisplay.find(entry => path.startsWith(getBaseSegment(entry.path)));

  return (
    <Page
      sideBarItems={entriesToDisplay}
      menuTitle={
        currentEntry && (
          <Header className="bold icon-header" as="h1">
            <span className="icon-wrapper">{currentEntry.icon}</span>
            {currentEntry.label}
          </Header>
        )
      }
      topMenuButtons={currentEntry && currentEntry.topMenuButtons}
    >
      {servicesLoading ? (
        <div className="page-loading">
          <Loader active size="large">
            <p>Loading...</p>
          </Loader>
        </div>
      ) : (
        <div>
          <Switch>
            <Route
              exact
              path={paths.app.root}
              render={() => <Landing services={custodyService} />}
            />
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

export function getBaseSegment(segment: string) {
  return [segment.split('/')[0], segment.split('/')[1], segment.split('/')[2]].join('/');
}

export const App = withRouter(AppComponent);
