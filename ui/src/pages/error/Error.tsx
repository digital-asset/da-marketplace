import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

import Widget from '../../components/Widget/Widget';
import paths from '../../paths';

export default function Error() {
  return (
    <div className="error-page">
      <Widget>
        <div className="error-page-body">
          <div className="header">
            <h1>404 Error</h1>
          </div>
          <div className="body">
            <Header as="h3">
              Oops. Looks like the page you&apos;re looking for no longer exists.
            </Header>
            <Header as="h4">But we&apos;re here to bring you back to safety</Header>
          </div>

          <Link to={paths.root}>Back to Home</Link>
        </div>
      </Widget>
    </div>
  );
}
