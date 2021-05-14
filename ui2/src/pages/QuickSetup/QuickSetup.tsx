import React, { useEffect, useState } from 'react';

import { Button, Loader, Menu } from 'semantic-ui-react';

import { useHistory } from 'react-router-dom';

import classNames from 'classnames';

import DamlLedger, { useLedger, useStreamQueries } from '@daml/react';
import { PartyDetails } from '@daml/hub-react';
import { WellKnownPartiesProvider } from '@daml/hub-react/lib';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import { Service as RegulatorService } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

import { PublicDamlProvider } from '../../Main';

import { httpBaseUrl, wsBaseUrl, ledgerId, publicParty, isHubDeployment } from '../../config';

import Credentials, { computeCredentials } from '../../Credentials';
import { retrieveParties, retrieveUserParties } from '../../Parties';

import { halfSecondPromise } from '../page/utils';

import { deployAutomation, MarketplaceTrigger, TRIGGER_HASH } from '../../automation';

import { ArrowLeftIcon, ArrowRightIcon, OpenMarketplaceLogo } from '../../icons/icons';
import QueryStreamProvider from '../../websocket/queryStream';

import AddPartiesPage from './AddPartiesPage';
import SelectRolesPage from './SelectRolesPage';
import SelectAutomationPage from './SelectAutomationPage';
import OfferServicesPage from './OfferServicesPage';
import ReviewPage from './ReviewPage';
import FinishPage from './FinishPage';

export enum MenuItems {
  ADD_PARTIES = 'Add Parties',
  SELECT_ROLES = 'Select Roles',
  SELECT_AUTOMATION = 'Select Automation',
  OFFER_SERVICES = 'Offer Services',
  REVIEW = 'Review',
}

const QuickSetup = () => {
  const localCreds = computeCredentials('Operator');
  const history = useHistory();
  const parties = retrieveParties() || [];
  const userParties = retrieveUserParties();

  const [adminCredentials, setAdminCredentials] = useState<Credentials>(localCreds);
  const [creatingVerifiedIdentities, setCreatingVerifiedIdentities] = useState(false);
  const [creatingAdminContracts, setCreatingAdminContracts] = useState(false);

  const [activeMenuItem, setActiveMenuItem] = useState<MenuItems | undefined>(
    MenuItems.ADD_PARTIES
  );

  useEffect(() => {
    if (isHubDeployment) {
      const adminParty = parties.find(p => p.partyName === 'UserAdmin');
      if (adminParty) {
        setAdminCredentials({ token: adminParty.token, party: adminParty.party, ledgerId });
      }
    }
  }, [activeMenuItem]);

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

  let activePage;

  if (creatingAdminContracts) {
    activePage = (
      <DamlLedger
        token={adminCredentials.token}
        party={adminCredentials.party}
        httpBaseUrl={httpBaseUrl}
        wsBaseUrl={wsBaseUrl}
      >
        <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
          <AdminLedger
            adminCredentials={adminCredentials}
            onFinish={() => {
              setCreatingAdminContracts(false);
              setCreatingVerifiedIdentities(true);
            }}
          />
        </QueryStreamProvider>
      </DamlLedger>
    );
  } else if (activeMenuItem === MenuItems.ADD_PARTIES) {
    activePage = (
      <AddPartiesPage
        localOperator={localCreds.party}
        onComplete={() => {
          setCreatingAdminContracts(true);
          setActiveMenuItem(MenuItems.SELECT_ROLES);
        }}
      />
    );
  } else if (activeMenuItem === MenuItems.SELECT_ROLES) {
    activePage = (
      <SelectRolesPage
        adminCredentials={adminCredentials}
        onComplete={() => setActiveMenuItem(MenuItems.SELECT_AUTOMATION)}
      />
    );
  } else if (activeMenuItem === MenuItems.SELECT_AUTOMATION) {
    activePage = isHubDeployment ? (
      <SelectAutomationPage
        adminCredentials={adminCredentials}
        onComplete={() => setActiveMenuItem(MenuItems.OFFER_SERVICES)}
      />
    ) : (
      <UnsupportedPageStep onComplete={() => setActiveMenuItem(MenuItems.OFFER_SERVICES)} />
    );
  } else if (activeMenuItem === MenuItems.OFFER_SERVICES) {
    activePage = (
      <OfferServicesPage
        adminCredentials={adminCredentials}
        onComplete={() => {
          setActiveMenuItem(MenuItems.REVIEW);
        }}
        backToSelectRoles={() => setActiveMenuItem(MenuItems.SELECT_ROLES)}
      />
    );
  } else if (activeMenuItem === MenuItems.REVIEW) {
    activePage = (
      <ReviewPage
        adminCredentials={adminCredentials}
        onComplete={() => {
          setActiveMenuItem(undefined);
        }}
      />
    );
  } else if (activeMenuItem === undefined) {
    activePage = <FinishPage adminCredentials={adminCredentials} />;
  }

  return (
    <WellKnownPartiesProvider>
      <div className="quick-setup">
        <div className="page-controls">
          <Button className="ghost dark control-button" onClick={() => history.push('/login')}>
            <ArrowLeftIcon color={'white'} />
            Back
          </Button>
          <Button
            className="ghost dark control-button"
            onClick={() => setActiveMenuItem(undefined)}
          >
            Skip to Log In
            <ArrowRightIcon color={'white'} />
          </Button>
        </div>

        <div className="quick-setup-header">
          <h1 className="logo-header">
            <OpenMarketplaceLogo size="32" /> Daml Open Marketplace
          </h1>
          {activeMenuItem ? <h2>Market Set-Up</h2> : <h2>Log In</h2>}
        </div>

        <div className="quick-setup-tile">
          {activeMenuItem && (
            <Menu pointing secondary className="quick-setup-menu page-row">
              {Object.values(MenuItems).map((item, i) => (
                <>
                  <Menu.Item
                    key={i}
                    disabled={
                      item === MenuItems.ADD_PARTIES ? false : userParties.length === 0 && true
                    }
                    active={activeMenuItem === item}
                    onClick={() => setActiveMenuItem(item)}
                  >
                    <p className={classNames({ visited: !checkIsVisited(item) })}>{item}</p>
                  </Menu.Item>
                  {i + 1 !== Object.values(MenuItems).length && (
                    <ArrowRightIcon
                      color={checkIsVisited(Object.values(MenuItems)[i + 1]) ? 'grey' : 'blue'}
                    />
                  )}
                </>
              ))}
            </Menu>
          )}
          {activePage}
        </div>

        {creatingVerifiedIdentities &&
          parties.map(p => (
            <DamlLedger
              party={p.party}
              token={p.token}
              httpBaseUrl={httpBaseUrl}
              wsBaseUrl={wsBaseUrl}
            >
              <QueryStreamProvider defaultPartyToken={p.token}>
                <CreateVerifiedIdentities
                  party={p}
                  onFinish={() => setCreatingVerifiedIdentities(false)}
                />
              </QueryStreamProvider>
            </DamlLedger>
          ))}
      </div>
    </WellKnownPartiesProvider>
  );

  function checkIsVisited(item: MenuItems) {
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
};

const UnsupportedPageStep = (props: { onComplete: () => void }) => {
  return (
    <div className="setup-page not-supported">
      <p className="page-row">This step is not supported locally.</p>
      <Button className="ghost next" onClick={() => props.onComplete()}>
        Next
      </Button>
    </div>
  );
};

const AdminLedger = (props: { adminCredentials: Credentials; onFinish: () => void }) => {
  const { adminCredentials, onFinish } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const ledger = useLedger();

  const { contracts: operatorService, loading: operatorServiceLoading } =
    useStreamQueries(OperatorService);
  const { contracts: regulatorRoles, loading: regulatorRolesLoading } =
    useStreamQueries(RegulatorRole);

  useEffect(() => {
    setLoading(regulatorRolesLoading || operatorServiceLoading);
  }, [regulatorRolesLoading, operatorServiceLoading]);

  useEffect(() => {
    if (loading) return;

    if (regulatorRoles.length > 0 && operatorService.length > 0) {
      console.log(regulatorRoles);
      console.log(operatorService);

      return onFinish();
    }
  }, [loading, operatorService, regulatorRoles]);

  useEffect(() => {
    if (loading) return;

    const createOperatorService = async () => {
      console.log('Creating Operator Service');
      await ledger.create(OperatorService, { operator: adminCredentials.party });
    };

    if (operatorService.length === 0) {
      createOperatorService();
    }

    const createRegulatorRole = async () => {
      console.log('Creating Operator Regulator Role');

      await ledger.create(RegulatorRole, {
        operator: adminCredentials.party,
        provider: adminCredentials.party,
      });
    };

    if (regulatorRoles.length === 0) {
      createRegulatorRole();
    }
  }, [loading, regulatorRoles, operatorService]);

  return (
    <div className="setup-page loading">
      <LoadingWheel label="Loading Quick Set Up..." />
    </div>
  );
};

const CreateVerifiedIdentities = (props: { onFinish: () => void; party: PartyDetails }) => {
  const { onFinish, party } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const parties = retrieveUserParties();

  const ledger = useLedger();

  const { contracts: regulatorServices, loading: regulatorServicesLoading } =
    useStreamQueries(RegulatorService);

  const { contracts: verifiedIdentities, loading: verifiedIdentityLoading } =
    useStreamQueries(VerifiedIdentity);

  useEffect(() => {
    if (loading) return;

    if (parties.every(p => !!verifiedIdentities.find(v => v.payload.customer === p.party))) {
      onFinish();
    }
  }, [verifiedIdentities]);

  useEffect(() => {
    setLoading(regulatorServicesLoading || verifiedIdentityLoading);
  }, [regulatorServicesLoading, verifiedIdentityLoading]);

  useEffect(() => {
    if (loading) return;

    if (!verifiedIdentities.find(id => id.payload.customer === party.party)) {
      console.log('Creating Verified Identity for', party.partyName);

      handleVerifiedIdentity();
    }
  }, [loading, regulatorServices]);

  return null;

  async function handleVerifiedIdentity() {
    let retries = 0;

    if (regulatorServices.length === 0 ){
        
    }
    while (retries < 3) {
      if (regulatorServices.length > 0) {
        await Promise.all(
          regulatorServices.map(async service => {
            await ledger
              .exercise(RegulatorService.RequestIdentityVerification, service.contractId, {
                legalName: party.partyName,
                location: '',
                observers: [publicParty],
              })
              .catch(resp => console.log(resp));
          })
        );
        break;
      } else {
        ledger.create(RegulatorRequest, { customer, provider });
        await halfSecondPromise();
        retries++;
      }
    }
  }
};

export const LoadingWheel = (props: { label?: string }) => {
  return (
    <Loader active indeterminate size="small">
      <p>{props.label || 'Loading...'}</p>
    </Loader>
  );
};

export default QuickSetup;
