import React, { useEffect, useState } from 'react';

import { Button, Loader, Menu } from 'semantic-ui-react';

import DamlLedger, { useLedger, useStreamQueries } from '@daml/react';
import { PartyDetails } from '@daml/hub-react';

import { useHistory } from 'react-router-dom';
import { PublicDamlProvider } from '../../Main';
import {
  DeploymentMode,
  deploymentMode,
  httpBaseUrl,
  wsBaseUrl,
  ledgerId,
  publicParty,
  isHubDeployment,
} from '../../config';

import classNames from 'classnames';

import Credentials, { computeCredentials } from '../../Credentials';
import { retrieveParties } from '../../Parties';

import { halfSecondPromise } from '../page/utils';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';

import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';

import { Service as RegulatorService } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

import { deployAutomation, MarketplaceTrigger, TRIGGER_HASH } from '../../automation';
import { AutomationProvider } from '../../context/AutomationContext';
import { ServicesProvider } from '../../context/ServicesContext';
import { RolesProvider } from '../../context/RolesContext';
import { OffersProvider } from '../../context/OffersContext';

import { ArrowLeftIcon, ArrowRightIcon, OpenMarketplaceLogo } from '../../icons/icons';
import QueryStreamProvider from '../../websocket/queryStream';
import { WellKnownPartiesProvider } from '@daml/hub-react/lib';

import AddPartiesPage from './AddPartiesPage';
import SelectRolesPage from './SelectRolesPage';
import SelectAutomationPage from './SelectAutomationPage';
import RequestServicesPage from './RequestServicesPage';
import ReviewPage from './ReviewPage';
import FinishPage from './FinishPage';

export enum ServiceKind {
  CLEARING = 'Clearing',
  CUSTODY = 'Custody',
  TRADING = 'Trading',
  MATCHING = 'Matching',
  SETTLEMENT = 'Settlement',
  REGULATOR = 'Regulator',
  DISTRIBUTION = 'Distribution',
}

export interface IQuickSetupData {
  roles?: ServiceKind[];
  automation?: string[];
}

export enum MenuItems {
  ADD_PARTIES = 'Add Parties',
  SELECT_ROLES = 'Select Roles',
  SELECT_AUTOMATION = 'Select Automation',
  REQUEST_SERVICES = 'Request Services',
  REVIEW = 'Review',
}

const AdminLedger = (props: {
  credentials: Credentials;
  onComplete: () => void;
  activeMenuItem?: MenuItems;
  setActiveMenuItem: (item?: MenuItems) => void;
}) => {
  const { credentials, onComplete, activeMenuItem, setActiveMenuItem } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const ledger = useLedger();

  const { contracts: operatorService, loading: operatorServiceLoading } =
    useStreamQueries(OperatorService);

  const { contracts: regulatorRoles, loading: regulatorRolesLoading } =
    useStreamQueries(RegulatorRole);

  useEffect(() => {
    setLoading(operatorServiceLoading || regulatorRolesLoading);
  }, [operatorServiceLoading, regulatorRolesLoading]);

  useEffect(() => {
    const createOperatorService = async () => {
      await ledger.create(OperatorService, { operator: credentials.party });
    };

    if (!operatorServiceLoading && operatorService.length === 0) {
      createOperatorService();
    }
  }, [operatorServiceLoading, operatorService]);

  useEffect(() => {
    const createRegulatorRole = async () => {
      await ledger.create(RegulatorRole, {
        operator: credentials.party,
        provider: credentials.party,
      });
    };

    if (!regulatorRolesLoading && regulatorRoles.length === 0) {
      createRegulatorRole();
    }
  }, [regulatorRolesLoading, regulatorRoles]);

  if (operatorService.length === 0 || loading) {
    return (
      <div className="setup-page">
        <LoadingWheel label="Loading Quick Setup..." />
      </div>
    );
  }

  if (activeMenuItem === MenuItems.SELECT_ROLES) {
    return <SelectRolesPage onComplete={() => setActiveMenuItem(MenuItems.SELECT_AUTOMATION)} />;
  } else if (activeMenuItem === MenuItems.SELECT_AUTOMATION) {
    return isHubDeployment ? (
      <SelectAutomationPage onComplete={() => setActiveMenuItem(MenuItems.REQUEST_SERVICES)} />
    ) : (
      <div className="setup-page not-supported">
        <p className="page-row">This step is not supported locally.</p>
        <Button
          className="ghost next"
          onClick={() => setActiveMenuItem(MenuItems.REQUEST_SERVICES)}
        >
          Next
        </Button>
      </div>
    );
  } else if (activeMenuItem === MenuItems.REQUEST_SERVICES) {
    return (
      <RequestServicesPage
        onComplete={() => {
          console.log('completing quick setup');
          onComplete();
          setActiveMenuItem(MenuItems.REVIEW);
        }}
      />
    );
  } else if (activeMenuItem === MenuItems.REVIEW) {
    return <ReviewPage onComplete={() => setActiveMenuItem(undefined)} />;
  }

  return <FinishPage />;
};

const CreateRoleContract = (props: { onFinish: () => void; party: PartyDetails }) => {
  const { onFinish, party } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const parties = retrieveParties() || [];

  const ledger = useLedger();

  const { contracts: regulatorServices, loading: regulatorServicesLoading } =
    useStreamQueries(RegulatorService);

  const { contracts: verifiedIdentities, loading: verifiedIdentityLoading } =
    useStreamQueries(VerifiedIdentity);

  useEffect(() => {
    if (loading) {
      return;
    }
    const allVerfified = parties.every(
      p => !!verifiedIdentities.find(v => v.payload.customer === p.party)
    );
    console.log('party is', party.partyName);
    console.log('allverified is', allVerfified);
    if (allVerfified) {
      onFinish();
    }
  }, [verifiedIdentities]);

  useEffect(() => {
    setLoading(regulatorServicesLoading || verifiedIdentityLoading);
  }, [regulatorServicesLoading, verifiedIdentityLoading]);

  useEffect(() => {
    if (loading) {
      return;
    }
    async function handleVerifiedIdentity() {
      let retries = 0;

      const legalName = party.partyName;
      const location = 'none';

      while (retries < 3) {
        console.log('attempting to verify party', party.partyName);

        if (regulatorServices.length > 0) {
          await Promise.all(
            regulatorServices.map(async service => {
              if (legalName && location) {
                await ledger.exercise(
                  RegulatorService.RequestIdentityVerification,
                  service.contractId,
                  {
                    legalName,
                    location,
                    observers: [publicParty],
                  }
                );
              }
            })
          );
          console.log('verified', party.partyName);

          break;
        } else {
          await halfSecondPromise();
          retries++;
        }
      }
    }
    handleVerifiedIdentity();
  }, [loading, regulatorServices]);

  return null;
};

const QuickSetup = () => {
  const localCreds = computeCredentials('Operator');

  const [adminCredentials, setAdminCredentials] = useState<Credentials>(localCreds);
  const [submitSetupData, setSubmitSetupData] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItems | undefined>(
    MenuItems.ADD_PARTIES
  );

  const history = useHistory();

  const parties =
    retrieveParties()?.filter(p => p.party != publicParty && p.party != adminCredentials?.party) ||
    [];

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

  return (
    <div className="quick-setup">
      <Button className="ghost dark back-button" onClick={() => history.push('/login')}>
        <ArrowLeftIcon color={'white'} />
        Back
      </Button>
      <div className="quick-setup-header">
        <h1 className="logo-header">
          <OpenMarketplaceLogo size="32" /> Daml Open Marketplace
        </h1>
        {activeMenuItem ? <h2>Market Set-Up</h2> : <h2>Log In</h2>}
      </div>
      <div className="quick-setup-tile">
        {activeMenuItem && (
          <Menu pointing secondary className="quick-setup-menu">
            {Object.values(MenuItems).map((item, i) => (
              <>
                <Menu.Item
                  key={i}
                  disabled={checkIsDisabled(item)}
                  active={activeMenuItem === item}
                  onClick={() => setActiveMenuItem(item)}
                >
                  <p className={classNames({ visited: !checkIsDisabled(item) })}>{item}</p>
                </Menu.Item>
                {i + 1 !== Object.values(MenuItems).length && (
                  <ArrowRightIcon
                    color={checkIsDisabled(Object.values(MenuItems)[i + 1]) ? 'grey' : 'blue'}
                  />
                )}
              </>
            ))}
          </Menu>
        )}
        {activeMenuItem === MenuItems.ADD_PARTIES ? (
          <AddPartiesPage
            localOperator={localCreds.party}
            onComplete={() => setActiveMenuItem(MenuItems.SELECT_ROLES)}
          />
        ) : adminCredentials ? (
          <WellKnownPartiesProvider>
            <DamlLedger
              token={adminCredentials.token}
              party={adminCredentials.party}
              httpBaseUrl={httpBaseUrl}
              wsBaseUrl={wsBaseUrl}
            >
              <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
                <ServicesProvider>
                  <RolesProvider>
                    <OffersProvider>
                      <AutomationProvider publicParty={publicParty}>
                        <AdminLedger
                          credentials={adminCredentials}
                          onComplete={() => setSubmitSetupData(true)}
                          activeMenuItem={activeMenuItem}
                          setActiveMenuItem={setActiveMenuItem}
                        />
                      </AutomationProvider>
                    </OffersProvider>
                  </RolesProvider>
                </ServicesProvider>
              </QueryStreamProvider>
            </DamlLedger>
          </WellKnownPartiesProvider>
        ) : (
          <LoadingWheel label="Loading credentials..." />
        )}
      </div>
      {submitSetupData &&
        parties.map(p => (
          <WellKnownPartiesProvider>
            <PublicDamlProvider
              party={p.party}
              token={p.token}
              httpBaseUrl={httpBaseUrl}
              wsBaseUrl={wsBaseUrl}
            >
              <CreateRoleContract party={p} onFinish={() => setSubmitSetupData(false)} />
            </PublicDamlProvider>
          </WellKnownPartiesProvider>
        ))}
    </div>
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
};

export const LoadingWheel = (props: { label?: string }) => {
  return (
    <Loader active indeterminate inverted size="small">
      <p>{props.label || 'Loading...'}</p>
    </Loader>
  );
};

export default QuickSetup;
