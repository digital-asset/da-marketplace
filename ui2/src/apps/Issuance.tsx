import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {PlayArrow} from '@material-ui/icons';
import {SidebarEntry} from '../components/Sidebar/SidebarEntry';
import {Issuances} from '../pages/issuance/Issuances';
import Page from '../pages/page/Page';

const IssuanceApp = () => {
  const entries: SidebarEntry[] = [];
  // entries.push({ label: "New Issuance", path: "/apps/issuance/new", render: () => (<New />), icon: (<PlayArrow/>), children: [] });
  // entries.push({ label: "Requests", path: "/apps/issuance/requests", render: () => (<Requests />), icon: (<PlayArrow/>), children: [] });
  entries.push({
    label: 'Issuances',
    path: '/apps/issuance/issuances',
    render: () => <Issuances />,
    icon: <PlayArrow />,
    children: [],
  });

  return (
    <Page sideBarItems={entries} menuTitle={<h1>Issuance Portal</h1>}>
      <Switch>
        {entries.map(e => (
          <Route exact={true} key={e.label} path={e.path} render={e.render} />
        ))}
      </Switch>
    </Page>
  );
};

export const Issuance = withRouter(IssuanceApp);
