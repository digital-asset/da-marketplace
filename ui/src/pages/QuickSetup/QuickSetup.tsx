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

import { WellKnownPartiesProvider } from '@daml/hub-react/lib';

import { ledgerId, isHubDeployment } from '../../config';

import Credentials, { computeCredentials } from '../../Credentials';
import { retrieveParties } from '../../Parties';

import { ArrowLeftIcon, ArrowRightIcon } from '../../icons/icons';

import AddPartiesPage from './AddPartiesPage';
import ReviewPage from './ReviewPage';
import FinishPage from './FinishPage';
import paths from '../../paths';
import Widget from '../../components/Widget/Widget';
import InstructionsPage from './Instructions';
import RequestServicesPage from './RequestServicesPage';
import AddAccountPage from './AddAccountPage';

export enum MenuItems {
  ADD_PARTIES = 'add-parties',
  ASSIGN_ROLES = 'assign-roles',
  REVIEW = 'review',
  LOG_IN = 'log-in-parties',
  REQUEST_SERVICES = 'request-services',
  NEW_ACCOUNT = 'new-account',
}

const QuickSetup = withRouter((props: RouteComponentProps<{}>) => {
  const localCreds = computeCredentials('Operator');

  const history = useHistory();
  const parties = retrieveParties() || [];

  const matchPath = props.match.path;
  const matchUrl = props.match.url;

  const [adminCredentials, setAdminCredentials] = useState<Credentials>(localCreds);
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItems>();

  useEffect(() => {
    const newSegment = history.location?.pathname.split('/quick-setup')[1].replace('/', '');
    const activeMenuItem = Object.values(MenuItems).find(s => s === newSegment);
    setActiveMenuItem(activeMenuItem);

    if (isHubDeployment) {
      const adminParty = parties.find(p => p.partyName === 'UserAdmin');
      if (adminParty) {
        setAdminCredentials({ token: adminParty.token, party: adminParty.party, ledgerId });
      }
    }
  }, [history.location]);

  return (
    <WellKnownPartiesProvider>
      <Widget
        subtitle={
          activeMenuItem
            ? activeMenuItem.replace('-', ' ').replace(/(?:^|\s)\S/g, res => {
                return res.toUpperCase();
              })
            : 'Quick Setup'
        }
        pageControls={{
          left: (
            <Button
              className="ghost dark control-button"
              onClick={() => history.push(activeMenuItem ? '/quick-setup' : paths.login)}
            >
              <ArrowLeftIcon color={'white'} />
              Back {activeMenuItem ? 'To Quick Setup' : 'To Login'}
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
          {!activeMenuItem && (
            <div className="setup-page main-select">
              <h4 className="dark title">What would you like to do?</h4>
              <NavLink to={`${matchUrl}${MenuItems.ADD_PARTIES}`}>
                <Button className="main-button">
                  Add Parties <ArrowRightIcon />
                </Button>
              </NavLink>
              <NavLink to={`${matchUrl}${MenuItems.ASSIGN_ROLES}`}>
                <Button className="main-button">
                  Assign Roles
                  <ArrowRightIcon />
                </Button>
              </NavLink>
              <NavLink to={`${matchUrl}${MenuItems.REQUEST_SERVICES}`}>
                <Button className="main-button">
                  Request Services
                  <ArrowRightIcon />
                </Button>
              </NavLink>
              <NavLink to={`${matchUrl}${MenuItems.NEW_ACCOUNT}`}>
                <Button className="main-button">
                  Create Accounts
                  <ArrowRightIcon />
                </Button>
              </NavLink>
              <NavLink to={`${matchUrl}${MenuItems.REVIEW}`}>
                <Button className="main-button">
                  Review
                  <ArrowRightIcon />
                </Button>
              </NavLink>
            </div>
          )}
          <Switch>
            <Route
              path={`${matchPath}/${MenuItems.ADD_PARTIES}`}
              component={() => <AddPartiesPage />}
            />
            <Route
              path={`${matchPath}/${MenuItems.ASSIGN_ROLES}`}
              component={() => <InstructionsPage adminCredentials={adminCredentials} />}
            />
            <Route
              path={`${matchPath}/${MenuItems.REQUEST_SERVICES}`}
              component={() => <RequestServicesPage adminCredentials={adminCredentials} />}
            />
            <Route
              path={`${matchPath}/${MenuItems.NEW_ACCOUNT}`}
              component={() => <AddAccountPage adminCredentials={adminCredentials} />}
            />
            <Route
              path={`${matchPath}/${MenuItems.REVIEW}`}
              component={() => <ReviewPage adminCredentials={adminCredentials} />}
            />
            <Route
              path={`${matchPath}/${MenuItems.LOG_IN}`}
              component={() => <FinishPage adminCredentials={adminCredentials} />}
            />
            <Redirect to={`${matchPath}/${isHubDeployment ? MenuItems.ADD_PARTIES : ''}`} />
          </Switch>
        </div>
      </Widget>
    </WellKnownPartiesProvider>
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
