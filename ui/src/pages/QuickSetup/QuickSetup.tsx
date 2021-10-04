import React, { useEffect, useState } from 'react';
import { Button, Loader } from 'semantic-ui-react';
import classNames from 'classnames';
import {
  NavLink,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useHistory,
  withRouter,
} from 'react-router-dom';

import Widget from '../../components/Widget/Widget';
import { ArrowLeftIcon, ArrowRightIcon } from '../../icons/icons';
import Credentials, { computeLocalCreds } from '../../Credentials';
import { isHubDeployment } from '../../config';
import { retrieveParties } from '../../Parties';

import AddPartiesPage from './AddPartiesPage';
import ReviewPage from './ReviewPage';
import LoginPage from './LoginPage';
import AssignRolesPage from './AssignRolesPage';
import ProvideServicesPage from './ProvideServicesPage';
import ConfigureProvidersPage from './ConfigureProvidersPage';
import { usePublicParty } from '../common';

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
  const history = useHistory();
  const publicParty = usePublicParty();

  const matchPath = props.match.path;
  const matchUrl = props.match.url;

  const [adminCredentials, setAdminCredentials] = useState<Credentials>();
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItems>();
  const [showAdvancedSetup, setShowAdvancedSetup] = useState<boolean>(false);

  useEffect(() => {
    const parties = retrieveParties(publicParty);

    const newSegment = history.location?.pathname.split('/quick-setup')[1].replace('/', '');
    const activeMenuItem = Object.values(MenuItems).find(s => s === newSegment);
    setActiveMenuItem(activeMenuItem);

    if (isHubDeployment) {
      const adminParty = parties.find(p => p.partyName === 'UserAdmin');
      if (adminParty) {
        setAdminCredentials(adminParty);
      }
    } else {
      setAdminCredentials(computeLocalCreds('Operator'));
    }
  }, [history.location, publicParty]);

  return (
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
            <NavLink to={`${matchUrl}/${MenuItems.ADD_PARTIES}`}>
              <Button className="main-button ghost dark">
                Upload More Parties
                <ArrowRightIcon />
              </Button>
            </NavLink>
            {showAdvancedSetup && (
              <>
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
              </>
            )}
            <button
              className="p2 advanced-setup"
              onClick={() => setShowAdvancedSetup(!showAdvancedSetup)}
            >
              {showAdvancedSetup ? 'Hide ' : 'Show '}Advanced Setup
            </button>
          </div>
        )}
        <Switch>
          <Route
            path={`${matchPath}/${MenuItems.ADD_PARTIES}`}
            component={() => <AddPartiesPage />}
          />
          {adminCredentials && (
            <>
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
                path={`${matchPath}/${MenuItems.REVIEW}`}
                component={() => <ReviewPage adminCredentials={adminCredentials} />}
              />
              <Route
                path={`${matchPath}/${MenuItems.LOG_IN}`}
                component={() => <LoginPage adminCredentials={adminCredentials} />}
              />
            </>
          )}
          <Redirect to={matchPath} />
        </Switch>
      </div>
    </Widget>
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
