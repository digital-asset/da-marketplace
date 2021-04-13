import React, { useEffect, useMemo, useState } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

import DamlLedger, { QueryResult, useStreamQueries as usq } from '@daml/react';
import { PublicLedger, useStreamQueriesAsPublic as usqp } from '@daml/hub-react/lib';
import { Template } from '@daml/types';

import ErrorComponent from './pages/error/Error';
import { useUserState } from './context/UserContext';
import Login from './pages/login/Login';
// import Apps from "./Apps";
import { App } from './App';
import { Network } from './apps/Network';
import { Custody } from './apps/Custody';
import { Issuance } from './apps/Issuance';
import { Distribution } from './apps/Distribution';
import { Listing } from './apps/Listing';
import { Trading } from './apps/Trading';
import { Registry } from './apps/Registry';
import { ServicesProvider } from './context/ServicesContext';
import { httpBaseUrl, wsBaseUrl, ledgerId, publicParty } from './config';
import { Query, StreamCloseEvent } from '@daml/ledger';
import { computeCredentials } from './Credentials';

type MainProps = {
  defaultPath: string;
};

export default function Main({ defaultPath }: MainProps) {
  const user = useUserState();

  return (
    <PublicDamlProvider
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
    </PublicDamlProvider>
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

type PublicDamlProviderProps = {
  party: string;
  token: string;
  httpBaseUrl?: string;
  wsBaseUrl?: string;
};

const PublicDamlProvider: React.FC<PublicDamlProviderProps> = ({
  children,
  party,
  token,
  httpBaseUrl,
  wsBaseUrl,
}) => (
  <DamlLedger party={party} token={token} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl}>
    <PublicLedger
      ledgerId={ledgerId}
      publicParty={publicParty}
      defaultToken={computeCredentials(publicParty).token}
    >
      {children}
    </PublicLedger>
  </DamlLedger>
);

export function useStreamQueries<T extends object, K, I extends string>(
  template: Template<T, K, I>,
  queryFactory?: () => Query<T>[],
  queryDeps?: readonly unknown[],
  closeHandler?: (e: StreamCloseEvent) => void
): QueryResult<T, K, I> {
  const contractsAsPublic = usqp(template, queryFactory, queryDeps, closeHandler);
  const contractsAsParty = usq(template, queryFactory, queryDeps, closeHandler);

  const result = useMemo(
    () => ({
      contracts: [...contractsAsParty.contracts, ...contractsAsPublic.contracts],
      loading: contractsAsParty.loading && contractsAsPublic.loading,
    }),
    [contractsAsPublic, contractsAsParty]
  );

  return result;
}
