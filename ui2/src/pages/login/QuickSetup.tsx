import React, { useEffect, useState } from 'react';

import { Form, Button, Icon, Loader, Table } from 'semantic-ui-react';

import DamlLedger, { useLedger, useStreamQueries } from '@daml/react';
import { DablPartiesInput, PartyDetails } from '@daml/hub-react';

import { useUserDispatch, loginUser } from '../../context/UserContext';
import { useHistory } from 'react-router-dom';

import {
  DeploymentMode,
  deploymentMode,
  httpBaseUrl,
  wsBaseUrl,
  ledgerId,
  publicParty,
} from '../../config';

import Credentials, { computeCredentials } from '../../Credentials';
import { retrieveParties, storeParties } from '../../Parties';

import { halfSecondPromise } from '../page/utils';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
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
  Service as MarchingService,
} from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';

import {
  Offer as RegulatorOffer,
  Service as RegulatorService,
  IdentityVerificationRequest,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';

import { CreateEvent } from '@daml/ledger';

type Offer = CustodianOffer | DistributorOffer | SettlementOffer | ExchangeOffer | MatchingOffer;

enum ServiceKind {
  CUSTODY = 'Custody',
  LISTING = 'Listing',
  TRADING = 'Trading',
  MATCHING = 'Matching',
  SETTLEMENT = 'Settlement',
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
  const [marketSetupDataMap, setMarketSetupDataMap] = useState<Map<string, IQuickSetupData>>(
    new Map()
  );
  const [verifiedIdentity, setVerifiedIdentity] = useState<{
    legalName?: string;
    location?: string;
  }>();

  const ledger = useLedger();
  const operator = credentials.party;

  const { party, services } = quickSetupData;
  const provider = party?.party;

  const custodianRoles = useStreamQueries(CustodianRole);
  const exchangeRoles = useStreamQueries(ExchangeRole);
  const distributorRoles = useStreamQueries(DistributorRole);
  const settlementServices = useStreamQueries(SettlementService);
  const matchingServices = useStreamQueries(MarchingService);
  const operatorService = useStreamQueries(OperatorService);
  const regulatorServices = useStreamQueries(RegulatorService);

  const custodianOffers = useStreamQueries(CustodianOffer);
  const distributorOffers = useStreamQueries(DistributorOffer);
  const settlementOffers = useStreamQueries(SettlementOffer);
  const exhangeOffers = useStreamQueries(ExchangeOffer);
  const matchingOffers = useStreamQueries(MatchingOffer);

  const verifiedIdentities = useStreamQueries(VerifiedIdentity);
  const verifiedIdeneityRequests = useStreamQueries(IdentityVerificationRequest);

  useEffect(() => {
    setLoading(
      custodianRoles.loading ||
        distributorRoles.loading ||
        settlementServices.loading ||
        exchangeRoles.loading ||
        matchingServices.loading ||
        operatorService.loading ||
        custodianOffers.loading ||
        distributorOffers.loading ||
        settlementOffers.loading ||
        exhangeOffers.loading ||
        matchingOffers.loading ||
        verifiedIdentities.loading
    );
  }, [
    custodianRoles.loading,
    distributorRoles.loading,
    settlementServices.loading,
    exchangeRoles.loading,
    matchingServices.loading,
    operatorService.loading,
    custodianOffers.loading,
    distributorOffers.loading,
    settlementOffers.loading,
    exhangeOffers.loading,
    matchingOffers.loading,
    verifiedIdentities.loading,
  ]);

  useEffect(() => {
    const verifyIdentities = async () => {
      await Promise.all(
        verifiedIdeneityRequests.contracts.map(async contract => {
          const regulatorService = regulatorServices.contracts.find(
            c => c.payload.customer === contract.payload.customer
          );

          if (regulatorService) {
            await ledger.exercise(RegulatorService.VerifyIdentity, regulatorService.contractId, {
              identityVerificationRequestCid: contract.contractId,
            });
          }
        })
      );
    };

    if (
      !verifiedIdeneityRequests.loading &&
      !regulatorServices.loading &&
      regulatorServices.contracts.length > 0 &&
      verifiedIdeneityRequests.contracts.length > 0
    ) {
      verifyIdentities();
    }
  }, [
    verifiedIdeneityRequests.loading,
    verifiedIdeneityRequests,
    regulatorServices.loading,
    regulatorServices,
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

  const partyOptions = parties.map(party => {
    return { text: party.partyName, value: party.party };
  });

  const serviceOptions = Object.values(ServiceKind)
    .filter(s => !findExistingRole(s))
    .map(service => {
      return { text: service, value: service };
    });

  if (operatorService.contracts.length === 0 || loading) {
    return <LoadingWheel label="Loading Quick Setup..." />;
  }

  return (
    <div className="setup-tile">
      <Table fixed className="role-contract-setup">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Party</Table.HeaderCell>
            <Table.HeaderCell>Legal Name</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Services</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              {deploymentMode === DeploymentMode.PROD_DABL ? (
                <Form.Select
                  value={party ? partyOptions.find(p => party.party === p.value)?.value : ''}
                  placeholder="Select..."
                  onChange={(_, data: any) => handleChangeParty(data.value)}
                  options={partyOptions}
                />
              ) : (
                <Form.Input
                  placeholder="Username"
                  onChange={e => handleChangeParty(e.currentTarget.value)}
                />
              )}
            </Table.Cell>
            <Table.Cell>
              {verifiedIdentity?.legalName ? (
                <p>{verifiedIdentity?.legalName}</p>
              ) : (
                <Form.Input
                  placeholder="Legal Name"
                  onChange={e =>
                    setQuickSetupData({ ...quickSetupData, legalName: e.currentTarget.value })
                  }
                />
              )}
            </Table.Cell>
            <Table.Cell>
              {verifiedIdentity?.location ? (
                <p>{verifiedIdentity.location}</p>
              ) : (
                <Form.Input
                  placeholder="Location"
                  onChange={e =>
                    setQuickSetupData({ ...quickSetupData, location: e.currentTarget.value })
                  }
                />
              )}
            </Table.Cell>
            <Table.Cell>
              {serviceOptions.length > 0 ? (
                <Form.Select
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
            </Table.Cell>
            <Table.Cell>
              {creatingRoleContracts ? (
                <Button disabled className="ghost" content={<p>Adding...</p>} />
              ) : (
                <Button
                  disabled={!party || services?.length === 0 || !!status}
                  className="ghost"
                  onClick={() => createRoleContract()}
                  content={<p>Add</p>}
                />
              )}
            </Table.Cell>
          </Table.Row>
          {!!status && (
            <Table.Row>
              <Table.Cell colSpan={3}>{status}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
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

    if (!provider || !operatorServiceContract || !services) return undefined;

    const id = operatorServiceContract.contractId;

    await ledger.exercise(OperatorService.OfferRegulatorService, id, {
      provider: operator,
      customer: provider,
    });

    Promise.all(
      services.map(async service => {
        if (findExistingOffer(service)) {
          return;
        }
        switch (service) {
          case ServiceKind.CUSTODY:
            return await ledger.exercise(OperatorService.OfferCustodianRole, id, { provider });
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
    }
  }

  function findExistingRole(service: string) {
    switch (service) {
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
      <Table.Body>
        {marketSetupDataMap.size > 0 ? (
          marketDataParties.map((p, i) => (
            <Table.Row key={i}>
              <Table.Cell>{parties.find(party => party.party === p)?.partyName || p}</Table.Cell>
              <Table.Cell>{marketSetupDataMap.get(p)?.legalName}</Table.Cell>
              <Table.Cell>{marketSetupDataMap.get(p)?.location}</Table.Cell>
              <Table.Cell>{marketSetupDataMap.get(p)?.services?.sort().join(', ')}</Table.Cell>

              <Table.Cell>
                <Button
                  className="ghost"
                  onClick={() => loginUser(dispatch, history, computeCredentials(p))}
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
  const { quickSetupData, operator, onFinish } = props;
  const { party, services, legalName, location } = quickSetupData;

  const [loading, setLoading] = useState<boolean>(false);

  const ledger = useLedger();

  const custodianOffers = useStreamQueries(CustodianOffer);
  const distributorOffers = useStreamQueries(DistributorOffer);
  const settlementOffers = useStreamQueries(SettlementOffer);
  const exhangeOffers = useStreamQueries(ExchangeOffer);
  const matchingOffers = useStreamQueries(MatchingOffer);
  const regulatorOffers = useStreamQueries(RegulatorOffer);

  useEffect(() => {
    setLoading(
      custodianOffers.loading ||
        distributorOffers.loading ||
        settlementOffers.loading ||
        exhangeOffers.loading ||
        matchingOffers.loading ||
        regulatorOffers.loading
    );
  }, [
    custodianOffers.loading,
    distributorOffers.loading,
    settlementOffers.loading,
    exhangeOffers.loading,
    matchingOffers.loading,
    regulatorOffers.loading,
  ]);

  useEffect(() => {
    if (loading) {
      return;
    }
    handleVerifiedIdentity();
    handleOffers();
  }, [loading]);

  async function handleVerifiedIdentity() {
    let retries = 0;

    const args = { operator, provider: operator, customer: party };

    while (retries < 3) {
      if (regulatorOffers.contracts.length > 0) {
        await Promise.all(
          regulatorOffers.contracts.map(async c => {
            const [service] = await ledger.exercise(RegulatorOffer.Accept, c.contractId, args);
            if (service && legalName && location) {
              await ledger.exercise(RegulatorService.RequestIdentityVerification, service, {
                legalName: legalName,
                location: location,
                observers: [publicParty],
              });
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

  async function handleOffers() {
    if (!services) return;

    await Promise.all(
      services.map(async service => {
        switch (service) {
          case ServiceKind.CUSTODY:
            return acceptAllOffers(custodianOffers.contracts, CustodianOffer.Accept);
          case ServiceKind.TRADING:
            return acceptAllOffers(exhangeOffers.contracts, ExchangeOffer.Accept);
          case ServiceKind.MATCHING:
            return acceptAllOffers(matchingOffers.contracts, MatchingOffer.Accept);
          case ServiceKind.SETTLEMENT:
            return acceptAllOffers(settlementOffers.contracts, SettlementOffer.Accept);
          case ServiceKind.LISTING:
            return acceptAllOffers(distributorOffers.contracts, DistributorOffer.Accept);
        }
      })
    );
    onFinish();
  }

  const acceptAllOffers = async (
    contracts: readonly CreateEvent<Offer, undefined, any>[],
    choice: any
  ) => {
    const args = { operator, provider: party };

    let retries = 0;

    while (retries < 3) {
      if (contracts.length > 0) {
        await Promise.all(
          contracts.map(async c => {
            return await ledger.exercise(choice, c.contractId, args);
          })
        );
        break;
      } else {
        await halfSecondPromise();
        retries++;
      }
    }
  };

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

  if (deploymentMode === DeploymentMode.PROD_DABL && parties.length === 0) {
    return (
      <div className="quick-setup">
        <div className="setup-tile">
          <span className="login-details dark">
            To get started, add the UserAdmin party found in the DABL Console Users tab, download
            the <code className="link">parties.json</code> file, and upload it here:
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
        <QuickSetupTable
          credentials={adminCredentials}
          quickSetupData={quickSetupData}
          setQuickSetupData={setQuickSetupData}
          parties={parties}
          creatingRoleContracts={submitSetupData}
          onComplete={() => setSubmitSetupData(true)}
        />
      </DamlLedger>
      {quickSetupData && quickSetupData.party && quickSetupData.services && submitSetupData && (
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
    <LoadingWheel label={'Loading credentials...'} />
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
