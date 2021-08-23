import React, { useEffect, useState } from 'react';
import { Button, Loader } from 'semantic-ui-react';
import {
  useHistory,
  Switch,
  Route,
  RouteComponentProps,
  withRouter,
  NavLink,
  Redirect,
} from 'react-router-dom';

import DamlHub, { PartyToken } from '@daml/hub-react';

import Widget from '../../components/Widget/Widget';
import { ArrowLeftIcon, ArrowRightIcon } from '../../icons/icons';
import { computeCredentials } from '../../Credentials';
import { isHubDeployment } from '../../config';
import { retrieveParties } from '../../Parties';
import paths from '../../paths';

import AddPartiesPage from './AddPartiesPage';
import ReviewPage from './ReviewPage';
import FinishPage from './FinishPage';

export enum MenuItems {
  ADD_PARTIES = 'add-parties',
  REVIEW = 'review',
  LOG_IN = 'log-in-parties',
}

const QuickSetup = withRouter((props: RouteComponentProps<{}>) => {
  const localCreds = computeCredentials('Operator');
  const history = useHistory();

  const matchPath = props.match.path;
  const matchUrl = props.match.url;

  const [adminCredentials, setAdminCredentials] = useState<PartyToken>(localCreds);
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItems>();

  useEffect(() => {
    const parties = retrieveParties() || [];
    const newSegment = history.location?.pathname.split('/quick-setup')[1].replace('/', '');
    const activeMenuItem = Object.values(MenuItems).find(s => s === newSegment);

    if (activeMenuItem) {
      setActiveMenuItem(activeMenuItem);
    }

    if (isHubDeployment) {
      const adminParty = parties.find(p => p.partyName === 'UserAdmin');
      if (adminParty) {
        setAdminCredentials(adminParty);
      }
    }
  }, [history.location]);

  return (
    <DamlHub>
      <Widget
        subtitle={
          activeMenuItem === MenuItems.LOG_IN
            ? 'Log In'
            : activeMenuItem === MenuItems.REVIEW
            ? 'Review'
            : 'Market Set-Up'
        }
        pageControls={{
          left: (
            <Button className="ghost dark control-button" onClick={() => history.push(paths.login)}>
              <ArrowLeftIcon color={'white'} />
              Back
            </Button>
          ),
          right:
            activeMenuItem !== MenuItems.LOG_IN ? (
              <NavLink to={`${matchUrl}/${MenuItems.LOG_IN}`}>
                <Button className="button ghost dark control-button">
                  Skip to Log In
                  <ArrowRightIcon color={'white'} />
                </Button>
              </NavLink>
            ) : undefined,
        }}
      >
        <div className="quick-setup">
          <Switch>
            <Route
              path={`${matchPath}/${MenuItems.ADD_PARTIES}`}
              component={() => <AddPartiesPage />}
            />
            <Route
              path={`${matchPath}/${MenuItems.REVIEW}`}
              component={() => <ReviewPage adminCredentials={adminCredentials} />}
            />
            <Route
              path={`${matchPath}/${MenuItems.LOG_IN}`}
              component={() => <FinishPage adminCredentials={adminCredentials} />}
            />
            <Redirect
              to={`${matchPath}/${isHubDeployment ? MenuItems.ADD_PARTIES : MenuItems.REVIEW}`}
            />
          </Switch>
        </div>
      </Widget>
    </DamlHub>
  );
});

export const LoadingWheel = (props: { label?: string }) => {
  return (
    <Loader active indeterminate size="small">
      <p>{props.label || 'Loading...'}</p>
    </Loader>
  );
};

export default QuickSetup;
