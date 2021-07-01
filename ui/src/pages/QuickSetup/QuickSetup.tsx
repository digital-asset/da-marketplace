import React, { useEffect, useState } from 'react';

import { Button, Loader, Menu } from 'semantic-ui-react';

import {
  useHistory,
  Switch,
  Route,
  RouteComponentProps,
  withRouter,
  NavLink,
  Redirect,
} from 'react-router-dom';

import classNames from 'classnames';

import { WellKnownPartiesProvider } from '@daml/hub-react/lib';

import { ledgerId, publicParty, isHubDeployment } from '../../config';

import Credentials, { computeCredentials } from '../../Credentials';
import { retrieveParties } from '../../Parties';

import { deployAutomation, MarketplaceTrigger, TRIGGER_HASH } from '../../automation';

import { ArrowLeftIcon, ArrowRightIcon } from '../../icons/icons';

import AddPartiesPage from './AddPartiesPage';
import SelectRolesPage from './SelectRolesPage';
import RequestServicesPage from './RequestServicesPage';
import ReviewPage from './ReviewPage';
import FinishPage from './FinishPage';
import paths from '../../paths';
import Widget from '../../components/Widget/Widget';
import InstructionsPage from './Instructions';

export enum MenuItems {
  ADD_PARTIES = 'add-parties',
  SELECT_ROLES = 'select-roles',
  TEST_INSTRUCTIONS = 'test-instructions',
  REQUEST_SERVICES = 'request-services',
  REVIEW = 'review',
  LOG_IN = 'log-in-parties',
}

const QuickSetup = withRouter((props: RouteComponentProps<{}>) => {
  const localCreds = computeCredentials('Operator');
  const history = useHistory();

  const matchPath = props.match.path;
  const matchUrl = props.match.url;

  const menuItems = Object.values(MenuItems)
    .filter(item => (isHubDeployment ? true : item !== MenuItems.ADD_PARTIES))
    .filter(item => item !== MenuItems.LOG_IN);

  const [adminCredentials, setAdminCredentials] = useState<Credentials>(localCreds);
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
        setAdminCredentials({ token: adminParty.token, party: adminParty.party, ledgerId });
      }
    }
  }, [history.location]);

  useEffect(() => {
    const parties = retrieveParties() || [];

    // deploy auto-trigger for all parties
    async function deployAllTriggers() {
      if (isHubDeployment && parties.length > 0) {
        const artifactHash = TRIGGER_HASH;

        if (!artifactHash || !adminCredentials) {
          return;
        }

        Promise.all(
          [
            ...parties.filter(p => p.party !== publicParty),
            {
              ...adminCredentials,
            },
          ].map(p => {
            return deployAutomation(
              artifactHash,
              MarketplaceTrigger.AutoApproveTrigger,
              p.token,
              publicParty
            );
          })
        );
      }
    }

    deployAllTriggers();
  }, [adminCredentials]);

  return (
    <WellKnownPartiesProvider>
      <Widget
        subtitle={activeMenuItem === MenuItems.LOG_IN ? 'Log In' : 'Market Set-Up'}
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
          {activeMenuItem !== MenuItems.LOG_IN && (
            <Menu pointing secondary className="quick-setup-menu page-row">
              {menuItems.map(item => (
                <>
                  {menuItems.indexOf(item) !== menuItems.length &&
                    menuItems.indexOf(item) !== 0 && (
                      <ArrowRightIcon color={checkIsDisabled(item) ? 'grey' : 'blue'} />
                    )}

                  {activeMenuItem === MenuItems.ADD_PARTIES || activeMenuItem === item ? (
                    <Menu.Item disabled={activeMenuItem === MenuItems.ADD_PARTIES} key={item}>
                      <p className={classNames({ visited: !checkIsDisabled(item) })}>
                        {formatMenuItem(item)}
                      </p>
                    </Menu.Item>
                  ) : (
                    <NavLink to={`${matchUrl}/${item}`}>
                      <Menu.Item key={item}>
                        <p className={classNames({ visited: !checkIsDisabled(item) })}>
                          {formatMenuItem(item)}
                        </p>
                      </Menu.Item>
                    </NavLink>
                  )}
                </>
              ))}
            </Menu>
          )}

          <Switch>
            <Route
              path={`${matchPath}/${MenuItems.ADD_PARTIES}`}
              component={() => <AddPartiesPage adminCredentials={adminCredentials} />}
            />
            <Route
              path={`${matchPath}/${MenuItems.SELECT_ROLES}`}
              component={() => <SelectRolesPage adminCredentials={adminCredentials} />}
            />

            <Route
              path={`${matchPath}/${MenuItems.TEST_INSTRUCTIONS}`}
              component={() => <InstructionsPage adminCredentials={adminCredentials} />}
            />

            <Route
              path={`${matchPath}/${MenuItems.REQUEST_SERVICES}`}
              component={() => <RequestServicesPage adminCredentials={adminCredentials} />}
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
                isHubDeployment ? MenuItems.ADD_PARTIES : MenuItems.SELECT_ROLES
              }`}
            />
          </Switch>
        </div>
      </Widget>
    </WellKnownPartiesProvider>
  );

  function checkIsDisabled(item: MenuItems) {
    if (!activeMenuItem) {
      return false;
    }

    const clickedItemIndex = Object.values(MenuItems).indexOf(item);
    const activeItemIndex = Object.values(MenuItems).indexOf(activeMenuItem);
    if (clickedItemIndex > activeItemIndex) {
      return true;
    }
    return false;
  }

  function formatMenuItem(item: MenuItems) {
    return item
      .split('-')
      .map(i => `${i.substring(0, 1).toUpperCase()}${i.substring(1)}`)
      .join(' ');
  }
});

export const LoadingWheel = (props: { label?: string }) => {
  return (
    <Loader active indeterminate size="small">
      <p>{props.label || 'Loading...'}</p>
    </Loader>
  );
};

export default QuickSetup;
