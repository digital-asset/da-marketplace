import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import { PlayArrow } from "@material-ui/icons";
import useStyles from "./styles";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { useLayoutState } from "../context/LayoutContext";
import { SidebarEntry } from "../components/Sidebar/SidebarEntry";
import { Market } from "../pages/trading/Market";
import { Markets } from "../pages/trading/Markets";
import { useStreamQueries } from "@daml/react";
import { Listing } from "@daml.js/da-marketplace/lib/Marketplace/Listing";

const TradingApp = () => {
  const classes = useStyles();
  const layoutState = useLayoutState();

  const listings = useStreamQueries(Listing).contracts;
  const marketEntries = listings.map(c => ({ label: c.payload.listingId, path: "/apps/trading/markets/" + c.contractId.replace("#", "_"), render: () => (<></>), icon: (<PlayArrow/>), children: [] }));
  const entries : SidebarEntry[] = [];
  entries.push({ label: "Markets", path: "/apps/trading/markets", render: () => (<Markets />), icon: (<PlayArrow/>), children: marketEntries });

  return (
    <div className={classes.root}>
      <>
        <Header app="Trading Portal" />
        <Sidebar entries={entries} />
        <div className={classnames(classes.content, { [classes.contentShift]: layoutState.isSidebarOpened })}>
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route key={"market"} path={"/apps/trading/markets/:contractId"} component={Market} />
            {entries.map(e => 
              <Route exact={true} key={e.label} path={e.path} render={e.render} />
            )}
          </Switch>
        </div>
      </>
    </div>
  );
}

export const Trading = withRouter(TradingApp);
