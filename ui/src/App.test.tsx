//
// Copyright (c) 2021, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
//
import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';

import { Stream } from '@daml/ledger';

import Main from './Main';
import { LayoutProvider } from './context/LayoutContext';
import { UserProvider } from './context/UserContext';
import './index.scss';

const mockLedgerFunction = jest.fn();

// See: https://discuss.daml.com/t/how-to-mock-usestreamqueries-in-jest-test/2095/2
jest.mock(
  '@daml/ledger',
  () =>
    class {
      streamQueries(...args: unknown[]): Stream<object, string, string, string[]> {
        return { ...mockLedgerFunction(...args), on: jest.fn(), close: jest.fn() };
      }
    }
);

it('renders without crashing', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(
    <LayoutProvider>
      <UserProvider>
        <div className="app">
          <Main defaultPath="/app" />
        </div>
      </UserProvider>
    </LayoutProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
