// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState} from 'react'
import RoleSelectScreen from './RoleSelectScreen'
import InvestorScreen from './InvestorScreen'

// May eventually want to switch to a proper routing
// library for different pages in the app
export enum Mode {
  ROLE_SELECT_VIEW,
  INVESTOR_VIEW
}

type Props = {
  onLogout: () => void;
}

/**
 * React component for the main screen of the `App`.
 */
const MainScreen: React.FC<Props> = ({onLogout}) => {
  const [ mode, setMode ] = useState(Mode.ROLE_SELECT_VIEW);

  switch(mode) {
    case Mode.ROLE_SELECT_VIEW:
      return <RoleSelectScreen setView={view => setMode(view)} onLogout={onLogout}/>
    case Mode.INVESTOR_VIEW:
      return <InvestorScreen onLogout={onLogout}/>
    default:
      return <></>
  }
};

export default MainScreen;
