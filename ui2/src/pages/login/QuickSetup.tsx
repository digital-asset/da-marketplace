import React, { useEffect, useState } from 'react';
import { Form, Button, Grid, Loader, Table } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

import { useLedger, useParty, useStreamQueries } from '@daml/react';

import { PartyDetails } from '@daml/hub-react';
import { retrieveParties } from '../../Parties';
import { useUserState, loginQuickSetup, useUserDispatch } from '../../context/UserContext';
import { DeploymentMode, deploymentMode, httpBaseUrl, getName, ledgerId } from '../../config';

import Credentials, {
  retrieveCredentials,
  computeCredentials,
  storeCredentials,
  clearCredentials,
} from '../../Credentials';
import DamlLedger from '@daml/react';

import { useCustomerServices, useProviderServices } from '../../context/ServicesContext';
import { Service as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Service';

import { Offer as RegulatorServiceOffer } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';
import { Offer as CustodianRoleOffer } from '@daml.js/da-marketplace/lib/Marketplace/Custody/Role';
import { Offer as DistributorRoleOffer } from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Role';
import { Offer as SettlementServiceOffer } from '@daml.js/da-marketplace/lib/Marketplace/Settlement/Service';
import { Offer as ExchangeRoleOffer } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Role';
import { Offer as MatchingServiceOffer } from '@daml.js/da-marketplace/lib/Marketplace/Trading/Matching/Service';

//   REGULARTOR_SERVICE = 'OfferRegulatorService',  TO DO

enum offerOptionsEnum {
  CUSTODIAN_ROLE = 'OfferCustodianRole',
  EXCHANGE_ROLE = 'OfferExchangeRole',
  MATCHING_SERVICE = 'OfferMatchingService',
  SETTLEMENT_SERVICE = 'OfferSettlementService',
  DISTRIBUTOR_ROLE = 'OfferDistributorRole',
}

const offerOptions = [
  'OfferCustodianRole',
  'OfferExchangeRole',
  'OfferMatchingService',
  'OfferSettlementService',
  'OfferDistributorRole',
];

const OperatorQuickSetupLedger = () => {
  const [credentials, setCredentials] = useState<Credentials>();
  const localCreds = computeCredentials('Operator');

  const userDispatch = useUserDispatch()

  useEffect(() => {
    if (deploymentMode === DeploymentMode.PROD_DABL) {
      setCredentials({ token: '', party: '', ledgerId });
    } else {
      setCredentials(localCreds);
    }
  }, []);

  useEffect(() => {
    if (credentials === localCreds) {
        loginQuickSetup(userDispatch, history, credentials)
    }

  }, [credentials]);

  if (credentials?.token === '' || credentials?.party === '') {
    return (
      <div className="quick-setup ">
        <div className="assign-role-tile">
          <p className="login-details dark">Please enter the User Admin PartyId and JWT Token:</p>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Form.Input
                  required
                  label={<p className="dark">Party</p>}
                  placeholder="Party ID"
                  value={credentials.party}
                  onChange={e => setCredentials({ ...credentials, party: e.currentTarget.value })}
                />
              </Grid.Column>
              <Grid.Column width={8}>
                <Form.Input
                  required
                  type="password"
                  label={<p className="dark">Token</p>}
                  placeholder="Party JWT"
                  value={credentials.token}
                  onChange={e => setCredentials({ ...credentials, token: e.currentTarget.value })}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }

  return credentials ? (
    <DamlLedger
      reconnectThreshold={0}
      token={credentials.token}
      party={credentials.party}
      httpBaseUrl={httpBaseUrl}
    >
      <RoleContractSetup credentials={credentials} />
    </DamlLedger>
  ) : (
    <Loader active indeterminate inverted size="small">
      <p className="dark">Loading operator credentials...</p>
    </Loader>
  );
};

const RoleContractSetup = (props: { credentials: Credentials }) => {
  const { credentials } = props;

  const [selectedParty, setSelectedParty] = useState<PartyDetails>();
  const [selectedRole, setSelectedRole] = useState<string>();
  const [parties, setParties] = useState<PartyDetails[]>([]);
  const [status, setStatus] = useState<string>();

  const ledger = useLedger();

  const { contracts: operatorService, loading: loadingOperatorService } = useStreamQueries(
    OperatorService
  );

  useEffect(() => {
    const parties = retrieveParties();

    if (parties) {
      console.log('settings parties:', parties);
      setParties(parties);
    }
  }, []);

  useEffect(() => {
    console.log(operatorService);
    console.log(loadingOperatorService);

    const createOperatorService = async () => {
      console.log('creating operator service');
      await ledger.create(OperatorService, { operator: credentials.party });
    };

    if (!loadingOperatorService && operatorService.length === 0) {
      createOperatorService();
    }
  }, [loadingOperatorService, operatorService]);

  const partyOptions =
    parties.map(party => {
      return { text: party.partyName, value: party.party };
    }) || [];

  const roleOptions = offerOptions.map(role => {
    return { text: role, value: role };
  });

  if (loadingOperatorService || operatorService.length === 0) {
    return (
      <Loader active indeterminate inverted size="small">
        <p className="dark">Loading</p>
      </Loader>
    );
  }

  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            {deploymentMode === DeploymentMode.PROD_DABL ? (
              <Form.Select
                label={<p className="dark input-label">Party</p>}
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
                required
                placeholder="Username"
                label={<p className="dark input-label">Party</p>}
                onChange={e => handleChangeParty(e.currentTarget.value)}
              />
            )}
          </Grid.Column>
          <Grid.Column width={8}>
            <Form.Select
              disabled={!selectedParty}
              value={selectedRole ? roleOptions.find(p => selectedRole === p.value)?.value : ''}
              label={<p className="dark input-label">Role</p>}
              placeholder="Select..."
              onChange={(_, data: any) => setSelectedRole(data.value)}
              options={roleOptions}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Button
        fluid
        icon="right arrow"
        labelPosition="right"
        disabled={!selectedParty}
        className="ghost dark submit-button"
        onClick={() => createRoleContract()}
        content={<p className="dark bold">Next</p>}
      />
      {!!status && (
        <Loader active indeterminate inverted size="small">
          <p className="dark">{status}</p>
        </Loader>
      )}
    </div>
  );

  function handleChangeParty(newPartyId?: string) {
    if (!newPartyId) {
      setSelectedParty(undefined);
      setSelectedRole(undefined);
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
        owner: 'Operator',
        partyName: newPartyId,
      };
    }

    if (!newParty) return;

    setSelectedParty(newParty);
    setSelectedRole(undefined);
  }

  async function createRoleContract() {
    console.log('creating role contract for ', selectedParty?.partyName);

    if (!selectedParty || !operatorService[0]) {
      console.log('no operator service contract');
      handleChangeParty();
      return;
    }

    const contractId = operatorService[0].contractId;

    const provider = selectedParty.party;

    switch (selectedRole) {
      case offerOptionsEnum.CUSTODIAN_ROLE:
        await ledger.exercise(OperatorService.OfferCustodianRole, contractId, { provider });
      case offerOptionsEnum.EXCHANGE_ROLE:
        await ledger.exercise(OperatorService.OfferExchangeRole, contractId, {
          provider,
        });
      case offerOptionsEnum.MATCHING_SERVICE:
        await ledger.exercise(OperatorService.OfferMatchingService, contractId, {
          provider,
        });
      case offerOptionsEnum.SETTLEMENT_SERVICE:
        await ledger.exercise(OperatorService.OfferSettlementService, contractId, {
          provider,
        });
      case offerOptionsEnum.DISTRIBUTOR_ROLE:
        await ledger.exercise(OperatorService.OfferDistributorRole, contractId, {
          provider,
        });
    }

    setStatus(undefined);
  }
};

const QuickSetup = () => {
  const history = useHistory();

  return (
    <div className="quick-setup">
      <Button
        icon="left arrow"
        className="back-button ghost dark"
        onClick={() => history.push('/login')}
      />
      <div className="quick-setup-tiles">
        <OperatorQuickSetupLedger />
      </div>
    </div>
  );
};

const ServiceSetup = (props: {
  clearPartyRoleSelect: () => void;
  setStatus: (message: string) => void;
  selectedParty: PartyDetails;
  selectedRole: string;
}) => {
  const { clearPartyRoleSelect, setStatus, selectedParty, selectedRole } = props;

  const [currentService, setCurrentService] = useState();

  const party = useParty();
  const ledger = useLedger();

  const providers = useProviderServices(party);
  const customers = useCustomerServices(party);

  const custodianRoleOffers = useStreamQueries(CustodianRoleOffer).contracts;
  const distributorRoleOffers = useStreamQueries(DistributorRoleOffer).contracts;
  const settlementServiceOffers = useStreamQueries(SettlementServiceOffer).contracts;
  const exhangeRoleOffers = useStreamQueries(ExchangeRoleOffer).contracts;
  const matchingServiceOffers = useStreamQueries(MatchingServiceOffer).contracts;

  useEffect(() => {
    switch (selectedRole) {
      case offerOptionsEnum.CUSTODIAN_ROLE:
        return custodianRoleOffers.forEach(c => {
          ledger.exercise(CustodianRoleOffer.Accept, c.contractId, {
            operator: 'Operator',
            provider: party,
          });
        });

      case offerOptionsEnum.EXCHANGE_ROLE:
        return exhangeRoleOffers.forEach(c => {
          ledger.exercise(CustodianRoleOffer.Accept, c.contractId, {
            operator: 'Operator',
            provider: party,
          });
        });

      case offerOptionsEnum.MATCHING_SERVICE:
        return matchingServiceOffers.forEach(c => {
          ledger.exercise(CustodianRoleOffer.Accept, c.contractId, {
            operator: 'Operator',
            provider: party,
          });
        });

      case offerOptionsEnum.SETTLEMENT_SERVICE:
        return settlementServiceOffers.forEach(c => {
          ledger.exercise(CustodianRoleOffer.Accept, c.contractId, {
            operator: 'Operator',
            provider: party,
          });
        });
      case offerOptionsEnum.DISTRIBUTOR_ROLE:
        return distributorRoleOffers.forEach(c => {
          ledger.exercise(CustodianRoleOffer.Accept, c.contractId, {
            operator: 'Operator',
            provider: party,
          });
        });
    }
  }, [selectedParty, selectedRole]);

  return <div>signing in</div>;
};

export default QuickSetup;
