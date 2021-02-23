import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
import { PlayArrow } from "@material-ui/icons";
import useStyles from "./styles";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { useLayoutState } from "../context/LayoutContext";
import { SidebarEntry } from "../components/Sidebar/SidebarEntry";
import { New } from "../pages/custody/New";
import { Requests } from "../pages/custody/Requests";
import { Accounts } from "../pages/custody/Accounts";
import { BottomDrawer } from "../components/BottomDrawer/BottomDrawer";

const CustodyApp = () => {
  const classes = useStyles();
  const layoutState = useLayoutState();

  const entries : SidebarEntry[] = [];
  entries.push({ label: "New Account", path: "/apps/custody/accounts/new", render: () => (<New />), icon: (<PlayArrow/>), children: [] });
  entries.push({ label: "Accounts", path: "/apps/custody/accounts", render: () => (<Accounts />), icon: (<PlayArrow/>), children: [] });
  entries.push({ label: "Requests", path: "/apps/custody/requests", render: () => (<Requests />), icon: (<PlayArrow/>), children: [] });

  return (
    <div className={classes.root}>
      <>
        <Header app="Custody Portal" />
        <Sidebar entries={entries} />
        <div className={classnames(classes.content, { [classes.contentShift]: layoutState.isSidebarOpened })}>
          <div className={classes.fakeToolbar} />
          <Switch>
            {/* <Route key={"product"} path={"/apps/policyadmin/products/:contractId"} component={Product} />
            <Route key={"request"} path={"/apps/policyadmin/requests/:contractId"} component={Request} />
            <Route key={"applications"} path={"/apps/policyadmin/applications/:contractId"} component={Application} />
            <Route key={"policy"} path={"/apps/policyadmin/policies/:contractId"} component={Policy} />
            <Route key={"invoice"} path={"/apps/policyadmin/invoices/:contractId"} component={Invoice} />
            <Route key={"myrequest"} path={"/apps/policyadmin/myrequests/:contractId"} component={MyRequest} />
            <Route key={"myquote"} path={"/apps/policyadmin/myquotes/:contractId"} component={MyQuote} />
            <Route key={"mypolicy"} path={"/apps/policyadmin/mypolicies/:contractId"} component={MyPolicy} />
            <Route key={"myinvoice"} path={"/apps/policyadmin/myinvoices/:contractId"} component={MyInvoice} /> */}
            {entries.map(e => 
              <Route exact={true} key={e.label} path={e.path} render={e.render} />
            )}
          </Switch>
          <BottomDrawer />
        </div>
      </>
    </div>
  );
}

export const Custody = withRouter(CustodyApp);
