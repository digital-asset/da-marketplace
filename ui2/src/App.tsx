import React from "react";
import { makeStyles, createStyles } from "@material-ui/styles";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import { PlayArrow } from "@material-ui/icons";
import Sidebar from "./components/Sidebar/Sidebar";
import { useLayoutState } from "./context/LayoutContext";
import { SidebarEntry } from "./components/Sidebar/SidebarEntry";
import { New as CustodyNew } from "./pages/custody/New";
import { Requests as CustodyRequests } from "./pages/custody/Requests";
import { Accounts as CustodyAccounts } from "./pages/custody/Accounts";
import { Account } from "./pages/custody/Account";
import Header from "./components/Header/Header";
import { useStreamQueries } from "@daml/react";
import { Service as CustodyService } from "@daml.js/da-marketplace/lib/Marketplace/Custody/Service/module";
import { Service as AuctionService } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service/module";
import { Service as BiddingService } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Service/module";
import { Service as IssuanceService } from "@daml.js/da-marketplace/lib/Marketplace/Issuance/Service/module";
import { Service as ListingService } from "@daml.js/da-marketplace/lib/Marketplace/Listing/Service/module";
import { Service as TradingService } from "@daml.js/da-marketplace/lib/Marketplace/Trading/Service/module";
import { CircularProgress } from "@material-ui/core";
import { Auctions } from "./pages/distribution/auction/Auctions";
import { Requests as AuctionRequests } from "./pages/distribution/auction/Requests";
import { Assets } from "./pages/distribution/Assets";
import { New as DistributionNew } from "./pages/distribution/auction/New";
import { BiddingAuction } from "./pages/distribution/bidding/Auction";
import { Issuances } from "./pages/issuance/Issuances";
import { New as IssuanceNew } from "./pages/issuance/New";
import { Requests as IssuanceRequests } from "./pages/issuance/Requests";
import { New as ListingNew } from "./pages/listing/New";
import { Requests as ListingRequests } from "./pages/listing/Requests";
import { Listings } from "./pages/listing/Listings";
import { Auction } from "./pages/distribution/auction/Auction";
import { Market } from "./pages/trading/Market";
import { Listing } from "@daml.js/da-marketplace/lib/Marketplace/Listing/Model";
import { Markets, Markets as MarketNetwork } from "./pages/trading/Markets";
import { Custody as CustodyNetwork } from "./pages/network/Custody";
import { Trading as TradingNetwork } from "./pages/network/Trading";
import { BiddingAuctions } from "./pages/distribution/bidding/Auctions";

type Entry = {
  displayEntry: () => boolean,
  sidebar: SidebarEntry[]
};

const AppComponent = () => {
  const classes = useStyles();
  const layoutState = useLayoutState();

  const { contracts: custodyService, loading: custodyLoading } = useStreamQueries(CustodyService);
  const { contracts: auctionService, loading: auctionLoading } = useStreamQueries(AuctionService);
  const { contracts: biddingService, loading: biddingLoading } = useStreamQueries(BiddingService);
  const { contracts: issuanceService, loading: issuanceLoading } = useStreamQueries(IssuanceService);
  const { contracts: listingService, loading: listingLoading } = useStreamQueries(ListingService);
  const { contracts: tradingService, loading: tradingLoading } = useStreamQueries(TradingService);
  const { contracts: listings, loading: listingsLoading } = useStreamQueries(Listing);

  const servicesLoading: boolean = [custodyLoading, auctionLoading, biddingLoading, issuanceLoading, listingLoading, tradingLoading, listingsLoading].every(s => s);

  const entries: Entry[] = [];
  entries.push({
    displayEntry: () => true,
    sidebar: [
      { label: "Wallets", path: "/app/distribution/assets", render: () => (<Assets />), icon: (<PlayArrow />), children: [] },
      {
        label: "Network", path: "/app/network/custody", render: () => (<CustodyNetwork services={custodyService} />), icon: (<PlayArrow />), children: [
          { label: "Custody", path: "/app/network/custody", render: () => (<CustodyNetwork services={custodyService} />), icon: (<PlayArrow />), children: [] },
          { label: "Trading", path: "/app/network/trading", render: () => (<TradingNetwork services={tradingService} />), icon: (<PlayArrow />), children: [] },
          { label: "Listing", path: "/app/network/listing", render: () => (<MarketNetwork listings={listings} />), icon: (<PlayArrow />), children: [] }
        ]
      }]
  });
  entries.push({
    displayEntry: () => custodyService.length > 0,
    sidebar: [
      { label: "New Account", path: "/app/custody/accounts/new", render: () => (<CustodyNew services={custodyService} />), icon: (<PlayArrow />), children: [] },
      { label: "Accounts", path: "/app/custody/accounts", render: () => (<CustodyAccounts services={custodyService} />), icon: (<PlayArrow />), children: [] },
      { label: "Account Requests", path: "/app/custody/requests", render: () => (<CustodyRequests services={custodyService} />), icon: (<PlayArrow />), children: [] }
    ]
  });
  entries.push({
    displayEntry: () => auctionService.length > 0,
    sidebar: [
      { label: "Auctions", path: "/app/distribution/auctions", render: () => (<Auctions />), icon: (<PlayArrow />), children: [] },
      { label: "New Auction", path: "/app/distribution/new", render: () => (<DistributionNew services={auctionService} />), icon: (<PlayArrow />), children: [] },
      { label: "Auction Requests", path: "/app/distribution/requests", render: () => (<AuctionRequests services={auctionService} />), icon: (<PlayArrow />), children: [] }
    ]
  });
  entries.push({ displayEntry: () => biddingService.length > 0, sidebar: [{ label: "My Auctions", path: "/app/distribution/auctions", render: () => (<BiddingAuctions />), icon: (<PlayArrow />), children: [] }] });
  entries.push({
    displayEntry: () => issuanceService.length > 0,
    sidebar: [
      { label: "Issuances", path: "/app/issuance/issuances", render: () => (<Issuances />), icon: (<PlayArrow />), children: [] },
      { label: "New Issuances", path: "/app/issuance/new", render: () => (<IssuanceNew services={issuanceService} />), icon: (<PlayArrow />), children: [] },
      { label: "Issuance Requests", path: "/app/issuance/requests", render: () => (<IssuanceRequests services={issuanceService} />), icon: (<PlayArrow />), children: [] }
    ]
  });
  entries.push({
    displayEntry: () => listingService.length > 0,
    sidebar: [
      { label: "Listings", path: "/app/listing/listings", render: () => (<Listings services={listingService} listings={listings} />), icon: (<PlayArrow />), children: [] },
      { label: "New Listings", path: "/app/listing/new", render: () => (<ListingNew services={listingService} />), icon: (<PlayArrow />), children: [] }
    ]
  });
  entries.push({ displayEntry: () => listingService.length > 0, sidebar: [{ label: "Listing Requests", path: "/app/listing/requests", render: () => (<ListingRequests services={listingService} listings={listings} />), icon: (<PlayArrow />), children: [] }] });
  entries.push({
    displayEntry: () => tradingService.length > 0,
    sidebar: [
      {
        label: "Markets", path: "/app/trading/markets", render: () => (<Markets listings={listings} />), icon: (<PlayArrow />),
        children: listings.map(c => ({ label: c.payload.listingId, path: "/app/trading/markets/" + c.contractId.replace("#", "_"), render: () => (<></>), icon: (<PlayArrow />), children: [] }))
      }]
  });

  const entriesToDisplay = entries.filter(e => e.displayEntry()).flatMap(e => e.sidebar);

  const routeEntries = (sidebarEntries : SidebarEntry[]) : React.ReactElement[] => {
    const childRoutes = sidebarEntries.map(e => routeEntries(e.children)).flat();
    const routes = sidebarEntries.map(e => <Route exact={true} key={e.label} path={e.path} render={e.render} />);

    return routes.concat(childRoutes);
  };

  return (
    <div className={classes.root}>
      <>
        <Header app="" />
        { servicesLoading ?
          <div className={classes.progress}>
            <CircularProgress color={"secondary"} />
          </div>
          :
          <>
            <Sidebar entries={entriesToDisplay} />
            <div className={classnames(classes.content, { [classes.contentShift]: layoutState.isSidebarOpened })}>
              <div className={classes.fakeToolbar} />
              <Switch>
                <Route key={"account"} path={"/app/custody/account/:contractId"} render={() => <Account services={custodyService} />} />
                <Route key={"auction"} path={"/app/distribution/auctions/:contractId"} render={(props) => <Auction auctionServices={auctionService} biddingServices={biddingService} {...props} />} />
                <Route key={"request"} path={"/app/distribution/auction/:contractId"} render={() => <BiddingAuction services={biddingService} />} />
                <Route key={"market"} path={"/app/trading/markets/:contractId"} render={() => <Market services={tradingService} />} />
                { routeEntries(entriesToDisplay) }
              </Switch>
            </div>
          </>
        }
      </>
    </div>
  );
}

const useStyles = makeStyles((theme: any) => createStyles({
  root: {
    display: "flex",
    maxWidth: "100vw",
    overflowX: "hidden",
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(3),
    width: `calc(100vw - 240px)`,
    minHeight: "100vh",
  },
  contentShift: {
    width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  fakeToolbar: {
    ...theme.mixins.toolbar,
  },
  progress: {
    display: 'flex',
    paddingLeft: `calc(100vw / 2)`,
    paddingTop: `calc(100vh / 2)`,
  }
}));

export const App = withRouter(AppComponent);
