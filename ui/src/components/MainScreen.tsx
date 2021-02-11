// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react'
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom'
import { Message } from 'semantic-ui-react'

import { User } from '@daml.js/da-marketplace/lib/Marketplace/Onboarding'

import { QueryStream, QueryStreamContext, useContractQuery } from '../websocket/queryStream'
import { StreamErrors } from '../websocket/websocket'

import { useDablParties } from './common/common'
import { roleRoute } from './common/utils'
import { parseError } from './common/errorTypes'
import OnboardingTile from './common/OnboardingTile'

import RoleSelectScreen from './RoleSelectScreen'
import Investor from './Investor/Investor'
import Issuer from './Issuer/Issuer'
import Exchange from './Exchange/Exchange'
import Custodian from './Custodian/Custodian'
import CCP from './CCP/CCP'
import Broker from './Broker/Broker'


type Props = {
  onLogout: () => void;
}

/**
 * React component for the main screen of the `App`.
 */
const MainScreen: React.FC<Props> = ({ onLogout }) => {
  const { path } = useRouteMatch();
  const { parties, loading, error } = useDablParties();

  const [ streamErrors, setStreamErrors ] = React.useState<StreamErrors[]>();
  const queryStream: QueryStream<any> | undefined = React.useContext(QueryStreamContext);

  const userContracts = useContractQuery(User);
  const currentRole = userContracts[0]?.contractData?.currentRole;

  useEffect(() => {
    if (queryStream) {
      setStreamErrors(queryStream.streamErrors);
    }
  }, [queryStream]);

  const loadingScreen = <OnboardingTile><p className='dark'>Loading...</p></OnboardingTile>;
  const errorScreen = (error || streamErrors) &&
    <OnboardingTile>
      <Message error>
        { error && parseError(error)?.message }
        { streamErrors && streamErrors.map(se => se.errors).join(',') }
      </Message>
    </OnboardingTile>;

  const getMainScreen = () => {
    if (currentRole) {
      return <Redirect to={roleRoute(currentRole)}/>
    }

    if (loading || !parties) {
      return loadingScreen;
    }

    if (error || streamErrors) {
      return errorScreen;
    } else {
      return <RoleSelectScreen operator={parties.userAdminParty} onLogout={onLogout}/>
    }
  };


  return (
    <Switch>
      <Route exact path={path}>
        { getMainScreen() }
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

      <Route path={`${path}/custodian`}>
        <Custodian onLogout={onLogout}/>
      </Route>

      <Route path={`${path}/broker`}>
        <Broker onLogout={onLogout}/>
      </Route>

      <Route path={`${path}/ccp`}>
        <CCP onLogout={onLogout}/>
      </Route>
    </Switch>
  );
}

export default MainScreen;
