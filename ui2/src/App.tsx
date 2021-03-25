import React from "react";
import { Route, Switch, withRouter, RouteProps } from "react-router-dom";
import { PlayArrow } from "@material-ui/icons";
import { SidebarEntry } from "./components/Sidebar/SidebarEntry";
import { New as CustodyNew } from "./pages/custody/New";
import { Requests as CustodyRequests } from "./pages/custody/Requests";
import { Accounts as CustodyAccounts } from "./pages/custody/Accounts";
import { Account } from "./pages/custody/Account";
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
import { Assets } from "./pages/custody/Assets";
import { New as DistributionNew } from "./pages/distribution/auction/New";
import { BiddingAuction } from "./pages/distribution/bidding/Auction";
import { Instruments } from "./pages/origination/Instruments";
import { New as InstrumentsNew } from "./pages/origination/New";
import { Requests as InstrumentsRequests } from "./pages/origination/Requests";
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
import Page from "./pages/page/Page";
import { PublicIcon } from "./icons/icons";
import { Instrument } from "./pages/origination/Instrument";
import {WalletIcon} from "./icons/icons";
import _ from "lodash";

type Entry = {
  displayEntry: () => boolean,
  sidebar: SidebarEntry[],
  additionalRoutes?: RouteProps[]
};

const AppComponent = () => {
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
    displayEntry: () => custodyService.length > 0,
    sidebar: [
      { label: "Wallet", path: "/app/custody/assets", render: () => (<Assets services={custodyService} />), icon: (<WalletIcon />), children: [] },
      // { label: "Accounts", path: "/app/custody/accounts", render: () => (<CustodyAccounts services={custodyService} />), icon: (<PlayArrow />), children: [] },
      { label: "Account Requests", path: "/app/custody/requests", render: () => (<CustodyRequests services={custodyService} />), icon: (<PlayArrow />), children: [] }
    ],
    additionalRoutes : [
      { path: "/app/custody/accounts/new", render: () => (<CustodyNew services={custodyService} />) },
      { path: "/app/custody/account/:contractId", render: () => (<Account services={custodyService} />) }
    ]
  });
  entries.push({
    displayEntry: () => true,
    sidebar: [
      {
        label: "Network", path: "/app/network/custody", render: () => (<CustodyNetwork services={custodyService} />), icon: (<PlayArrow />), children: [
          { label: "Custody", path: "/app/network/custody", render: () => (<CustodyNetwork services={custodyService} />), icon: (<PlayArrow />), children: [] },
          { label: "Trading", path: "/app/network/trading", render: () => (<TradingNetwork services={tradingService} />), icon: (<PlayArrow />), children: [] },
          { label: "Listing", path: "/app/network/listing", render: () => (<MarketNetwork listings={listings} />), icon: (<PlayArrow />), children: [] }
        ]
      }]
  });
  entries.push({
    displayEntry: () => auctionService.length > 0,
    sidebar: [
      { label: "Auctions", path: "/app/distribution/auctions", render: () => (<Auctions />), icon: (<PlayArrow />), children: [] },
      { label: "New Auction", path: "/app/distribution/new", render: () => (<DistributionNew services={auctionService} />), icon: (<PlayArrow />), children: [] },
      { label: "Auction Requests", path: "/app/distribution/requests", render: () => (<AuctionRequests services={auctionService} />), icon: (<PlayArrow />), children: [] }
    ],
    additionalRoutes : [
      { path: "/app/distribution/auctions/:contractId", render: (props) => <Auction auctionServices={auctionService} biddingServices={biddingService} {...props} />}
    ]
  });
  entries.push({ displayEntry: () => biddingService.length > 0,
    sidebar: [
      { label: "My Auctions", path: "/app/distribution/auctions", render: () => (<BiddingAuctions />), icon: (<PlayArrow />), children: [] }
    ],
    additionalRoutes : [
      { path: "/app/distribution/auction/:contractId", render: () => <BiddingAuction services={biddingService} />}
    ]
  });
  entries.push({
    displayEntry: () => issuanceService.length > 0,
    sidebar: [
      { label: "Instruments", path: "/app/instrument/instruments", render: () => (<Instruments />), icon: (<PublicIcon />), children: [] },
      { label: "New Instruments", path: "/app/instrument/new", render: () => (<InstrumentsNew />), icon: (<PublicIcon />), children: [] },
      { label: "Instrument Requests", path: "/app/instrument/requests", render: () => (<InstrumentsRequests />), icon: (<PublicIcon />), children: [] },

      { label: "Issuances", path: "/app/issuance/issuances", render: () => (<Issuances />), icon: (<PublicIcon />), children: [] },
      { label: "New Issuances", path: "/app/issuance/new", render: () => (<IssuanceNew services={issuanceService} />), icon: (<PublicIcon />), children: [] },
      { label: "Issuance Requests", path: "/app/issuance/requests", render: () => (<IssuanceRequests services={issuanceService} />), icon: (<PublicIcon />), children: [] }
    ]
  });
  entries.push({
    displayEntry: () => listingService.length > 0,
    sidebar: [
      { label: "Listings", path: "/app/listing/listings", render: () => (<Listings services={listingService} listings={listings} />), icon: (<PlayArrow />), children: [] },
      { label: "New Listings", path: "/app/listing/new", render: () => (<ListingNew services={listingService} />), icon: (<PlayArrow />), children: [] },
      { label: "Listing Requests", path: "/app/listing/requests", render: () => (<ListingRequests services={listingService} listings={listings} />), icon: (<PlayArrow />), children: [] }
    ]
  });
  entries.push({
    displayEntry: () => tradingService.length > 0,
    sidebar: [
      {
        label: "Markets", path: "/app/trading/markets", render: () => (<Markets listings={listings} />), icon: (<PlayArrow />),
        children: listings.map(c => ({ label: c.payload.listingId, path: "/app/trading/markets/" + c.contractId.replace("#", "_"), render: () => (<></>), icon: (<PlayArrow />), children: [] }))
      }],
    additionalRoutes: [
      { path: "/app/trading/markets/:contractId", render: () => <Market services={tradingService} /> }
    ]
  });

  const entriesToDisplay = entries
    .filter(e => e.displayEntry())
    .flatMap(e => e.sidebar);
  const additionRouting : RouteProps[] = _.compact(entries
    .filter(e => e.displayEntry())
    .flatMap(e => e.additionalRoutes)
  );

  const routeEntries = (sidebarEntries : SidebarEntry[]) : React.ReactElement[] => {
    const childRoutes = sidebarEntries.map(e => routeEntries(e.children)).flat();
    const routes = sidebarEntries.map(e => <Route exact={true} key={e.label} path={e.path} render={e.render} />);

    return routes.concat(childRoutes);
  };

  return (
    <Page sideBarItems={entriesToDisplay}>
       { servicesLoading ?
          <div>
            <CircularProgress color={"secondary"} />
          </div>
          :
          <div>
            <Switch>
              <Route key={"account"} path={"/app/custody/account/:contractId"} render={() => <Account services={custodyService} />} />
              <Route key={"auction"} path={"/app/distribution/auctions/:contractId"} render={(props) => <Auction auctionServices={auctionService} biddingServices={biddingService} {...props} />} />
              <Route key={"request"} path={"/app/distribution/auction/:contractId"} render={() => <BiddingAuction services={biddingService} />} />
              <Route key={"instruments"} path={"/app/registry/instruments/:contractId"} component={Instrument}/>
              <Route key={"market"} path={"/app/trading/markets/:contractId"} render={() => <Market services={tradingService} />} />
              { routeEntries(entriesToDisplay) }
              { additionRouting.map(routeProps =>
                <Route {...routeProps} />
              )}
            </Switch>
          </div>
        }
    </Page>
  );
}

export const App = withRouter(AppComponent);
