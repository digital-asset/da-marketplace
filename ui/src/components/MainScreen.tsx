// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import { useParty, useStreamQuery, useLedger } from '@daml/react'
import { RegisteredIssuer } from '@daml.js/da-marketplace/lib/Marketplace/Registry'

import RoleSelectScreen from './RoleSelectScreen'
import Investor from './Investor/Investor'
import Issuer from './Issuer/Issuer'
import Exchange from './Exchange/Exchange'

type Props = {
  onLogout: () => void;
}

/**
 * React component for the main screen of the `App`.
 */
const MainScreen: React.FC<Props> = ({ onLogout }) => {
  const { path } = useRouteMatch();
  const registeredIssuer = useStreamQuery(RegisteredIssuer).contracts;

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

      <Route path={`${path}/exchange`}>
        <Exchange onLogout={onLogout}/>
      </Route>
    </Switch>
  );
}

export default MainScreen;
