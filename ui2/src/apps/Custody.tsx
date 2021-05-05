import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {SidebarEntry} from '../components/Sidebar/SidebarEntry';
import {Account} from '../pages/custody/Account';
import Page from '../pages/page/Page';

const CustodyApp = () => {
  const entries: SidebarEntry[] = [];
  // entries.push({ label: "New Account", path: "/apps/custody/accounts/new", render: () => (<New />), icon: (<PlayArrow/>), children: [] });
  // entries.push({ label: "Accounts", path: "/apps/custody/accounts", render: () => (<Accounts />), icon: (<PlayArrow/>), children: [] });
  // entries.push({ label: "Requests", path: "/apps/custody/requests", render: () => (<Requests />), icon: (<PlayArrow/>), children: [] });

  return (
    <Page sideBarItems={entries} menuTitle={<h1>Custody Portal</h1>}>
      <Switch>
        <Route key={'account'} path={'/apps/custody/account/:contractId'} component={Account} />
        {entries.map(e => (
          <Route exact={true} key={e.label} path={e.path} render={e.render} />
        ))}
      </Switch>
    </Page>
  );
};

export const Custody = withRouter(CustodyApp);
