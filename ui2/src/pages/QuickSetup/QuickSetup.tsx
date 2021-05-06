import React, { useEffect, useState } from 'react';

import {
  Form,
  Button,
  Icon,
  Loader,
  Table,
  DropdownItemProps,
  Grid,
  Menu,
  Header,
} from 'semantic-ui-react';

import DamlLedger, { useLedger, useStreamQueries } from '@daml/react';
import { DablPartiesInput, PartyDetails } from '@daml/hub-react';

import { useUserDispatch, loginUser } from '../../context/UserContext';
import { useHistory, NavLink } from 'react-router-dom';
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

import Credentials, { computeCredentials } from '../../Credentials';
import { retrieveParties, storeParties } from '../../Parties';

import { halfSecondPromise } from '../page/utils';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';

import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';

import {
  Offer as RegulatorServiceOffer,
  Service as RegulatorService,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

import { deployAutomation, MarketplaceTrigger, TRIGGER_HASH } from '../../automation';
import { AutomationProvider } from '../../context/AutomationContext';
import { ServicesProvider } from '../../context/ServicesContext';
import { RolesProvider } from '../../context/RolesContext';
import { OffersProvider } from '../../context/OffersContext';

import { SetupAutomation } from '../setup/SetupAutomation';
import { ArrowLeftIcon, ArrowRightIcon, OpenMarketplaceLogo } from '../../icons/icons';
import QueryStreamProvider from '../../websocket/queryStream';
import { WellKnownPartiesProvider } from '@daml/hub-react/lib';

import AddPartiesPage from './AddPartiesPage';
import SelectRolesPage from './SelectRolesPage';
import SelectAutomationPage from './SelectAutomationPage';
import RequestServicesPage from './RequestServicesPage';
import ReviewPage from './ReviewPage';

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

const QuickSetupWizard = (props: {
  credentials: Credentials;
  parties: PartyDetails[];
  handleNewParties: (newParties: PartyDetails[]) => void;
}) => {
  const { credentials, parties, handleNewParties } = props;

  const [activeMenuItem, setActiveMenuItem] = useState<MenuItems>(MenuItems.ADD_PARTIES);

  const [loading, setLoading] = useState<boolean>(false);

  const ledger = useLedger();

  const { contracts: operatorService, loading: operatorServiceLoading } = useStreamQueries(
    OperatorService
  );
  const { contracts: regulatorRoles, loading: regulatorRolesLoading } = useStreamQueries(
    RegulatorRole
  );
  const { contracts: regulatorServices, loading: regulatorServicesLoading } = useStreamQueries(
    RegulatorService
  );

  useEffect(() => {
    setLoading(operatorServiceLoading || regulatorRolesLoading || regulatorServicesLoading);
  }, [operatorServiceLoading, regulatorRolesLoading, regulatorServicesLoading]);

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
    return <LoadingWheel label="Loading Quick Setup..." />;
  }

  return (
    <div className="quick-setup-tile">
      <Menu pointing secondary className="quick-setup-menu">
        {Object.values(MenuItems).map((item, idx) =>
          !isHubDeployment && item === MenuItems.SELECT_AUTOMATION ? null : (
            <>
              <Menu.Item
                key={idx}
                disabled={checkIsDisabled(item)}
                active={activeMenuItem === item}
                onClick={() => setActiveMenuItem(item)}
              >
                <p>{item}</p>
              </Menu.Item>
              {idx + 1 !== Object.values(MenuItems).length && <ArrowRightIcon color="black" />}
            </>
          )
        )}
      </Menu>

      {activeMenuItem === MenuItems.ADD_PARTIES && (
        <AddPartiesPage
          parties={parties}
          operator={credentials.party}
          toNextPage={addPartiesToNextPage}
        />
      )}

      {activeMenuItem === MenuItems.SELECT_ROLES && (
        <SelectRolesPage
          parties={parties}
          toNextPage={() =>
            setActiveMenuItem(
              isHubDeployment ? MenuItems.SELECT_AUTOMATION : MenuItems.REQUEST_SERVICES
            )
          }
        />
      )}

      {activeMenuItem === MenuItems.SELECT_AUTOMATION && isHubDeployment && (
        <SelectAutomationPage
          parties={parties}
          toNextPage={() => setActiveMenuItem(MenuItems.REQUEST_SERVICES)}
          credentials={credentials}
        />
      )}

      {activeMenuItem === MenuItems.REQUEST_SERVICES && (
        <RequestServicesPage toNextPage={() => completeQuickSetup()} />
      )}

      {activeMenuItem === MenuItems.REVIEW && <ReviewPage />}
    </div>
  );

  function completeQuickSetup() {
    setActiveMenuItem(MenuItems.REVIEW);
    onComplete();
  }

  function addPartiesToNextPage(newParties: PartyDetails[]) {
    handleNewParties(newParties);
    setActiveMenuItem(MenuItems.SELECT_ROLES);
  }

  function checkIsDisabled(item: MenuItems) {
    const menuItems = Object.values(MenuItems);
    const clickedItemIndex = menuItems.indexOf(item);
    const activeItemIndex = menuItems.indexOf(activeMenuItem);

    if (clickedItemIndex > activeItemIndex) {
      return true;
    }
    return false;
  }

  async function onComplete() {
    return await Promise.all(parties.map(p => handleVerifiedIdentity(p)));
  }

  async function handleVerifiedIdentity(party: PartyDetails) {
    let retries = 0;

    const legalName = party.partyName;
    const location = 'none';

    while (retries < 3) {
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
        break;
      } else {
        await halfSecondPromise();
        retries++;
      }
    }
  }
};

const QuickSetup = () => {
  const localCreds = computeCredentials('Operator');
  const [parties, setParties] = useState<PartyDetails[]>([]);
  const [adminCredentials, setAdminCredentials] = useState<Credentials>(localCreds);
  const history = useHistory();

  useEffect(() => {
    const newParties = retrieveParties();
    if (newParties) {
      handleNewParties(newParties);
    }
  }, []);

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

  function handleNewParties(newParties: PartyDetails[]) {
    const adminParty = newParties.find(p => p.partyName === 'UserAdmin');

    if (deploymentMode === DeploymentMode.PROD_DABL && adminParty) {
      setParties(newParties.filter(p => p.party != publicParty && p != adminParty));
      setAdminCredentials({ token: adminParty.token, party: adminParty.party, ledgerId });
    } else {
      setParties(newParties);
    }
  }

  return adminCredentials ? (
    <div className="quick-setup">
      <Button className="back-button ghost dark" onClick={() => history.push('/login')}>
        <ArrowLeftIcon color={'white'} />
        Back
      </Button>
      <div className="header">
        <h1 className="logo-header">
          <OpenMarketplaceLogo size="32" /> Daml Open Marketplace
        </h1>
        <h2>Market Set-Up</h2>
      </div>

      <WellKnownPartiesProvider>
        <PublicDamlProvider
          token={adminCredentials.token}
          party={adminCredentials.party}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <QueryStreamProvider>
            <ServicesProvider>
              <RolesProvider>
                <OffersProvider>
                  <AutomationProvider publicParty={publicParty}>
                    <QuickSetupWizard
                      credentials={adminCredentials}
                      handleNewParties={handleNewParties}
                      parties={parties}
                    />
                  </AutomationProvider>
                </OffersProvider>
              </RolesProvider>
            </ServicesProvider>
          </QueryStreamProvider>
        </PublicDamlProvider>
      </WellKnownPartiesProvider>
    </div>
  ) : (
    <LoadingWheel label="Loading credentials..." />
  );
};

const LoadingWheel = (props: { label?: string }) => {
  return (
    <Loader active indeterminate inverted size="small">
      <p className="dark">{props.label || 'Loading...'}</p>
    </Loader>
  );
};

export default QuickSetup;
