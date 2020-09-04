// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import DamlLedger from '@daml/react'

import Credentials from '../Credentials'
import { httpDataUrl } from '../config'

import LoginScreen from './LoginScreen'
import MainScreen from './MainScreen'

/**
 * React component for the entry point into the application.
 */
// APP_BEGIN
const App: React.FC = () => {
  const [credentials, setCredentials] = React.useState<Credentials>();

  return credentials
    ? <DamlLedger
        token={credentials.token}
        party={credentials.party}
        httpBaseUrl={httpDataUrl}
      >
        <MainScreen onLogout={() => setCredentials(undefined)}/>
      </DamlLedger>
    : <LoginScreen onLogin={setCredentials}/>
}
// APP_END

export default App;
