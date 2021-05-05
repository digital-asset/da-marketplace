import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {PlayArrow} from '@material-ui/icons';
import {SidebarEntry} from '../components/Sidebar/SidebarEntry';
import {BiddingAuctions} from '../pages/distribution/bidding/Auctions';
import {Auctions} from '../pages/distribution/auction/Auctions';
import {Auction} from '../pages/distribution/auction/Auction';
import {useParty} from '@daml/react';
import {useStreamQueries} from '../Main';
import {Service} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Service';
import {BiddingAuction} from '../pages/distribution/bidding/Auction';
import Page from '../pages/page/Page';

const DistributionApp = () => {
  const party = useParty();
  const services = useStreamQueries(Service).contracts;
  const providerServices = services.filter(c => c.payload.provider === party);
  const customerServices = services.filter(c => c.payload.customer === party);
  const isAgent = providerServices.length > 0;
  const isIssuer = customerServices.length > 0;

  const entries: SidebarEntry[] = [];
  // entries.push({ label: "Assets", path: "/apps/distribution/assets", render: () => (<Assets />), icon: (<PlayArrow/>), children: [] });
  if (isAgent) {
    entries.push({
      label: 'Auctions',
      path: '/apps/distribution/auctions',
      render: () => <Auctions />,
      icon: <PlayArrow />,
      children: [],
    });
    // entries.push({ label: "Requests", path: "/apps/distribution/requests", render: () => (<Requests />), icon: (<PlayArrow/>), children: [] });
  } else if (isIssuer) {
    // entries.push({ label: "New Auction", path: "/apps/distribution/new"     , render: () => (<New />)     , icon: (<PlayArrow/>), children: [] });
    entries.push({
      label: 'Auctions',
      path: '/apps/distribution/auctions',
      render: () => <Auctions />,
      icon: <PlayArrow />,
      children: [],
    });
    // entries.push({ label: "Requests"   , path: "/apps/distribution/requests", render: () => (<Requests />), icon: (<PlayArrow/>), children: [] });
  } else {
    entries.push({
      label: 'Auctions',
      path: '/apps/distribution/auctions',
      render: () => <BiddingAuctions />,
      icon: <PlayArrow />,
      children: [],
    });
  }

  return (
    <Page sideBarItems={entries} menuTitle={<h1>Distribution Portal</h1>}>
      <Switch>
        <Route
          key={'auction'}
          path={'/apps/distribution/auctions/:contractId'}
          component={Auction}
        />
        <Route
          key={'request'}
          path={'/apps/distribution/auction/:contractId'}
          component={BiddingAuction}
        />
        {entries.map(e => (
          <Route key={e.label} path={e.path} exact={true} render={e.render} />
        ))}
      </Switch>
    </Page>
  );
};

export const Distribution = withRouter(DistributionApp);
