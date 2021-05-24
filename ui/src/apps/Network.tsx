import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { SidebarEntry } from '../components/Sidebar/SidebarEntry';
import Page from '../pages/page/Page';

const NetworkApp = () => {
  const entries: SidebarEntry[] = [];
  // entries.push({ label: "Overview", path: "/apps/network/overview", render: () => (<Overview />), icon: (<PlayArrow/>), children: [] });
  // entries.push({ label: "Custody", path: "/apps/network/custody", render: () => (<Custody />), icon: (<PlayArrow/>), children: [] });
  // entries.push({ label: "Trading", path: "/apps/network/trading", render: () => (<Trading />), icon: (<PlayArrow/>), children: [] });
  // entries.push({ label: "Listing", path: "/apps/network/listing", render: () => (<Listing />), icon: (<PlayArrow/>), children: [] });

  return (
    <Page sideBarItems={entries} menuTitle={<h1>Network Portal</h1>}>
      <Switch>
        {entries.map(e => (
          <Route exact={true} key={e.label} path={e.path} render={e.render} />
        ))}
      </Switch>
    </Page>
  );
};

export const Network = withRouter(NetworkApp);
