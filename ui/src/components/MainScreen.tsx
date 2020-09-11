// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import RoleSelectScreen from './RoleSelectScreen'
import Investor from './Investor/Investor'
import Issuer from './Issuer/Issuer'

type Props = {
  onLogout: () => void;
}

/**
 * React component for the main screen of the `App`.
 */
const MainScreen: React.FC<Props> = ({ onLogout }) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <RoleSelectScreen onLogout={onLogout}/>
      </Route>

      <Route path={`${path}/investor`}>
        <Investor onLogout={onLogout}/>
      </Route>

      <Route path={`${path}/issuer`}>
        <Issuer onLogout={onLogout}/>
      </Route>
    </Switch>
  );
}

export default MainScreen;
