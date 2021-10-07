import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';

import Main from './Main';
import { LayoutProvider } from './context/LayoutContext';
import { UserProvider } from './context/UserContext';
import './index.scss';
import paths from './paths';

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
