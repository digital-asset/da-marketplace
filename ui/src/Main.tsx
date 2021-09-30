import React, { useMemo } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import DamlLedger, { QueryResult } from '@daml/react';
import DamlHub from '@daml/hub-react';
import { Template } from '@daml/types';

import ErrorComponent from './pages/error/Error';
import { useUserState } from './context/UserContext';
import Login from './pages/login/Login';
import { App } from './App';
import QuickSetup from './pages/QuickSetup/QuickSetup';
import { ServicesProvider } from './context/ServicesContext';
import { MessagesProvider } from './context/MessagesContext';
import { httpBaseUrl, wsBaseUrl } from './config';
import QueryStreamProvider, { useContractQuery } from './websocket/queryStream';
import { RolesProvider } from './context/RolesContext';
import { RequestsProvider } from './context/RequestsContext';
import paths from './paths';

type MainProps = {
  defaultPath: string;
};

export default function Main({ defaultPath }: MainProps) {
  const user = useUserState();

  return (
    <HashRouter>
      <DamlHub>
        <Switch>
          <Route exact path={paths.root} component={() => <Redirect to={defaultPath} />} />
          <PrivateRoute
            path={paths.app.root}
            component={() => {
              return (
                <UnifiedDamlProvider
                  party={user.party}
                  token={user.token}
                  httpBaseUrl={httpBaseUrl}
                  wsBaseUrl={wsBaseUrl}
                >
                  <MessagesProvider>
                    <ServicesProvider>
                      <RolesProvider>
                        <RequestsProvider>
                          <App />
                        </RequestsProvider>
                      </RolesProvider>
                    </ServicesProvider>
                  </MessagesProvider>
                </UnifiedDamlProvider>
              );
            }}
          />
          <PublicRoute path={paths.quickSetup.root} component={QuickSetup} />
          <PublicRoute path={paths.login} component={Login} />
          <Route component={ErrorComponent} />
        </Switch>
      </DamlHub>
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
            <Redirect to={{ pathname: paths.login, state: { from: props.location } }} />
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
            <Redirect to={paths.root} />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}

type UnifiedDamlProviderProps = {
  party: string;
  token: string;
  httpBaseUrl?: string;
  wsBaseUrl?: string;
};

export const UnifiedDamlProvider: React.FC<UnifiedDamlProviderProps> = ({
  children,
  party,
  token,
  httpBaseUrl,
  wsBaseUrl,
}) => (
  <DamlHub token={token}>
    <DamlLedger party={party} token={token} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl}>
      <QueryStreamProvider defaultPartyToken={token}>{children}</QueryStreamProvider>
    </DamlLedger>
  </DamlHub>
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
