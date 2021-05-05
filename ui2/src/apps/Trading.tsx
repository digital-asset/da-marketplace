import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {PlayArrow} from '@material-ui/icons';
import {SidebarEntry} from '../components/Sidebar/SidebarEntry';
import {Market} from '../pages/trading/Market';
import {useStreamQueries} from '../Main';
import {Listing} from '@daml.js/da-marketplace/lib/Marketplace/Listing/Model';
import Page from '../pages/page/Page';

const TradingApp = () => {
  const listings = useStreamQueries(Listing).contracts;
  const marketEntries = listings.map(c => ({
    label: c.payload.listingId,
    path: '/apps/trading/markets/' + c.contractId.replace('#', '_'),
    render: () => <></>,
    icon: <PlayArrow />,
    children: [],
  }));
  const entries: SidebarEntry[] = [];
  // entries.push({ label: "Markets", path: "/apps/trading/markets", render: () => (<Markets />), icon: (<PlayArrow/>), children: marketEntries });

  return (
    <Page sideBarItems={entries} menuTitle={<h1>Trading Portal</h1>}>
      <Switch>
        <Route key={'market'} path={'/apps/trading/markets/:contractId'} component={Market} />
        {entries.map(e => (
          <Route exact={true} key={e.label} path={e.path} render={e.render} />
        ))}
      </Switch>
    </Page>
  );
};

export const Trading = withRouter(TradingApp);
