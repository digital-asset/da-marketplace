import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import { PlayArrow } from "@material-ui/icons";
import useStyles from "./styles";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { useLayoutState } from "../context/LayoutContext";
import { SidebarEntry } from "../components/Sidebar/SidebarEntry";
import { BiddingAuctions } from "../pages/distribution/bidding/Auctions";
import { Auctions } from "../pages/distribution/auction/Auctions";
import { Auction } from "../pages/distribution/auction/Auction";
import { New } from "../pages/distribution/auction/New";
import { useParty, useStreamQueries } from "@daml/react";
import { Service } from "@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service";
import { Requests } from "../pages/distribution/auction/Requests";
import { Assets } from "../pages/distribution/Assets";
import { BiddingAuction } from "../pages/distribution/bidding/Auction";

const DistributionApp = () => {
  const classes = useStyles();
  const layoutState = useLayoutState();

  const party = useParty();
  const services = useStreamQueries(Service).contracts;
  const providerServices = services.filter(c => c.payload.provider === party);
  const customerServices = services.filter(c => c.payload.customer === party);
  const isAgent = providerServices.length > 0;
  const isIssuer = customerServices.length > 0;

  const entries : SidebarEntry[] = [];
  entries.push({ label: "Assets", path: "/apps/distribution/assets", render: () => (<Assets />), icon: (<PlayArrow/>), children: [] });
  if (isAgent) {
    entries.push({ label: "Auctions", path: "/apps/distribution/auctions", render: () => (<Auctions />), icon: (<PlayArrow/>), children: [] });
    // entries.push({ label: "Requests", path: "/apps/distribution/requests", render: () => (<Requests />), icon: (<PlayArrow/>), children: [] });
  } else if (isIssuer) {
    // entries.push({ label: "New Auction", path: "/apps/distribution/new"     , render: () => (<New />)     , icon: (<PlayArrow/>), children: [] });
    entries.push({ label: "Auctions"   , path: "/apps/distribution/auctions", render: () => (<Auctions />), icon: (<PlayArrow/>), children: [] });
    // entries.push({ label: "Requests"   , path: "/apps/distribution/requests", render: () => (<Requests />), icon: (<PlayArrow/>), children: [] });
  } else {
    entries.push({ label: "Auctions", path: "/apps/distribution/auctions", render: () => (<BiddingAuctions />), icon: (<PlayArrow/>), children: [] });
  }

  return (
    <div className={classes.root}>
      <>
        <Header app="Distribution Portal" />
        <Sidebar entries={entries} />
        <div className={classnames(classes.content, { [classes.contentShift]: layoutState.isSidebarOpened })}>
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route key={"auction"} path={"/apps/distribution/auctions/:contractId"} component={Auction} />
            <Route key={"request"} path={"/apps/distribution/auction/:contractId"} component={BiddingAuction} />
            {entries.map(e =>
              <Route key={e.label} path={e.path} exact={true} render={e.render} />
            )}
          </Switch>
        </div>
      </>
    </div>
  );
}

export const Distribution = withRouter(DistributionApp);
