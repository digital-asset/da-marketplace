import React, { useEffect, useState } from 'react';

import { Button, Loader, Checkbox } from 'semantic-ui-react';

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
  ADD_RELATIONSHIPS = 'add-relationships',
  NEW_ACCOUNT = 'new-account',
}

const QuickSetup = withRouter((props: RouteComponentProps<{}>) => {
  const localCreds = computeCredentials('Operator');

  const history = useHistory();
  const storedParties = retrieveUserParties();

  const matchPath = props.match.path;
  const matchUrl = props.match.url;

  const [adminCredentials, setAdminCredentials] = useState<Credentials>(localCreds);
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItems>();
  const [isClearedExchange, setIsClearedExchange] = useState<boolean>(false);

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
        subtitle={'Quick Setup'}
        pageControls={{
          left: (
            <Button
              className="ghost dark control-button"
              onClick={() =>
                activeMenuItem &&
                activeMenuItem !== MenuItems.ADD_PARTIES &&
                storedParties.length > 0 &&
                history.push(paths.login)
              }
            >
              <ArrowLeftIcon color={'white'} />
              Back
            </Button>
          ),
          right:
            activeMenuItem === MenuItems.ADD_PARTIES &&
            storedParties.length == 0 ? undefined : activeMenuItem === MenuItems.REVIEW ? (
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
          <Switch>
            <Route
              path={`${matchPath}/${MenuItems.ADD_PARTIES}`}
              component={() => <AddPartiesPage />}
            />
            <Route
              path={`${matchPath}/${MenuItems.ASSIGN_ROLES}`}
              component={() => (
                <InstructionsPage
                  adminCredentials={adminCredentials}
                  isClearedExchange={isClearedExchange}
                />
              )}
            />
            <Route
              path={`${matchPath}/${MenuItems.ADD_RELATIONSHIPS}`}
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
            <Redirect
              to={`${matchPath}/${
                isHubDeployment ? MenuItems.ADD_PARTIES : MenuItems.ASSIGN_ROLES
              }`}
            />
          </Switch>
          <div className="checkbox-cleared">
            <Checkbox
              active={isClearedExchange}
              onClick={() => setIsClearedExchange(!isClearedExchange)}
            />
            <p className="p2 dark cleared-exchange"> Cleared Exchange</p>
          </div>
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
