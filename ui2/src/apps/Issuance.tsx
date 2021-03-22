import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import { PlayArrow } from "@material-ui/icons";
import useStyles from "./styles";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { useLayoutState } from "../context/LayoutContext";
import { SidebarEntry } from "../components/Sidebar/SidebarEntry";
import { New } from "../pages/issuance/New";
import { Requests } from "../pages/issuance/Requests";
import { Issuances } from "../pages/issuance/Issuances";

const IssuanceApp = () => {
  const classes = useStyles();
  const layoutState = useLayoutState();

  const entries : SidebarEntry[] = [];
  // entries.push({ label: "New Issuance", path: "/apps/issuance/new", render: () => (<New />), icon: (<PlayArrow/>), children: [] });
  // entries.push({ label: "Requests", path: "/apps/issuance/requests", render: () => (<Requests />), icon: (<PlayArrow/>), children: [] });
  entries.push({ label: "Issuances", path: "/apps/issuance/issuances", render: () => (<Issuances />), icon: (<PlayArrow/>), children: [] });

  return (
    <div className={classes.root}>
      <>
        <Header app="Issuance" />
        <Sidebar entries={entries} />
        <div className={classnames(classes.content, { [classes.contentShift]: layoutState.isSidebarOpened })}>
          <div className={classes.fakeToolbar} />
          <Switch>
            {entries.map(e =>
              <Route exact={true} key={e.label} path={e.path} render={e.render} />
            )}
          </Switch>
        </div>
      </>
    </div>
  );
}

export const Issuance = withRouter(IssuanceApp);
