import React, { useState, useEffect } from 'react';

import { DablPartiesInput, PartyDetails } from '@daml/hub-react';

import DamlLedger, { useLedger } from '@daml/react';

import { Button } from 'semantic-ui-react';

import { useHistory } from 'react-router-dom';

import { storeParties, retrieveUserParties } from '../../Parties';

import QueryStreamProvider from '../../websocket/queryStream';

import { PublicDamlProvider, useStreamQueries } from '../../Main';
import { httpBaseUrl, wsBaseUrl, ledgerId, publicParty, isHubDeployment } from '../../config';

import Credentials, { computeCredentials } from '../../Credentials';

import { halfSecondPromise } from '../page/utils';

import { LoadingWheel } from './QuickSetup';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import {
  IdentityVerificationRequest,
  Service as RegulatorService,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';
import {
  OperatorOnboarding,
  PartyOnboarding,
} from '@daml-ui.js/da-marketplace-ui/lib/UI/Onboarding';
import { Offer as RegulatorOffer } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { makeDamlSet } from '../common';
import { retrieveParties } from '../../Parties';

import { deployAutomation, MarketplaceTrigger, TRIGGER_HASH } from '../../automation';

enum LoadingStatus {
  CREATING_ADMIN_CONTRACTS = 'Confirming Admin role....',
  WAITING_FOR_TRIGGERS = 'Waiting for auto-approve triggers to deploy. This may take up to 5 minutes....',
}

const AddPartiesPage = () => {
  const history = useHistory();
  const localCreds = computeCredentials('Operator');

  const [error, setError] = useState<string>();
  const [parties, setParties] = useState<PartyDetails[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>();
  const [adminCredentials, setAdminCredentials] = useState<Credentials>(localCreds);

  useEffect(() => {
    const parties = retrieveParties() || [];
    const storedParties = retrieveUserParties();

    if (storedParties) {
      setParties(storedParties);
    }

    if (isHubDeployment) {
      const adminParty = parties.find(p => p.partyName === 'UserAdmin');
      if (adminParty) {
        setAdminCredentials({ token: adminParty.token, party: adminParty.party, ledgerId });
      }
    }
  }, [loadingStatus]);

  const uploadButton = (
    <label className="custom-file-upload button ui">
      <DablPartiesInput
        ledgerId={ledgerId}
        onError={error => setError(error)}
        onLoad={partyDetails => {
          storeParties(partyDetails);
          setParties(partyDetails);
        }}
      />
      <p>Upload {parties.length > 0 ? 'a new ' : ''}.JSON file</p>
    </label>
  );

  if (loadingStatus) {
    return (
      <div className="setup-page">
        <div className="add-parties-page">
          <LoadingWheel label={loadingStatus} />
          {loadingStatus === LoadingStatus.CREATING_ADMIN_CONTRACTS ? (
            <DamlLedger
              token={adminCredentials.token}
              party={adminCredentials.party}
              httpBaseUrl={httpBaseUrl}
              wsBaseUrl={wsBaseUrl}
            >
              <QueryStreamProvider defaultPartyToken={adminCredentials.token}>
                <AdminLedger
                  adminCredentials={adminCredentials}
                  onComplete={() => setLoadingStatus(LoadingStatus.WAITING_FOR_TRIGGERS)}
                />
              </QueryStreamProvider>
            </DamlLedger>
          ) : (
            loadingStatus === LoadingStatus.WAITING_FOR_TRIGGERS &&
            parties.map(p => (
              <PublicDamlProvider
                party={p.party}
                token={p.token}
                httpBaseUrl={httpBaseUrl}
                wsBaseUrl={wsBaseUrl}
              >
                <QueryStreamProvider defaultPartyToken={p.token}>
                  <CreateVerifiedIdentity
                    party={p}
                    onComplete={() => history.push('/quick-setup')}
                  />
                </QueryStreamProvider>
              </PublicDamlProvider>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="setup-page">
      <div className="add-parties-page">
        {parties.length > 0 ? (
          <>
            <div className="page-row">
              <div>
                <p className="bold">Parties</p>
                <div className="party-names uploaded">
                  {parties.map(p => (
                    <p className="party-name" key={p.party}>
                      {p.partyName}
                    </p>
                  ))}
                </div>
              </div>
              <div className="upload-parties uploaded">{uploadButton}</div>
            </div>
            <Button
              className="button ghost submit"
              disabled={parties.length === 0}
              onClick={() => setLoadingStatus(LoadingStatus.CREATING_ADMIN_CONTRACTS)}
            >
              Onboard Parties
            </Button>
          </>
        ) : (
          <div className="upload-parties">
            <p className="details">
              Download the .json file from the Users tab on Daml Hub, and upload it here.
            </p>
            {uploadButton}
            <span className="login-details dark">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const CreateVerifiedIdentity = (props: { onComplete: () => void; party: PartyDetails }) => {
  const { onComplete, party } = props;
  const ledger = useLedger();
  const userParties = retrieveUserParties() || [];

  const { contracts: regulatorServices, loading: regulatorServicesLoading } = useStreamQueries(
    RegulatorService
  );
  const { contracts: verifiedIdentities, loading: verifiedIdentitiesLoading } = useStreamQueries(
    VerifiedIdentity
  );
  const {
    contracts: verifiedIdentityRequests,
    loading: verifiedIdentityRequestsLoading,
  } = useStreamQueries(IdentityVerificationRequest);

  useEffect(() => {
    if (regulatorServicesLoading || verifiedIdentitiesLoading || verifiedIdentityRequestsLoading) {
      return;
    }

    const handleVerifiedIdentity = async () => {
      let retries = 0;

      const currentServices = regulatorServices.filter(s => s.payload.customer === party.party);

      while (retries < 3) {
        if (currentServices.length > 0) {
          await Promise.all(
            currentServices.map(async service => {
              await ledger.exercise(
                RegulatorService.RequestIdentityVerification,
                service.contractId,
                {
                  legalName: party.partyName,
                  location: '',
                  observers: [publicParty],
                }
              );
            })
          );
          break;
        } else {
          await halfSecondPromise();
          retries++;
        }
      }
    };

    if (
      !verifiedIdentities.find(id => id.payload.customer === party.party) &&
      !verifiedIdentityRequests.find(c => c.payload.customer === party.party)
    ) {
      handleVerifiedIdentity();
    }

    if (userParties.every(p => !!verifiedIdentities.find(v => v.payload.customer === p.party))) {
      return onComplete();
    }
  }, [
    ledger,
    onComplete,
    userParties,
    verifiedIdentities,
    verifiedIdentitiesLoading,
    regulatorServices,
    regulatorServicesLoading,
    verifiedIdentityRequestsLoading,
    verifiedIdentityRequests,
    party,
  ]);

  return null;
};

const AdminLedger = (props: { adminCredentials: Credentials; onComplete: () => void }) => {
  const { adminCredentials, onComplete } = props;

  const userParties = retrieveUserParties() || [];
  const parties = retrieveParties() || [];
  const ledger = useLedger();

  const { contracts: operatorService, loading: operatorServiceLoading } = useStreamQueries(
    OperatorService
  );
  const { contracts: operatorOnboarding, loading: operatorOnboardingLoading } = useStreamQueries(
    OperatorOnboarding
  );
  const { contracts: partyOnboarding, loading: partyOnboardingLoading } = useStreamQueries(
    PartyOnboarding
  );
  const { contracts: regulatorRoles, loading: regulatorRolesLoading } = useStreamQueries(
    RegulatorRole
  );
  const {
    contracts: regulatorServiceOffers,
    loading: regulatorServiceOffersLoading,
  } = useStreamQueries(RegulatorOffer);

  useEffect(() => {
    const createOperatorService = async () => {
      return await ledger.create(OperatorService, {
        operator: adminCredentials.party,
        observers: makeDamlSet([publicParty]),
      });
    };

    const createOperatorOnboarding = async () => {
      return await ledger.create(OperatorOnboarding, {
        operator: adminCredentials.party,
      });
    };

    const createRegulatorRole = async () => {
      return await ledger.create(RegulatorRole, {
        operator: adminCredentials.party,
        provider: adminCredentials.party,
        observers: makeDamlSet([publicParty]),
      });
    };

    const offerRegulatorService = async (party: string) => {
      const regulatorRoleId = regulatorRoles[0]?.contractId;

      if (regulatorRoleId) {
        return await ledger.exercise(RegulatorRole.OfferRegulatorService, regulatorRoleId, {
          customer: party,
        });
      }
    };

    const offerRegulatorServices = async () => {
      await Promise.all(
        userParties.map(async party => {
          if (!regulatorServiceOffers.find(c => c.payload.customer === party.party)) {
            await offerRegulatorService(party.party);
          }
        })
      );
    };

    const createPartyOnboarding = async (party: string) => {
      return await ledger.create(PartyOnboarding, {
        operator: adminCredentials.party,
        party,
      });
    };

    const createPartiesOnboarding = async () => {
      await Promise.all(
        userParties.map(async party => {
          if (!partyOnboarding.find(c => c.payload.party === party.party)) {
            await createPartyOnboarding(party.party);
          }
        })
      );
    };

    if (
      operatorServiceLoading ||
      regulatorRolesLoading ||
      regulatorServiceOffersLoading ||
      operatorOnboardingLoading ||
      partyOnboardingLoading
    ) {
      return;
    }

    async function deployAllTriggers() {
      if (isHubDeployment && parties.length > 0) {
        const artifactHash = TRIGGER_HASH;

        if (!artifactHash || !adminCredentials) {
          return;
        }

        Promise.all(
          [
            ...parties.filter(p => p.party !== publicParty),
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

    if (operatorService.length === 0) {
      createOperatorService();
    } else if (regulatorRoles.length === 0) {
      createRegulatorRole();
    } else if (operatorOnboarding.length === 0) {
      createOperatorOnboarding();
    } else {
      offerRegulatorServices();
      createPartiesOnboarding();
      deployAllTriggers();
      return onComplete();
    }
  }, [
    ledger,
    adminCredentials.party,
    userParties,
    onComplete,
    regulatorRolesLoading,
    operatorServiceLoading,
    regulatorServiceOffersLoading,
    operatorOnboardingLoading,
    operatorOnboarding,
    partyOnboardingLoading,
    partyOnboarding,
    regulatorRoles,
    operatorService,
    regulatorServiceOffers,
    adminCredentials,
    parties,
  ]);

  return null;
};

export default AddPartiesPage;
