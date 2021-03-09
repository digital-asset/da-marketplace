import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import { PlayArrow } from "@material-ui/icons";
import useStyles from "./styles";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { useLayoutState } from "../context/LayoutContext";
import { SidebarEntry } from "../components/Sidebar/SidebarEntry";
import { Requests } from "../pages/structuring/Requests";
import { Instruments } from "../pages/structuring/Instruments";
import { Instrument } from "../pages/structuring/Instrument";
import { New } from "../pages/structuring/New";
import { NewBinaryOption } from "../pages/structuring/NewBinaryOption";
import { NewConvertibleNote } from "../pages/structuring/NewConvertibleNote";

const StructuringApp = () => {
  const classes = useStyles();
  const layoutState = useLayoutState();

  const entries : SidebarEntry[] = [];
  entries.push({ label: "New Instrument", path: "/apps/structuring/instruments/new", render: () => (<New />), icon: (<PlayArrow/>), children: [
    { label: "Binary Option", path: "/apps/structuring/instruments/new/binaryoption", render: () => (<NewBinaryOption />), icon: (<PlayArrow/>), children: [] },
    { label: "Convertible Note", path: "/apps/structuring/instruments/new/convertiblenote", render: () => (<NewConvertibleNote />), icon: (<PlayArrow/>), children: [] }
  ] });
  entries.push({ label: "Instruments", path: "/apps/structuring/instruments", render: () => (<Instruments />), icon: (<PlayArrow/>), children: [] });
  entries.push({ label: "Requests", path: "/apps/structuring/requests", render: () => (<Requests />), icon: (<PlayArrow/>), children: [] });

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
            <Route key={"newconvertiblenote"} path={"/apps/structuring/instruments/new/convertiblenote"} component={NewConvertibleNote} />
            <Route key={"newbinaryoption"} path={"/apps/structuring/instruments/new/binaryoption"} component={NewBinaryOption} />
            <Route key={"instrument"} path={"/apps/structuring/instruments/:contractId"} component={Instrument} />
          </Switch>
        </div>
      </>
    </div>
  );
}

export const Structuring = withRouter(StructuringApp);
