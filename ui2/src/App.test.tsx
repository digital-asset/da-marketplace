//
// Copyright (c) 2021, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
//


import App from './App';
import { Router } from "react-router-dom";
import { Stream } from '@daml/ledger';
import React from 'react';
import ReactDOM from 'react-dom';

import Themes from './themes';
import Main from './Main';
import { LayoutProvider } from './context/LayoutContext';
import { UserProvider } from './context/UserContext';
import { CustomThemeProvider } from './context/ThemeContext';

import 'semantic-ui-css/semantic.min.css';
import './index.scss';

const mockLedgerFunction = jest.fn();

// See: https://discuss.daml.com/t/how-to-mock-usestreamqueries-in-jest-test/2095/2
jest.mock('@daml/ledger', () => class {
  streamQueries(...args: unknown[]): Stream<object, string, string, string[]>{
    return {...mockLedgerFunction(...args), on: jest.fn(), close: jest.fn()};
  }
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(
    <LayoutProvider>
      <UserProvider>
        <CustomThemeProvider lightTheme={Themes.light} darkTheme={Themes.dark}>
          <div className="app">
            <Main defaultPath="/app" />
          </div>
        </CustomThemeProvider>
      </UserProvider>
    </LayoutProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

/*
import React from 'react';
import ReactDOM from 'react-dom';

import Themes from './themes';
import Main from './Main';
import { LayoutProvider } from './context/LayoutContext';
import { UserProvider } from './context/UserContext';
import { CustomThemeProvider } from './context/ThemeContext';

import 'semantic-ui-css/semantic.min.css';
import './index.scss';

ReactDOM.render(
  <LayoutProvider>
    <UserProvider>
      <CustomThemeProvider lightTheme={Themes.light} darkTheme={Themes.dark}>
        <div className="app">
          <Main defaultPath="/app" />
        </div>
      </CustomThemeProvider>
    </UserProvider>
  </LayoutProvider>,
  document.getElementById('root')
);

*/
