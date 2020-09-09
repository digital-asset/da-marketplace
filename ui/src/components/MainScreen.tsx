// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Switch, Route } from 'react-router-dom'

import RoleSelectScreen from './RoleSelectScreen'
import Investor from './investor/Investor'
import Issuer from './Issuer/Issuer'

type Props = {
  onLogout: () => void;
}

/**
 * React component for the main screen of the `App`.
 */
const MainScreen: React.FC<Props> = ({ onLogout }) => (
  <Switch>
    <Route exact path='/role'>
      <RoleSelectScreen onLogout={onLogout}/>
    </Route>

    <Route path='/role/investor'>
      <Investor onLogout={onLogout}/>
    </Route>

    <Route path='/role/issuer'>
      <Issuer onLogout={onLogout}/>
    </Route>
  </Switch>
);

export default MainScreen;
