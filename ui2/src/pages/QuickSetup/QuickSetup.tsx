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
import {
  Offer as ClearingOffer,
  Role as ClearingRole,
} from '@daml.js/da-marketplace/lib/Marketplace/Clearing/Role';
import {
  Offer as CustodianOffer,
  Role as CustodianRole,
} from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import {
  Offer as DistributorOffer,
  Role as DistributorRole,
} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import {
  Offer as SettlementOffer,
  Service as SettlementService,
} from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import {
  Offer as ExchangeOffer,
  Role as ExchangeRole,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import {
  Offer as MatchingOffer,
  Service as MatchingService,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';

import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';

import {
  Offer as RegulatorServiceOffer,
  Service as RegulatorService,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

import {
  deployAutomation,
  MarketplaceTrigger,
  PublicAutomation,
  TRIGGER_HASH,
} from '../../automation';
import { handleSelectMultiple } from '../common';
import { useAutomations, AutomationProvider } from '../../context/AutomationContext';
import { ServicesProvider, useCustomerServices } from '../../context/ServicesContext';
import { RolesProvider, useRoles, useOffers } from '../../context/RoleContext';

import { SetupAutomation, makeAutomationOptions } from '../setup/SetupAutomation';
import { ArrowLeftIcon, ArrowRightIcon, OpenMarketplaceLogo } from '../../icons/icons';
import QueryStreamProvider, { useContractQuery } from '../../websocket/queryStream';
import {
  PublicLedger,
  useStreamQueriesAsPublic as usqp,
  WellKnownPartiesProvider,
} from '@daml/hub-react/lib';

import AddPartiesPage from './AddPartiesPage';
import SelectRolesPage from './SelectRolesPage';
import SelectAutomationPage from './SelectAutomationPage';
import RequestServicesPage from './RequestServicesPage';
import ReviewPage from './ReviewPage';
import { MenuItem } from '@material-ui/core';

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
  creatingRoleContracts: boolean;
  onComplete: () => void;
  handleNewParties: (newParties: PartyDetails[]) => void;
}) => {
  const { credentials, parties, onComplete, creatingRoleContracts, handleNewParties } = props;

  const [activeMenuItem, setActiveMenuItem] = useState<MenuItems>(MenuItems.ADD_PARTIES);

  const [loading, setLoading] = useState<boolean>(false);
  const [toDeploy, setToDeploy] = useState<string[]>([]);

  const ledger = useLedger();
  const operator = credentials.party;
  // const roles = useCustomerServices(credentials.party)
  // console.log(roles)
  const handleDeployment = async (token: string) => {
    for (const auto of toDeploy) {
      const [name, hash] = auto.split('#');
      if (hash) {
        deployAutomation(hash, name, token, publicParty);
      }
    }
  };

  const clearingRoles = useStreamQueries(ClearingRole);
  const custodianRoles = useStreamQueries(CustodianRole);
  const exchangeRoles = useStreamQueries(ExchangeRole);
  const distributorRoles = useStreamQueries(DistributorRole);
  const regulatorRoles = useStreamQueries(RegulatorRole);
  const regulatorServices = useStreamQueries(RegulatorService);
  const settlementServices = useStreamQueries(SettlementService);
  const matchingServices = useStreamQueries(MatchingService);
  const operatorService = useStreamQueries(OperatorService);

  const clearingOffers = useStreamQueries(ClearingOffer);
  const regulatorServiceOffers = useStreamQueries(RegulatorServiceOffer);
  const custodianOffers = useStreamQueries(CustodianOffer);
  const distributorOffers = useStreamQueries(DistributorOffer);
  const settlementOffers = useStreamQueries(SettlementOffer);
  const exhangeOffers = useStreamQueries(ExchangeOffer);
  const matchingOffers = useStreamQueries(MatchingOffer);

  const verifiedIdentities = useStreamQueries(VerifiedIdentity);

  useEffect(() => {
    setLoading(
      custodianRoles.loading ||
        clearingRoles.loading ||
        regulatorRoles.loading ||
        regulatorServices.loading ||
        distributorRoles.loading ||
        settlementServices.loading ||
        exchangeRoles.loading ||
        matchingServices.loading ||
        operatorService.loading ||
        clearingOffers.loading ||
        custodianOffers.loading ||
        distributorOffers.loading ||
        settlementOffers.loading ||
        exhangeOffers.loading ||
        matchingOffers.loading ||
        verifiedIdentities.loading
    );
  }, [
    custodianRoles.loading,
    clearingRoles.loading,
    distributorRoles.loading,
    regulatorRoles.loading,
    regulatorServices.loading,
    settlementServices.loading,
    exchangeRoles.loading,
    matchingServices.loading,
    operatorService.loading,
    clearingOffers.loading,
    custodianOffers.loading,
    distributorOffers.loading,
    settlementOffers.loading,
    exhangeOffers.loading,
    matchingOffers.loading,
    verifiedIdentities.loading,
  ]);

//   const roles = useRoles();
//   console.log(roles);

  useEffect(() => {
    const createOperatorService = async () => {
      await ledger.create(OperatorService, { operator: credentials.party });
    };

    if (!operatorService.loading && operatorService.contracts.length === 0) {
      createOperatorService();
    }
  }, [operatorService.loading, operatorService]);

  useEffect(() => {
    const createRegulatorRole = async () => {
      await ledger.create(RegulatorRole, {
        operator: credentials.party,
        provider: credentials.party,
      });
    };

    if (!regulatorRoles.loading && regulatorRoles.contracts.length === 0) {
      createRegulatorRole();
    }
  }, [regulatorRoles.loading, regulatorRoles]);

  //   const serviceOptions = Object.values(ServiceKind)
  //     .filter(s => !findExistingRole(s))
  //     .filter(s => !findExistingOffer(s))
  //     .filter(s => s !== ServiceKind.REGULATOR)
  //     .map(service => {
  //       return { text: service, value: service };
  //     });

  if (operatorService.contracts.length === 0 || loading) {
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
          //   quickSetupData={quickSetupData}
          //   setQuickSetupData={setQuickSetupData}
          toNextPage={() => selectRolesComplete()}
        />
      )}

      {activeMenuItem === MenuItems.SELECT_AUTOMATION && isHubDeployment && (
        <SelectAutomationPage
          parties={parties}
          //   quickSetupData={quickSetupData}
          //   setQuickSetupData={setQuickSetupData}
          toNextPage={() => setActiveMenuItem(MenuItems.REQUEST_SERVICES)}
          credentials={credentials}
        />
      )}

      {activeMenuItem === MenuItems.REQUEST_SERVICES && (
        <RequestServicesPage toNextPage={() => setActiveMenuItem(MenuItems.REVIEW)} />
      )}

      {activeMenuItem === MenuItems.REVIEW && <ReviewPage />}
    </div>
  );

  function addPartiesToNextPage(newParties: PartyDetails[]) {
    handleNewParties(newParties);
    setActiveMenuItem(MenuItems.SELECT_ROLES);
  }

  function selectRolesComplete() {
    setActiveMenuItem(isHubDeployment ? MenuItems.SELECT_AUTOMATION : MenuItems.REQUEST_SERVICES);
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

  //   function findExistingRole(service: string) {
  //     switch (service) {
  //       case ServiceKind.CLEARING:
  //         // TODO: once we can auto accept clearing roles we can remove this
  //         return (
  //           !!clearingRoles.contracts.find(c => c.payload.provider === provider) ||
  //           !!clearingOffers.contracts.find(c => c.payload.provider === provider)
  //         );
  //       case ServiceKind.CUSTODY:
  //         return !!custodianRoles.contracts.find(c => c.payload.provider === provider);
  //       case ServiceKind.TRADING:
  //         return !!exchangeRoles.contracts.find(c => c.payload.provider === provider);
  //       case ServiceKind.MATCHING:
  //         return !!matchingServices.contracts.find(c => c.payload.provider === provider);
  //       case ServiceKind.DISTRIBUTION:
  //         return !!distributorRoles.contracts.find(c => c.payload.provider === provider);
  //       case ServiceKind.SETTLEMENT:
  //         return !!settlementServices.contracts.find(c => c.payload.provider === provider);
  //     }
  //   }
};

const MarketSetup = (props: {
  parties: PartyDetails[];
  loading: boolean;
  marketSetupDataMap: Map<string, IQuickSetupData>;
}) => {
  const { parties, loading, marketSetupDataMap } = props;
  const dispatch = useUserDispatch();
  const history = useHistory();

  const marketDataParties = Array.from(marketSetupDataMap.keys()).sort();

  if (loading) {
    return <LoadingWheel label="Loading market data..." />;
  }

  return (
    <Table className="party-registry-table" fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            <h4>Party</h4>
          </Table.HeaderCell>
          <Table.HeaderCell>
            <h4>Legal Name</h4>
          </Table.HeaderCell>
          <Table.HeaderCell>
            <h4>Location</h4>
          </Table.HeaderCell>
          <Table.HeaderCell>
            <h4>Services</h4>
          </Table.HeaderCell>
          {isHubDeployment && (
            <Table.HeaderCell>
              <h4>Setup Automation</h4>
            </Table.HeaderCell>
          )}
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {marketSetupDataMap.size > 0 ? (
          marketDataParties.map((p, i) => (
            <Table.Row key={i}>
              <Table.Cell>{parties.find(party => party.party === p)?.partyName || p}</Table.Cell>
              {/* <Table.Cell>{marketSetupDataMap.get(p)?.legalName}</Table.Cell> */}
              {/* <Table.Cell>{marketSetupDataMap.get(p)?.location}</Table.Cell> */}
              <Table.Cell>{marketSetupDataMap.get(p)?.roles?.sort().join(', ')}</Table.Cell>
              {isHubDeployment && (
                <Table.Cell>
                  <SetupAutomation
                    title={`Setup Automation: ${
                      parties.find(party => party.party === p)?.partyName
                    }`}
                    token={parties.find(party => party.party === p)?.token || ''}
                    modalTrigger={<NavLink to="#">Setup Automation</NavLink>}
                  />
                </Table.Cell>
              )}
              <Table.Cell>
                <Button
                  className="ghost"
                  onClick={() =>
                    loginUser(
                      dispatch,
                      history,
                      parties.find(party => party.party === p) || computeCredentials(p)
                    )
                  }
                >
                  Login
                </Button>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={4}>
              None
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

const CreateRoleContract = (props: {
  quickSetupData: IQuickSetupData;
  operator: string;
  onFinish: () => void;
}) => {
  const { quickSetupData, onFinish } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const ledger = useLedger();

  const regulatorServices = useStreamQueries(RegulatorService);

  useEffect(() => {
    setLoading(regulatorServices.loading);
  }, [regulatorServices.loading]);

  useEffect(() => {
    if (loading) {
      return;
    }

    async function handleVerifiedIdentity() {
      let retries = 0;

      while (retries < 3) {
        if (regulatorServices.contracts.length > 0) {
          await Promise.all(
            regulatorServices.contracts.map(async service => {
              //   if (legalName && location) {
              //     await ledger.exercise(
              //       RegulatorService.RequestIdentityVerification,
              //       service.contractId,
              //       {
              //         legalName,
              //         location,
              //         observers: [publicParty],
              //       }
              //     );
              //   }
            })
          );
          break;
        } else {
          await halfSecondPromise();
          retries++;
        }
      }
      onFinish();
    }

    handleVerifiedIdentity();
  }, [loading, regulatorServices.contracts]);

  return null;
};

const QuickSetup = () => {
  const localCreds = computeCredentials('Operator');

  const [parties, setParties] = useState<PartyDetails[]>([]);
  //   const [quickSetupData, setQuickSetupData] = useState<Map<string, IQuickSetupData>>(new Map());

  const [adminCredentials, setAdminCredentials] = useState<Credentials>(localCreds);
  const [submitSetupData, setSubmitSetupData] = useState(false);

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
        <DamlLedger
          token={adminCredentials.token}
          party={adminCredentials.party}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <QueryStreamProvider>
            <ServicesProvider>
              <RolesProvider>
                <AutomationProvider publicParty={publicParty}>
                  <QuickSetupWizard
                    credentials={adminCredentials}
                    //   quickSetupData={quickSetupData}
                    handleNewParties={handleNewParties}
                    //   setQuickSetupData={setQuickSetupData}
                    parties={parties}
                    creatingRoleContracts={submitSetupData}
                    onComplete={() => setSubmitSetupData(true)}
                  />
                </AutomationProvider>
              </RolesProvider>
            </ServicesProvider>
          </QueryStreamProvider>
        </DamlLedger>
      </WellKnownPartiesProvider>
      {/*
      {quickSetupData.party && quickSetupData.services && submitSetupData && (
        <DamlLedger
          party={quickSetupData.party.party}
          token={quickSetupData.party.token}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <CreateRoleContract
            quickSetupData={quickSetupData}
            operator={adminCredentials.party}
            onFinish={() => {
              setQuickSetupData({ party: quickSetupData.party, services: [] });
              setSubmitSetupData(false);
            }}
          />
        </DamlLedger>
      )} */}
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
