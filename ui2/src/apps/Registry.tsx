import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import { PlayArrow } from "@material-ui/icons";
import useStyles from "./styles";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { useLayoutState } from "../context/LayoutContext";
import { SidebarEntry } from "../components/Sidebar/SidebarEntry";
import { Instruments } from "../pages/registry/Instruments";
import { Instrument } from "../pages/registry/Instrument";

const RegistryApp = () => {
  const classes = useStyles();
  const layoutState = useLayoutState();

  const entries : SidebarEntry[] = [];
  // entries.push({ label: "New Instrument", path: "/apps/registry/new", render: () => (<New />), icon: (<PlayArrow/>), children: [] });
  // entries.push({ label: "Requests", path: "/apps/registry/requests", render: () => (<Requests />), icon: (<PlayArrow/>), children: [] });
  entries.push({ label: "Instruments", path: "/apps/registry/instruments", render: () => (<Instruments />), icon: (<PlayArrow/>), children: [] });

  return (
    <div className={classes.root}>
      <>
        <Header app="Issuance" />
        <Sidebar entries={entries} />
        <div className={classnames(classes.content, { [classes.contentShift]: layoutState.isSidebarOpened })}>
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route key={"instrument"} path={"/apps/registry/instruments/:contractId"} component={Instrument} />
            {entries.map(e => 
              <Route exact={true} key={e.label} path={e.path} render={e.render} />
            )}
          </Switch>
        </div>
      </>
    </div>
  );
}

export const Registry = withRouter(RegistryApp);
