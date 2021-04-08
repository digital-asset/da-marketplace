import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { PlayArrow } from '@material-ui/icons';
import { SidebarEntry } from '../components/Sidebar/SidebarEntry';
import { New } from '../pages/listing/New';
import { Requests } from '../pages/listing/Requests';
import { Listings } from '../pages/listing/Listings';
import Page from '../pages/page/Page';

const ListingApp = () => {
  const entries: SidebarEntry[] = [];
  // entries.push({ label: "New Listing", path: "/apps/listing/new", render: () => (<New />), icon: (<PlayArrow/>), children: [] });
  // entries.push({ label: "Requests", path: "/apps/listing/requests", render: () => (<Requests />), icon: (<PlayArrow/>), children: [] });
  // entries.push({ label: "Listings", path: "/apps/listing/listings", render: () => (<Listings />), icon: (<PlayArrow/>), children: [] });

  return (
    <Page sideBarItems={entries} menuTitle={<h1>Listing Portal</h1>}>
      <Switch>
        {entries.map(e => (
          <Route exact={true} key={e.label} path={e.path} render={e.render} />
        ))}
      </Switch>
    </Page>
  );
};

export const Listing = withRouter(ListingApp);
