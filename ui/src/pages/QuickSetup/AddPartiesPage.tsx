import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import { DamlHubLogin, PartyToken, useAutomationInstances } from '@daml/hub-react';
import { useLedger } from '@daml/react';

import { Role as OperatorService } from '@daml.js/da-marketplace/lib/Marketplace/Operator/Role';
import { VerifiedIdentity } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Model';
import { Role as RegulatorRole } from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Role';
import {
  IdentityVerificationRequest,
  Service as RegulatorService,
  Offer as RegulatorOffer,
} from '@daml.js/da-marketplace/lib/Marketplace/Regulator/Service';

import {
  OperatorOnboarding,
  PartyOnboarding,
} from '@daml-ui.js/da-marketplace-ui/lib/UI/Onboarding';

import Credentials from '../../Credentials';
import { UnifiedDamlProvider, useStreamQueries } from '../../Main';
import { storeParties, retrieveParties, retrieveUserParties } from '../../Parties';
import {
  httpBaseUrl,
  wsBaseUrl,
  isHubDeployment,
  MarketplaceTrigger,
  TRIGGER_HASH,
} from '../../config';
import { ArrowRightIcon } from '../../icons/icons';
import { makeDamlSet, useOperatorParty, usePublicParty } from '../common';
import { halfSecondPromise } from '../page/utils';
import { LoadingWheel } from './QuickSetup';

enum LoadingStatus {
  CREATING_ADMIN_CONTRACTS = 'Confirming Admin role....',
  WAITING_FOR_TRIGGERS = 'Waiting for auto-approve triggers to deploy. This may take up to 5 minutes....',
}

const AddPartiesPage = () => {
  const history = useHistory();

  const [error, setError] = useState<string>();
  const [parties, setParties] = useState<PartyToken[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>();
  const [adminCredentials, setAdminCredentials] = useState<Credentials>();
  const userAdminId = useOperatorParty();
  const publicParty = usePublicParty();

  useEffect(() => {
    const parties = retrieveParties(publicParty);
    if (isHubDeployment) {
      const adminParty = parties.find(p => p.party === userAdminId);
      if (adminParty) {
        setAdminCredentials(adminParty);
      }
    }
  }, [userAdminId, publicParty]);

  useEffect(() => {
    const storedParties = retrieveUserParties(publicParty);

    if (storedParties) {
      setParties(storedParties);
    }
  }, [publicParty]);

  const uploadButton = (
    <DamlHubLogin
      withFile
      options={{
        method: {
          file: {
            render: () => (
              <label className="custom-file-upload button ui">
                <p>Upload a {parties.length > 0 ? 'new ' : ''}parties.JSON file</p>
              </label>
            ),
          },
        },
      }}
      onPartiesLoad={(parties, err) => {
        if (parties && parties.length > 0) {
          storeParties(parties);
          setParties(parties);

          const adminParty = parties.find(p => p.party === userAdminId);
          if (adminParty) {
            setAdminCredentials(adminParty);
          }
        } else {
          setError(err);
        }
      }}
    />
  );

  if (adminCredentials && loadingStatus) {
    return (
      <div className="setup-page">
        <div className="add-parties-page">
          <LoadingWheel label={loadingStatus} />
          {loadingStatus === LoadingStatus.CREATING_ADMIN_CONTRACTS ? (
            <UnifiedDamlProvider
              token={adminCredentials.token}
              party={adminCredentials.party}
              httpBaseUrl={httpBaseUrl}
              wsBaseUrl={wsBaseUrl}
            >
              <AdminLedger
                adminCredentials={adminCredentials}
                onComplete={() => setLoadingStatus(LoadingStatus.WAITING_FOR_TRIGGERS)}
              />
            </UnifiedDamlProvider>
          ) : (
            loadingStatus === LoadingStatus.WAITING_FOR_TRIGGERS &&
            parties.map(p => (
              <UnifiedDamlProvider
                party={p.party}
                token={p.token}
                httpBaseUrl={httpBaseUrl}
                wsBaseUrl={wsBaseUrl}
              >
                <CreateVerifiedIdentity
                  party={p}
                  onComplete={() => history.push('/quick-setup')}
                  operator={adminCredentials.party}
                />
              </UnifiedDamlProvider>
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
              <div className="upload-parties uploaded">
                {uploadButton}
                <Button
                  className="button ghost icon-right"
                  disabled={parties.length === 0}
                  onClick={() => setLoadingStatus(LoadingStatus.CREATING_ADMIN_CONTRACTS)}
                >
                  Onboard Parties <ArrowRightIcon />
                </Button>
              </div>
            </div>
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

const CreateVerifiedIdentity = (props: {
  onComplete: () => void;
  party: PartyToken;
  operator: string;
}) => {
  const { onComplete, party, operator } = props;

  const completedIdentityVerifications = useIdentityVerification(party);
  const completedPartyOnboarding = usePartyOnboarding(party, operator);

  useEffect(() => {
    if (completedIdentityVerifications && completedPartyOnboarding) {
      return onComplete();
    }
  }, [completedIdentityVerifications, completedPartyOnboarding, onComplete]);

  return null;
};

const useIdentityVerification = (party: PartyToken) => {
  const [completed, setCompleted] = useState(false);

  const ledger = useLedger();
  const publicParty = usePublicParty();

  const { contracts: regulatorServices, loading: regulatorServicesLoading } =
    useStreamQueries(RegulatorService);

  const { contracts: verifiedIdentities, loading: verifiedIdentitiesLoading } =
    useStreamQueries(VerifiedIdentity);

  const { contracts: verifiedIdentityRequests, loading: verifiedIdentityRequestsLoading } =
    useStreamQueries(IdentityVerificationRequest);

  useEffect(() => {
    const userParties = retrieveUserParties(publicParty);

    setCompleted(
      userParties.length > 0 &&
        userParties.every(p => !!verifiedIdentities.find(v => v.payload.customer === p.party))
    );
  }, [verifiedIdentities, publicParty]);

  useEffect(() => {
    if (
      regulatorServicesLoading ||
      verifiedIdentitiesLoading ||
      verifiedIdentityRequestsLoading ||
      !publicParty
    ) {
      return;
    }

    const handleVerifiedIdentity = async () => {
      const currentServices = regulatorServices.filter(s => s.payload.customer === party.party);
      let retries = 0;

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
  }, [
    ledger,
    party,
    publicParty,
    verifiedIdentities,
    verifiedIdentitiesLoading,
    regulatorServices,
    regulatorServicesLoading,
    verifiedIdentityRequestsLoading,
    verifiedIdentityRequests,
  ]);

  return completed;
};

const usePartyOnboarding = (party: PartyToken, operator: string) => {
  const [completed, setCompleted] = useState(false);

  const ledger = useLedger();

  const { contracts: partyOnboarding, loading: partyOnboardingLoading } =
    useStreamQueries(PartyOnboarding);

  useEffect(() => {
    setCompleted(!!partyOnboarding.find(c => c.payload.party === party.party));
  }, [party, partyOnboarding]);

  useEffect(() => {
    const createPartyOnboarding = async () => {
      await ledger.create(PartyOnboarding, {
        operator,
        party: party.party,
      });
    };

    if (partyOnboardingLoading) {
      return;
    }

    if (!completed) {
      createPartyOnboarding();
    }
  }, [ledger, operator, completed, partyOnboardingLoading, party]);

  return completed;
};

const AdminLedger = (props: { adminCredentials: Credentials; onComplete: () => void }) => {
  const { adminCredentials, onComplete } = props;

  const operatorCompleted = useOperatorOnboarding(adminCredentials);
  const regulatorCompleted = useRegulatorOnboarding(adminCredentials);
  const deploysCompleted = useDeployAll();

  useEffect(() => {
    if (operatorCompleted && regulatorCompleted && deploysCompleted) {
      return onComplete();
    }
  }, [operatorCompleted, regulatorCompleted, deploysCompleted, onComplete]);

  return null;
};

const useOperatorOnboarding = (adminCredentials: Credentials): boolean => {
  const [serviceCreated, setServiceCreated] = useState(false);
  const [operatorOnboarded, setOperatorOnboarded] = useState(false);

  const ledger = useLedger();
  const publicParty = usePublicParty();

  const { contracts: operatorService, loading: operatorServiceLoading } =
    useStreamQueries(OperatorService);

  const { contracts: operatorOnboarding, loading: operatorOnboardingLoading } =
    useStreamQueries(OperatorOnboarding);

  useEffect(() => {
    // If pre-existing:
    if (!operatorServiceLoading && operatorService.length > 0) {
      setServiceCreated(true);
    }
    if (!operatorOnboardingLoading && operatorOnboarding.length > 0) {
      setOperatorOnboarded(true);
    }

    // Create service if not exists
    const createOperatorService = async (publicParty: string) => {
      await ledger.create(OperatorService, {
        operator: adminCredentials.party,
        observers: makeDamlSet([publicParty]),
      });

      setServiceCreated(true);
    };

    if (!!publicParty && !operatorServiceLoading && operatorService.length === 0) {
      createOperatorService(publicParty);
    }

    // Create onboarding if not exists
    const onboardOperator = async () => {
      await ledger.create(OperatorOnboarding, {
        operator: adminCredentials.party,
      });
      setOperatorOnboarded(true);
    };
    if (!operatorOnboardingLoading && operatorOnboarding.length === 0) {
      onboardOperator();
    }
  }, [
    adminCredentials,
    ledger,
    publicParty,
    operatorService,
    operatorServiceLoading,
    operatorOnboarding,
    operatorOnboardingLoading,
    setServiceCreated,
    setOperatorOnboarded,
  ]);

  return serviceCreated && operatorOnboarded;
};

const useRegulatorOnboarding = (adminCredentials: Credentials) => {
  const [regulatorRoleCreated, setRegulatorRoleCreated] = useState(false);
  const [regulatorServicesCreated, setRegulatorServicesCreated] = useState(false);

  const ledger = useLedger();
  const publicParty = usePublicParty();

  const { contracts: regulatorRoles, loading: regulatorRolesLoading } =
    useStreamQueries(RegulatorRole);
  const { contracts: regulatorServiceOffers, loading: regulatorServiceOffersLoading } =
    useStreamQueries(RegulatorOffer);

  useEffect(() => {
    const userParties = retrieveUserParties(publicParty);

    // If pre-existing:
    if (!regulatorRolesLoading && regulatorRoles.length > 0) {
      setRegulatorRoleCreated(true);
    }

    // Create the role contract
    const createRegulatorRole = async (publicParty: string) => {
      await ledger.create(RegulatorRole, {
        operator: adminCredentials.party,
        provider: adminCredentials.party,
        observers: makeDamlSet([publicParty]),
      });

      setRegulatorRoleCreated(true);
    };

    if (!!publicParty && !regulatorRolesLoading && regulatorRoles.length === 0) {
      createRegulatorRole(publicParty);
    }

    // Create regulator service offers
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
      setRegulatorServicesCreated(true);
    };

    if (!regulatorServiceOffersLoading) {
      offerRegulatorServices();
    }
  }, [
    ledger,
    publicParty,
    adminCredentials.party,
    regulatorRolesLoading,
    regulatorServiceOffersLoading,
    regulatorRoles,
    regulatorServiceOffers,
    adminCredentials,
  ]);

  return regulatorRoleCreated && regulatorServicesCreated;
};

const useDeployAll = () => {
  const [deployedAll, setDeployedAll] = useState(false);
  const { deployAutomation } = useAutomationInstances();
  const publicParty = usePublicParty();

  useEffect(() => {
    const artifactHash = TRIGGER_HASH;
    const parties = retrieveParties(publicParty);

    async function deployAllTriggers() {
      if (!artifactHash || !deployAutomation || !publicParty) {
        return;
      }

      await Promise.all(
        parties
          .filter(p => p.party !== publicParty)
          .map(p => deployAutomation(artifactHash, MarketplaceTrigger.AutoApproveTrigger, p.token))
      );
      setDeployedAll(true);
    }

    if (parties.length > 0 && isHubDeployment) {
      deployAllTriggers();
    }
  }, [deployAutomation, publicParty]);

  return deployedAll;
};

export default AddPartiesPage;
