import React, { useEffect, useState } from 'react';

import { Button, Loader } from 'semantic-ui-react';
import classNames from 'classnames';
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
import { retrieveParties, retrieveUserParties } from '../../Parties';

import { ArrowLeftIcon, ArrowRightIcon } from '../../icons/icons';

import AddPartiesPage from './AddPartiesPage';
import ReviewPage from './ReviewPage';
import LoginPage from './LoginPage';
import Widget from '../../components/Widget/Widget';
import AssignRolesPage from './AssignRolesPage';
import ProvideServicesPage from './ProvideServicesPage';
import CreateAccountPage from './CreateAccountPage';
import ConfigureProvidersPage from './ConfigureProvidersPage';

export enum MenuItems {
  ADD_PARTIES = 'add-parties',
  CONFIGURE_PROVIDERS = 'configure-providers',
  ASSIGN_ROLES = 'assign-roles',
  REVIEW = 'review',
  LOG_IN = 'log-in-parties',
  PROVIDE_SERVICES = 'provide-services',
  CREATE_ACCOUNTS = 'create-accounts',
}

const QuickSetup = withRouter((props: RouteComponentProps<{}>) => {
  const localCreds = computeCredentials('Operator');

  const history = useHistory();
  const storedParties = retrieveUserParties();

  const matchPath = props.match.path;
  const matchUrl = props.match.url;

  const [adminCredentials, setAdminCredentials] = useState<Credentials>(localCreds);
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItems>();

  useEffect(() => {
    const parties = retrieveParties() || [];

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
          <NavLink to="/quick-setup">
            <h2>Quick Setup</h2>
          </NavLink>
        }
        pageControls={{
          left:
            activeMenuItem === MenuItems.ADD_PARTIES ||
            activeMenuItem === MenuItems.ASSIGN_ROLES ? undefined : (
              <NavLink to={!!activeMenuItem ? `${matchUrl}` : ''}>
                <Button className="button ghost dark control-button">
                  <ArrowLeftIcon color={'white'} />
                  Back
                </Button>
              </NavLink>
            ),
          right:
            activeMenuItem === MenuItems.ADD_PARTIES ? undefined : activeMenuItem ===
              MenuItems.REVIEW ? (
              <NavLink to={`${matchUrl}/${MenuItems.LOG_IN}`}>
                <Button className="button ghost dark control-button">
                  Skip to Log In
                  <ArrowRightIcon color={'white'} />
                </Button>
              </NavLink>
            ) : activeMenuItem !== MenuItems.LOG_IN ? (
              <NavLink to={`${matchUrl}/${MenuItems.REVIEW}`}>
                <Button className="button ghost dark control-button">
                  Review Setup
                  <ArrowRightIcon color={'white'} />
                </Button>
              </NavLink>
            ) : undefined,
        }}
      >
        <div className="quick-setup">
          {!activeMenuItem && (
            <div className="setup-page main-select">
              <h4 className="dark">What would you like to do?</h4>
              <NavLink to={`${matchUrl}/${MenuItems.ASSIGN_ROLES}`}>
                <Button className="main-button ghost dark">
                  Assign Roles
                  <ArrowRightIcon />
                </Button>
              </NavLink>
              <NavLink to={`${matchUrl}/${MenuItems.CONFIGURE_PROVIDERS}`}>
                <Button className="main-button ghost dark">
                  Configure Providers
                  <ArrowRightIcon />
                </Button>
              </NavLink>
              <NavLink to={`${matchUrl}/${MenuItems.PROVIDE_SERVICES}`}>
                <Button className="main-button ghost dark">
                  Provide Services
                  <ArrowRightIcon />
                </Button>
              </NavLink>
              <NavLink to={`${matchUrl}/${MenuItems.CREATE_ACCOUNTS}`}>
                <Button className="main-button ghost dark">
                  Create accounts
                  <ArrowRightIcon />
                </Button>
              </NavLink>
              <NavLink to={`${matchUrl}/${MenuItems.ADD_PARTIES}`}>
                <Button className="main-button ghost dark">
                  Add Parties
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
              component={() => <AssignRolesPage adminCredentials={adminCredentials} />}
            />
            <Route
              path={`${matchPath}/${MenuItems.CONFIGURE_PROVIDERS}`}
              component={() => <ConfigureProvidersPage adminCredentials={adminCredentials} />}
            />
            <Route
              path={`${matchPath}/${MenuItems.PROVIDE_SERVICES}`}
              component={() => <ProvideServicesPage adminCredentials={adminCredentials} />}
            />
            <Route
              path={`${matchPath}/${MenuItems.CREATE_ACCOUNTS}`}
              component={() => <CreateAccountPage adminCredentials={adminCredentials} />}
            />
            <Route
              path={`${matchPath}/${MenuItems.REVIEW}`}
              component={() => <ReviewPage adminCredentials={adminCredentials} />}
            />
            <Route
              path={`${matchPath}/${MenuItems.LOG_IN}`}
              component={() => <LoginPage adminCredentials={adminCredentials} />}
            />
            <Redirect to={`${matchPath}${isHubDeployment ? `/${MenuItems.ADD_PARTIES}` : ''}`} />
          </Switch>
        </div>
      </Widget>
    </WellKnownPartiesProvider>
  );
});

export const LoadingWheel = (props: { label?: string; dark?: boolean }) => {
  return (
    <Loader active indeterminate size="small">
      <p className={classNames({ dark: props.dark })}>{props.label || 'Loading...'}</p>
    </Loader>
  );
};

export default QuickSetup;
