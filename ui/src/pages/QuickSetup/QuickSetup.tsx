import React, { useEffect, useState } from 'react';

import { Button, Loader, Menu } from 'semantic-ui-react';

import {
  useHistory,
  Switch,
  Route,
  RouteComponentProps,
  withRouter,
  NavLink,
} from 'react-router-dom';

import classNames from 'classnames';

import { WellKnownPartiesProvider } from '@daml/hub-react/lib';

import { ledgerId, publicParty, isHubDeployment } from '../../config';

import Credentials, { computeCredentials } from '../../Credentials';
import { retrieveParties, retrieveUserParties } from '../../Parties';

import { deployAutomation, MarketplaceTrigger, TRIGGER_HASH } from '../../automation';

import { ArrowLeftIcon, ArrowRightIcon, OpenMarketplaceLogo } from '../../icons/icons';

import AddPartiesPage from './AddPartiesPage';
import SelectRolesPage from './SelectRolesPage';
import SelectAutomationPage from './SelectAutomationPage';
import OfferServicesPage from './OfferServicesPage';
import ReviewPage from './ReviewPage';
import FinishPage from './FinishPage';

export enum MenuItems {
  ADD_PARTIES = 'add-parties',
  SELECT_ROLES = 'select-roles',
  SELECT_AUTOMATION = 'select-automation',
  OFFER_SERVICES = 'offer-services',
  REVIEW = 'review',
  LOG_IN = 'login-in-parties',
}

const QuickSetup = withRouter((props: RouteComponentProps<{}>) => {
  const localCreds = computeCredentials('Operator');
  const history = useHistory();
  const parties = retrieveParties() || [];

  const matchPath = props.match.path;
  const matchUrl = props.match.url;
  const menuItems = Object.values(MenuItems);

  const [adminCredentials, setAdminCredentials] = useState<Credentials>(localCreds);

  const NextButton = (props: { item: MenuItems; disabled?: boolean }) => {
    if (props.disabled) {
      return (
        <Button disabled className="ghost next">
          Next
        </Button>
      );
    }
    return (
      <NavLink to={`${matchUrl}/${props.item}`}>
        <Button className="ghost next">Next</Button>
      </NavLink>
    );
  };

  useEffect(() => {
    console.log('setting admin creds');
    if (isHubDeployment) {
      const adminParty = parties.find(p => p.partyName === 'UserAdmin');
      if (adminParty) {
        setAdminCredentials({ token: adminParty.token, party: adminParty.party, ledgerId });
      }
    }
  }, [history.location, parties.length]);

  useEffect(() => {
    // deploy auto-trigger for all parties
    async function deployAllTriggers() {
      if (isHubDeployment && parties.length > 0) {
        const artifactHash = TRIGGER_HASH;

        if (!artifactHash || !adminCredentials) {
          return;
        }

        Promise.all(
          [
            ...parties,
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
  }, [parties, adminCredentials]);

  return (
    <WellKnownPartiesProvider>
      <div className="quick-setup">
        <div className="page-controls">
          <Button className="ghost dark control-button" onClick={() => history.push('/login')}>
            <ArrowLeftIcon color={'white'} />
            Back
          </Button>
          <NavLink to={matchUrl + '/log-in-parties'}>
            <Button className="button ghost dark control-button">
              Skip to Log In
              <ArrowRightIcon color={'white'} />
            </Button>
          </NavLink>
        </div>

        <div className="quick-setup-header">
          <h1 className="logo-header">
            <OpenMarketplaceLogo size="32" /> Daml Open Marketplace
          </h1>
          {/* {activeMenuItem === MenuItems.LOG_IN ? <h2>Log In</h2> : <h2>Market Set-Up</h2>} */}
        </div>

        <div className="quick-setup-tile">
          <Menu pointing secondary className="quick-setup-menu page-row">
            {menuItems
              .filter(item => (isHubDeployment ? true : item != MenuItems.ADD_PARTIES))
              .map(item => (
                <>
                  {menuItems.indexOf(item) !== menuItems.length && (
                    <ArrowRightIcon color={checkIsDisabled(item) ? 'grey' : 'blue'} />
                  )}
                  <NavLink to={`${matchUrl}/${item}`}>
                    <Menu.Item key={item}>
                      <p className={classNames({ visited: !checkIsDisabled(item) })}>{item}</p>
                    </Menu.Item>
                  </NavLink>
                </>
              ))}
          </Menu>

          <Switch>
            <Route
              path={`${matchPath}/${MenuItems.ADD_PARTIES}`}
              component={() => (
                <>
                  <AddPartiesPage adminCredentials={adminCredentials} />
                </>
              )}
            />
            <Route
              path={`${matchPath}/${MenuItems.SELECT_ROLES}`}
              component={() => (
                <>
                  <SelectRolesPage adminCredentials={adminCredentials} />
                  <NextButton item={MenuItems.SELECT_AUTOMATION} />
                </>
              )}
            />
            <Route
              path={`${matchPath}/${MenuItems.SELECT_AUTOMATION}`}
              component={() => (
                <>
                  {isHubDeployment ? (
                    <SelectAutomationPage adminCredentials={adminCredentials} />
                  ) : (
                    <UnsupportedPageStep />
                  )}
                  <NextButton item={MenuItems.OFFER_SERVICES} />
                </>
              )}
            />
            <Route
              path={`${matchPath}/${MenuItems.OFFER_SERVICES}`}
              component={() => (
                <>
                  <OfferServicesPage adminCredentials={adminCredentials} />
                  <NextButton item={MenuItems.REVIEW} />
                </>
              )}
            />
            <Route
              path={`${matchPath}/${MenuItems.REVIEW}`}
              component={() => (
                <>
                  <ReviewPage adminCredentials={adminCredentials} />
                  <NextButton item={MenuItems.LOG_IN} />
                </>
              )}
            />
            <Route
              path={`${matchPath}/${MenuItems.LOG_IN}`}
              component={() => <FinishPage adminCredentials={adminCredentials} />}
            />
          </Switch>
        </div>
      </div>
    </WellKnownPartiesProvider>
  );

  function checkIsDisabled(item: MenuItems) {
    const newSegment = history.location?.pathname.split('/quick-setup')[1].replace('/', '');
    const activeMenuItem = Object.values(MenuItems).find(s => s === newSegment);

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
});

const UnsupportedPageStep = () => {
  return (
    <div className="setup-page not-supported">
      <p className="page-row">This step is not supported locally.</p>
    </div>
  );
};

export const LoadingWheel = (props: { label?: string }) => {
  return (
    <Loader active indeterminate size="small">
      <p>{props.label || 'Loading...'}</p>
    </Loader>
  );
};

export default QuickSetup;
