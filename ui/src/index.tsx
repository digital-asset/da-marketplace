import React from 'react';
import ReactDOM from 'react-dom';

import Main from './Main';
import { LayoutProvider } from './context/LayoutContext';
import { UserProvider } from './context/UserContext';
import paths from './paths';

import 'semantic-ui-css/semantic.min.css';
import './index.scss';

ReactDOM.render(
  <LayoutProvider>
    <UserProvider>
      <div className="app">
        <Main defaultPath={paths.app.root} />
      </div>
    </UserProvider>
  </LayoutProvider>,
  document.getElementById('root')
);
