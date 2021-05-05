import React, { useEffect, useMemo, useState } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

import DamlLedger, { QueryResult, useStreamQueries as usq } from '@daml/react';
import {
  PublicLedger,
  useStreamQueriesAsPublic as usqp,
  WellKnownPartiesProvider,
} from '@daml/hub-react/lib';
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
import QuickSetup from './pages/login/QuickSetup';
import { ServicesProvider } from './context/ServicesContext';
import { httpBaseUrl, wsBaseUrl, ledgerId, publicParty } from './config';
import { Query, StreamCloseEvent } from '@daml/ledger';
import { computeCredentials } from './Credentials';
import QueryStreamProvider, { useContractQuery } from './websocket/queryStream';

type MainProps = {
  defaultPath: string;
};

export default function Main({ defaultPath }: MainProps) {
  const user = useUserState();

  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={() => <Redirect to={defaultPath} />} />
        <PrivateRoute
          path="/app"
          component={() => {
            return (
              <WellKnownPartiesProvider>
                <PublicDamlProvider
                  party={user.party}
                  token={user.token}
                  httpBaseUrl={httpBaseUrl}
                  wsBaseUrl={wsBaseUrl}
                >
                  <ServicesProvider>
                    <App />
                  </ServicesProvider>
                </PublicDamlProvider>
              </WellKnownPartiesProvider>
            );
          }}
        />
        {/* <PrivateRoute path="/apps/network" component={Network} />
        <PrivateRoute path="/apps/custody" component={Custody} />
        <PrivateRoute path="/apps/registry" component={Registry} />
        <PrivateRoute path="/apps/issuance" component={Issuance} />
        <PrivateRoute path="/apps/distribution" component={Distribution} />
        <PrivateRoute path="/apps/listing" component={Listing} />
        <PrivateRoute path="/apps/trading" component={Trading} /> */}
        <PublicRoute path="/quick-setup" component={QuickSetup} />
        <PublicRoute path="/login" component={Login} />
        <Route component={ErrorComponent} />
      </Switch>
    </HashRouter>
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
      <QueryStreamProvider>{children}</QueryStreamProvider>
    </PublicLedger>
  </DamlLedger>
);

export function useStreamQueries<T extends object, K, I extends string>(
  template: Template<T, K, I>
): QueryResult<T, K, I> {
  const { contracts: contractsAsParty, loading: partyLoading } = useContractQuery(template, false);
  const { contracts: contractsAsPublic, loading: publicLoading } = useContractQuery(template, true);

  const result = useMemo(() => {
    const mergedContracts = [...contractsAsParty, ...contractsAsPublic];

    // deduplication for when a contract appears in both streams
    // ex., the current party is a signatory to a contract also visible to public
    const contracts = mergedContracts.filter(
      (c1, index) => mergedContracts.findIndex(c2 => c2.contractId === c1.contractId) === index
    );

    return {
      contracts,
      loading: partyLoading || publicLoading,
    };
  }, [contractsAsPublic, contractsAsParty, partyLoading, publicLoading]);

  return result;
}
