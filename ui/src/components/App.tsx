// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'

import DamlLedger from '@daml/react'
import { PublicLedger, WellKnownPartiesProvider } from '@daml/dabl-react'

import Credentials, { computeCredentials } from '../Credentials'
import { httpBaseUrl } from '../config'

import { useDablParties } from './common/common'
import LoginScreen from './LoginScreen'
import MainScreen from './MainScreen'
import OnboardingTile from './common/OnboardingTile'
import { RegistryLookupProvider } from './common/RegistryLookup'

/**
 * React component for the entry point into the application.
 */
// APP_BEGIN
const App: React.FC = () => {
  const [credentials, setCredentials] = React.useState<Credentials>();

  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <LoginScreen onLogin={setCredentials}/>
        </Route>

        <Route path='/role' render={() => {
          return credentials
            ? <DamlLedger
                token={credentials.token}
                party={credentials.party}
                httpBaseUrl={httpBaseUrl}
              >
                <WellKnownPartiesProvider>
                  <PublicProvider>
                    <RegistryLookupProvider>
                      <MainScreen onLogout={() => setCredentials(undefined)}/>
                    </RegistryLookupProvider>
                  </PublicProvider>
                </WellKnownPartiesProvider>
            </DamlLedger>
            : <Redirect to='/'/>
          }}>
        </Route>
      </Switch>
    </Router>
  )
}
// APP_END

const PublicProvider: React.FC = ({ children }) => {
  const { parties, loading } = useDablParties();
  const { party, ledgerId, token } = computeCredentials(parties.publicParty);

  return loading ? <OnboardingTile>Loading...</OnboardingTile> : (
    <PublicLedger
      ledgerId={ledgerId}
      publicParty={party}
      defaultToken={token}
      httpBaseUrl={httpBaseUrl}
    >
      { children }
    </PublicLedger>
  )
}
export default App;
