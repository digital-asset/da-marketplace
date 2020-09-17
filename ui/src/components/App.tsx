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
import { WellKnownPartiesProvider } from '@daml/dabl-react'

import Credentials from '../Credentials'
import { httpBaseUrl } from '../config'

import LoginScreen from './LoginScreen'
import MainScreen from './MainScreen'

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
                <WellKnownPartiesProvider
                  defaultWkp={{ userAdminParty: "Operator", publicParty: "Public" }}
                >
                  <MainScreen onLogout={() => setCredentials(undefined)}/>
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

export default App;
