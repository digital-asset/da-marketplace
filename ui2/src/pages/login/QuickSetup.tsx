import React, { useEffect, useState } from 'react';
import { Form, Button, Icon, Loader, Table } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

import { useLedger, useStreamQueries } from '@daml/react';

import { DablPartiesInput, PartyDetails } from '@daml/hub-react';
import { useUserDispatch } from '../../context/UserContext';
import {
  DeploymentMode,
  deploymentMode,
  httpBaseUrl,
  wsBaseUrl,
  ledgerId,
  publicParty,
} from '../../config';

import Credentials, { computeCredentials } from '../../Credentials';
import DamlLedger from '@daml/react';

import { Service as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Service';
import { retrieveParties, storeParties } from '../../Parties';

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

const OPERATOR = 'Operator';

type Offer = CustodianOffer | DistributorOffer | SettlementOffer | ExchangeOffer | MatchingOffer;

enum serviceOptionsEnum {
  CUSTODY = 'Custody',
  TRADING = 'Trading',
  MATCHING = 'Matching',
  SETTLEMENT = 'Settlement',
  LISTING = 'Listing',
}

const serviceOptions = ['Custody', 'Trading', 'Matching', 'Settlement', 'Listing'];

const RoleContractSetup = (props: {
  credentials: Credentials;
  roleSetupData?: IRoleContractSetupData;
  setRoleSetupData: (data: IRoleContractSetupData) => void;
  parties: PartyDetails[];
  onComplete: () => void;
}) => {
  const { credentials, roleSetupData, setRoleSetupData, parties, onComplete } = props;

  const [status, setStatus] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [marketSetupDataMap, setMarketSetupDataMap] = useState<Map<string, string[]>>(new Map());

  const { contracts: custodianOffers, loading: custodianOffersLoading } = useStreamQueries(
    CustodianOffer
  );
  const { contracts: distributorOffers, loading: distributorOffersLoading } = useStreamQueries(
    DistributorOffer
  );
  const { contracts: settlementOffers, loading: settlementOffersLoading } = useStreamQueries(
    SettlementOffer
  );
  const { contracts: exhangeOffers, loading: exchangeOffersLoading } = useStreamQueries(
    ExchangeOffer
  );
  const { contracts: matchingOffers, loading: matchingOffersLoading } = useStreamQueries(
    MatchingOffer
  );

  const ledger = useLedger();

  const custodianRoles = useStreamQueries(CustodianRole);
  const exchangeRoles = useStreamQueries(ExchangeRole);
  const distributorRoles = useStreamQueries(DistributorRole);
  const settlementServices = useStreamQueries(SettlementService);
  const matchingServices = useStreamQueries(MarchingService);
  const operatorService = useStreamQueries(OperatorService);

  const selectedParty = roleSetupData?.party;
  const selectedRole = roleSetupData?.role;

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

  let roleOptions = serviceOptions.map(role => {
    return { text: role, value: role };
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
                value={selectedRole ? roleOptions.find(p => selectedRole === p.value)?.value : ''}
                placeholder="Select..."
                onChange={(_, data: any) => hangleChangeRole(data.value)}
                options={roleOptions}
              />
            </Table.Cell>
            <Table.Cell>
              <Button
                disabled={!selectedParty || !!status}
                className="ghost"
                onClick={() => createRoleContract()}
                content={<p>Add</p>}
              />
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
    setRoleSetupData({ ...roleSetupData, role: newRole });

    const hasRole = findExistingRoleorOffer(newRole);

    if (hasRole) {
      setStatus(`${selectedParty?.partyName} already offers ${newRole} services`);
      setRoleSetupData({ ...roleSetupData, role: undefined });
    } else {
      setStatus(undefined);
    }
  }

  function handleChangeParty(newPartyId?: string) {
    setStatus(undefined);

    if (!newPartyId) {
      setRoleSetupData({ ...roleSetupData, party: undefined, role: undefined });
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
        owner: OPERATOR,
        partyName: newPartyId,
      };
    }

    if (!newParty) return;

    setRoleSetupData({ ...roleSetupData, party: newParty, role: undefined });
  }

  async function createRoleContract() {
    const operatorServiceContract = operatorService.contracts[0];

    if (!selectedParty || !operatorServiceContract || !selectedRole) return undefined;

    const id = operatorServiceContract.contractId;
    const provider = selectedParty.party;

    switch (selectedRole) {
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
        return (
          !!custodianRoles.contracts.find(c => c.payload.provider === selectedParty?.party) ||
          !!custodianOffers.find(c => c.payload.provider === selectedParty?.party)
        );
      case serviceOptionsEnum.TRADING:
        return (
          !!exchangeRoles.contracts.find(c => c.payload.provider === selectedParty?.party) ||
          !!exhangeOffers.find(c => c.payload.provider === selectedParty?.party)
        );
      case serviceOptionsEnum.MATCHING:
        return (
          !!matchingServices.contracts.find(c => c.payload.provider === selectedParty?.party) ||
          !!matchingOffers.find(c => c.payload.provider === selectedParty?.party)
        );
      case serviceOptionsEnum.SETTLEMENT:
        return (
          !!settlementServices.contracts.find(c => c.payload.provider === selectedParty?.party) ||
          !!settlementOffers.find(c => c.payload.provider === selectedParty?.party)
        );
      case serviceOptionsEnum.LISTING:
        return (
          !!distributorRoles.contracts.find(c => c.payload.provider === selectedParty?.party) ||
          !!distributorOffers.find(c => c.payload.provider === selectedParty?.party)
        );
    }
  }
};

interface IRoleContractSetupData {
  party?: PartyDetails;
  role?: string;
}

const USER_ADMIN = 'UserAdmin';

const QuickSetup = () => {
  const [parties, setParties] = useState<PartyDetails[]>([]);
  const [roleSetupData, setRoleSetupData] = useState<IRoleContractSetupData>();
  const [adminCredentials, setAdminCredentials] = useState<Credentials>();
  const [error, setError] = useState<string>();
  const [startServiceSetup, setStartServiceSetup] = useState(false);

  const localCreds = computeCredentials(OPERATOR);
  const history = useHistory();

  useEffect(() => {
    const parties = retrieveParties();
    if (parties) {
      console.log('RELOADING PARTIES');
      setParties(parties.filter(p => p.party != publicParty && p.partyName != USER_ADMIN));

      const adminParty = parties.find(p => p.partyName === USER_ADMIN);

      if (deploymentMode === DeploymentMode.PROD_DABL && adminParty) {
        console.log('found the admin party', adminParty);

        setAdminCredentials({ token: adminParty.token, party: adminParty.party, ledgerId });
      }
    } else {
      setAdminCredentials(localCreds);
    }
  }, []);

  useEffect(() => {
    console.log('credentials changed', adminCredentials);
  }, [adminCredentials]);

  const handleLoad = async (parties: PartyDetails[]) => {
    console.log('loading parties', parties);
    const adminParty = parties.find(p => p.partyName === USER_ADMIN);

    if (deploymentMode === DeploymentMode.PROD_DABL && adminParty) {
      console.log('found the admin party', adminParty);

      setAdminCredentials({ token: adminParty.token, party: adminParty.party, ledgerId });
    } else {
      console.log('DID NOT FIND ADMIN PARTY', adminParty);
    }
    setParties(parties.filter(p => p.party != publicParty && p.partyName != USER_ADMIN));
    storeParties(parties);
  };

  if (deploymentMode === DeploymentMode.PROD_DABL && parties.length === 0) {
    return (
      <div className="quick-setup">
        <div className="assign-role-tile">
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
        <RoleContractSetup
          credentials={adminCredentials}
          roleSetupData={roleSetupData}
          setRoleSetupData={setRoleSetupData}
          parties={parties}
          onComplete={() => setStartServiceSetup(true)}
        />
      </DamlLedger>
      {roleSetupData && roleSetupData.party && roleSetupData.role && startServiceSetup && (
        <DamlLedger
          party={roleSetupData.party.party}
          token={roleSetupData.party.token}
          httpBaseUrl={httpBaseUrl}
          wsBaseUrl={wsBaseUrl}
        >
          <ServiceSetup
            roleSetupData={roleSetupData}
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
              <Table.Cell>
                <Button className="ghost" onClick={() => loginAsParty(p)}>
                  Log in
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

  function loginAsParty(p: string) {
    const creds = computeCredentials(p);
    console.log('logging in as ', creds);
    //   loginUser(dispatch, history, creds);
  }
};

const ServiceSetup = (props: {
  roleSetupData: IRoleContractSetupData;
  operator: string;
  onFinish: () => void;
}) => {
  const { roleSetupData, operator, onFinish } = props;
  const { party, role } = roleSetupData;

  const [loading, setLoading] = useState<boolean>(false);

  const ledger = useLedger();

  const { contracts: custodianOffers, loading: cl } = useStreamQueries(CustodianOffer);
  const { contracts: distributorOffers, loading: dl } = useStreamQueries(DistributorOffer);
  const { contracts: settlementOffers, loading: sl } = useStreamQueries(SettlementOffer);
  const { contracts: exhangeOffers, loading: el } = useStreamQueries(ExchangeOffer);
  const { contracts: matchingOffers, loading: ml } = useStreamQueries(MatchingOffer);

  useEffect(() => {
    setLoading(cl || dl || sl || el || ml);
  }, [cl, dl, sl, el, ml]);

  useEffect(() => {
    if (loading) {
      return;
    }

    switch (role) {
      case serviceOptionsEnum.CUSTODY:
        acceptAllOffers(custodianOffers, CustodianOffer.Accept);
        break;
      case serviceOptionsEnum.TRADING:
        acceptAllOffers(exhangeOffers, ExchangeOffer.Accept);
        break;
      case serviceOptionsEnum.MATCHING:
        acceptAllOffers(matchingOffers, MatchingOffer.Accept);
        break;
      case serviceOptionsEnum.SETTLEMENT:
        acceptAllOffers(settlementOffers, SettlementOffer.Accept);
        break;
      case serviceOptionsEnum.LISTING:
        acceptAllOffers(distributorOffers, DistributorOffer.Accept);
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

const LoadingWheel = (props: { label?: string }) => {
  return (
    <Loader active indeterminate inverted size="small">
      <p className="dark">{props.label || 'Loading...'}</p>
    </Loader>
  );
};
export async function halfSecondPromise() {
  await new Promise<void>((resolve, _) => {
    setTimeout(() => resolve(), 500);
  });
}
export default QuickSetup;
