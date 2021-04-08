import React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import ErrorComponent from './pages/error/Error';
import { useUserState } from './context/UserContext';
import Login from './pages/login/Login';
// import Apps from "./Apps";
import DamlLedger from '@daml/react';
import { httpBaseUrl, wsBaseUrl } from './config';
import { App } from './App';
import { Network } from './apps/Network';
import { Custody } from './apps/Custody';
import { Issuance } from './apps/Issuance';
import { Distribution } from './apps/Distribution';
import { Listing } from './apps/Listing';
import { Trading } from './apps/Trading';
import { Registry } from './apps/Registry';
import { ServicesProvider } from './context/ServicesContext';

type MainProps = {
  defaultPath: string;
};

export default function Main({ defaultPath }: MainProps) {
  const user = useUserState();

  return (
    <DamlLedger
      party={user.party}
      token={user.token}
      httpBaseUrl={httpBaseUrl}
      wsBaseUrl={wsBaseUrl}
    >
      <ServicesProvider>
        <HashRouter>
          <Switch>
            <Route exact path="/" component={() => <Redirect to={defaultPath} />} />
            <PrivateRoute path="/app" component={App} />
            {/* <PrivateRoute path="/apps/network" component={Network} />
            <PrivateRoute path="/apps/custody" component={Custody} />
            <PrivateRoute path="/apps/registry" component={Registry} />
            <PrivateRoute path="/apps/issuance" component={Issuance} />
            <PrivateRoute path="/apps/distribution" component={Distribution} />
            <PrivateRoute path="/apps/listing" component={Listing} />
            <PrivateRoute path="/apps/trading" component={Trading} /> */}
            <PublicRoute path="/login" component={Login} />
            <Route component={ErrorComponent} />
          </Switch>
        </HashRouter>
      </ServicesProvider>
    </DamlLedger>
  );

  function PrivateRoute({ component, ...rest }: any) {
    return (
      <Route
        {...rest}
        render={props =>
          user.isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }: any) {
    return (
      <Route
        {...rest}
        render={props =>
          user.isAuthenticated ? (
            <Redirect to={{ pathname: '/' }} />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
