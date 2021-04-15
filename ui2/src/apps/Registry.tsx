import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { PlayArrow } from '@material-ui/icons';
import { SidebarEntry } from '../components/Sidebar/SidebarEntry';
import { Requests } from '../pages/origination/Requests';
import { Instruments } from '../pages/origination/Instruments';
import { Instrument } from '../pages/origination/Instrument';
import { New } from '../pages/origination/New';
import { NewBinaryOption } from '../pages/origination/NewBinaryOption';
import { NewConvertibleNote } from '../pages/origination/NewConvertibleNote';
import Page from '../pages/page/Page';

const RegistryApp = () => {
  const entries: SidebarEntry[] = [];
  entries.push({
    label: 'New Instrument',
    path: '/apps/registry/instruments/new',
    render: () => <New />,
    icon: <PlayArrow />,
    children: [
      {
        label: 'Binary Option',
        path: '/apps/registry/instruments/new/binaryoption',
        render: () => <NewBinaryOption />,
        icon: <PlayArrow />,
        children: [],
      },
      {
        label: 'Convertible Note',
        path: '/apps/registry/instruments/new/convertiblenote',
        render: () => <NewConvertibleNote />,
        icon: <PlayArrow />,
        children: [],
      },
    ],
  });
  entries.push({
    label: 'Instruments',
    path: '/apps/registry/instruments',
    render: () => <Instruments />,
    icon: <PlayArrow />,
    children: [],
  });
  entries.push({
    label: 'Requests',
    path: '/apps/registry/requests',
    render: () => <Requests />,
    icon: <PlayArrow />,
    children: [],
  });

  return (
    <Page sideBarItems={entries} menuTitle={<h1>Registry Portal</h1>}>
      <Switch>
        {entries.map(e => (
          <Route exact={true} key={e.label} path={e.path} render={e.render} />
        ))}
        <Route
          key={'newconvertiblenote'}
          path={'/apps/registry/instruments/new/convertiblenote'}
          component={NewConvertibleNote}
        />
        <Route
          key={'newbinaryoption'}
          path={'/apps/registry/instruments/new/binaryoption'}
          component={NewBinaryOption}
        />
        <Route
          key={'instrument'}
          path={'/apps/registry/instruments/:contractId'}
          component={Instrument}
        />
      </Switch>
    </Page>
  );
};

export const Registry = withRouter(RegistryApp);
