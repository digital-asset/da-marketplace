// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Page from './common/Page'
import WelcomeHeader from './common/WelcomeHeader'

import RoleSelectScreen from './RoleSelectScreen'
import InvestorWallet from './InvestorWallet'

import { WalletIcon } from '../icons/Icons'

type Props = {
  onLogout: () => void;
}

/**
 * React component for the main screen of the `App`.
 */
const MainScreen: React.FC<Props> = ({onLogout}) => (
  <Switch>
    <Route path='/role'>
      <RoleSelectScreen onLogout={onLogout}/>
    </Route>

    <Route path='/wallet'>
      <Page
        menuTitle={<><WalletIcon/>Wallet</>}
        onLogout={onLogout}
      >
        <InvestorWallet/>
      </Page>
    </Route>

    <Route path='/'>
      <Page onLogout={onLogout}>
        <WelcomeHeader/>
      </Page>
    </Route>
  </Switch>
);

export default MainScreen;
