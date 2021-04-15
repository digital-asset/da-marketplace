import React, { useEffect, useState } from 'react';

import { Form, Button, Icon, Loader, Table } from 'semantic-ui-react';

import DamlLedger, { useLedger, useStreamQueries } from '@daml/react';
import { DablPartiesInput, PartyDetails } from '@daml/hub-react';
import { useWellKnownParties } from '@daml/hub-react/lib';

import { useUserDispatch } from '../../context/UserContext';
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

import { Service as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Service';
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

import { CreateEvent } from '@daml/ledger';

type Offer = CustodianOffer | DistributorOffer | SettlementOffer | ExchangeOffer | MatchingOffer;

enum serviceOptionsEnum {
  CUSTODY = 'Custody',
  TRADING = 'Trading',
  MATCHING = 'Matching',
  SETTLEMENT = 'Settlement',
  LISTING = 'Listing',
}

interface IServiceContractSetupData {
  party?: PartyDetails;
  service?: string;
}

const services = ['Custody', 'Trading', 'Matching', 'Settlement', 'Listing'];

const OfferServiceContractSetup = (props: {
  credentials: Credentials;
  serviceSetupData?: IServiceContractSetupData;
  setServiceSetupData: (data: IServiceContractSetupData) => void;
  parties: PartyDetails[];
  creatingRoleContracts: boolean;
  onComplete: () => void;
}) => {
  const {
    credentials,
    serviceSetupData,
    setServiceSetupData,
    parties,
    onComplete,
    creatingRoleContracts,
  } = props;

  const [status, setStatus] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [marketSetupDataMap, setMarketSetupDataMap] = useState<Map<string, string[]>>(new Map());

  const ledger = useLedger();
  const operator = useWellKnownParties().parties?.userAdminParty || 'Operator';

  const custodianRoles = useStreamQueries(CustodianRole);
  const exchangeRoles = useStreamQueries(ExchangeRole);
  const distributorRoles = useStreamQueries(DistributorRole);
  const settlementServices = useStreamQueries(SettlementService);
  const matchingServices = useStreamQueries(MarchingService);
  const operatorService = useStreamQueries(OperatorService);

  const selectedParty = serviceSetupData?.party;
  const selectedService = serviceSetupData?.service;

  useEffect(() => {
    setLoading(
      custodianRoles.loading ||
        distributorRoles.loading ||
        settlementServices.loading ||
        exchangeRoles.loading ||
        matchingServices.loading ||
        operatorService.loading
    );
  }, [
    custodianRoles.loading,
    distributorRoles.loading,
    settlementServices.loading,
    exchangeRoles.loading,
    matchingServices.loading,
    operatorService.loading,
  ]);

  useEffect(() => {
    if (loading) {
      return;
    }

    let newMarketData: Map<string, string[]> = new Map();

    custodianRoles.contracts.forEach(c => addMarketData(c.payload.provider, 'Custody'));
    distributorRoles.contracts.forEach(c => addMarketData(c.payload.provider, 'Listing'));
    settlementServices.contracts.forEach(c => addMarketData(c.payload.provider, 'Settlement'));
    exchangeRoles.contracts.forEach(c => addMarketData(c.payload.provider, 'Trading'));
    matchingServices.contracts.forEach(c => addMarketData(c.payload.provider, 'Matching'));

    function addMarketData(party: string, serviceName: string) {
      newMarketData.set(party, [...(newMarketData.get(party) || []), serviceName]);
    }

    setMarketSetupDataMap(newMarketData);
  }, [
    loading,
    custodianRoles.contracts.length,
    distributorRoles.contracts.length,
    settlementServices.contracts.length,
    exchangeRoles.contracts.length,
    matchingServices.contracts.length,
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

  let serviceOptions = services.map(service => {
    return { text: service, value: service };
  });

  if (operatorService.contracts.length === 0 || loading) {
    return <LoadingWheel label="Loading Quick Setup..." />;
  }

  return (
    <div className="assign-role-tile">
      <Table fixed className="role-contract-setup">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Party</Table.HeaderCell>
            <Table.HeaderCell>Services</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              {deploymentMode === DeploymentMode.PROD_DABL ? (
                <Form.Select
                  value={
                    selectedParty
                      ? partyOptions.find(p => selectedParty.party === p.value)?.value
                      : ''
                  }
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
              <Form.Select
                disabled={!selectedParty}
                value={
                  selectedService
                    ? serviceOptions.find(p => selectedService === p.value)?.value
                    : ''
                }
                placeholder="Select..."
                onChange={(_, data: any) => hangleChangeRole(data.value)}
                options={serviceOptions}
              />
            </Table.Cell>
            <Table.Cell>
              {creatingRoleContracts ? (
                <Loader active indeterminate inverted size="small"></Loader>
              ) : (
                <Button
                  disabled={!selectedParty || !!status}
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

  function hangleChangeRole(newRole: string) {
    setServiceSetupData({ ...serviceSetupData, service: newRole });

    const hasRole = findExistingRoleorOffer(newRole);

    if (hasRole) {
      setStatus(`${selectedParty?.partyName} already offers ${newRole} services`);
      setServiceSetupData({ ...serviceSetupData, service: undefined });
    } else {
      setStatus(undefined);
    }
  }

  function handleChangeParty(newPartyId?: string) {
    setStatus(undefined);

    if (!newPartyId) {
      setServiceSetupData({ ...serviceSetupData, party: undefined, service: undefined });
      return;
    }

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

    setServiceSetupData({ ...serviceSetupData, party: newParty, service: undefined });
  }

  async function createRoleContract() {
    const operatorServiceContract = operatorService.contracts[0];

    if (!selectedParty || !operatorServiceContract || !selectedService) return undefined;

    const id = operatorServiceContract.contractId;
    const provider = selectedParty.party;

    switch (selectedService) {
      case serviceOptionsEnum.CUSTODY:
        return await ledger
          .exercise(OperatorService.OfferCustodianRole, id, { provider })
          .then(_ => onComplete());
      case serviceOptionsEnum.TRADING:
        return await ledger
          .exercise(OperatorService.OfferExchangeRole, id, { provider })
          .then(_ => onComplete());
      case serviceOptionsEnum.MATCHING:
        return await ledger
          .exercise(OperatorService.OfferMatchingService, id, { provider })
          .then(_ => onComplete());
      case serviceOptionsEnum.SETTLEMENT:
        return await ledger
          .exercise(OperatorService.OfferSettlementService, id, { provider })
          .then(_ => onComplete());
      case serviceOptionsEnum.LISTING:
        return await ledger
          .exercise(OperatorService.OfferDistributorRole, id, { provider })
          .then(_ => onComplete());
    }
  }

  function findExistingRoleorOffer(newRole: string) {
    switch (newRole) {
      case serviceOptionsEnum.CUSTODY:
        return !!custodianRoles.contracts.find(c => c.payload.provider === selectedParty?.party);
      case serviceOptionsEnum.TRADING:
        return !!exchangeRoles.contracts.find(c => c.payload.provider === selectedParty?.party);
      case serviceOptionsEnum.MATCHING:
        return !!matchingServices.contracts.find(c => c.payload.provider === selectedParty?.party);
      case serviceOptionsEnum.LISTING:
        return !!distributorRoles.contracts.find(c => c.payload.provider === selectedParty?.party);
      case serviceOptionsEnum.SETTLEMENT:
        return !!settlementServices.contracts.find(
          c => c.payload.provider === selectedParty?.party
        );
    }
  }
};

const MarketSetup = (props: {
  parties: PartyDetails[];
  loading: boolean;
  marketSetupDataMap: Map<string, string[]>;
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
              <Table.Cell>{marketSetupDataMap.get(p)?.sort().join(', ')}</Table.Cell>
              {/* <Table.Cell>
                <Button className="ghost" onClick={() => loginAsParty(p)}>
                  Log in
                </Button>
              </Table.Cell> */}
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

  //   function loginAsParty(p: string) {
  //     const creds = computeCredentials(p);
  //     loginUser(dispatch, history, creds);
  //   }
};

const CreateRoleContract = (props: {
  serviceSetupData: IServiceContractSetupData;
  operator: string;
  onFinish: () => void;
}) => {
  const { serviceSetupData, operator, onFinish } = props;
  const { party, service } = serviceSetupData;

  const [loading, setLoading] = useState<boolean>(false);

  const ledger = useLedger();

  const custodianOffers = useStreamQueries(CustodianOffer);
  const distributorOffers = useStreamQueries(DistributorOffer);
  const settlementOffers = useStreamQueries(SettlementOffer);
  const exhangeOffers = useStreamQueries(ExchangeOffer);
  const matchingOffers = useStreamQueries(MatchingOffer);

  useEffect(() => {
    setLoading(
      custodianOffers.loading ||
        distributorOffers.loading ||
        settlementOffers.loading ||
        exhangeOffers.loading ||
        matchingOffers.loading
    );
  }, [
    custodianOffers.loading,
    distributorOffers.loading,
    settlementOffers.loading,
    exhangeOffers.loading,
    matchingOffers.loading,
  ]);

  useEffect(() => {
    if (loading) {
      return;
    }

    switch (service) {
      case serviceOptionsEnum.CUSTODY:
        acceptAllOffers(custodianOffers.contracts, CustodianOffer.Accept);
        break;
      case serviceOptionsEnum.TRADING:
        acceptAllOffers(exhangeOffers.contracts, ExchangeOffer.Accept);
        break;
      case serviceOptionsEnum.MATCHING:
        acceptAllOffers(matchingOffers.contracts, MatchingOffer.Accept);
        break;
      case serviceOptionsEnum.SETTLEMENT:
        acceptAllOffers(settlementOffers.contracts, SettlementOffer.Accept);
        break;
      case serviceOptionsEnum.LISTING:
        acceptAllOffers(distributorOffers.contracts, DistributorOffer.Accept);
        break;
    }
  }, [loading]);

  const acceptAllOffers = async (
    contracts: readonly CreateEvent<Offer, undefined, any>[],
    choice: any
  ) => {
    const args = { operator, provider: party };

    await halfSecondPromise();

    Promise.all(
      contracts.map(async c => {
        return await ledger.exercise(choice, c.contractId, args);
      })
    ).then(_ => onFinish());
  };

  return null;
};

const QuickSetup = () => {
  const [error, setError] = useState<string>();
  const [parties, setParties] = useState<PartyDetails[]>([]);
  const [serviceSetupData, setServiceSetupData] = useState<IServiceContractSetupData>();
  const [adminCredentials, setAdminCredentials] = useState<Credentials>();
  const [startServiceSetup, setStartServiceSetup] = useState(false);

  const operator = useWellKnownParties().parties?.userAdminParty || 'Operator';

  const localCreds = computeCredentials(operator);
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
    const adminParty = newParties.find(p => p.party === operator);

    setParties(newParties.filter(p => p.party != publicParty && p != adminParty));

    if (deploymentMode === DeploymentMode.PROD_DABL && adminParty) {
      setAdminCredentials({ token: adminParty.token, party: adminParty.party, ledgerId });
    }
  }

  if (deploymentMode === DeploymentMode.PROD_DABL && parties.length === 0) {
    return (
      <div className="quick-setup">
        <div className="assign-service-tile">
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
        <OfferServiceContractSetup
          credentials={adminCredentials}
          serviceSetupData={serviceSetupData}
          setServiceSetupData={setServiceSetupData}
          parties={parties}
          creatingRoleContracts={startServiceSetup}
          onComplete={() => setStartServiceSetup(true)}
        />
      </DamlLedger>
      {serviceSetupData && serviceSetupData.party && serviceSetupData.service && startServiceSetup && (
        <DamlLedger
          party={serviceSetupData.party.party}
          token={serviceSetupData.party.token}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <CreateRoleContract
            serviceSetupData={serviceSetupData}
            operator={adminCredentials.party}
            onFinish={() => setStartServiceSetup(false)}
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
