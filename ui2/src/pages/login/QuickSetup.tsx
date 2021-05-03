import React, { useEffect, useState } from 'react';

import { Form, Button, Icon, Loader, Table, DropdownItemProps, Grid } from 'semantic-ui-react';

import DamlLedger, { useLedger, useStreamQueries } from '@daml/react';
import { DablPartiesInput, PartyDetails } from '@daml/hub-react';

import { useUserDispatch, loginUser } from '../../context/UserContext';
import { useHistory, NavLink } from 'react-router-dom';

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
  getPublicAutomation,
  MarketplaceTrigger,
  TRIGGER_HASH,
} from '../../automation';
import { handleSelectMultiple } from '../common';
import { useAutomations, AutomationProvider } from '../../context/AutomationContext';
import { SetupAutomation, makeAutomationOptions } from '../setup/SetupAutomation';

enum ServiceKind {
  CLEARING = 'Clearing',
  CUSTODY = 'Custody',
  LISTING = 'Listing',
  TRADING = 'Trading',
  MATCHING = 'Matching',
  SETTLEMENT = 'Settlement',
  REGULATOR = 'Regulator',
}

interface IVerifiedIdentityData {
  legalName?: string;
  location?: string;
}

interface IQuickSetupData extends IVerifiedIdentityData {
  party?: PartyDetails;
  services?: string[];
}

const QuickSetupTable = (props: {
  credentials: Credentials;
  quickSetupData: IQuickSetupData;
  setQuickSetupData: (data: IQuickSetupData) => void;
  parties: PartyDetails[];
  creatingRoleContracts: boolean;
  onComplete: () => void;
}) => {
  const {
    credentials,
    quickSetupData,
    setQuickSetupData,
    parties,
    onComplete,
    creatingRoleContracts,
  } = props;

  const [status, setStatus] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [toDeploy, setToDeploy] = useState<string[]>([]);
  const [marketSetupDataMap, setMarketSetupDataMap] = useState<Map<string, IQuickSetupData>>(
    new Map()
  );
  const [verifiedIdentity, setVerifiedIdentity] = useState<IVerifiedIdentityData>();

  const ledger = useLedger();
  const operator = credentials.party;

  const automations = useAutomations();
  const triggerOptions: DropdownItemProps[] = makeAutomationOptions(automations);

  const handleDeployment = async (token: string) => {
    for (const auto of toDeploy) {
      const [name, hash] = auto.split('#');
      if (hash) {
        deployAutomation(hash, name, token, publicParty);
      }
    }
  };

  const { party, services } = quickSetupData;
  const provider = party?.party;

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

  useEffect(() => {
    if (verifiedIdentities.loading) return;

    const verifiedIdentityContract = verifiedIdentities.contracts.find(
      c => c.payload.customer === quickSetupData?.party?.party
    );

    let identityInfo: IVerifiedIdentityData = {
      legalName: undefined,
      location: undefined,
    };

    if (verifiedIdentityContract) {
      identityInfo = {
        legalName: verifiedIdentityContract.payload.legalName,
        location: verifiedIdentityContract.payload.location,
      };
    }

    setVerifiedIdentity(identityInfo);
    setQuickSetupData({
      ...quickSetupData,
      ...identityInfo,
    });
  }, [verifiedIdentities.loading, verifiedIdentities, quickSetupData?.party]);

  useEffect(() => {
    if (loading) return;

    let newMarketData: Map<string, IQuickSetupData> = new Map();

    clearingRoles.contracts.forEach(c => addMarketData(c.payload.provider, ServiceKind.CLEARING));

    // TODO: Add ability to create accounts
    clearingOffers.contracts.forEach(c =>
      addMarketData(c.payload.provider, ServiceKind.CLEARING + ' (Pending)')
    );
    custodianRoles.contracts.forEach(c => addMarketData(c.payload.provider, ServiceKind.CUSTODY));
    distributorRoles.contracts.forEach(c => addMarketData(c.payload.provider, ServiceKind.LISTING));
    settlementServices.contracts.forEach(c =>
      addMarketData(c.payload.provider, ServiceKind.SETTLEMENT)
    );
    exchangeRoles.contracts.forEach(c => addMarketData(c.payload.provider, ServiceKind.TRADING));
    matchingServices.contracts.forEach(c =>
      addMarketData(c.payload.provider, ServiceKind.MATCHING)
    );

    function addMarketData(party: string, serviceName: string) {
      const currentQuickSetupData = newMarketData.get(party);
      newMarketData.set(party, {
        ...currentQuickSetupData,
        services: [...(currentQuickSetupData?.services || []), serviceName],
      });
    }

    verifiedIdentities.contracts.forEach(c => {
      const currentQuickSetupData = newMarketData.get(c.payload.customer);
      if (currentQuickSetupData) {
        newMarketData.set(c.payload.customer, {
          ...currentQuickSetupData,
          legalName: c.payload.legalName,
          location: c.payload.location,
        });
      }
    });

    setMarketSetupDataMap(newMarketData);
  }, [
    loading,
    clearingRoles.contracts.length,
    custodianRoles.contracts.length,
    distributorRoles.contracts.length,
    settlementServices.contracts.length,
    exchangeRoles.contracts.length,
    matchingServices.contracts.length,
    verifiedIdentities.contracts.length,
  ]);

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

  const partyOptions = parties.map(party => {
    return { text: party.partyName, value: party.party };
  });

  const serviceOptions = Object.values(ServiceKind)
    .filter(s => !findExistingRole(s))
    .filter(s => !findExistingOffer(s))
    .filter(s => s !== ServiceKind.REGULATOR)
    .map(service => {
      return { text: service, value: service };
    });

  if (operatorService.contracts.length === 0 || loading) {
    return <LoadingWheel label="Loading Quick Setup..." />;
  }

  return (
    <div className="setup-tile">
      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
            {isHubDeployment ? (
              <Form.Select
                label={<h4 className="dark">Party</h4>}
                value={party ? partyOptions.find(p => party.party === p.value)?.value : ''}
                placeholder="Select..."
                onChange={(_, data: any) => handleChangeParty(data.value)}
                options={partyOptions}
              />
            ) : (
              <Form.Input
                label={<h4 className="dark">Party</h4>}
                placeholder="Username"
                onChange={e => handleChangeParty(e.currentTarget.value)}
              />
            )}
          </Grid.Column>
          <Grid.Column width={6}>
            {verifiedIdentity?.legalName ? (
              <Form.Input
                label={<h4 className="dark">Legal Name</h4>}
                value={verifiedIdentity?.legalName || ''}
                disabled={true}
              />
            ) : (
              <Form.Input
                label={<h4 className="dark">Legal Name</h4>}
                value={quickSetupData?.legalName || ''}
                placeholder="Legal Name"
                onChange={e =>
                  setQuickSetupData({ ...quickSetupData, legalName: e.currentTarget.value })
                }
              />
            )}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6}>
            {verifiedIdentity?.location ? (
              <Form.Input
                label={<h4 className="dark">Location</h4>}
                value={verifiedIdentity?.location || ''}
                disabled={true}
              />
            ) : (
              <Form.Input
                label={<h4 className="dark">Location</h4>}
                value={quickSetupData?.location || ''}
                placeholder="Location"
                onChange={e =>
                  setQuickSetupData({ ...quickSetupData, location: e.currentTarget.value })
                }
              />
            )}
          </Grid.Column>
          <Grid.Column width={6}>
            {serviceOptions.length > 0 ? (
              <Form.Select
                label={<h4 className="dark">Services</h4>}
                multiple
                value={services}
                disabled={!party}
                placeholder="Select..."
                onChange={(_, data: any) =>
                  setQuickSetupData({
                    ...quickSetupData,
                    services: data.value,
                  })
                }
                options={serviceOptions}
              />
            ) : (
              <p>All services added</p>
            )}
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={6}>
            {isHubDeployment && (
              <Form.Select
                label={<h4 className="dark">Automation</h4>}
                disabled={!party}
                placeholder="Select..."
                multiple
                value={toDeploy}
                onChange={(_, result) => handleSelectMultiple(result, toDeploy, setToDeploy)}
                options={triggerOptions}
              />
            )}
          </Grid.Column>
          <Grid.Column width={6}>
            {creatingRoleContracts ? (
              <Button disabled className="ghost" content={<p>Adding...</p>} />
            ) : (
              <Button
                disabled={!party || (services?.length === 0 && toDeploy.length === 0) || !!status}
                className="ghost"
                onClick={() => createRoleContract()}
                content={<p>Add</p>}
              />
            )}
          </Grid.Column>
        </Grid.Row>
        {!!status && (
          <Grid.Row>
            <Grid.Column width={12}>{status}</Grid.Column>
          </Grid.Row>
        )}
      </Grid>
      <MarketSetup parties={parties} loading={loading} marketSetupDataMap={marketSetupDataMap} />
    </div>
  );

  function handleChangeParty(newPartyId: string) {
    setStatus(undefined);

    let newParty: PartyDetails | undefined;

    if (deploymentMode === DeploymentMode.PROD_DABL) {
      newParty = parties.find(p => p.party === newPartyId);
    } else {
      const { ledgerId, party, token } = computeCredentials(newPartyId);

      newParty = {
        ledgerId,
        party,
        token,
        owner: operator,
        partyName: newPartyId,
      };
    }

    if (!newParty) return;

    setQuickSetupData({ ...quickSetupData, party: newParty, services: [] });
  }

  async function createRoleContract() {
    const operatorServiceContract = operatorService.contracts[0];

    if (!!party) {
      const token = party.token;
      await handleDeployment(token).then(_ => {
        if (services?.length === 0) onComplete();
        setToDeploy([]);
      });
    }

    if (!provider || !operatorServiceContract || !services) return undefined;

    const id = operatorServiceContract.contractId;

    if (!findExistingOffer(ServiceKind.REGULATOR)) {
      if (!regulatorServices.contracts.find(c => c.payload.customer === provider)) {
        const regId = regulatorRoles.contracts[0].contractId;
        await ledger.exercise(RegulatorRole.OfferRegulatorService, regId, {
          customer: provider,
        }); // trigger auto-approves
      }
    }

    Promise.all(
      services.map(async service => {
        if (findExistingOffer(service)) {
          return;
        }
        switch (service) {
          case ServiceKind.CUSTODY:
            return await ledger.exercise(OperatorService.OfferCustodianRole, id, { provider });
          case ServiceKind.CLEARING:
            return await ledger.exercise(OperatorService.OfferClearingRole, id, { provider });
          case ServiceKind.TRADING:
            return await ledger.exercise(OperatorService.OfferExchangeRole, id, { provider });
          case ServiceKind.MATCHING:
            return await ledger.exercise(OperatorService.OfferMatchingService, id, { provider });
          case ServiceKind.SETTLEMENT:
            return await ledger.exercise(OperatorService.OfferSettlementService, id, { provider });
          case ServiceKind.LISTING:
            return await ledger.exercise(OperatorService.OfferDistributorRole, id, { provider });
        }
      })
    );
    onComplete();
  }

  function findExistingOffer(service: string) {
    switch (service) {
      case ServiceKind.CLEARING:
        return !!clearingOffers.contracts.find(c => c.payload.provider === provider);
      case ServiceKind.CUSTODY:
        return !!custodianOffers.contracts.find(c => c.payload.provider === provider);
      case ServiceKind.TRADING:
        return !!exhangeOffers.contracts.find(c => c.payload.provider === provider);
      case ServiceKind.MATCHING:
        return !!matchingOffers.contracts.find(c => c.payload.provider === provider);
      case ServiceKind.LISTING:
        return !!distributorOffers.contracts.find(c => c.payload.provider === provider);
      case ServiceKind.SETTLEMENT:
        return !!settlementOffers.contracts.find(c => c.payload.provider === provider);
      case ServiceKind.REGULATOR:
        return !!regulatorServiceOffers.contracts.find(c => c.payload.provider === provider);
    }
  }

  function findExistingRole(service: string) {
    switch (service) {
      case ServiceKind.CLEARING:
        // TODO: once we can auto accept clearing roles we can remove this
        return (
          !!clearingRoles.contracts.find(c => c.payload.provider === provider) ||
          !!clearingOffers.contracts.find(c => c.payload.provider === provider)
        );
      case ServiceKind.CUSTODY:
        return !!custodianRoles.contracts.find(c => c.payload.provider === provider);
      case ServiceKind.TRADING:
        return !!exchangeRoles.contracts.find(c => c.payload.provider === provider);
      case ServiceKind.MATCHING:
        return !!matchingServices.contracts.find(c => c.payload.provider === provider);
      case ServiceKind.LISTING:
        return !!distributorRoles.contracts.find(c => c.payload.provider === provider);
      case ServiceKind.SETTLEMENT:
        return !!settlementServices.contracts.find(c => c.payload.provider === provider);
    }
  }
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
              <Table.Cell>{marketSetupDataMap.get(p)?.legalName}</Table.Cell>
              <Table.Cell>{marketSetupDataMap.get(p)?.location}</Table.Cell>
              <Table.Cell>{marketSetupDataMap.get(p)?.services?.sort().join(', ')}</Table.Cell>
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
  const { legalName, location } = quickSetupData;

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
      onFinish();
    }

    handleVerifiedIdentity();
  }, [loading, regulatorServices.contracts]);

  return null;
};

const QuickSetup = () => {
  const [error, setError] = useState<string>();
  const [parties, setParties] = useState<PartyDetails[]>([]);
  const [quickSetupData, setQuickSetupData] = useState<IQuickSetupData>({
    party: undefined,
    services: [],
    legalName: undefined,
    location: undefined,
  });
  const [adminCredentials, setAdminCredentials] = useState<Credentials>();
  const [submitSetupData, setSubmitSetupData] = useState(false);

  const localCreds = computeCredentials('Operator');
  const history = useHistory();

  useEffect(() => {
    const newParties = retrieveParties();
    if (newParties) {
      handleNewParties(newParties);
    } else {
      setAdminCredentials(localCreds);
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

  const handleLoad = async (newParties: PartyDetails[]) => {
    storeParties(newParties);
    handleNewParties(newParties);
  };

  function handleNewParties(newParties: PartyDetails[]) {
    const adminParty = newParties.find(p => p.partyName === 'UserAdmin');

    if (deploymentMode === DeploymentMode.PROD_DABL && adminParty) {
      setParties(newParties.filter(p => p.party != publicParty && p != adminParty));
      setAdminCredentials({ token: adminParty.token, party: adminParty.party, ledgerId });
    }
  }

  if (isHubDeployment && parties.length === 0) {
    return (
      <div className="quick-setup">
        <div className="setup-tile">
          <span className="login-details dark">
            To get started, add the UserAdmin party found in the Daml Hub Console Users tab,
            download the <code className="link">parties.json</code> file, and upload it here:
          </span>
          <label className="custom-file-upload button ui">
            <DablPartiesInput
              ledgerId={ledgerId}
              onError={error => setError(error)}
              onLoad={handleLoad}
            />
            <Icon name="file" className="white" />
            <p className="dark">Load Parties</p>
          </label>
          <span className="login-details dark">{error}</span>
        </div>
      </div>
    );
  }

  return adminCredentials ? (
    <div className="quick-setup">
      <Button
        icon="left arrow"
        className="back-button ghost dark"
        onClick={() => history.push('/login')}
      />
      <DamlLedger
        token={adminCredentials.token}
        party={adminCredentials.party}
        httpBaseUrl={httpBaseUrl}
        wsBaseUrl={wsBaseUrl}
      >
        <AutomationProvider publicParty={publicParty}>
          <QuickSetupTable
            credentials={adminCredentials}
            quickSetupData={quickSetupData}
            setQuickSetupData={setQuickSetupData}
            parties={parties}
            creatingRoleContracts={submitSetupData}
            onComplete={() => setSubmitSetupData(true)}
          />
        </AutomationProvider>
      </DamlLedger>
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
      )}
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
